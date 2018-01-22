import { Document } from 'mongoose';

export interface IClient {
    name: string;
    clientId: string,
    required: string
}

export interface IClientModel extends IClient, Document {

}