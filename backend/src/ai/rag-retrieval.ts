import { OpenAIEmbedding } from "@llamaindex/openai";
import { Settings, storageContextFromDefaults, TextNode, VectorStoreIndex } from "llamaindex";
import { appConfig } from "../utils/app-config";
import path from "path";

class RagRetrieval {

    private vectorStore: VectorStoreIndex = null!;

    public constructor() {
        this.loadVectorDB();
    }

    private async loadVectorDB(): Promise<void> {

        Settings.embedModel = new OpenAIEmbedding({ apiKey: appConfig.openaiApiKey });

        const vectorDbFolder = path.join(__dirname, "..", "assets", "vector-db");
        const vectorDbStorage = await storageContextFromDefaults({ persistDir: vectorDbFolder });

        this.vectorStore = await VectorStoreIndex.init({ storageContext: vectorDbStorage });
    }

        public async retrieve(question: string, topResultsCount: number): Promise<string> {

        const results = await this.vectorStore
            .asRetriever({ similarityTopK: topResultsCount })
            .retrieve(question);

        let chunks = "";

        for (let i = 0; i < results.length; i++) {
            const score = results[i].score;
            const text = (results[i].node as TextNode).text.replace(/\s+/g, " ");
            chunks += `[chunk ${i + 1} | score: ${score}]: ${text}\n\n`;
        }

        return chunks;
    }

}

export const ragRetrieval = new RagRetrieval();