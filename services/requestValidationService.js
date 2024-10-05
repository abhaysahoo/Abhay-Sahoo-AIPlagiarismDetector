import { BadRequestError } from "@/errors/BadRequestError";

export class RequestValidationService {
    async validateRequestAndGetFile(req) {
        let formData;

        try {
            formData = await req.formData();
        } catch (error) {
            console.error(error);
            //this error can only be generated during standalone API testing
            throw new BadRequestError("Error while parsing payload");
        }

        const file = await formData.get('file'); // gettting file from the form

        if (file === undefined) {
            //this error can only be generated during standalone API testing
            throw new BadRequestError("'file' key is undefined in the payload");
        }

        if (file.type !== 'application/pdf'
            && file.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            //this error can only be generated during standalone API testing
            throw new BadRequestError("Only .pdf or .docx files are accepted in the payload");
        }

        return file;
    }
}