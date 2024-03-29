# Инструкция по использованию сборки

Скачайте сборку с помощью `git clone <ссылка-на-репозиторий>`, либо скачав zip архив из вкладки Code -> Download ZIP.

`npm i` – установить все зависимости  
`npm run dev` – запустить сборку в режиме разработки  
`npm run build` – запустить сборку в режиме продакшена  
`npm run buildNoWebp` – запустить сборку в режиме продакшена (без конвертации картинок в webp)

## Оглавление
* Структура папок и файлов
* Основные возможности
* HTML
* SCSS
* JavaScript
* Изображения
* Шрифты
* Дополнения
* Конец работы

## Структура папок и файлов

```
|--config
|  |--webpack.dev.js      # для сборки минифицированного js
|  |--webpack.prod.js     # для сборки неминифицированного js
|
|--src
|  |--assets              # папка с необязательными дополнениями
|  |  |--json             # для json файлов
|  |  |--music            # для файлов музыки
|  |  |--video            # для файлов видео
|  |
|  |--fonts               # для файлов шрифтов (.ttf и .woff2)
|  |
|  |--img                 # для изображений
|  |  |--icons            # для иконок (.svg)
|  |  |--switcher         # здесь лежат 4 иконки для модуля Switcher
|  |
|  |--js                  # папка для скриптов
|  |  |--app.js           # главный файл скриптов
|  |  |--components       # папка с дополнениями
|  |  |  |--functions.js  # файл с функциями
|  |  |  |--modules.js    # файл с модулями
|  |  |  |--script.js     # файл для написания скриптов
|  |
|  |--scss                # папка для стилей
|  |  |--components       # папка с scss модулями
|  |  |--elements         # папка со стилями подключаемых модулей
|  |  |--style.scss       # главный файл стилей
|  |
|  |--_footer.html        # файл для разметки подвала сайта
|  |--_head.html          # файл для тега head
|  |--_header.html        # файл для разметки шапки сайта
|  |--index.html          # основной файл html (для главной страницы)
|
|--.gitignore             # файл .gitignore
|--gulpfile.js            # основной файл сборки
|--package.json           # package.json
```

## Основные возможности сборки:

* **Сжатие кода и изображений** (кроме формата svg), конвертация картинок в webp (можно отключить)
* Возможность подключать различные **html файлы** друг к другу
* Возможность использования **JavaScript import/export**
* Конвертация шрифтов в формат **woff2** и их **автоматическое подключение** в файл стилей
* Огромное количество **модулей, функций и модификаций**, позволяющих в разы ускорить разработку сайта
* Создание разметки **Open Graph** из коробки
* **Dev сервер** с возможностью hot-reload

# Подробно

## HTML

Главный файл – **index.html**. В нем пишется весь код для основной (главной) страницы сайта.

В самом верху есть конструкция @@include('_head.html') с различными полями. Эта конструкция позволяет быстро подключить на страницу шапку со всеми необходимыми настройками. Пробежимся по полям:
* title: Вставляется в тег title, то есть название сайта
* description: Вставляется в тег description, то есть описание сайта
* keywords: служит для определения ключевых слов
* url: базовый url сайта
* image: сюда вставляется путь к картинке сайта (для соцсетей)
* name: имя сайта

Пример:

```
@@include('_head.html', {  
  title: 'Главная страница',  
  description: 'Описание сайта',  
  keywords: 'e-commerce, shop, blog',  
  url: 'https://example.com',  
  image: 'https://example.com/thumb.png',  
  name: 'E-commerce Shop',  
})
```

Используя эту конструкцию (@@include с параметрами), можно быстро вставлять мета-теги в любую страницу многостраничного сайта, а не копировать всю Open Graph разметку.

Далее в файле так же есть конструкции @@include, которые подключают шапку и подвал сайта. Эти конструкции также рекомендуется использовать на всех страницах сайта, чтобы не копировать разметку шапки и подвала. Саму разметку следует писать в файлах _header.html и _footer.html соответственно. Также, файлы, начинающиеся с нижнего подчеркивания (\_) в production-версию не идут (то есть идет только файл index.html). Если необходимо создать еще какие-нибудь html-страницы, то их следует создавать на том же уровне, что и index.html, и называть без нижнего подчеркивания (например page.html).

Чтобы добавить на сайт favicon, необходимо добавить файл favicon.ico в папку img. (В будущем будут изменения)

## SCSS

Самая большая папка на сборке – scss. В ней есть 3 сущности: файл style.scss, где идет настройка проекта и где можно писать стили для страницы. Далее идут папки components и elements, о них позже.

### style.scss

Первой строкой подключается библиотека для вычислений sass math. Далее идет подключение файлов с миксинами. Из них самый важный, который удалять нельзя – миксин для подключения шрифтов. О нем также позже. Далее идет раздел для подключения шрифтов, причем 2-мя способами:
1) Подключения с помощью @import (если шрифт идет с Google Fonts). При таком способе подключения необходимо вставить строку &display=swap в конец подключаемой ссылки (закомментирована ниже)
2) Раскомментировав подключение файла components/fonts.scss, тогда вставятся локальные шрифты, которые находятся в папке fonts

