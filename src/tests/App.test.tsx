import { describe, expect, test } from "vitest"
import App from "../App";
import { render, screen, userEvent } from "../../test-utils";

describe("testing mock-server-worker", () => {
  test("register", async () => {
    render(<App />);
    const register_name_input = screen.getByLabelText("register_name");
    const register_password_input = screen.getByLabelText("register_password");
    const register_submit_input = screen.getByLabelText("register_submit");
    await userEvent.type(register_name_input, "test");
    await userEvent.type(register_password_input, "1234");
    await userEvent.click(register_submit_input);
    expect(await screen.findByText("가입성공")).toBeTruthy()
  });
  test("login", async () => {
    render(<App />);
    const login_name_input = screen.getByLabelText("login_name");
    const login_password_input = screen.getByLabelText("login_password");
    const login_submit_input = screen.getByLabelText("login_submit");
    await userEvent.type(login_name_input, "test");
    await userEvent.type(login_password_input, "1234");
    await userEvent.click(login_submit_input);
    expect(await screen.findByText("로그인성공")).toBeTruthy()
  });
  test("auth", async () => {
    render(<App />);
    expect(await screen.findByText("test님 환영합니다")).toBeTruthy()
  })
});