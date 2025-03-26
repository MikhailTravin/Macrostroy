function indents() {
    const header = document.querySelector('.header');
    const page = document.querySelector('.page');

    //Оступ от шапки
    let hHeader = window.getComputedStyle(header, false).height;
    hHeader = Number(hHeader.slice(0, hHeader.length - 2));

    if (page) {
        page.style.paddingTop = hHeader + 'px';
    }

    const residentialComplex = document.querySelector('.residential-complex');
    const residentialComplexContent = document.querySelectorAll('.residential-complex__container');
    if (residentialComplex) {
        if (document.documentElement.clientWidth > 767.98) {
            residentialComplex.style.height = `calc(100vh - ${hHeader}px)`;
            residentialComplexContent.forEach(item => {
                item.style.height = `calc(100vh - ${hHeader}px)`;
            });
        } else {
            residentialComplex.style.height = 'auto';
            residentialComplexContent.forEach(item => {
                item.style.height = `auto`;
            });
        }
    }

    //выпадающее меню
    const menuBody = document.querySelector('.menu__body');
    if (document.documentElement.clientWidth < 991.98) {
        menuBody.style.top = hHeader + 'px';
        menuBody.style.minHeight = `calc(100vh - ${hHeader}px)`;
        menuBody.style.height = `calc(100vh - ${hHeader}px)`;
    } else {
        menuBody.style.top = '0px';
        menuBody.style.minHeight = 'auto';
        menuBody.style.height = 'auto';
    }

    const menuSpollersBody = document.querySelectorAll('.spollers-menu__body');
    const spollersMenuSimplebar = document.querySelectorAll('.spollers-menu__simplebar');
    const spollersMenuTitleMob = document.querySelector('.spollers-menu__title-mob');
    if (menuSpollersBody) {
        let hspollersMenuTitleMob = window.getComputedStyle(spollersMenuTitleMob, false).height;
        hspollersMenuTitleMob = Number(hspollersMenuTitleMob.slice(0, hspollersMenuTitleMob.length - 2));
        if (document.documentElement.clientWidth < 991.98) {
            menuSpollersBody.forEach(item => {
                item.style.top = hHeader + 'px';
                item.style.minHeight = `calc(100vh - ${hHeader}px)`;
                item.style.height = `calc(100vh - ${hHeader}px)`;
            });

            spollersMenuSimplebar.forEach(item => {
                item.style.height = `calc(100% - ${hspollersMenuTitleMob}px)`;
            });
        } else {
            menuSpollersBody.forEach(item => {
                item.style.top = '0px';
                item.style.minHeight = 'auto';
                item.style.height = 'auto';
            });

            spollersMenuSimplebar.forEach(item => {
                item.style.height = 'auto';
            });
        }
    }

}

window.addEventListener('scroll', () => {
    indents();
});

window.addEventListener('resize', () => {
    indents();
});

indents();

//========================================================================================================================================================

//Меню
const spollerItems = document.querySelectorAll('.spollers-menu__item');
const spollersMenuSimplebar = document.querySelector('.spollers-menu__simplebar');

