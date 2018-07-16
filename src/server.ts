import { ErrorRoute } from './routes/error';
import { Application, Request, Router, Response, NextFunction } from 'express';
import { IndexRoute } from './routes';
import * as express from 'express';
import * as path from 'path';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as root from 'app-root-path';
import * as cookieParser from 'cookie-parser';
import * as errorHandler from "errorhandler";
import log from "./libs/winston.error";
import * as crypto from 'crypto';

import { ArticleModel } from './libs/mongoose';
import { IArticle } from './models/Article';
// view engine setup

export class Server {

    public app: Application;

    public static bootstrap(): Server {
        return new Server();
    }


    constructor() {
        //create expressjs application
        this.app = express();

        //configure application
        this.config();

        //add routes
        this.routes();

        //add api
        this.api();


    }

    public api() {

        this.app.get('/api', function (req, res) {
            res.send({ crypto: crypto.createHmac('sha1', '123').update('password').digest('hex') });
        });

        //empty for now
        this.app.get('/api/articles', (req, res) => {
            return ArticleModel.find((err, articles) => {
                if (!err) {
                    log.info('!!!');
                    return res.send(articles);
                } else {
                    res.statusCode = 500;
                    log.error('Internal error(%d): %s', res.statusCode, err.message);
                    return res.send({ error: 'Server error' });
                }
            })
        });

        this.app.post('/api/articles', (req, res, next) => {
            log.info(req.body);
            let article = new ArticleModel({
                title: req.body.title,
                author: req.body.author,
                description: req.body.description,
                images: req.body.images
            });
            article.save((err) => {
                if (!err) {
                    log.info("article created");
                    return res.send({ status: 'OK', article: article })
                } else {
                    console.log(err);
                    if (err.name === 'ValidationError') {
                        res.statusCode = 400;
                        res.send({ error: 'Validation error' });
                    } else {
                        res.statusCode = 500;
                        res.send({ error: 'Server error' });
                    }
                    log.error('Internal error(%d): %s', res.statusCode, err.message);
                }
            });
        });
        this.app.get('/api/articles/:id', function (req, res) {
            return ArticleModel.findById(req.params.id, function (err, article) {
                if (!article) {
                    res.statusCode = 404;
                    return res.send({ error: 'Article not found' });
                }
                if (!err) {
                    return res.send({ status: 'OK', article: article });
                } else {
                    res.statusCode = 500;
                    log.error('Internal error(%d): %s', res.statusCode, err.message);
                    return res.send({ error: 'Server error' });
                }
            });
        });
        this.app.put('/api/articles/:id', function (req, res) {
            return ArticleModel.findById(req.params.id, function (err, article: any) {
                if (!article) {
                    res.statusCode = 404;
                    return res.send({ error: 'Not found' });
                }

                article.title = req.body.title;
                article.description = req.body.description;
                article.author = req.body.author;
                article.images = req.body.images;
                return article.save((err) => {
                    if (!err) {
                        log.info("article updated");
                        return res.send({ status: 'OK', article: article });
                    } else {
                        if (err.name == 'ValidationError') {
                            res.statusCode = 400;
                            res.send({ error: 'Validation error' });
                        } else {
                            res.statusCode = 500;
                            log.error('Internal error(%d): %s', res.statusCode, err.message);
                            res.send({ error: 'Server error' });
                        }
                        log.error('Internal error(%d): %s', res.statusCode, err.message);
                    }
                });
            });
        });
        this.app.delete('/api/articles/:id', function (req, res) {
            return ArticleModel.findById(req.params.id, function (err, article) {
                if (!article) {
                    res.statusCode = 404;
                    return res.send({ error: 'Not found' });
                }
                return article.remove(function (err) {
                    if (!err) {
                        log.info("article removed");
                        return res.send({ status: 'OK' });
                    } else {
                        res.statusCode = 500;
                        log.error('Internal error(%d): %s', res.statusCode, err.message);
                        return res.send({ error: 'Server error' });
                    }
                });
            });
        });


        this.errorHandlingRoute();
    }

    public config() {
        this.app.use(express.static(path.join(__dirname, "public")));

        //Configuring EJS
        this.app.set("views", path.join(__dirname, "views"));

        this.app.set('view engine', 'ejs');

        //mount logger
        this.app.use(logger('dev'));

        //mount json form parser
        this.app.use(bodyParser.json());

        //mount query string parser
        this.app.use(bodyParser.urlencoded({
            extended: false
        }));

        //mount cookie parser middleware
        this.app.use(cookieParser("SECRET_GOES_HERE"));

        // catch 404 and forward to error handler
        this.app.use((err: any, req: Request, res: Response, next: NextFunction) => {
            err.status = 404;
            next(err);
        });

        // error handlers
        // development error handler
        // will print stacktrace
        //error handling
        this.app.use(errorHandler());
    }

    private routes() {
        let router: Router;
        router = express.Router();

        //IndexRoute
        IndexRoute.create(router);

        //ErrorRoute
        ErrorRoute.create(router);

        //use router middleware
        this.app.use(router);
    }

    public errorHandlingRoute() {
        this.app.use(function (req, res, next) {
            res.status(404);
            log.debug('Not found URL: %s', req.url);
            res.send({ error: 'Not found' });
            return;
        });

        this.app.use(function (err, req, res, next) {
            res.status(err.status || 500);
            log.error('Internal error(%d): %s', res.statusCode, err.message);
            res.send({ error: err.message });
            return;
        });

        if (this.app.get('env') === 'development') {
            this.app.use((err: any, req: Request, res: Response, next: NextFunction) => {
                res.status(err.status || 500);
                res.render('error', {
                    message: err.message,
                    error: err
                });
            });
        }

        this.app.use((err: any, req: Request, res: Response, next: NextFunction) => {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: {}
            });
        });
    }
}