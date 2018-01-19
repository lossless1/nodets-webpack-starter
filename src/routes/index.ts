import { BaseRoute } from './route';
import { Request, NextFunction, Response, Router } from 'express';

export class IndexRoute extends BaseRoute {
    constructor() {
        super();
    }

    public static create(router: Router) {
        console.log("IndexRoute::create");
        router.get('/', (req: Request, res: Response, next: NextFunction) => {
            new IndexRoute().index(req, res, next);
        });
    }
    public index(req: Request, res: Response, next: NextFunction) {
        this.title = 'Home | Template';
        let options: Object = {
            "message": "Welcome to the template"
        }
        this.render(req, res, "index", options);
    }
}