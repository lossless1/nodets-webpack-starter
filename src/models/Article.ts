import { Schema } from "mongoose";

export interface Images{
    kind: string;
    url: string;
}

export interface Article extends Schema, Document{
    title:string;
    author: string;
    description: string;
    images: [Images];
    modified: Date;
}
