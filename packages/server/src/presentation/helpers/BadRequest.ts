export const badRequest = (value: Error) => {
  return {
    statusCode: 400,
    message: value.message,
  };
};
