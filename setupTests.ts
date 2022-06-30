import "@testing-library/jest-dom";
import { mockServer } from "./src/mocks/server";

beforeAll(() => mockServer.listen());
afterEach(() => mockServer.resetHandlers());
afterAll(() => mockServer.close());
