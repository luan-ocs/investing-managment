export class UserAlreadyCreatedError extends Error {
  constructor() {
    super(`user already created`);
    super.name = 'UserAlreadyCreatedError';
  }
}
