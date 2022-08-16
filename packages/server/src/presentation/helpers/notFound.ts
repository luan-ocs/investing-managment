export const notFound = (value: Error) => {
  return {
    statusCode: 404,
    message: value.message,
  };
};
