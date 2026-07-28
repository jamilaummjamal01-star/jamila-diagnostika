import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("diagnostic reset", () => {
  it("returns to question one and clears every answer after completion", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "Пройти диагностику" }));

    const answers = [
      /Косметика и парфюмерия/,
      /Новый проект или запуск/,
      /Поддержать продажи/,
      /Есть чёткий сегмент/,
      /Понятны продукт, выгода/,
      /Публикуем регулярно и видим отклик/,
      /^Instagram$/,
      /Есть качественные исходники/,
      /4–6 ключевых материалов/,
      /Да, направление соответствует/,
    ];

    for (const [index, answer] of answers.entries()) {
      await user.click(screen.getByRole("button", { name: answer }));
      await user.click(
        screen.getByRole("button", {
          name: index === answers.length - 1 ? "Получить результат" : "Продолжить",
        }),
      );
    }

    expect(
      screen.getByRole("heading", { name: /визуальный beauty-бренд/ }),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "Пройти диагностику заново" }),
    );

    expect(
      screen.getByRole("heading", { name: "В какой сфере работает Ваш бизнес?" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Косметика и парфюмерия" }),
    ).toHaveAttribute("aria-pressed", "false");
  });
});
