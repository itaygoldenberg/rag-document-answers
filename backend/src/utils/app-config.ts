import dotenv from "dotenv";

dotenv.config();

class AppConfig {

    public readonly port = process.env.PORT!;
    public readonly openaiApiKey = process.env.OPENAI_API_KEY!;

    public readonly openaiModel = "gpt-5";
    public readonly openaiUrl = "https://api.openai.com/v1/chat/completions";

    public readonly topResultsCount = 4;
}

export const appConfig = new AppConfig();