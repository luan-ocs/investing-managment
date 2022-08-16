export class UnauthorizedError extends Error {
  constructor() {
    super(`unauthourized Error`);
    super.name = 'Unauthorized Error';
  }
}
