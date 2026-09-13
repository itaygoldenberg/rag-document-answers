import axios from "axios";
import { appConfig } from "../utils/app-config";

class RagService {

    // Without this the model proposes questions about the reader's own company
    // ("have we tested our DR plan?"), which the handbook cannot answer, and
    // every suggestion comes back as "I don't know".
    private static readonly ANSWERABLE =
        "Every question must be answerable from the handbook itself, about what it " +
        "recommends or requires. Never ask about the reader's own organisation, its " +
        "history or its current state. ";

    // The handbook is written in English, so the question always travels in
    // English and only the reply changes language. Translating the question
    // first would weaken the retrieval.
    public async ask(question: string, language: string): Promise<string> {

        const asked = language === "he" ? question + " Answer in Hebrew." : question;

        const response = await axios.post(appConfig.askUrl, { question: asked });

        return response.data.answer;
    }

    // Naming the chapters in the question changes which chunks the retriever
    // pulls, which is what keeps the suggestions from repeating themselves.
    public async suggestOpeners(topics: string[], language: string): Promise<string[]> {

        const question =
            "Ask one short question about each of these handbook topics: " +
            topics.join("; ") + ". " +
            RagService.ANSWERABLE +
            "Reply with the questions only, one per line, in that order, " +
            "no numbering and no extra text. Keep each under 60 characters.";

        return this.pickQuestions(await this.ask(question, language), language);
    }

    // Three ways into one chapter, for when the reader picks it from the rail.
    public async suggestForTopic(topic: string, language: string): Promise<string[]> {

        const question =
            "Ask exactly three short questions about this handbook topic: " + topic + ". " +
            RagService.ANSWERABLE +
            "Each must approach the topic differently. Reply with the three questions " +
            "only, one per line, no numbering and no extra text. Keep each under 60 characters.";

        return this.pickQuestions(await this.ask(question, language), language);
    }

    // Follow-ups run through the same RAG pipeline, so they can only point at
    // material the handbook actually covers.
    public async suggestFollowUps(previousQuestion: string, language: string): Promise<string[]> {

        const question =
            "Based on the handbook, list exactly three short follow-up questions a reader " +
            "might ask after reading about: " + previousQuestion + ". " +
            RagService.ANSWERABLE +
            "Reply with the three questions only, one per line, no numbering and no extra " +
            "text. Keep each under 60 characters.";

        return this.pickQuestions(await this.ask(question, language), language);
    }

    private pickQuestions(raw: string, language: string): string[] {

        // Hebrew ends a question with the same mark, so one test covers both.
        return raw
            .split("\n")
            .map(line => line.replace(/^[\s\-*\d.)]+/, "").trim())
            .filter(line => line.endsWith("?") && line.length > (language === "he" ? 8 : 15))
            .slice(0, appConfig.suggestionsPerRound);
    }
}

export const ragService = new RagService();
