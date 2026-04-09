document.addEventListener('DOMContentLoaded', function() {
    console.log('Custom Gallery Script Loaded (Slider Version)');

    const carousel = document.querySelector('.product-gallery__carousel-wrapper');
    const thumbnails = document.querySelectorAll('.product-gallery__thumbnail');
    
    if (!carousel) {
        console.error('Gallery wrapper not found!');
        return;
    }

    // 1. Criar e injetar o visualizador personalizado (Estilo Slider)
    const originalCarousel = document.querySelector('.product-gallery__carousel');
    if (originalCarousel) {
        originalCarousel.style.display = 'none';
    }

    // Criar container (Viewport)
    const viewerContainer = document.createElement('div');
    viewerContainer.className = 'custom-gallery-viewer';
    viewerContainer.style.cssText = `
        position: relative;
        width: 100%;
        max-width: 500px; /* Limitar largura para não ficar gigante */
        margin: 0 auto; /* Centralizar */
        aspect-ratio: 1 / 1; /* Manter quadrado como o original */
        overflow: hidden;
        cursor: grab;
        touch-action: pan-y;
        display: block;
        background-color: #fff; /* Fundo branco para imagens transparentes */
        -webkit-tap-highlight-color: transparent; /* Remove piscar ao tocar no mobile */
        -webkit-touch-callout: none; /* Previne menu de contexto no mobile */
        user-select: none; /* Previne seleção de texto/imagem */
        -webkit-user-select: none;
    `;

    // Criar a faixa de slides (Track)
    const sliderTrack = document.createElement('div');
    sliderTrack.className = 'custom-gallery-track';
    sliderTrack.style.cssText = `
        display: flex;
        width: 100%;
        height: 100%;
        transition: transform 0.3s ease-out;
        will-change: transform;
    `;

    // Lista de URLs e criação dos slides
    const images = Array.from(thumbnails).map(thumb => ({
        id: thumb.getAttribute('data-media-id'),
        src: thumb.getAttribute('href'),
        element: thumb
    }));

    // Popular o track com todas as imagens
    images.forEach(imgData => {
        const slide = document.createElement('div');
        slide.style.cssText = `
            min-width: 100%;
            height: 100%;
            flex-shrink: 0;
            display: flex;
            justify-content: center;
            align-items: center;
        `;
        
        const img = document.createElement('img');
        img.src = imgData.src;
        img.draggable = false; // Desabilita arrasto nativo explicitamente
        img.style.cssText = `
            max-width: 100%;
            max-height: 100%;
            width: auto;
            height: auto;
            object-fit: contain; /* Garantir que a imagem caiba no quadrado */
            display: block;
            user-select: none;
            -webkit-user-drag: none;
            pointer-events: none;
        `;
        
        slide.appendChild(img);
        sliderTrack.appendChild(slide);
    });
    
    // Inserir no DOM
    viewerContainer.appendChild(sliderTrack);
    carousel.insertBefore(viewerContainer, carousel.firstChild);

    let currentIndex = 0;
    let trackWidth = 0;

    // Atualizar largura do track ao redimensionar
    function updateDimensions() {
        trackWidth = viewerContainer.offsetWidth;
    }
    window.addEventListener('resize', () => {
        updateDimensions();
        updateGallery(currentIndex, false); // Reposicionar sem animar
    });
    // Inicializar dimensões após render
    setTimeout(updateDimensions, 100);

    // Função para ir para um slide específico
    function updateGallery(index, animate = true) {
        if (index < 0) index = 0; // Não fazer loop no swipe, apenas travar nas bordas? 
        // Se quiser loop infinito visual, precisaria de clonagem. Vamos manter finito por simplicidade primeiro.
        // O usuário pediu "começa a aparecer a outra", o que implica continuidade.
        // Vamos manter finito (0 a N-1) para simplificar a lógica de "puxar".
        
        if (index >= images.length) index = images.length - 1;
        
        currentIndex = index;
        
        // Atualizar visual
        const translateX = -(currentIndex * 100);
        sliderTrack.style.transition = animate ? 'transform 0.3s ease-out' : 'none';
        sliderTrack.style.transform = `translateX(${translateX}%)`;

        // Atualizar classe ativa nas miniaturas
        thumbnails.forEach(t => t.classList.remove('is-nav-selected'));
        if (images[currentIndex].element) {
            images[currentIndex].element.classList.add('is-nav-selected');
        }
        
        console.log('Gallery updated to index:', index);
    }

    // Inicializar
    updateGallery(0, false);

    // 2. Event Listeners para cliques nas miniaturas
    thumbnails.forEach((thumb, index) => {
        thumb.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            updateGallery(index);
        });
    });

    // 3. Implementar Arrastar (Swipe) com Feedback Visual em Tempo Real
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID;

    // Funções auxiliares
    function getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }

    function touchStart(index) {
        return function(event) {
            isDragging = true;
            startX = getPositionX(event);
            
            // CORREÇÃO: Inicializar a posição atual corretamente baseada no slide atual
            // Sincroniza a variável de arrasto com a posição visual atual
            trackWidth = viewerContainer.offsetWidth;
            currentTranslate = -(currentIndex * trackWidth);
            
            // Desabilitar transição para movimento instantâneo
            sliderTrack.style.transition = 'none';
            
            viewerContainer.style.cursor = 'grabbing';
            animationID = requestAnimationFrame(animation);
        }
    }

    function touchMove(event) {
        if (isDragging) {
            const currentPosition = getPositionX(event);
            const diff = currentPosition - startX;
            // Calcular deslocamento atual
            // Posição base: -currentIndex * width
            const baseTranslate = -(currentIndex * viewerContainer.offsetWidth);
            currentTranslate = baseTranslate + diff;
        }
    }

    function touchEnd() {
        isDragging = false;
        cancelAnimationFrame(animationID);
        viewerContainer.style.cursor = 'grab';

        const movedBy = currentTranslate - (-(currentIndex * viewerContainer.offsetWidth));
        const threshold = 50; // Mínimo para trocar

        // Determinar próxima ação
        if (movedBy < -threshold && currentIndex < images.length - 1) {
            currentIndex += 1;
        } else if (movedBy > threshold && currentIndex > 0) {
            currentIndex -= 1;
        }

        // Snap para a posição final
        updateGallery(currentIndex, true);
    }

    function animation() {
        if(isDragging) {
            sliderTrack.style.transform = `translateX(${currentTranslate}px)`;
            requestAnimationFrame(animation);
        }
    }

    // Adicionar Listeners
    viewerContainer.addEventListener('touchstart', touchStart(currentIndex), {passive: true});
    viewerContainer.addEventListener('touchmove', touchMove, {passive: true});
    viewerContainer.addEventListener('touchend', touchEnd);

    viewerContainer.addEventListener('mousedown', touchStart(currentIndex));
    viewerContainer.addEventListener('mousemove', touchMove);
    viewerContainer.addEventListener('mouseup', touchEnd);
    viewerContainer.addEventListener('mouseleave', () => {
        if (isDragging) touchEnd();
    });

    // Prevenir menu de contexto no clique direito/long press
    window.oncontextmenu = function(event) {
        if (event.target.closest('.custom-gallery-viewer')) {
            event.preventDefault();
            event.stopPropagation();
            return false;
        }
    }

});
