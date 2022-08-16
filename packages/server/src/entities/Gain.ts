import crypto from 'crypto';

export class Gain {
  public readonly id: string;
  public at: Date;

  constructor(
    public quantity: number,
    public type: string,
    at: Date,
    id?: string,
  ) {
    if (id) {
      this.id = id;
    } else {
      this.id = crypto.randomUUID();
    }

    this.at = at;
  }
}
