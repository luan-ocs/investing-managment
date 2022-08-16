import { Request, Response } from 'express';
import { CreateUserController } from '.';
import { InMemoryUserRepository } from '../../../../test/repositories/InMemoryUserRepository';
import { CreateUser } from '../../../../useCases/User/CreateUser';
import { MissingParamError } from '../../../errors/MissingParamError';
import { UserAlreadyCreatedError } from '../../../errors/UserAlreadyCreatedError';
import { badRequest, ok } from '../../../helpers';
import { conflict } from '../../../helpers/conflict';

describe('Controller: Create user ===>', () => {
  const createSut = () => {
    const repository = new InMemoryUserRepository();
    const createUser = new CreateUser(repository);

    return new CreateUserController(createUser);
  };

  it('should send an response with an error when not pass email', async () => {
    const status = jest.fn();
    const json = jest.fn();

    const mockResponse = {
      status(code) {
        status(code);
        return mockResponse;
      },
      json(body: unknown) {
        json(body);
        return mockResponse;
      },
    } as Response;

    const sut = createSut();
    const mockRequest = {
      body: {
        email: '',
      },
    } as Request;

    await sut.handle(mockRequest, mockResponse);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({
      statusCode: 400,
      message: new MissingParamError('email').message,
    });

    expect(json).toBeCalledTimes(1);

    expect.assertions(3);
  });

  it('should send an response with an error when not pass name', async () => {
    const status = jest.fn();
    const json = jest.fn();

    const mockResponse = {
      status(code) {
        status(code);
        return mockResponse;
      },
      json(body: unknown) {
        json(body);
        return mockResponse;
      },
    } as Response;

    const sut = createSut();
    const mockRequest = {
      body: {
        email: 'abc',
      },
    } as Request;

    await sut.handle(mockRequest, mockResponse);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith(
      badRequest(new MissingParamError('name')),
    );
    expect(json).toHaveBeenCalledTimes(1);

    expect.assertions(3);
  });

  it('should send an response with an error when not pass password', async () => {
    const status = jest.fn();
    const json = jest.fn();

    const mockResponse = {
      status(code) {
        status(code);
        return mockResponse;
      },
      json(body: unknown) {
        json(body);
        return mockResponse;
      },
    } as Response;

    const sut = createSut();
    const mockRequest = {
      body: {
        email: 'abc',
        name: 'any',
      },
    } as Request;

    await sut.handle(mockRequest, mockResponse);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith(
      badRequest(new MissingParamError('password')),
    );
    expect(json).toHaveBeenCalledTimes(1);

    expect.assertions(3);
  });

  it('should send an response with the user id created when send the right params', async () => {
    const status = jest.fn();
    const json = jest.fn();
    let userId = '';

    const mockResponse = {
      status(code) {
        status(code);
        return mockResponse;
      },
      json(response) {
        userId = response.data.userId;
        json(response);
        return mockResponse;
      },
    } as Response;

    const sut = createSut();
    const mockRequest = {
      body: {
        email: 'any',
        name: 'any',
        password: '123abc',
      },
    } as Request;

    await sut.handle(mockRequest, mockResponse);

    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith(ok({ userId }));
    expect(json).toHaveBeenCalledTimes(1);

    expect.assertions(3);
  });

  it('should send an error if send an user that already in database', async () => {
    const status = jest.fn();
    const json = jest.fn();

    const mockResponse = {
      status(code) {
        status(code);
        return mockResponse;
      },
      json(response) {
        json(response);
        return mockResponse;
      },
    } as Response;

    const sut = createSut();
    const mockRequest = {
      body: {
        email: 'any',
        name: 'any',
        password: '123abc',
      },
    } as Request;

    await sut.handle(mockRequest, mockResponse);
    await sut.handle(mockRequest, mockResponse);

    expect(status).toHaveBeenCalledWith(200);
    expect(status).toHaveBeenLastCalledWith(409);
    expect(json).toHaveBeenCalledWith(conflict(new UserAlreadyCreatedError()));
    expect(json).toHaveBeenCalledTimes(2);

    expect.assertions(4);
  });
});
