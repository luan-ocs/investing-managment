import { Request, Response } from 'express';
import knex from 'knex';
import config from '../../knexfile';
import crypto from 'crypto';
import { TABLE_FIXED_EXPENSES, TABLE_VARIABLE_EXPENSES } from '../names';

const db = knex(config);

type expenses = {
  name: string;
  value: number;
  description: string;
  until: string;
};

import { isBeforeOrSameMonth } from './gain';

export const getExpenses = async (req: Request, res: Response) => {
  const { id, month, year } = req.params;

  if (!id || !month || !year) {
    return res.status(400).send('missing params');
  }

  const date = new Date(`${year}-${month}-1`);

  if (!date) {
    return res.status(400).send('invalid date');
  }
  const expenses = await db(TABLE_FIXED_EXPENSES).where({ userId: id });
  const variableexpenses = await db(TABLE_VARIABLE_EXPENSES).where({
    userId: id,
  });

  const allexpenses = [] as expenses[];

  expenses.forEach((expenses) => {
    if (isBeforeOrSameMonth(expenses.since, date)) {
      allexpenses.push(expenses);
    }
  });

  variableexpenses.forEach((expenses) => {
    if (isBeforeOrSameMonth(expenses.at, date)) {
      allexpenses.push(expenses);
    }
  });

  return res.json(allexpenses);
};

export const addFixedexpenses = async (req: Request, res: Response) => {
  const fixedexpenses = { ...req.body };
  const { id } = req.params;

  if (
    !fixedexpenses.name ||
    !fixedexpenses.value ||
    !fixedexpenses.since ||
    !fixedexpenses.userId
  ) {
    return res.status(400).send('missing params');
  }

  fixedexpenses.since = new Date(fixedexpenses.since);

  if (!fixedexpenses.since) {
    return res.status(400).send('invalid date');
  }

  if (id) {
    fixedexpenses.id = id;

    db(TABLE_FIXED_EXPENSES)
      .update(fixedexpenses)
      .where({ id })
      .then(() => res.status(204).send())
      .catch((err) => res.status(500).send(err));
  } else {
    fixedexpenses.id = crypto.randomUUID();
    db(TABLE_FIXED_EXPENSES)
      .insert(fixedexpenses)
      .then(() => res.status(204).send())
      .catch((err) => res.status(500).send(err));
  }
};

export const addVariableexpenses = async (req: Request, res: Response) => {
  const varibleexpenses = { ...req.body };
  const { id } = req.params;
  if (
    !varibleexpenses.name ||
    !varibleexpenses.description ||
    !varibleexpenses.value ||
    !varibleexpenses.at ||
    !varibleexpenses.userId
  ) {
    return res.status(400).send('missing params');
  }

  varibleexpenses.at = new Date(varibleexpenses.at);

  if (!varibleexpenses.at) {
    return res.status(400).send('invalid date');
  }

  if (!id) {
    varibleexpenses.id = crypto.randomUUID();
    db(TABLE_VARIABLE_EXPENSES)
      .insert(varibleexpenses)
      .then(() => res.status(204).send())
      .catch((err) => res.status(400).send(err));
  } else {
    varibleexpenses.id = id;
    db(TABLE_VARIABLE_EXPENSES)
      .update(varibleexpenses)
      .where({ id })
      .then(() => res.status(204).send())
      .catch((err) => res.status(500).send(err));
  }
};

export const deleteFixedexpenses = (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).send('Missing id');
  }

  db(TABLE_FIXED_EXPENSES)
    .delete()
    .where({ id })
    .then(() => res.status(204).send())
    .catch((err) => res.status(500).send(err));
};

export const deleteVariableexpenses = (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).send('Missing id');
  }

  db(TABLE_VARIABLE_EXPENSES)
    .delete()
    .where({ id })
    .then(() => res.status(204).send())
    .catch((err) => res.status(500).send(err));
};

export const getexpensesById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).send('missing params');
  }

  const fixedexpenses = await db(TABLE_FIXED_EXPENSES).where({ id }).first();

  if (fixedexpenses) {
    fixedexpenses.type = 'fixed expenses';
    return res.json(fixedexpenses);
  }

  const variableexpenses = await db(TABLE_VARIABLE_EXPENSES)
    .where({ id })
    .first();

  if (variableexpenses) {
    variableexpenses.type = 'variable expenses';
    return res.json(variableexpenses);
  } else {
    return res.status(404).send('expenses not found');
  }
};
