export class MissingParamError extends Error {
  constructor(paramName: string) {
    super(`missing param ${paramName}`);
    super.name = 'MissingParamError';
  }
}
