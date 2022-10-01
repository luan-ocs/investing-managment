export const unauthorized = (value: Error) => {
  return {
    statusCode: 403,
    message: value.message,
  };
};
