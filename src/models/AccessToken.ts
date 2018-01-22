import { IAccessToken } from './AccessToken';
import { Document } from 'mongoose';
export interface IAccessToken{
    userId: string,
    clientId: string,
    token: string,
    created: Date
}

export interface IAccessTokenModel extends IAccessToken, Document{

}