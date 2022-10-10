import { isBefore, isSameMonth } from 'date-fns';
import { Request, Response } from 'express';
import knex from 'knex';
import config from '../../knexfile';
import crypto from 'crypto';
import { TABLE_FIXED_GAINS, TABLE_VARIABLE_GAINS } from '../names';

const db = knex(config);

type Gain = {
  name: string;
  value: number;
  description: string;
  until: string;
};

export const isBeforeOrSameMonth = (date: Date, compare: Date) => {
  return isBefore(date, compare) || isSameMonth(date, compare);
};

export const getGains = async (req: Request, res: Response) => {
  const { id, month, year } = req.params;

  if (!id || !month || !year) {
    return res.status(400).send('missing params');
  }

  const date = new Date(`${year}-${month}-1`);

  if (!date) {
    return res.status(400).send('invalid date');
  }
  const gains = await db(TABLE_FIXED_GAINS).where({ userId: id });
  const variableGains = await db(TABLE_VARIABLE_GAINS).where({ userId: id });

  const allGains = [] as Gain[];

  gains.forEach((gain) => {
    if (isBeforeOrSameMonth(gain.since, date)) {
      allGains.push(gain);
    }
  });

  variableGains.forEach((gain) => {
    if (isSameMonth(gain.at, date)) {
      allGains.push(gain);
    }
  });

  return res.json(allGains);
};

export const addFixedGain = async (req: Request, res: Response) => {
  const fixedGain = { ...req.body };
  const { id } = req.params;

  if (
    !fixedGain.name ||
    !fixedGain.value ||
    !fixedGain.since ||
    !fixedGain.userId
  ) {
    return res.status(400).send('missing params');
  }

  fixedGain.since = new Date(fixedGain.since);

  if (!fixedGain.since) {
    return res.status(400).send('invalid date');
  }

  if (id) {
    fixedGain.id = id;

    db(TABLE_FIXED_GAINS)
      .update(fixedGain)
      .where({ id })
      .then(() => res.status(204).send())
      .catch((err) => res.status(500).send(err));
  } else {
    fixedGain.id = crypto.randomUUID();
    db(TABLE_FIXED_GAINS)
      .insert(fixedGain)
      .then(() => res.status(204).send())
      .catch((err) => res.status(500).send(err));
  }
};

export const addVariableGain = async (req: Request, res: Response) => {
  const varibleGain = { ...req.body };
  const { id } = req.params;
  if (
    !varibleGain.name ||
    !varibleGain.description ||
    !varibleGain.value ||
    !varibleGain.at ||
    !varibleGain.userId
  ) {
    return res.status(400).send('missing params');
  }

  varibleGain.at = new Date(varibleGain.at);

  if (!varibleGain.at) {
    return res.status(400).send('invalid date');
  }

  if (!id) {
    varibleGain.id = crypto.randomUUID();
    db(TABLE_VARIABLE_GAINS)
      .insert(varibleGain)
      .then(() => res.status(204).send())
      .catch((err) => res.status(400).send(err));
  } else {
    varibleGain.id = id;
    db(TABLE_VARIABLE_GAINS)
      .update(varibleGain)
      .where({ id })
      .then(() => res.status(204).send())
      .catch((err) => res.status(500).send(err));
  }
};

export const deleteFixedGain = (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).send('Missing id');
  }

  db(TABLE_FIXED_GAINS)
    .delete()
    .where({ id })
    .then(() => res.status(204).send())
    .catch((err) => res.status(500).send(err));
};

export const deleteVariableGain = (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).send('Missing id');
  }

  db(TABLE_VARIABLE_GAINS)
    .delete()
    .where({ id })
    .then(() => res.status(204).send())
    .catch((err) => res.status(500).send(err));
};

export const getGainById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).send('missing params');
  }

  const fixedGain = await db(TABLE_FIXED_GAINS).where({ id }).first();

  if (fixedGain) {
    fixedGain.type = 'fixed Gain';
    return res.json(fixedGain);
  }

  const variableGain = await db(TABLE_VARIABLE_GAINS).where({ id }).first();

  if (variableGain) {
    variableGain.type = 'variable Gain';
    return res.json(variableGain);
  } else {
    return res.status(404).send('gain not found');
  }
};
