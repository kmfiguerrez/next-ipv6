import { ArgumentError } from "./custom-error"

/**
 * Gets the error message of the input unknown error object.
 * 
 * @param {object} error - An unknown error object. 
 * 
 * @returns A string of error message.
 */
export const getErrorMessage = (error: unknown): string => {
  let message: string = "Something went wrong."

  if (error instanceof SyntaxError) {
    message = error.message
    return message
  }  
  else if (error instanceof TypeError) {
    message = error.message
    return message
  }
  else if (error instanceof RangeError) {
    message = error.message
    return message
  }
  else if (error instanceof ArgumentError) {
    message = error.message
    return message
  }
  else if (error instanceof Error) {
    message = error.message
    return message
  }

  // Otherwise couldn't figure out the error.
  return message
}