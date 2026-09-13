import express from "express";
import cors from "cors";
import { errorMiddleware } from "./middleware/error-middleware";
import { aiController } from "./controllers/ai-controller";
import { appConfig } from "./utils/app-config";

const server = express();

server.use(cors());
server.use(express.json());

server.use("/", aiController.router);

server.use(errorMiddleware.routeNotFound);
server.use(errorMiddleware.catchAll);

server.listen(appConfig.port, () => console.log("Listening..."));