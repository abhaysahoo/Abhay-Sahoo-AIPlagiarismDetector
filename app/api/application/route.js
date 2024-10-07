import { NextResponse } from 'next/server';
import { PlagiarismCheckerService } from '@/services/plagiarismCheckerService';
import { RequestValidationService } from '@/services/requestValidationService';

export async function POST(req, res) {
    try {

        const requestValidationService = new RequestValidationService();
        console.log('Validating request and getting file...')
        const file = await requestValidationService.validateRequestAndGetFile(req);
        // console.log(file);
        
        const plagiarismCheckerService = new PlagiarismCheckerService();
        const report = await plagiarismCheckerService.checkPlagiarism(file);

        return NextResponse.json({ message: 'File processed by AI', plagiarismReport: report }, { status: 200 });     
    } catch (error) {
        console.error('Error handling file: ', error);
        return NextResponse.json({ 
            message: error.message, 
            errorType: error.errorCode 
        }, { status: error.statusCode });
    }
};
