import crypto from 'crypto';
import { Expense } from './Expense';
import { Gain } from './Gain';

export class User {
  public readonly id: string;
  public name: string;
  public email: string;
  public password: string;
  public gains: Gain[];
  public expenses: Expense[];
  public admin: boolean;

  constructor(
    props: {
      name: string;
      email: string;
      password: string;
      gains?: Gain[];
      admin?: boolean;
      expenses?: Expense[];
    },
    id?: string,
  ) {
    this.admin = false;
    this.email = props.email;
    this.name = props.name;
    this.password = props.password;
    this.gains = [];
    this.expenses = [];

    if (!id) {
      this.id = crypto.randomUUID();
    } else {
      this.id = id;
    }

    if (props.gains) {
      this.gains = props.gains;
    }

    if (props.expenses) {
      this.expenses = props.expenses;
    }

    if (props.admin) {
      this.admin = props.admin;
    }
  }

  addGain(gain: Gain) {
    this.gains.push(gain);
  }

  addExpense(expense: Expense) {
    this.expenses.push(expense);
  }

  removeGain(g: Gain) {
    this.gains = this.gains.filter((gain) => gain.id !== g.id);
  }

  removeExpense(ex: Expense) {
    this.expenses = this.expenses.filter((expense) => expense.id !== ex.id);
  }
}