if (spollerItems) {
    // Функция для добавления классов при наведении
    const handleHover = (item) => {
        item.addEventListener('mouseenter', () => {
            document.documentElement.classList.add('menu-hovered');
            bodyLock();
        });

        item.addEventListener('mouseleave', () => {
            document.documentElement.classList.remove('menu-hovered');
            bodyUnlock();
        });
    };

    // Функция для добавления классов при клике на .spollers-menu__item
    const handleClickOnItem = (item) => {
        item.addEventListener('click', () => {
            // Переключаем класс menu-hovered у документа
            document.documentElement.classList.toggle('menu-hovered');

            // Переключаем класс menu-hovered у самого элемента .spollers-menu__item
            item.classList.toggle('menu-hovered');

            // Если нужно, вызываем функцию блокировки/разблокировки скролла
            if (document.documentElement.classList.contains('menu-hovered')) {
                bodyLock();
            } else {
                bodyUnlock();
            }
        });
    };

    // Определяем медиа-запрос
    const mediaQuery = window.matchMedia('(max-width: 991.98px)');

    // Функция для очистки всех обработчиков событий
    const clearEventListeners = () => {
        spollerItems.forEach(item => {
            item.removeEventListener('mouseenter', () => { });
            item.removeEventListener('mouseleave', () => { });
            item.removeEventListener('click', () => { });
        });
    };

    // Функция для настройки обработчиков событий
    const setupEventListeners = () => {
        // Сначала очищаем все предыдущие обработчики событий
        clearEventListeners();

        spollerItems.forEach(item => {
            const hasArrow = item.querySelector('.spollers-menu__arrow-desc') || item.querySelector('.spollers-menu__arrow-mob');

            if (hasArrow) {
                if (mediaQuery.matches) {
                    // Для мобильных устройств (клики на .spollers-menu__item)
                    handleClickOnItem(item);
                } else {
                    // Для десктопов (наведение на .spollers-menu__item)
                    handleHover(item);

                    // Добавляем обработчик клика на .spollers-menu__item для широких экранов
                    handleClickOnItem(item);
                }
            }
        });

        // Проверяем наличие класса menu-open на широких экранах
        if (!mediaQuery.matches && !document.documentElement.classList.contains('menu-open')) {
            document.documentElement.classList.remove('menu-hovered');
            spollerItems.forEach(item => {
                item.classList.remove('menu-hovered');
            });
        }
    };

    // Инициализация обработчиков событий
    setupEventListeners();

    // Обновление обработчиков событий при изменении размера окна
    mediaQuery.addEventListener('change', () => {
        // Очищаем все состояния и обработчики
        document.documentElement.classList.remove('menu-hovered');
        spollerItems.forEach(item => {
            item.classList.remove('menu-hovered');
        });
        bodyUnlock();

        // Перенастраиваем обработчики событий
        setupEventListeners();
    });

    // Обработчик для кликов вне меню
    document.addEventListener('click', (e) => {
        if (
            !e.target.closest('.spollers-menu__item') &&
            !e.target.closest('.spollers-menu__simplebar') &&
            !e.target.closest('.menu__icon')
        ) {
            document.documentElement.classList.remove('menu-hovered');
            spollerItems.forEach(item => {
                item.classList.remove('menu-hovered');
            });
            bodyUnlock();
        }
    });

    // Останавливаем всплытие кликов внутри .spollers-menu__simplebar
    if (spollersMenuSimplebar) {
        spollersMenuSimplebar.addEventListener('click', (e) => {
            e.stopPropagation(); // Останавливаем всплытие события
        });
    }
}

//========================================================================================================================================================

//Таймер
const timeCount = document.querySelector('.time-count');
if (timeCount) {
    // Функция для запуска таймера
    function startTimer(targetDateString) {
        const daysElement = document.querySelector('.time-count__days .time-count__val');
        const hoursElement = document.querySelector('.time-count__hours .time-count__val');
        const minutesElement = document.querySelector('.time-count__minutes .time-count__val');

        // Преобразуем целевую дату в миллисекунды
        const targetDate = new Date(targetDateString).getTime();

        // Если дата уже прошла, сразу устанавливаем 00:00:00
        if (isNaN(targetDate) || targetDate < Date.now()) {
            daysElement.textContent = '00';
            hoursElement.textContent = '00';
            minutesElement.textContent = '00';
            return;
        }

        // Обновление таймера каждую секунду
        const timerInterval = setInterval(() => {
            const now = Date.now(); // Текущая дата в миллисекундах
            const timeDifference = targetDate - now;

            // Если время истекло
            if (timeDifference <= 0) {
                clearInterval(timerInterval); // Останавливаем таймер
                daysElement.textContent = '00';
                hoursElement.textContent = '00';
                minutesElement.textContent = '00';
                return;
            }

            // Расчет дней, часов и минут
            const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

            // Обновление значений на странице
            daysElement.textContent = String(days).padStart(2, '0');
            hoursElement.textContent = String(hours).padStart(2, '0');
            minutesElement.textContent = String(minutes).padStart(2, '0');
        }, 1000); // Обновление каждую секунду
    }
    // Укажите целевую дату 
    const targetDate = "2025-04-25";
    // Запуск таймера
    startTimer(targetDate);
}

