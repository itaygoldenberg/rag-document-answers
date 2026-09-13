import { OpenAIEmbedding } from "@llamaindex/openai";
import { SimpleDirectoryReader } from "@llamaindex/readers/directory";
import {
  Settings,
  storageContextFromDefaults,
  VectorStoreIndex,
} from "llamaindex";
import path from "path";
import dotenv from "dotenv";
import { appConfig } from "../utils/app-config";



// Run with: npm run embed
class RagEmbedding {
  public constructor() {
  
  }

   public async embed(): Promise<void> {
    Settings.embedModel = new OpenAIEmbedding({
      apiKey: appConfig.openaiApiKey ,
    });
    Settings.chunkSize = 512;
    Settings.chunkOverlap = 128;

    const reader = new SimpleDirectoryReader();
    const docsFolder = path.join(__dirname, "..", "assets", "docs");
    const documents = await reader.loadData({ directoryPath: docsFolder });

    const vectorDbFolder = path.join(__dirname, "..", "assets", "vector-db");
    const vectorDbStorage = await storageContextFromDefaults({
      persistDir: vectorDbFolder,
    });

    const vectorStore = await VectorStoreIndex.fromDocuments(documents, {
      storageContext: vectorDbStorage,
    });

    const nodes = vectorStore.indexStruct.nodesDict;
    console.log("Total chunks created: " + Object.keys(nodes).length);
  }
}

export const ragEmbedding = new RagEmbedding();

// Runs only when this file is executed directly (npm run embed)
if (require.main === module) ragEmbedding.embed();