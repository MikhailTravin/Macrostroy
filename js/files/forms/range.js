function rangeInit() {

    //Фильтр
    const ratingFilters = document.querySelectorAll('.rating-filter-tabs__range');
    ratingFilters.forEach((ratingFilter) => {
        if (ratingFilter) {
            // Инициализируем noUiSlider для каждого ползунка
            noUiSlider.create(ratingFilter, {
                start: [1300000, 53175000], // Начальные значения
                connect: true, // Заполнение между бегунками
                range: {
                    'min': 1300000, // Минимальное значение
                    'max': 253175000 // Максимальное значение
                },
                format: wNumb({
                    decimals: 0, // Без десятичных знаков
                    thousand: ' ', // Разделитель тысяч
                })
            });

            // Находим связанные элементы для текущего ползунка
            const container = ratingFilter.closest('.filter-tabs');
            if (!container) {
                return;
            }

            const priceStart = container.querySelector('.rating-filter-tabs__input .price-start');
            const priceEnd = container.querySelector('.rating-filter-tabs__input .price-end');
            const resetButton = container.querySelector('.filter-tabs__clear');

            if (!priceStart || !priceEnd || !resetButton) {
                return;
            }

            // Обновляем значения инпутов при изменении слайдера
            ratingFilter.noUiSlider.on('update', function (values, handle) {
                const value = values[handle];
                if (handle) {
                    priceEnd.value = value + ' ₽';
                } else {
                    priceStart.value = value + ' ₽';
                }
            });

            // При изменении значения priceStart обновляем слайдер
            priceStart.addEventListener('change', function () {
                const numericValue = this.value.replace(/[^0-9]/g, ''); // Убираем все, кроме цифр
                ratingFilter.noUiSlider.set([numericValue, null]);
            });

            // При изменении значения priceEnd обновляем слайдер
            priceEnd.addEventListener('change', function () {
                const numericValue = this.value.replace(/[^0-9]/g, ''); // Убираем все, кроме цифр
                ratingFilter.noUiSlider.set([null, numericValue]);
            });

            // Функция для сброса фильтров
            function resetFilters() {
                priceStart.value = priceStart.defaultValue;
                priceEnd.value = priceEnd.defaultValue;

                const startValue = parseInt(priceStart.defaultValue.replace(/\s/g, ''), 10);
                const endValue = parseInt(priceEnd.defaultValue.replace(/\s/g, ''), 10);
                ratingFilter.noUiSlider.set([startValue, endValue]);
            }

            // Обработчик клика на кнопку "Сбросить"
            resetButton.addEventListener('click', function () {
                resetFilters();
            });
        }
    });

    // Глобальная функция для форматирования значений
    function formatValue(value, suffix) {
        if (suffix === '₽') {
            return new Intl.NumberFormat('ru-RU').format(value) + ' ₽';
        } else if (suffix === '%') {
            return value + ' %';
        } else if (suffix === 'лет') {
            return value + ' лет';
        }
        return value;
    }

    // Функция для инициализации одного блока
    function initializeCalculatorBlock(sliderId, inputId, buttonsClass, options) {
        const slider = document.querySelector(`#${sliderId}`);
        const input = document.querySelector(`#${inputId}`);
        const buttons = buttonsClass ? document.querySelectorAll(`.${buttonsClass} .controls-calculator__button`) : null;

        if (slider && input) {
            try {
                // Получаем начальное значение из инпута
                let startValue = parseFloat(input.value.replace(/\D/g, '')) || 0;

                noUiSlider.create(slider, {
                    start: startValue,
                    connect: options.connect || [true, false],
                    range: {
                        min: options.min || 0,
                        max: options.max || 100
                    },
                    step: options.step || 1
                });

                // Форматируем начальное значение инпута
                input.value = formatValue(startValue, options.suffix);

            } catch (error) {
                return;
            }

            // Функция для обновления активной кнопки
            function updateActiveButton(value, id) {
                if (buttons) {
                    // Сначала удаляем класс active со всех кнопок
                    buttons.forEach(button => button.classList.remove('active'));

                    // Находим кнопку, которая соответствует значению и data-id
                    const activeButton = Array.from(buttons).find(button => {
                        const buttonValue = parseFloat(button.dataset.value);
                        const buttonId = button.dataset.id;

                        return (
                            Math.abs(buttonValue - value) < 0.1 && // Совпадение по значению
                            (!id || buttonId === id) // Совпадение по data-id, если он передан
                        );
                    });

                    // Если найдена подходящая кнопка, активируем её
                    if (activeButton) {
                        activeButton.classList.add('active');
                    }
                }
            }

            // Обновляем инпут и активную кнопку при изменении ползунка
            slider.noUiSlider.on('update', function (values, handle) {
                const rawValue = parseFloat(values[handle]);
                const formattedValue = formatValue(rawValue, options.suffix); // Форматируем значение

                input.value = formattedValue; // Выводим отформатированное значение в инпут
                updateActiveButton(rawValue); // Обновляем активную кнопку
            });

            // Обновляем ползунок при изменении значения в инпуте
            input.addEventListener('change', function () {
                const rawValue = input.value.replace(/\D/g, ''); // Убираем все нецифровые символы
                const numericValue = parseFloat(rawValue);

                if (!isNaN(numericValue)) {
                    slider.noUiSlider.set(numericValue); // Устанавливаем значение ползунка
                    updateActiveButton(numericValue); // Обновляем активную кнопку
                } else {
                }
            });

            // Если есть кнопки, добавляем обработчики
            if (buttons) {
                buttons.forEach(button => {
                    button.addEventListener('click', function () {
                        const value = parseFloat(this.dataset.value);
                        const id = this.dataset.id; // Получаем data-id

                        slider.noUiSlider.set(value); // Устанавливаем значение ползунка
                        input.value = formatValue(value, options.suffix); // Форматируем значение для инпута
                        updateActiveButton(value, id); // Вызываем функцию для обновления активной кнопки
                    });
                });

                // Установка начального состояния активной кнопки
                const initialActiveButton = Array.from(buttons).find(button => button.classList.contains('active'));
                if (initialActiveButton) {
                    const initialValue = parseFloat(initialActiveButton.dataset.value);
                    slider.noUiSlider.set(initialValue); // Устанавливаем значение ползунка
                    updateActiveButton(initialValue); // Обновляем активную кнопку
                }
            }
        }
    }

    // Инициализация блока "Стоимость недвижимости"
    initializeCalculatorBlock('property-price-slider', 'property-price-input', null, {
        min: 1000000,
        max: 50000000,
        step: 100000,
    });

    // Инициализация блока "Срок кредита"
    initializeCalculatorBlock('loan-term-slider', 'loan-term-input', 'loan-term-buttons', {
        min: 5,
        max: 20,
        step: 5,
    });

    // Инициализация блока "Процентная ставка"
    initializeCalculatorBlock('interest-rate-slider', 'interest-rate-input', 'interest-rate-buttons', {
        min: 5,
        max: 20,
        step: 0.1,
    });

    // Инициализация блока "Первоначальный взнос"
    initializeCalculatorBlock('down-payment-slider', 'down-payment-input', 'down-payment-buttons', {
        min: 5,
        max: 20,
        step: 5,
    });
}

// Инициализация всех слайдеров
rangeInit();