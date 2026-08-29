import { defineConfig } from 'astro/config';

export default defineConfig({
  // Базовый домен сайта.
  // Репозиторий должен называться <владелец>.github.io — иначе GitHub Pages отдаёт
  // сайт по подпути /<репозиторий>/, и все абсолютные ссылки на стили и картинки ломаются.
  // Потом обязательно заменить на реальный домен, чтобы sitemap и robots работали корректно.
  site: 'https://luckyday-docx.github.io',

  // Если позже понадобится, здесь можно подключить интеграции:
  // integrations: [],
});