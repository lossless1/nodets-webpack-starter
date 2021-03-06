import { Document } from 'mongoose';

export interface Images {
    kind: string;
    url: string;
}

export interface IArticle {
    title: string;
    author: string;
    description: string;
    images: [Images];
    modified: Date;
}

export interface IArticleModel extends IArticle, Document {

}