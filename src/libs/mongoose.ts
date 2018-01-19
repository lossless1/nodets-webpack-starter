import { Article } from './../models/Article';
import * as mongoose from 'mongoose';
import log from './winston.error';
import { nconf } from './config';

mongoose.connect(nconf.get('mongoose:uri'));

let db = mongoose.connection;

db.on('error', (err) => {
    log.error('connection error:', err.message);
})

db.once('open', () => {
    log.info('Connection successfull');
})

let Schema = mongoose.Schema;

let Images = new Schema({
    kind: {
        type: String,
        enum: ['thumbnail', 'detail'],
        required: true
    },
    url: { type: String, required: true }
})

let ArticleSchema = new Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    description: { type: String, required: true },
    images: [Images],
    modified: { type: Date, default: Date.now }
})

ArticleSchema.path('title').validate((v) => {
    return v.length > 5 && v.length < 70;
})

let ArticleModel = mongoose.model('Article', ArticleSchema);

export { ArticleModel };
