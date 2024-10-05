import PDF from 'pdf-extraction'; // For handling PDF text extraction
import mammoth from 'mammoth'; // For handling .docx text extraction
import { splitIntoSentences } from '@/lib/utils';
import { BadRequestError } from '@/errors/BadRequestError';

export class SentenceExtractionService {
    async getSentenceArray(file) {
        let fileBuffer;

        try {
            const arrayBuffer = await file.arrayBuffer(); // Convert file to ArrayBuffer
            fileBuffer = Buffer.from(arrayBuffer); // Convert ArrayBuffer to Buffer
        } catch (error) {
            throw new BadRequestError("Error while parsing file");
        }

        let fileText;

        if (file.type === 'application/pdf') {
            const pdfData = await PDF(fileBuffer); //extracting PDF data
            // console.log(pdfData.text);
            fileText = pdfData.text;

        } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            const docxData = await mammoth.extractRawText({ buffer: fileBuffer }); //extracting docx data
            // console.log(docxData.value);
            fileText = docxData.value;
            
        }

        const sentenceArray = splitIntoSentences(fileText); // splits text into sentences and returns an array of sentences

        if(sentenceArray.length === 0) {
            throw new BadRequestError("No text in provided file");
        }

        return sentenceArray;
    }
}