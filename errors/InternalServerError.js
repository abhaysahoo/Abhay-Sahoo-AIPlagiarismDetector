import { HttpStatusCode } from "@/enums/errorCodes";
import { ErrorCode } from "@/enums/errorCodes";
import { CustomError } from "./CustomError";

export class InternalServerError extends CustomError {
    constructor(message = 'Internal Server Error') {
        super(message, HttpStatusCode.INTERNAL_SERVER_ERROR, ErrorCode.INTERNAL_ERROR);
    }
}