export class StatusCodeError extends Error {
  statusCode: number
  originalErrorMessage: string
  constructor({
    message,
    statusCode,
    originalErrorMessage,
  }: {
    message: string
    statusCode: number
    originalErrorMessage: string
  }) {
    super(message)
    this.name = 'StatusCodeError'
    this.statusCode = statusCode
    this.originalErrorMessage = originalErrorMessage
  }
}

export class AllRetriesFailedError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AllRetriesFailedError'
  }
}
