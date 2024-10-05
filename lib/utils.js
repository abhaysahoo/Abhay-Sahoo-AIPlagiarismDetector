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
export async function retryWithBackoff(fn, retries, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      // If it's a rate limit error (429), increase the backoff and try again
      if (error.response && error.response.status === 429) {
        const retryAfter = error.response.headers['retry-after'] || delay; // Use 'retry-after' header if available
        console.warn(`Rate limit hit. Retrying after ${retryAfter}ms...`);
        await new Promise(resolve => setTimeout(resolve, retryAfter));
      } else {
        console.error('Error:', error);
        throw error; // Other errors should not be retried
      }
    }
    // Exponentially increase the delay with each retry
    delay *= 2;
  }
  throw new Error('Max retries reached');
}

