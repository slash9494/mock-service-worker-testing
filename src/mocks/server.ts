import { setupServer } from "msw/node";
import { userAPIHandlers } from "./user";


export const mockServer = setupServer(...userAPIHandlers);