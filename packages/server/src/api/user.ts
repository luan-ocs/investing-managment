import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import config from '../../knexfile';
import knex from 'knex';
import { TABLE_USERS } from '../names';
import crypto from 'crypto';

const db = knex(config);

const encryptPassword = (password: string) => {
  const salt = bcrypt.genSaltSync(10);

  return bcrypt.hashSync(password, salt);
};

export const save = async (req: Request, res: Response) => {
  const user = { ...req.body };

  const { id } = req.params;

  if (id) {
    user.id = id;
  }
  if (!user.name || !user.email || !user.password) {
    return res.status(400).send('bad request');
  }

  const userFromDB = await db(TABLE_USERS).where({ email: user.email }).first();

  if (userFromDB) {
    return res.status(402).send('user already created');
  }

  user.password = encryptPassword(user.password);

  if (user.id) {
    db(TABLE_USERS)
      .update(user)
      .where({ id: user.id })
      .then(() => res.status(204).send())
      .catch((err) => res.status(500).send(err));
  } else {
    user.id = crypto.randomUUID();
    db(TABLE_USERS)
      .insert(user)
      .then(() => res.status(204).send())
      .catch((err) => res.status(500).send(err));
  }
};

export const getUser = (req: Request, res: Response) => {
  db(TABLE_USERS)
    .select('id', 'name', 'email')
    .then((users) => res.json(users))
    .catch((err) => res.status(500).send(err));
};
