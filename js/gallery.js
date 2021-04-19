import galleryImagesLis from "../gallery-items.js";

// все переменние хранятся в начале скрипта
const galleryElement = document.querySelector('.js-gallery');
const modalLightboxContainer = document.querySelector('.js-lightbox');
const modalOverlay = document.querySelector('.lightbox__overlay');
const modalImageEl = document.querySelector('.lightbox__image');
const modalCloseBtn = document.querySelector('.lightbox__button[data-action="close-lightbox"]');
const galleryImgCard = createImgCard(galleryImagesLis);

// 1.Создание и рендер разметки по массиву данных по предоставленному шаблону.
// создания галлереи изображений по массиву данных с использованием
// array.map(callback[currentValue, index, array]) + деструктуризация({ preview, original, description }) вместо .map(image => {,,,,,
// Метод insertAdjacentHTML() парсит указанную строку как HTML и добавляет результирующие узлы в указанное место DOM-дерева.
// 'beforeend' - внутрь element, в самый конец контента
// Метод join() объединяет все элементы массива (или массивоподобного объекта) в строку.
galleryElement.insertAdjacentHTML('beforeend', galleryImgCard);

function createImgCard(galleryImagesLis) {
    return galleryImagesLis.map(({ preview, original, description }) => {
        return `<li class="gallery_item">
        <a class="gallery_link" href="${original}">
        <img class="gallery__image"
        src="${preview}"
        data-source="${original}"
        alt="${description}">
        </a>
        </li>`;
    }).join('');
};

// 2.Реализация делегирования на галерее ul.js-gallery и получение url большого изображения.
// 3.Открытие модального окна по клику на элементе галереи.
// 4.Подмена значения атрибута src элемента img.lightbox ** image.
// Слушатели событий
// Метод elem.addEventListener()
// Для обработчика события можно (и желательно) 
// использовать отдельную функцию.

// (делегирование)
// Метод event.preventDefault() интерфейса Event сообщает User agent, что если событие не обрабатывается явно, его действие по умолчанию не должно выполняться так, как обычно.
// preventDefault не останавливает дальнейшее распространение событий на DOM. Для этого следует использовать event.stopPropagation.

// Модальное окно для полноразмерного изображения которое добавляэтся через modalImageEl
// Для того чтобы открыть, необходимо добавить на div.lightbox(modalLightboxContainer) 
// CSS - класс is - open

galleryElement.addEventListener('click', onGalleryContainerClick);

function onGalleryContainerClick(event) {
    event.preventDefault();

    window.addEventListener('keydown', onEscKeyPress);
    document.addEventListener('keydown', rotatImg)
    // const isImageTarget = event.target.classList.contains('gallery__image');
    //  if (!isImageTarget) {
    // return;

    if (!event.target.classList.contains('gallery__image')) {
        return;
    };

    modalLightboxContainer.classList.add('is-open');
    modalImageEl.setAttribute('src', event.target.getAttribute('data-source'));
    modalImageEl.setAttribute('alt', event.target.getAttribute('alt'));

    cleanImagAttributesModal(event.target.getAttribute('data-source'), event.target.getAttribute('alt'))
};

// 5.Закрытие модального окна по клику на кнопку button
// ссылка и функция для закрития модалки
// Метод elem.removeEventListener() удаляет слушателя. Аргументы те же, что у addEventListener.
// Для удаления нужно передать ссылку именно на ту функцию-обработчик, которая была назначена в addEventListener. Поэтому для callback используют отдельную функцию и передают ее по имени.
// компонент Window закрываться при щелчке по оверлею за пределами модального окна(изображения)

modalCloseBtn.addEventListener('click', onCloseModal);

function onCloseModal() {
    window.removeEventListener('keydown', onEscKeyPress);
    document.removeEventListener('keydown', rotatImg);
    modalLightboxContainer.classList.remove('is-open');
    cleanImagAttributesModal('', '');
};

// ссылка и функция для Overlay
modalOverlay.addEventListener('click', onOverlayClick);

function onOverlayClick({ currentTarget, target }) {
    if (currentTarget === target) {
        onCloseModal();
    }
};

// функция для onEscKeyPress - при нажатии на ESC (изображение)-модалка закриваэтся.
function onEscKeyPress({ elem }) {
    if (elem === 'Escape') {
        onCloseModal()
    }
};

// target - элемент, на котором произошло событие,
// currentTarget - элемент, на котором сработал обработчик,
// click - происходит, когда кликнули на элемент левой кнопкой мыши,
// keydown - посетитель нажимает клавишу,
// event(evt, e) - имя события, строка, например click,

// 6.Очистка значения атрибута src элемента img.lightbox ** image.Это необходимо для того, чтобы при следующем открытии модального окна, пока грузится изображение, мы не видели предыдущее.

function cleanImagAttributesModal(src, alt) {
    modalImageEl.src = src;
    modalImageEl.alt = alt;
};

const arraySrc = galleryImagesLis.map(image => image.original);

function rotatImg({ elem }) {
    let newIndex = arraySrc.indexOf(modalImageEl.src);
    if (newIndex < 0) {
        return;
    }
    if (elem === 'ArrowLeft') {
        newIndex -= 1;
        if (newIndex === -1) {
            newIndex = arraySrc.length - 1;
        }
    } else if (elem === 'ArrowRight') {
        newIndex += 1;
        if (newIndex === arraySrc.length) {
            newIndex = 0;
        }
    }
    modalImageEl.src = arraySrc[newIndex];
};