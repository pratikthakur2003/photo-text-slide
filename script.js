document.addEventListener('DOMContentLoaded', () => {
    const swiper = new Swiper('.swiper', {
        direction: 'horizontal',
        loop: false,
        pagination: {
            el: '.swiper-pagination',
            clickable: true
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        slidesPerView: 1,
        spaceBetween: 0,
        threshold: 10,
        touchStartPreventDefault: false
    });

    const addTextBtn = document.getElementById('add-text-btn');
    const textEditor = document.querySelector('.text-editor');
    let selectedText = null;
    let isDragging = false;
    let startX, startY, initialX, initialY;

    // Text Creation
    addTextBtn.addEventListener('click', () => {
        const currentSlide = swiper.slides[swiper.activeIndex];
        const textContainer = currentSlide.querySelector('.text-container');
        const newText = document.createElement('div');
        newText.className = 'draggable-text';
        newText.textContent = 'Double click to edit';
        newText.style.left = '50%';
        newText.style.top = '50%';
        newText.style.transform = 'translate(-50%, -50%)';
        textContainer.appendChild(newText);
        makeTextDraggable(newText);
        makeTextEditable(newText);
    });

    function makeTextDraggable(element) {
        element.addEventListener('mousedown', startDragging);
        element.addEventListener('touchstart', startDragging, { passive: false });
    }

    function startDragging(e) {
        if (e.type === 'mousedown' && e.button !== 0) return;
        if (e.target.classList.contains('draggable-text')) {
            isDragging = true;
            const touch = e.type === 'touchstart' ? e.touches[0] : e;
            startX = touch.clientX;
            startY = touch.clientY;

            const rect = e.target.getBoundingClientRect();
            initialX = rect.left;
            initialY = rect.top;

            selectText(e.target);
            e.preventDefault();
            swiper.allowTouchMove = false;
        }
    }

    function drag(e) {
        if (!isDragging || !selectedText) return;

        const touch = e.type === 'touchmove' ? e.touches[0] : e;
        const deltaX = touch.clientX - startX;
        const deltaY = touch.clientY - startY;

        const newX = initialX + deltaX;
        const newY = initialY + deltaY;

        // Get the container boundaries
        const container = selectedText.parentElement;
        const containerRect = container.getBoundingClientRect();
        const textRect = selectedText.getBoundingClientRect();

        // Calculate boundaries
        const minX = containerRect.left;
        const maxX = containerRect.right - textRect.width;
        const minY = containerRect.top;
        const maxY = containerRect.bottom - textRect.height;

        // Constrain the text within the boundaries
        const constrainedX = Math.max(minX, Math.min(maxX, newX));
        const constrainedY = Math.max(minY, Math.min(maxY, newY));

        // Convert to percentage
        const percentX = ((constrainedX - containerRect.left) / containerRect.width) * 100;
        const percentY = ((constrainedY - containerRect.top) / containerRect.height) * 100;

        selectedText.style.left = `${percentX}%`;
        selectedText.style.top = `${percentY}%`;
        selectedText.style.transform = 'none';
    }

    function stopDragging() {
        if (isDragging) {
            isDragging = false;
            swiper.allowTouchMove = true;
        }
    }

    function makeTextEditable(element) {
        element.addEventListener('dblclick', () => {
            element.contentEditable = true;
            element.focus();
            selectText(element);
            if (element.textContent === 'Double click to edit') {
                element.textContent = '';
            }
        });

        element.addEventListener('blur', () => {
            element.contentEditable = false;
            if (element.textContent.trim() === '') {
                element.textContent = 'Double click to edit';
            }
        });
    }

    function selectText(element) {
        if (selectedText) {
            selectedText.classList.remove('selected');
        }
        selectedText = element;
        selectedText.classList.add('selected');
        textEditor.style.display = 'block';
    }

    function deselectText() {
        if (selectedText) {
            selectedText.classList.remove('selected');
            selectedText = null;
            textEditor.style.display = 'none';
        }
    }

    // Text Styling Controls
    document.getElementById('font-family').addEventListener('change', (e) => {
        if (selectedText) {
            selectedText.style.fontFamily = e.target.value;
        }
    });

    document.getElementById('font-size').addEventListener('change', (e) => {
        if (selectedText) {
            selectedText.style.fontSize = `${e.target.value}px`;
        }
    });

    document.getElementById('font-color').addEventListener('input', (e) => {
        if (selectedText) {
            selectedText.style.color = e.target.value;
        }
    });

    document.getElementById('bold-btn').addEventListener('click', () => {
        if (selectedText) {
            selectedText.style.fontWeight = selectedText.style.fontWeight === 'bold' ? 'normal' : 'bold';
        }
    });

    document.getElementById('italic-btn').addEventListener('click', () => {
        if (selectedText) {
            selectedText.style.fontStyle = selectedText.style.fontStyle === 'italic' ? 'normal' : 'italic';
        }
    });

    document.getElementById('underline-btn').addEventListener('click', () => {
        if (selectedText) {
            selectedText.style.textDecoration = selectedText.style.textDecoration === 'underline' ? 'none' : 'underline';
        }
    });

    document.getElementById('delete-btn').addEventListener('click', () => {
        if (selectedText) {
            selectedText.remove();
            deselectText();
        }
    });

    // Add mouse/touch event listeners for dragging
    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag, { passive: false });
    document.addEventListener('mouseup', stopDragging);
    document.addEventListener('touchend', stopDragging);

    // Prevent deselection when clicking controls
    textEditor.addEventListener('mousedown', (e) => e.stopPropagation());

    // Deselect text when clicking outside
    document.addEventListener('mousedown', (e) => {
        if (!e.target.closest('.draggable-text') && !e.target.closest('.text-editor')) {
            deselectText();
        }
    });
});
