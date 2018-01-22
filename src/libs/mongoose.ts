import { IRefreshTokenModel } from './../models/RefreshToken';
import { IAccessTokenModel, IAccessToken } from './../models/AccessToken';
import { IArticle } from './../models/Article';
import * as mongoose from 'mongoose';
import log from './winston.error';
import { nconf } from './config';
import * as crypto from 'crypto';
import { Document, Schema, model } from 'mongoose';
import { IClientModel } from '../models/Client';
import { IUserModel } from '../models/User';

mongoose.connect(nconf.get('mongoose:uri'));

let db = mongoose.connection;

db.on('error', (err) => {
    log.error('connection error:', err.message);
})

db.once('open', () => {
    log.info('Connection successfull');
})

let Images: Schema = new Schema({
    kind: {
        type: String,
        enum: ['thumbnail', 'detail'],
        required: true
    },
    url: { type: String, required: true }
})

let ArticleSchema: Schema = new Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    description: { type: String, required: true },
    images: [Images],
    modified: { type: Date, default: Date.now }
})

ArticleSchema.path('title').validate((v) => {
    return v.length > 5 && v.length < 70;
})

let ArticleModel = model('Article', ArticleSchema);

let User = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
})

User.methods.encryptPassword = (password) => {
    console.log(password);
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
}

User.virtual('userId')
    .get(() => {
        return this.id;
    })

User.virtual('password').set((password) => {
    this._plainPassword = password;
    this.salt = crypto.randomBytes(32).toString('base64');
    this.hashedPassword = this.encryptPassword(password);
})

User.methods.checkPassword = (password) => {
    return this.encryptPassword(password) === this.hashedPassword;
}

let UserModel = model<IUserModel>('User', User);

let Client = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    clientId: {
        type: String,
        unique: true,
        required: true
    },
    clientSecret: {
        type: String,
        required: true
    }
})

let ClientModel = model<IClientModel>('Client', Client);

let AccessToken: Schema = new Schema({
    userId: {
        type: String,
        required: true
    },
    clientId: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true,
        unique: true
    },
    created: {
        type: Date,
        default: Date.now
    }
})
let AccessTokenModel = model<IAccessTokenModel>('AccessToken', AccessToken);

let RefreshToken: Schema = new Schema({
    userId: {
        type: String,
        required: true
    },
    clientId: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true,
        unique: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

let RefreshTokenModel= model<IRefreshTokenModel>('RefreshToken', RefreshToken);

export { ArticleModel, UserModel, Client, ClientModel, RefreshTokenModel, AccessTokenModel };
