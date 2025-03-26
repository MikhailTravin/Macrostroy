const productSlider = document.querySelectorAll('.product-card-tabs__slider');
if (productSlider) {
    productSlider.forEach(sliderContainer => {

        const prevButton = sliderContainer.closest('.product-card-tabs__top').querySelector('.product-card-tabs__arrow-prev');
        const nextButton = sliderContainer.closest('.product-card-tabs__top').querySelector('.product-card-tabs__arrow-next');

        // Инициализация Swiper
        new Swiper(sliderContainer, {
            modules: [Navigation],
            observer: true,
            observeParents: true,
            slidesPerView: 1,
            spaceBetween: 10,
            speed: 800,

            // Навигация (кнопки "влево/вправо")
            navigation: {
                prevEl: prevButton,
                nextEl: nextButton,
            },
        });
    });
}

if (document.querySelector('.purchase-steps__slider')) {
    // Создаем слайдер
    new Swiper('.purchase-steps__slider', {
        // Подключаем модули слайдера
        // для конкретного случая
        modules: [Navigation, Pagination],
        observer: true,
        observeParents: true,
        slidesPerView: 4.2,
        spaceBetween: 10,
        speed: 800,

        // Пагинация
        pagination: {
            el: '.purchase-steps__pagination',
            type: "fraction",
            // Кастомизация фракции
            renderFraction: function (currentClass, totalClass) {
                return `<span class="${currentClass}"></span>/<span class="${totalClass}"></span>`;
            },
            formatFractionCurrent: function (number) {
                // Добавляем ведущий ноль, если число меньше 10
                return number < 10 ? `0${number}` : number;
            },
            formatFractionTotal: function (number) {
                // Добавляем ведущий ноль, если число меньше 10
                return number < 10 ? `0${number}` : number;
            },
        },

        // Кнопки "влево/вправо"
        navigation: {
            prevEl: '.purchase-steps__arrow-prev',
            nextEl: '.purchase-steps__arrow-next',
        },

        // Брейкпоинты
        breakpoints: {
            0: {
                slidesPerView: 1.2,
                spaceBetween: 16,
            },
            390: {
                slidesPerView: 1.3,
                spaceBetween: 16,
            },
            479.98: {
                slidesPerView: 2.2,
                spaceBetween: 16,
            },
            767.98: {
                slidesPerView: 3.2,
                spaceBetween: 16,
            },
            991.98: {
                slidesPerView: 4.2,
                spaceBetween: 10,
            },
        },
    });
}

if (document.querySelector('.bottom-partnership-block__slider')) {
    // Создаем слайдер
    new Swiper('.bottom-partnership-block__slider', {
        // Подключаем модули слайдера
        // для конкретного случая
        modules: [Navigation, Pagination],
        observer: true,
        observeParents: true,
        slidesPerView: 1,
        spaceBetween: 10,
        speed: 800,

        // Пагинация
        pagination: {
            el: '.bottom-partnership-block__pagination',
            clickable: true,
        },

        // Кнопки "влево/вправо"
        navigation: {
            prevEl: '.bottom-partnership-block__arrow-prev',
            nextEl: '.bottom-partnership-block__arrow-next',
        },
    });
}

const apartmentsSlider = document.querySelectorAll('.apartments__slider');
if (apartmentsSlider) {
    apartmentsSlider.forEach(sliderContainer => {

        const prevButton = sliderContainer.closest('.apartments__column').querySelector('.apartments__arrow-prev');
        const nextButton = sliderContainer.closest('.apartments__column').querySelector('.apartments__arrow-next');
        const pagination = sliderContainer.closest('.apartments__column').querySelector('.apartments__pagination');

        // Инициализация Swiper
        new Swiper(sliderContainer, {
            modules: [Navigation, Pagination],
            observer: true,
            observeParents: true,
            slidesPerView: 1,
            spaceBetween: 0,
            speed: 800,

            // Пагинация
            pagination: {
                el: pagination,
                clickable: true,
            },

            // Навигация (кнопки "влево/вправо")
            navigation: {
                prevEl: prevButton,
                nextEl: nextButton,
            },
        });
    });
}

