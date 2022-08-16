import crypto from 'crypto';

export class Expense {
  public readonly id: string;

  constructor(public quantity: number, public type: string, id?: string) {
    if (id) {
      this.id = id;
    } else {
      this.id = crypto.randomUUID();
    }
  }
}
