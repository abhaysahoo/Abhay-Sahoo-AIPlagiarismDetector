import { InternalServerError } from "@/errors/InternalServerError";
import { retryWithBackoff } from "@/lib/utils";

import OpenAI from 'openai';

const openai = new OpenAI();

export class OpenAIWrapperService {
    async processSentencesWithAI(sentenceArray) {
        console.log("Chuncking all sentences into batches...");
        const batchesArray = this.#chunkArray(sentenceArray, 5); // splitting sentences into batches of 5
        const responses2dArray = [];

        // Process every 4 batches concurrently
        for (let i = 0; i < batchesArray.length; i += 4) {
            const currentBatchGroup = batchesArray.slice(i, i + 4); // Get the next 4 batches

            // Process the 4 batches concurrently with retry logic
            console.log("Processing 4 batches concurrently...");
            const batchResponses = await Promise.all(
                currentBatchGroup.map(batch => retryWithBackoff(async () => await this.#processBatch(batch), 3))
            );

            // Collect all responses from this batch group
            responses2dArray.push(...batchResponses);
        }

        const responses1dArray = responses2dArray.flat(); // Merge all responses into one 1d array

        const results = this.#generateResults(sentenceArray, responses1dArray);
        return results;
    }


    /* Splitting the array of sentences into chunks for concurrent API requests */
    #chunkArray(sentenceArray, size) {
        const result = [];
        for (let i = 0; i < sentenceArray.length; i += size) {
            result.push(sentenceArray.slice(i, i + size));
        }

        return result;
    }

    #generateResults(sentences, responsesArray) {
        const results = [];
        responsesArray.forEach((item, index) => {
            if(sentences[index]) {
                results.push({
                    sentence: sentences[index],
                    plagiarismInfo: item
                });
            }  
        });

        return results;
    }

    async #processBatch(batch) {
        try {
            const response = await openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: "system",
                        content: `You are a plagiarism detection tool. Your task is to analyze the sentences given by the user 
                            and determine if they are likely to be plagiarised based on the following criteria: 
                            - Similarity to known or common content: Consider if the sentence seems overly familiar, follows 
                            widely used phrasing, or mirrors common sources like articles, books, or papers.
                            - If the sentence repeats known information, it is likely to be plagiarised.
                            - Structural and content repetition: Evaluate whether the structure and organization of the content 
                            match typical examples of plagiarism.
                            - If part of a word is flagged as plagiarised, mark the entire word as plagiarised. 
                            
                            For each sentence, return a JSON object with 
                            two keys: 'st' (start index) and 'ed' (end index). If the entire sentence is plagiarized, 
                            'st' should be 0 and 'ed' should be the length of the sentence minus 1. If no part of the 
                            sentence is plagiarized, return { "st": -1, "ed": -1 }.

                            Ensure the response is **valid JSON**.
                            
                            USER INPUT Format:
                            Sentences:
                            "<sentence1>"
                            "<sentence2>"
                            ...

                            RESPONSE Format: 
                            {
                                "data": [
                                    { "st": 0, "ed": 56 },
                                    { "st": -1, "ed": -1 },
                                    ...
                                ]
                            }`
                    },
                    {
                        role: "user",
                        content: `Sentences:\n${batch.join("\n")}`,
                    },
                ],
                max_tokens: 10000,
                temperature: 0,
            });

            // Try parsing the response content as JSON
            let responseJSONObject;
            try {
                // Remove unwanted newlines or trailing commas before parsing
                const cleanedResponse = response.choices[0].message.content.trim();

                // Attempt to parse the cleaned response as JSON
                responseJSONObject = JSON.parse(cleanedResponse);
            } catch (jsonError) {
                // Log the response content for debugging purposes
                console.error('Failed to parse JSON. Response:', response.choices[0].message.content);
                throw new InternalServerError("Invalid JSON format returned from OpenAI.");
            }

            // Ensure 'data' exists and is properly formatted
            if (!responseJSONObject.data || !Array.isArray(responseJSONObject.data)) {
                console.error('Malformed response:', responseJSONObject);
                throw new InternalServerError("Malformed response from OpenAI API.");
            }

            return responseJSONObject.data;

        } catch (error) {
            if(error instanceof InternalServerError)
                throw error;

            console.error('Error while using OpenAI API:', error);
            throw new InternalServerError("Something went wrong on the server-side. Please contact the administrator.");
        }
    }
}