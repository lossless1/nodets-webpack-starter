import * as config from './config';
import * as passport from 'passport';
import { BasicStrategy } from 'passport-http';
import { Strategy as ClientPasswordStrategy } from 'passport-oauth2-client-password';
import { Strategy as BearerStrategy } from 'passport-http-bearer';
import { ClientModel, Client } from './mongoose';
import {Document} from 'mongoose';

interface IClientModel extends Client, Document{

}


passport.use(new BasicStrategy((username, password, done) => {
    ClientModel.findOne({ clientId: username }, (err, client) => {
        if (err) return done(err);

        if (!client) return done(null, false);

        if (client.clientSecret)
    })
}))