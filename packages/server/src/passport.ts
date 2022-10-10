import dotenv from 'dotenv';
import knex from 'knex';
import passport from 'passport';
import passportJwt from 'passport-jwt';
import config from '../knexfile';
import { TABLE_USERS } from './names';

const { ExtractJwt, Strategy } = passportJwt;

const db = knex(config);

dotenv.config();

const params = {
  secretOrKey: process.env.AUTH_SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const strategy = new Strategy(params, (payload, done) => {
  db(TABLE_USERS)
    .where({ id: payload.id })
    .first()
    .then((user) => done(null, user ? { ...payload } : false))
    .catch((err) => done(err, false));
});

passport.use(strategy);

export const authenticate = () =>
  passport.authenticate('jwt', { session: false });
