import { IAccessToken } from './AccessToken';
import { Document } from 'mongoose';
export interface IRefreshToken {
    userId: string,
    clientId: string,
    token: string,
    created: Date
}

export interface IRefreshTokenModel extends IAccessToken, Document {

}