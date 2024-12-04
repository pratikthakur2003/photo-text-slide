document.addEventListener('DOMContentLoaded', () => {
    const slider = document.querySelector('.image-slider');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const addTextBtn = document.getElementById('add-text-btn');
    const textEditor = document.querySelector('.text-editor');
    
    let currentSlide = 0;
    let selectedText = null;
    let isDragging = false;
    let startX, startY, initialX, initialY;
    let isSwiping = false;

    // Slider Navigation
    function updateSlider() {
        slider.style.transform = `translateX(-${currentSlide * 33.333}%)`;
    }

    prevBtn.addEventListener('click', () => {
        currentSlide = Math.max(currentSlide - 1, 0);
        updateSlider();
        deselectText();
    });

    nextBtn.addEventListener('click', () => {
        currentSlide = Math.min(currentSlide + 1, slides.length - 1);
        updateSlider();
        deselectText();
    });

    // Touch Events for Swiping
    let touchStartX = 0;
    let touchEndX = 0;

    slider.addEventListener('touchstart', (e) => {
        // Only start swiping if we're not touching a text element
        if (!e.target.closest('.draggable-text')) {
            touchStartX = e.changedTouches[0].screenX;
            isSwiping = true;
        }
    });

    slider.addEventListener('touchmove', (e) => {
        if (isSwiping) {
            e.preventDefault(); // Prevent scrolling while swiping
        }
    }, { passive: false });

    slider.addEventListener('touchend', (e) => {
        if (isSwiping) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            isSwiping = false;
        }
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0 && currentSlide < slides.length - 1) {
                currentSlide++;
            } else if (diff < 0 && currentSlide > 0) {
                currentSlide--;
            }
            updateSlider();
            deselectText();
        }
    }

    // Text Creation and Management
    addTextBtn.addEventListener('click', () => {
        const currentTextContainer = slides[currentSlide].querySelector('.text-container');
        const newText = document.createElement('div');
        newText.className = 'draggable-text';
        newText.textContent = 'Double click to edit';
        newText.style.left = '50%';
        newText.style.top = '50%';
        newText.style.transform = 'translate(-50%, -50%)';
        currentTextContainer.appendChild(newText);
        
        makeTextDraggable(newText);
        makeTextEditable(newText);
    });

    function makeTextDraggable(element) {
        element.addEventListener('mousedown', startDragging);
        element.addEventListener('touchstart', startDragging, { passive: false });
    }

    function startDragging(e) {
        if (e.target !== this) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        isDragging = true;
        const touch = e.type === 'touchstart' ? e.touches[0] : e;
        startX = touch.clientX;
        startY = touch.clientY;

        const rect = this.getBoundingClientRect();
        initialX = rect.left;
        initialY = rect.top;

        document.addEventListener('mousemove', drag);
        document.addEventListener('touchmove', drag, { passive: false });
        document.addEventListener('mouseup', stopDragging);
        document.addEventListener('touchend', stopDragging);

        selectText(this);
    }

    function drag(e) {
        if (!isDragging) return;

        e.preventDefault();
        e.stopPropagation();
        
        const touch = e.type === 'touchmove' ? e.touches[0] : e;
        
        const currentX = touch.clientX;
        const currentY = touch.clientY;
        
        const deltaX = currentX - startX;
        const deltaY = currentY - startY;

        const element = selectedText;
        const container = element.parentElement;
        const containerRect = container.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();

        // Calculate new position relative to the container
        let newX = initialX - containerRect.left + deltaX;
        let newY = initialY - containerRect.top + deltaY;

        // Get element dimensions without transform
        element.style.transform = 'none';
        const elementWidth = element.offsetWidth;
        const elementHeight = element.offsetHeight;
        element.style.transform = 'translate(-50%, -50%)';

        // Constrain to container bounds, accounting for element size
        newX = Math.max(elementWidth/2, Math.min(newX, containerRect.width - elementWidth/2));
        newY = Math.max(elementHeight/2, Math.min(newY, containerRect.height - elementHeight/2));

        element.style.left = `${newX}px`;
        element.style.top = `${newY}px`;
    }

    function stopDragging() {
        isDragging = false;
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('touchmove', drag);
        document.removeEventListener('mouseup', stopDragging);
        document.removeEventListener('touchend', stopDragging);
    }

    function makeTextEditable(element) {
        element.addEventListener('dblclick', () => {
            element.contentEditable = true;
            element.focus();
            selectText(element);
        });

        element.addEventListener('blur', () => {
            element.contentEditable = false;
        });

        element.addEventListener('click', (e) => {
            selectText(element);
            e.stopPropagation();
        });
    }

    function selectText(element) {
        if (selectedText) {
            selectedText.classList.remove('selected');
        }
        selectedText = element;
        element.classList.add('selected');
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

    // Click outside to deselect
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.draggable-text') && !e.target.closest('.controls')) {
            deselectText();
        }
    });
});
