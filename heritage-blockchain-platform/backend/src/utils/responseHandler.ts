const successHandler = (status: number, message: string, data: unknown = null) => {
  return {
    success: true,
    status,
    message,
    data
  };
};

const errorHandler = (status: number, message: string) => {
  return {
    success: false,
    status,
    message
  };
};

export { successHandler, errorHandler };
