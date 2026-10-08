// Меняется при каждой сборке: добавляем к /src/scripts/*.js и /src/styles/*.css,
// чтобы после обновления сайта браузеры не брали старые файлы из кэша
export const buildVersion = Date.now().toString(36);

export const site = {
  name: 'Кухни Оренбург',
  title: 'Кухни на заказ в Оренбурге',
  description:
    'Кухни на заказ в Оренбурге: каталог, цены, фото, дизайн, доставка и монтаж.',
    url: 'https://kuhni-v-orenburge.ru',
  locale: 'ru_RU',
  ogImage: '/images/og-image.jpg',
  author: {
    '@type': 'Organization',
    name: 'Кухни Оренбург',
  url: 'https://kuhni-v-orenburge.ru',
  },
};