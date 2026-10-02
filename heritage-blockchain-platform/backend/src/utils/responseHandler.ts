const successHandler = (message: string, data: unknown = null, status: number = 200) => {
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
