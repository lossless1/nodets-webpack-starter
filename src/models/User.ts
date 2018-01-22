import { Document } from 'mongoose';

export interface Images {
    kind: string;
    url: string;
}

export interface IUser {
    title: string;
    author: string;
    description: string;
    images: [Images];
    modified: Date;
}

export interface IUserModel extends IUser, Document {

}