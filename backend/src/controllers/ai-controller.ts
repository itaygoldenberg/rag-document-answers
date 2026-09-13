import express, { Request, Response, NextFunction } from "express";
import { ragRetrieval } from "../ai/rag-retrieval";
import { gptService } from "../services/gpt-service";
import { appConfig } from "../utils/app-config";
import { ragEmbedding } from "../ai/rag-embedding";

class AiController {

    public readonly router = express.Router();

    public constructor() {
        this.router.post("/api/vector-db", this.buildVectorDb);
        this.router.post("/api/chunks", this.getChunks);
        this.router.post("/api/ask", this.ask);
    }

        private async buildVectorDb(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            await ragEmbedding.embed();
            response.json({ message: "Vector database created." });
        }
        catch (err: any) {
            next(err);
        }
    }
    private async getChunks(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const question = request.body.question;

            const chunks = await ragRetrieval.retrieve(question, appConfig.topResultsCount);

            response.json({ chunks });
        }
        catch (err: any) {
            next(err);
        }
        
    }
        private async ask(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const question = request.body.question;

            const chunks = await ragRetrieval.retrieve(question, appConfig.topResultsCount);

            const systemPrompt = ` Answer the question based on  the attached documents. if the answer isn't  there write i don't know. ${chunks}`;

            const answer = await gptService.getCompletion(systemPrompt, question);

            response.json({answer, chunks });
        }
        catch (err: any) {
            next(err);
        }
    }
}

export const aiController = new AiController();