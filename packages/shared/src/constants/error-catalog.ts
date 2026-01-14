export const ErrorCatalog = {
  USER_NOT_FOUND: {
    statusCode: 404,
    message: 'User not found',
  },
  EMAIL_ALREADY_EXISTS: {
    statusCode: 409,
    message: 'Email already exists',
  },
  UNAUTHORIZED: {
    statusCode: 401,
    message: 'Unauthorized',
  },
  SERVICE_UNAVAILABLE: {
    statusCode: 503,
    message: 'Service unavailable',
  },
} as const;
