
export class StandardResponse<T> {
  statusCode: number;
  message: string;
  data?: T;
  error?: any;

  constructor(
    statusCode: number,
    message: string,
    data?: T,
    error?: any,
  ) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.error = error;
  }

  static success<T>(message: string, data?: T): StandardResponse<T> {
    return new StandardResponse<T>(200, message, data);
  }
  static error<T>(message: string, error?: any): StandardResponse<T> {
    return new StandardResponse<T>(500, message, undefined, error);
  }
  static notFound<T>(message: string, error?: any): StandardResponse<T> {
    return new StandardResponse<T>(404, message, undefined, error);
  }
  static badRequest<T>(message: string, error?: any): StandardResponse<T> {
    return new StandardResponse<T>(400, message, undefined, error);
  }
  static unauthorized<T>(message: string, error?: any): StandardResponse<T> {
    return new StandardResponse<T>(401, message, undefined, error);
  }
  static forbidden<T>(message: string, error?: any): StandardResponse<T> {
    return new StandardResponse<T>(403, message, undefined, error);
  }
  static conflict<T>(message: string, error?: any): StandardResponse<T> {
    return new StandardResponse<T>(409, message, undefined, error);
  }
  static unprocessableEntity<T>(message: string, error?: any): StandardResponse<T> {
    return new StandardResponse<T>(422, message, undefined, error);
  }
  static internalServerError<T>(message: string, error?: any): StandardResponse<T> {
    return new StandardResponse<T>(500, message, undefined, error);
  }
  static notImplemented<T>(message: string, error?: any): StandardResponse<T> {
    return new StandardResponse<T>(501, message, undefined, error);
  }
  static serviceUnavailable<T>(message: string, error?: any): StandardResponse<T> {
    return new StandardResponse<T>(503, message, undefined, error);
  }
  static gatewayTimeout<T>(message: string, error?: any): StandardResponse<T> {
    return new StandardResponse<T>(504, message, undefined, error);
  }
  static tooManyRequests<T>(message: string, error?: any): StandardResponse<T> {
    return new StandardResponse<T>(429, message, undefined, error);
  }
}