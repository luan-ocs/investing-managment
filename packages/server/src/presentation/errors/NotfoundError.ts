export class NotFoundError extends Error {
  constructor(element: string) {
    super(`${element} not found`);
    super.name = 'not found error';
  }
}
