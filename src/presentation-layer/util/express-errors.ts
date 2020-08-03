import * as httpStatus from 'http-status';

/**
 * @extends Error
 */
export class ExtendableError extends Error {
  public name: string;
  public message: string;
  public errors?: string[];
  public status?: number;
  public isPublic?: boolean;
  public isOperational?: boolean;
  public stack?: string;
  constructor({
    message, errors, status, isPublic, stack,
  }) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    this.errors = errors;
    this.status = status;
    this.isPublic = isPublic;
    this.isOperational = true;
    this.stack = stack;
  }
}

/**
 * Class representing an API error.
 * @extends ExtendableError
 */
export class ApiError extends ExtendableError {
  public errors?: any;
  public status?: number;
  public isPublic?: boolean;
  public isOperational?: boolean;
  public stack?: string;
  /**
   * Creates an API error.
   * @param {string} message - Error message.
   * @param {number} status - HTTP status code of error.
   * @param {boolean} isPublic - Whether the message should be visible to user or not.
   */
  constructor({
    message, errors = [], stack = '', status = httpStatus.INTERNAL_SERVER_ERROR, isPublic = false,
  }) {
    super({
      errors,
      isPublic,
      message,
      stack,
      status,
    });
  }
}

/**
 * @function Api succes response
 * @param {string} typeOrMessage Can be "FETCH","UPDATE","DELETE" or any custom message
 * @param {any} data Any data type array, object etc.
 */
export function success(typeOrMessage, data = null) {
  let message = '';

  switch (typeOrMessage) {
    case 'FETCH':
      message = 'Data fetched successfully';
      break;

    case 'UPDATE':
      message = 'Data updated successfully';
      break;

    case 'DELETE':
      message = 'Data deleted successfully';
      break;

    default:
      message = typeOrMessage;
      break;
  }

  return {
    data,
    message,
  };
}

export function makeErrorHandlers(env: string) {
  /**
 * Error handler. Send stacktrace only during development
 * @public
 */
  // eslint-disable-next-line no-unused-vars
  const handler = (err, req, res, next) => {
    const response = {
      code: err.status,
      errors: err.errors,
      message: err.message || httpStatus[err.status],
      stack: err.stack,
    };

    if (env !== 'development') {
      delete response.stack;
    }
    if (err.status) {
      res.status(err.status);
    } else {
      res.status(httpStatus.INTERNAL_SERVER_ERROR);
    }
    res.json(response);
  };


  /**
   * If error is not an instanceOf {Error}, convert it.
   * @public
   */
  // eslint-disable-next-line no-unused-vars
  function converter(err, req, res, next) {
    let convertedError = err;

    if (!(err instanceof ApiError)) {
      convertedError = new ApiError({
        message: err.message,
        stack: err.stack,
        status: err.status,
      });
    }

    return handler(convertedError, req, res, next);
  };

  /**
   * Catch 404 and forward to error handler
   * @public
   */
  function notFound(req, res, next) {
    const err = new ApiError({
      message: 'Not found',
      status: httpStatus.NOT_FOUND,
    });

    return handler(err, req, res, next);
  };

  return {
    handler,
    converter,
    notFound,
  }
}