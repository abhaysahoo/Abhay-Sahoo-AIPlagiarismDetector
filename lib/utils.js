import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import Tokenizer from "sentence-tokenizer";
import { InternalServerError } from "@/errors/InternalServerError";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function splitIntoSentences(text) {
  const tokenizer = new Tokenizer('Chuck');
  tokenizer.setEntry(text);
  const sentences = tokenizer.getSentences();
  const cleanedUpSentences = sentences.map(sentence => cleanUpString(sentence));
  // console.log(cleanedUpSentences);
  return cleanedUpSentences;
}

export function cleanUpString(str) {
  return str.replace(/\n/g, ' ')           // Replace newlines with spaces
            .replace(/\s+/g, ' ')          // Replace multiple spaces with a single space
            .trim();                       // Trim spaces from the start and end
}

// Retry function with exponential backoff
export async function retryWithBackoff(fn, retries = 3) {
  let delay = 1000; // Start with 1 second
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) {
        console.error('Failed to generate response from OpenAI API after retries: ', error);
        // If max retries are reached, throw the error
        throw new InternalServerError("Something went wrong on the server-side. Please contact administrator of this website");
      } 
      await new Promise(resolve => setTimeout(resolve, delay)); // Wait before retrying
      delay *= 2; // Exponentially increase the delay
    }
  }
}
