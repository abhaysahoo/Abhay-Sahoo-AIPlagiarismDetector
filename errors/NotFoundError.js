import { HttpStatusCode } from "@/enums/errorCodes";
import { ErrorCode } from "@/enums/errorCodes";
import { CustomError } from "./CustomError";

export class NotFoundError extends CustomError {
    constructor(message = 'Resource Not Found') {
        super(message, HttpStatusCode.NOT_FOUND, ErrorCode.NOT_FOUND);
    }
}