//========================================================================================================================================================

//Фильтр
const filterButtonMob = document.querySelectorAll('.filter-tabs__button-mob');

if (filterButtonMob.length > 0) {
    const filterContents = document.querySelectorAll('.filter-tabs__content');
    const closeButtons = document.querySelectorAll('.filter-tabs__close');
    const resetButtons = document.querySelectorAll('.filter-tabs__clear');

    // Функция для открытия фильтров
    function openFilters(filterContent) {
        filterContent.classList.add('open');
        document.documentElement.classList.add('filter-open');
    }

    // Функция для закрытия фильтров
    function closeFilters(filterContent) {
        filterContent.classList.remove('open');
        document.documentElement.classList.remove('filter-open');
    }

    // Функция для сброса фильтров
    function resetFilters(filterContent) {
        // Сброс селектов
        const selects = filterContent.querySelectorAll('.select');
        selects.forEach(select => {
            const selectElement = select.querySelector('select');
            const selectTitle = select.querySelector('.select__title');
            const selectContent = select.querySelector('.select__content');
            if (selectElement) {
                // Устанавливаем первый <option> как выбранный
                const defaultOption = selectElement.querySelector('option[selected]');
                if (defaultOption) {
                    defaultOption.selected = true;
                    selectContent.textContent = defaultOption.textContent;
                } else {
                    // Если нет атрибута selected, выбираем первый <option>
                    const firstOption = selectElement.querySelector('option');
                    if (firstOption) {
                        firstOption.selected = true;
                        selectContent.textContent = firstOption.textContent;
                    }
                }
            }

            // Закрываем выпадающий список, если он открыт
            select.classList.remove('_select-open');
            const options = select.querySelector('.select__options');
            if (options) {
                options.setAttribute('hidden', '');
            }
        });

        // Сброс чекбоксов
        const checkboxes = filterContent.querySelectorAll('.checkbox__input');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false; // Отключаем все чекбоксы
        });

        // Сброс радиокнопок
        const radioButtons = filterContent.querySelectorAll('.options__input');
        radioButtons.forEach(radio => {
            radio.checked = false; // Отключаем все радиокнопки
        });
    }

    // Привязываем кнопки к соответствующим фильтрам
    filterButtonMob.forEach((button, index) => {
        button.addEventListener('click', function () {
            // Находим связанный фильтр по индексу
            const filterContent = filterContents[index];
            if (filterContent) {
                openFilters(filterContent);
            }
        });
    });

    // Обработчик клика на кнопку закрытия
    closeButtons.forEach(closeButton => {
        closeButton.addEventListener('click', function () {
            const filterContent = closeButton.closest('.filter-tabs__content');
            if (filterContent) {
                closeFilters(filterContent);
            }
        });
    });

    // Обработчик клика на кнопки "Сбросить"
    resetButtons.forEach(resetButton => {
        resetButton.addEventListener('click', function () {
            const filterContent = resetButton.closest('.filter-tabs__content');
            if (filterContent) {
                resetFilters(filterContent);
            }
        });
    });

    // Закрытие фильтров при клике вне области фильтров
    document.addEventListener('click', function (event) {
        filterContents.forEach(filterContent => {
            if (
                !filterContent.contains(event.target) && // Клик вне фильтра
                !event.target.closest('.filter-tabs__button-mob') // Клик не на кнопке открытия
            ) {
                closeFilters(filterContent);
            }
        });
    });
}

