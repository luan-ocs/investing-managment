export const ok = (data: unknown) => {
  return {
    statusCode: 200,
    data: data,
  };
};