Так же, при необходимости, можно подключить иконочный шрифт (Icomoon). Для этого так же сохраните шрифт в папку fonts, далее все классы, которые предоставляет Icomoon необходимо вставить в файл по пути scss/components/icons.scss, далее раскомментировать подключаемый файл icons.scss. По умолчанию класс для иконки – _icon-<название-иконки>, но можно настроить это под себя, поменяв класс во все том же файле icons.scss.

Далее идет подключения стилей обнуления, там все стандартно. Далее идет файл с подключением scss-переменных. Они нужны для настройки проекта.

```SCSS
//---Шрифт по умолчанию
$fontFamily: "";
$fontWeight: 400;

//---РАЗМЕРЫ---===============================
// Минимальная ширина страницы
$minWidth: 320;
// Ширина полотна (макета)
$maxWidth: 1440;
// Ширина ограничивающего контейнера (0 = нет ограничения)
$maxWidthContainer: 1280;
// Отступ безопасности
$containerPadding: 30;

// Конечная ширина контейнера
$containerWidth: $maxWidthContainer + $containerPadding;
```

Далее идет селектор `:root`, куда подключаются остальные переменные, но уже в CSS формате. Я рекомендую использовать CSS переменные, чтобы после билда проекта переменные можно было быстро поменять, не залезая в исходники.

Далее идут остальные стили страницы. Первым делом можно подключить цветовую схему, если сайт имеет 2 темы (темную и светлую). В ней так же лежат переменные, которые необходимо будет заполнить в зависимости от названия темы (сначала идет темная тема, потом светлая).

В `body` присутствуют основные стили для страницы: шрифт, цвета и transition, если будет смена темы (чтобы плавно). Так же присутствует класс _lock, которые ограничивает скролл сайта при открытых элементах (меню, модальные окна и тд).

Далее идет класс wrapper, который нужен для того, чтобы избежать появление горизонтального скролла на странице. Ниже идет настройка контейнера. Чтобы воспользоваться контейнером, не обязательно писать класс `container`, можно писать любой класс, который оканчивается на `__container` (например `header__container`, `block__container`)

Далее идет импорт файла с общими классами. Например, если на сайте много однотипных текстов/заголовков/кнопок, то классы для этих элементов можно писать в этом файле. После общих классов идут импорты подключения различных модулей, на них останавливаться не будем.

Под конец идет подключение файлов для шапки и подвала (так сделано ради удобства), и секция для написания остальных стилей. Стиль 
```SCSS
.main {
	flex: 1 1 auto;
}
```
нужен для того, чтобы подвал сайта всегда был прижат к низу сайта.

### components

В этой папке лежат компоненты, которые отвечают за стили в целом (кроме header и footer).

### elements

В отличие от папки components, здесь лежат стили, относящиеся к каким-либо компонентам.

## JavaScript

В папке js лежат все JS файлы. Самый главный – `app.js`. Здесь подключаются все модули, но практически не пишется код. Чтобы подключить модуль, достаточно просто раскомментировать его подключение. Для некоторых модулей (spoilers, showMore) необходимо будет подключить дополнительные модули анимации в самом низу app.js (в будущем планирую убрать это).

Так же есть папка components, где лежат 3 файла: `modules.js` для описания всех модулей, `functions.js`, где лежат функции, которые могут пригодиться во время написания скриптов (а именно throttling, debounce, random number, getDay, getMonth). Список будет пополняться.

Третий файл – `script.js`. В этом файле можно писать свои скрипты, подключать библиотеки и тд и тп.

## Изображения

Все изображения хранятся в папке `img`. Изображения можно хранить в отдельных папках внутри img. Все иконки можно хранить в папке icons. Так же там лежит папка switcher, в которой лежат все необходимые иконки для элемента switcher (если на сайте он использоваться не будет, то папку можно удалить). 

Все изображения будут сжиматься при команде `buildNoWebp`, а при обычном `build` еще и конвертироваться в webp. При этом, в HTML автоматически вставятся теги `picture`, а в CSS вставятся так же изображения в формате webp. Векторные изображения никак не сжимаются и не конвертируются.

## Шрифты

Шрифты необходимо помещать в папку fonts, причем в 1 из 2-х форматов: `.ttf` либо `.woff2`. Шрифты в формате `.ttf` будут на выходе конвертироваться в формат `.woff2`, что даст меньший размер шрифта. Так же, все шрифты из папки `fonts` будут автоматически подключаться в файл стилей с помощью директивы `@font-face`. Я рекомендую в начале работы именно подключить шрифты, а потом уже работать с настройкой проекта и тд.

#### ВАЖНО: после подключения шрифтов, проверьте, чтобы в файле `scss/components/fonts.scss` правильно выставился `font-weight` шрифта. Если это не так, то можно вручную поставить правильный font-weight. Так же проверьте, чтобы не подключился один и тот же шрифт несколько раз. Если такое произошло, то просто удалите лишние подключения.

## Дополнения

В папке `assets` можно добавлять музыку, видео и json, который будет использоваться на сайте. Данная папка никак не обрабатывается, файлы в ней остаются неизменными

## После окончания работы

После того, как проект полностью закончен, есть 2 пути: сбилдить проект с webp и без него. При билде проекта происходит сжатие кода, всех картинок и шрифтов. Файлы стилей и скриптов будут доступны в 2-х версиях: минифицированной и обычной. Билд может происходить долго из-за сжатия картинок, если сборщик завис на функции images – не пугайтесь, дайте ему подумать и сжать все картинки.


[Я в телеграмме](https://t.me/prokashev_daniil)  
