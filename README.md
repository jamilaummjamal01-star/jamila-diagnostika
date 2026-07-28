# Контент-диагностика Джамили Шакуровой

Самостоятельная версия сайта без зависимости от ChatGPT Sites.

## Локальный запуск

```bash
npm install
npm run dev
```

## Проверка и production-сборка

```bash
npm test
npm run build
```

Готовый сайт появится в папке `dist`.

## Cloudflare Pages

При подключении репозитория укажите:

- Build command: `npm run build`
- Build output directory: `dist`
- Node.js version: `22`

После успешной публикации добавьте в проекте Pages собственный домен
`diagnostika.shakurova-content.ru`. Только после проверки временного адреса
Cloudflare замените старую DNS-запись, ведущую на ChatGPT Sites.
