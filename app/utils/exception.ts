export class CustomException extends Error {
  status = 999
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

export class AuthException extends CustomException {
  constructor(message: string = 'Unauthorized.', status: number = 401) {
    super(message, status)
  }
}

export class ForbiddenException extends CustomException {
  status = 403
  constructor(message: string = 'Forbidden.', status: number = 403) {
    super(message, status)
  }
}

export class NotFoundException extends CustomException {
  constructor(message: string = 'No record(s) found.', status: number = 404) {
    super(message, status)
  }
}

export class ServerInternalError extends CustomException {
  constructor(
    message: string = 'Server internal error.',
    status: number = 500,
  ) {
    super(message, status)
  }
}
