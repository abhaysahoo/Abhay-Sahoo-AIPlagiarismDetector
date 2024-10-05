import { HttpStatusCode } from "@/enums/errorCodes";
import { ErrorCode } from "@/enums/errorCodes";
import { CustomError } from "./CustomError";

export class BadRequestError extends CustomError {
    constructor(message = 'Bad Request') {
        super(message, HttpStatusCode.BAD_REQUEST, ErrorCode.INVALID_INPUT);
    }
}