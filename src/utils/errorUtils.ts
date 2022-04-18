export function invalidEntity(message : string) {
    return { statusCode: 422, message}
  }
export function authError(message : string) {
    return { statusCode: 401, message}
  }
export function notFoundError(message : string) {
    return { statusCode: 404, message}
  }
export function conflictError(message : string) {
    return { statusCode: 409, message}
  }
export function badRequest(message : string) {
    return { statusCode: 400, message }
  }

