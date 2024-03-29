export class ArgumentError extends Error {
    constructor(message: string) {
        // Call the parent constructor
        super(message)
        // Adjust the prototype
        Object.setPrototypeOf(this, ArgumentError.prototype);
    }
}