//========================================================================================================================================================

//Прикрепить файл
const file = document.querySelector('#file');
if (file) {
    let selectedFiles = []; // Массив для хранения выбранных файлов
    const previewContainer = document.querySelector('.form__previews');
    // Устанавливаем курсор

    document.getElementById('file').addEventListener('change', function (event) {
        const files = Array.from(event.target.files); // Получаем список выбранных файлов
        selectedFiles = [...selectedFiles, ...files]; // Добавляем новые файлы к существующим
        renderFileList();
    });

    function renderFileList() {

        previewContainer.innerHTML = ''; // Очищаем предыдущие файлы

        selectedFiles.forEach((file, index) => {
            const previewItem = document.createElement('div');
            previewItem.classList.add('form__preview-item');

            //const icon = document.createElement('span');
            //icon.classList.add('form__preview-icon');
            //icon.textContent = '📄'; // Иконка файла (можно заменить на SVG или другой символ)

            const fileName = document.createElement('span');
            fileName.textContent = file.name;

            const closeButton = document.createElement('span');
            closeButton.classList.add('form__preview-close');
            closeButton.textContent = '×'; // Кнопка "×"
            closeButton.addEventListener('click', () => removeFile(index)); // Удаление файла по индексу

            //previewItem.appendChild(icon);
            previewItem.appendChild(fileName);
            previewItem.appendChild(closeButton);

            previewContainer.appendChild(previewItem);
            previewContainer.classList.add('_active')
        });
    }

    function removeFile(index) {
        selectedFiles.splice(index, 1); // Удаляем файл из массива
        renderFileList(); // Перерисовываем список файлов
        previewContainer.classList.remove('_active')
    }
}

//========================================================================================================================================================

//Бегущая строка
const tickerBody = document.querySelector('.ticker__body');

if (tickerBody) {
    // Клонируем содержимое
    const originalContent = tickerBody.innerHTML;
    tickerBody.innerHTML += originalContent; // Добавляем клонированный контент

    // Вычисляем ширину контейнера
    const columns = document.querySelectorAll('.ticker__column');
    const columnWidth = 154; // Фиксированная ширина колонки
    const gap = 5; // Расстояние между колонками
    const totalWidth = columns.length * (columnWidth + gap);

    tickerBody.style.width = `${totalWidth}px`;
}

//========================================================================================================================================================

//Cкролл

function scroll() {

    let scrolls = document.querySelectorAll('.scroll');

    if (scrolls) {

        let speed = 2; // Скорость скролла.
        let left = 0;
        let top = 0;
        let drag = false;
        let coorX = 0;
        let coorY = 0;

        scrolls.forEach(scroll => {
            scroll.addEventListener('mousedown', function (e) {
                drag = true;
                coorX = e.pageX;
                coorY = e.pageY;
            });
            document.addEventListener('mouseup', function () {
                drag = false;
                left = scroll.scrollLeft;
                top = scroll.scrollTop;
            });
            scroll.addEventListener('mousemove', function (e) {
                if (drag) {
                    this.scrollLeft = left - (e.pageX - coorX) * speed;
                    this.scrollTop = top - (e.pageY - coorY) * speed;
                }
            });
        });

    }

};

scroll()

//========================================================================================================================================================

//Simplebar
const simpleBarElement = document.querySelector(".spollers-menu__simplebar");
const mediaQuery = window.matchMedia("(max-width: 991.98px)");

function handleMediaQueryChange(e) {
    if (e.matches) {
        new SimpleBar(simpleBarElement, {
            autoHide: true,
            scrollbarMaxSize: 20
        });
    } else {
        if (simpleBarElement.SimpleBar) {
            simpleBarElement.SimpleBar.unMount();
        }
    }
}

handleMediaQueryChange(mediaQuery);
mediaQuery.addEventListener("change", handleMediaQueryChange);