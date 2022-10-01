export class UnauthorizedError extends Error {
  constructor(error: Error) {
    super(`unauthourized Error`);
    super.name = 'Unauthorized Error';
    super.message = error?.message;
  }
}
