import { InternalServerError } from "@/errors/InternalServerError";
import { retryWithBackoff } from "@/lib/utils";

import OpenAI from 'openai';

const openai = new OpenAI();

export class OpenAIWrapperService {
    async processSentencesWithAI(sentenceArray) {
        const batchesArray = this.#chunkArray(sentenceArray, 5); //splitting sentences into batches of 5

        //invoking processBatch function concurrently for each batch with retry strategy
        const responses2dArray = await Promise.all(batchesArray.map(batch => retryWithBackoff(() => this.#processBatch(batch), 3)));

        const responses1dArray = responses2dArray.flat(); //merge all responses into one 1d array

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
                        content: `You are a plagiarism detection tool. Your task is to analyze the sentences given by user 
                                and determine if it likely to be plagiarised based on the following criteria: 
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
                                }`,
                    },
                    {
                        role: "user",
                        content: `Sentences:\n${batch.join("\n")}`,
                    },
                ],
                max_completion_tokens: 10000,
                temperature: 0,
            });
    
            const responseJSONObject = response.choices[0].message.content;
            const responseObject = JSON.parse(responseJSONObject);
            // console.log(responseObject.data);

            return responseObject.data;
        } catch (error) {
            console.error('Error while using OpenAI API: ', error);
            throw new InternalServerError("Something went wrong on the server-side. Please contact administrator of this website");
        }
    }
}