import { setupWorker } from "msw";
import { userAPIHandlers } from "./user";

export const mockWorker = setupWorker(...userAPIHandlers);