if (document.querySelector('.apartments-main-slider')) {
    // Создаем слайдер
    const swiper = new Swiper('.apartments-main-slider', {
        // Подключаем модули слайдера
        modules: [Navigation, Pagination, EffectFade, Autoplay],
        observer: true,
        observeParents: true,
        slidesPerView: 1,
        spaceBetween: 0,
        speed: 800,
        lazy: true,

        fadeEffect: {
            crossFade: true,
        },
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.apartments-main-column .apartments__pagination',
            clickable: true,
        },
        navigation: {
            prevEl: '.apartments-main-arrow-prev',
            nextEl: '.apartments-main-arrow-next',
        },
        breakpoints: {
            0: {
                effect: false,
                loop: false,
                autoplay: false,
            },
            767.98: {
                loop: true,
                effect: "fade",
            },
        },
    });

    // Функция для обновления параметров слайдера при изменении размера окна
    function updateSwiperParams() {
        const windowWidth = window.innerWidth;

        if (windowWidth <= 767.98) {
            // Отключаем автоплей и эффект для мобильных устройств
            swiper.params.autoplay = false;
            swiper.params.effect = false;
            swiper.params.loop = false;
        } else {
            // Включаем автоплей и эффект для больших экранов
            swiper.params.autoplay = {
                delay: 3000,
                disableOnInteraction: false,
            };
            swiper.params.effect = "fade";
            swiper.params.loop = true;
        }

        // Обновляем слайдер
        swiper.update();
    }

    // Вызываем функцию при загрузке страницы
    updateSwiperParams();

    // Добавляем обработчик события resize
    window.addEventListener('resize', () => {
        updateSwiperParams();
    });
}

if (document.querySelector('.slider-product-card__slider')) {
    // Создаем слайдер
    new Swiper('.slider-product-card__slider', {
        // Подключаем модули слайдера
        // для конкретного случая
        modules: [Navigation],
        observer: true,
        observeParents: true,
        slidesPerView: 1,
        spaceBetween: 10,
        speed: 800,

        // Кнопки "влево/вправо"
        navigation: {
            prevEl: '.slider-product-card__arrow-prev',
            nextEl: '.slider-product-card__arrow-next',
        },
    });
}

if (document.querySelector('.construction-progress__slider')) {
    // Создаем слайдер
    new Swiper('.construction-progress__slider', {
        // Подключаем модули слайдера
        // для конкретного случая
        modules: [Navigation],
        observer: true,
        observeParents: true,
        slidesPerView: 4,
        spaceBetween: 10,
        speed: 800,

        // Кнопки "влево/вправо"
        navigation: {
            prevEl: '.construction-progress__arrow-prev',
            nextEl: '.construction-progress__arrow-next',
        },

        // Брейкпоинты
        breakpoints: {
            0: {
                slidesPerView: 1.3,
            },
            479.98: {
                slidesPerView: 1.6,
            },
            600: {
                slidesPerView: 2.2,
            },
            767.98: {
                slidesPerView: 3.2,
            },
            991.98: {
                slidesPerView: 4,
            },
        },
    });
}

if (document.querySelector('.photo__slider')) {
    // Создаем слайдер
    new Swiper('.photo__slider', {
        // Подключаем модули слайдера
        // для конкретного случая
        modules: [Navigation, Pagination],
        observer: true,
        observeParents: true,
        slidesPerView: 1,
        spaceBetween: 10,
        speed: 800,

        // Пагинация
        pagination: {
            el: '.photo__pagination',
            clickable: true,
        },

        // Кнопки "влево/вправо"
        navigation: {
            prevEl: '.photo__arrow-prev',
            nextEl: '.photo__arrow-next',
        },
    });
}

if (document.querySelector('.residential-complex__slider')) {
    // Создаем слайдер
    new Swiper('.residential-complex__slider', {
        // Подключаем модули слайдера
        // для конкретного случая
        modules: [Pagination, EffectFade, Autoplay],
        observer: true,
        observeParents: true,
        slidesPerView: 1,
        spaceBetween: 0,
        speed: 800,
        loop: true,
        lazy: true,
        effect: "fade",

        fadeEffect: {
            crossFade: true,
        },
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },

        // Пагинация
        pagination: {
            el: '.residential-complex__pagination',
            clickable: true,
        },
    });
}