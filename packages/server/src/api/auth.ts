import { Request, Response } from 'express';
import knex from 'knex';
import config from '../../knexfile';
import { TABLE_USERS } from '../names';
import bcrypt from 'bcrypt';
import jwt from 'jwt-simple';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const db = knex(config);

const authSecret = process.env.AUTH_SECRET as string;

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send('missing email and password');
  }

  const user = await db(TABLE_USERS).where({ email }).first();

  if (!user) {
    return res.status(400).send('usuário não encontrado');
  }

  const isMatch = bcrypt.compareSync(password, user.password);

  if (!isMatch) {
    return res.status(401).send('usuário ou senha incorreto');
  }

  const now = Math.floor(Date.now() / 1000);

  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,

    iat: now,
    exp: now + 60 * 60 * 24 * 3,
  };

  return res.json({
    ...payload,
    token: jwt.encode(payload, authSecret),
  });
};

export const register = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).send('invalid params');
  }

  const createUser = await db(TABLE_USERS).where({ email }).first();

  if (createUser) {
    return res.status(400).send('user already created');
  }

  const id = crypto.randomUUID();

  await db(TABLE_USERS).insert({
    email,
    password,
    name,
    id,
  });

  const now = Math.floor(Date.now() / 1000);

  const payload = {
    id: id,
    name: name,
    email: email,

    iat: now,
    exp: now + 60 * 60 * 24 * 3,
  };

  return res.json({
    ...payload,
    token: jwt.encode(payload, authSecret),
  });
};
