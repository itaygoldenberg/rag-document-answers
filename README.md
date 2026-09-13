<h1 align="center">RAG</h1>

<p align="center"><em>Answers questions from your own documents, not from the model's memory.</em></p>

<p align="center">
<img src="https://img.shields.io/badge/LlamaIndex-000000?style=for-the-badge&logo=chainlink&logoColor=white" alt="LlamaIndex" />
<img src="https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white" alt="OpenAI" />
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
<img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
<img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
</p>

---
## The problem it solves

A language model answers from what it was trained on. Ask it about a document it has never seen and it will either refuse or invent one. Retrieval-Augmented Generation fixes that by finding the relevant passages first and handing them to the model as context.

## How it works

```text
documents  -->  chunks  -->  embeddings  -->  vector store
                                                   |
question  -->  embedding  -->  nearest chunks  -----+-->  prompt  -->  answer
```

| Step | Where |
|---|---|
| Split the documents and embed them | `npm run embed` reads `src/assets/docs` and writes `src/assets/vector-db` |
| Embed the question and find the closest chunks | retrieval, at request time |
| Put those chunks in the prompt and ask | the answer draws only on what was retrieved |

Embedding turns text into a list of numbers positioned so that similar meanings sit close together. Finding relevant text then becomes a distance calculation rather than a keyword match, which is why a question phrased differently from the document still finds it.

## Structure

```text
backend/
|-- src/ai/          indexing and retrieval
|-- src/assets/
|   |-- docs/            the source documents
|   `-- vector-db/       generated, not committed
`-- src/controllers/
frontend/            asks the question, shows the answer
```

## Running it

```bash
cd backend
```

```bash
npm install
```

Build the vector store once, before the first question:

```bash
npm run embed
```

```bash
npm start
```

Then, in a second terminal:

```bash
cd frontend
```

```bash
npm run dev
```

## Environment

Copy `.env.example` to `.env` and fill in your own values:

```env
OPENAI_API_KEY=your_openai_api_key
```

`.env` is ignored by git. Never commit real keys.

---

<p align="center">
  <strong>Itay Goldenberg</strong><br />
  <sub>John Bryce Full Stack Development</sub>
</p>

<p align="center">
  <a href="https://github.com/itaygoldenberg">GitHub</a> &middot;
  <a href="https://www.linkedin.com/in/itay-goldenberg/">LinkedIn</a>
</p>
