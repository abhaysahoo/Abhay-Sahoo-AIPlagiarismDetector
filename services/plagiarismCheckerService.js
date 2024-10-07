import { OpenAIWrapperService } from "./openAIWrapperService";
import { SentenceExtractionService } from "./sentenceExtractionService";

export class PlagiarismCheckerService {
    async checkPlagiarism(file) {
        try {
            const sentenceExtractionService = new SentenceExtractionService();
            console.log("Extracting sentences from the file text...");
            const sentences = await sentenceExtractionService.getSentenceArray(file);

            const openAIWrapperService = new OpenAIWrapperService();
            console.log("Calling API wrapper to process all sentences...");
            const result = await openAIWrapperService.processSentencesWithAI(sentences);

            const plagiarismPercentage = this.#calculatePlagiarismPercentage(result);
            // console.log(plagiarismPercentage)

            return {
                sentenceReport: result, 
                plagiarismPercentage
            };
        } catch (error) {
            throw error;
        } 
    }

    #calculatePlagiarismPercentage(data) {
        let totalChars = 0;
        let plagiarizedChars = 0;

        data.forEach(item => {
            const { sentence, plagiarismInfo } = item;
            const sentenceLength = sentence.length;

            // Add the sentence length to total characters
            totalChars += sentenceLength;

            const { st, ed } = plagiarismInfo;

            // Ensure the plagiarism indices are valid before calculating plagiarized characters
            if (st >= 0 && ed >= st && ed < sentenceLength) {
                plagiarizedChars += (ed - st + 1);  // Number of plagiarized characters
            }
        });

        // Calculate the plagiarism percentage
        const plagiarismPercentage = (plagiarizedChars / totalChars) * 100;
        return plagiarismPercentage.toFixed(2);  // Returning a fixed percentage with 2 decimal points
    }
}