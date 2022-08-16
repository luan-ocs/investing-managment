export const conflict = (data: Error) => {
  return {
    statusCode: 409,
    message: data.message,
  };
};
