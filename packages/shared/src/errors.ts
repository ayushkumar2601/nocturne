export class WethError extends Error {
  constructor(message: string, public code: string, public statusCode: number = 500) {
    super(message);
    this.name = 'WethError';
  }
}

export class ValidationError extends WethError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR', 400);
    this.name = 'ValidationError';
  }
}

export class RpcError extends WethError {
  constructor(message: string) {
    super(message, 'RPC_ERROR', 502);
    this.name = 'RpcError';
  }
}
