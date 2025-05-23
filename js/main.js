const BRAND_PENGUIN = 'penguin';
const BRAND_OXFORD = 'oxford';

const config = {
    canvas: {
        width: 500,
        height: 775
    },
    photoArea: {
        yOffset: 0, // Y position where photo area starts
        height: 533 // approximate height of the photo area
    },
    brands: {
        [BRAND_PENGUIN]: {
            authorFont: {
                small: "20px 'FuturaPTW01-Book', sans-serif",
                medium: "26px 'FuturaPTW01-Book', sans-serif",
                large: "32px 'FuturaPTW01-Book', sans-serif"
            },
            titleFont: "24px 'MrsEavesItalic', serif",
            subtitleFont: "18px 'MrsEavesItalic', serif",
            authorColor: '#D28928',
            titleColor: '#FFFFFF',
            subtitleColor: '#FFFFFF',
            authorPosition: { align: 'center', x: 250, y: 651 },
            titlePosition: { align: 'center', x: 250, y: 685 },
            subtitlePosition: { align: 'center', x: 250, y: 710 }
        },
        [BRAND_OXFORD]: {
            authorFont: {
                small: "20px 'Capitolium', serif",
                medium: "26px 'Capitolium', serif",
                large: "29px 'Capitolium', serif"
            },
            titleFont: "29px 'Capitolium', serif",
            subtitleFont: "22px 'Capitolium', serif",
            authorColor: '#cc2233',
            titleColor: '#42393E',
            subtitleColor: '#42393E',
            authorPosition: { align: 'left', x: 500 / 12.25, y: 568 },
            titlePosition: { align: 'left', x: 500 / 12.25, y: 602 },
            subtitlePosition: { align: 'left', x: 500 / 12.25, y: 630 }
        }
    }
};

const elements = {
    canvas: document.getElementById('canvas'),
    photoCanvas: document.getElementById('photo_canvas'),
    bgCanvas: document.getElementById('bg_canvas'),
    dlCanvas: document.getElementById('dl_canvas'),
    fileInput: document.getElementById('file_input'),
    fileButton: document.getElementById('file-button'),
    fileName: document.getElementById('file-name'),
    zoomRange: document.getElementById('zoom_range'),
    panXRange: document.getElementById('pan_x_range'),
    panYRange: document.getElementById('pan_y_range'),
    zoomValueSpan: document.getElementById('zoom_value'),
    panXValueSpan: document.getElementById('pan_x_value'),
    panYValueSpan: document.getElementById('pan_y_value'),
    resetImageButton: document.getElementById('reset_image_button'),
    downloadButton: document.getElementById('download-button'),
    notification: document.getElementById('notification'),
    brandButtons: document.querySelectorAll('.brand-button'),
    penguinInputs: document.getElementById('penguin-inputs'),
    oxfordInputs: document.getElementById('oxford-inputs'),
    colorButtons: document.querySelectorAll('#penguin-inputs .color-button')
};

const getContext = (canvas) => {
    if (!canvas || !canvas.getContext) {
        console.error("Could not get canvas or context for:", canvas);
        return null;
    }
    return canvas.getContext('2d');
};

const ctx = {
    main: getContext(elements.canvas),
    photo: getContext(elements.photoCanvas),
    bg: getContext(elements.bgCanvas),
    dl: getContext(elements.dlCanvas)
};

const areContextsValid = Object.values(ctx).every(c => c !== null);

const state = {
    brand: '',
    authorColor: '',
    coverPhoto: new Image(),
    templateImg: new Image(),
    originalFit: { x: 0, y: 0, width: 0, height: 0 },
    transform: { scale: 1.0, panX: 0, panY: 0 },
    isTemplateLoaded: false,
    isPhotoLoaded: false
};

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func.apply(this, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function getInputValues() {
    if (!state.brand) return { author: '', title: '', subtitle: '' };
    return {
        author: document.getElementById(`${state.brand}_author`)?.value || '',
        title: document.getElementById(`${state.brand}_title`)?.value || '',
        subtitle: document.getElementById(`${state.brand}_subtitle`)?.value || ''
    };
}

function getBrandConfig() {
    return config.brands[state.brand] || config.brands[BRAND_PENGUIN];
}

function getAuthorFontSize(authorLength) {
    const fonts = getBrandConfig().authorFont;
    if (authorLength > 30) return fonts.small;
    if (authorLength > 15) return fonts.medium;
    return fonts.large;
}

function showNotification(message, duration = 4000) {
    if (!elements.notification) return;
    elements.notification.textContent = message;
    elements.notification.style.display = 'block';
    setTimeout(() => {
        elements.notification.style.display = 'none';
    }, duration);
}

function updateBrandUI(brandName) {
    elements.brandButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.brand === brandName);
    });

    document.querySelectorAll('.brand-inputs').forEach(div => {
        div.style.display = div.id === `${brandName}-inputs` ? 'block' : 'none';
    });
}

function drawAuthor(author) {
    const brandConfig = getBrandConfig();
    const ctxMain = ctx.main;
    if (!ctxMain) return;

    ctxMain.textBaseline = 'alphabetic';
    ctxMain.font = getAuthorFontSize(author.length);
    ctxMain.textAlign = brandConfig.authorPosition.align;
    
    ctxMain.fillStyle = state.authorColor;
    ctxMain.fillText(author, brandConfig.authorPosition.x, brandConfig.authorPosition.y);
}

function drawTitle(title) {
    const brandConfig = getBrandConfig();
    const ctxMain = ctx.main;
    if (!ctxMain) return;

    ctxMain.textBaseline = 'alphabetic';
    ctxMain.font = brandConfig.titleFont;
    ctxMain.fillStyle = brandConfig.titleColor;
    ctxMain.textAlign = brandConfig.titlePosition.align;
    ctxMain.fillText(title, brandConfig.titlePosition.x, brandConfig.titlePosition.y);
}

function drawSubtitle(subtitle) {
    if (!subtitle) return;

    const brandConfig = getBrandConfig();
    const ctxMain = ctx.main;
    if (!ctxMain) return;

    ctxMain.textBaseline = 'alphabetic';
    ctxMain.font = brandConfig.subtitleFont;
    ctxMain.fillStyle = brandConfig.subtitleColor;
    ctxMain.textAlign = brandConfig.subtitlePosition.align;
    ctxMain.fillText(subtitle, brandConfig.subtitlePosition.x, brandConfig.subtitlePosition.y);
}

function drawTemplate() {
    const ctxBg = ctx.bg;
    if (!ctxBg) return;
    ctxBg.clearRect(0, 0, config.canvas.width, config.canvas.height);
    if (state.isTemplateLoaded) {
        ctxBg.drawImage(state.templateImg, 0, 0, config.canvas.width, config.canvas.height);
    }
}

function updateCoverPhoto() {
    const ctxPhoto = ctx.photo;
    if (!ctxPhoto) return;

    ctxPhoto.clearRect(0, 0, config.canvas.width, config.canvas.height);

    if (state.isPhotoLoaded && state.originalFit.width > 0) {
        const base = state.originalFit;
        const transform = state.transform;

        const scaledWidth = base.width * transform.scale;
        const scaledHeight = base.height * transform.scale;

        const centerX = base.x + base.width / 2;
        const centerY = base.y + base.height / 2;

        let drawX = centerX - scaledWidth / 2;
        let drawY = centerY - scaledHeight / 2;

        drawX += transform.panX;
        drawY += transform.panY;

        ctxPhoto.drawImage(
            state.coverPhoto,
            drawX,
            drawY,
            scaledWidth,
            scaledHeight
        );
    }
}

function updateText() {
    const { author, title, subtitle } = getInputValues();
    const ctxMain = ctx.main;
    if (!ctxMain) return;

    ctxMain.clearRect(0, 0, config.canvas.width, config.canvas.height);
    if (state.brand) {
        drawAuthor(author);
        drawTitle(title);
        drawSubtitle(subtitle);
    }
}

function switchBrand(brandName) {
    if (!config.brands[brandName]) {
        showNotification(`Error: Brand "${brandName}" configuration not found.`);
        return;
    }

    state.brand = brandName;
    state.isTemplateLoaded = false;
    updateBrandUI(brandName);

    if (ctx.bg) ctx.bg.clearRect(0, 0, config.canvas.width, config.canvas.height);
    state.templateImg.src = `template_${brandName}.png`;

    state.authorColor = getBrandConfig().authorColor;

    updateText();
}

function changeAuthorColor(color) {
    if (state.brand === BRAND_PENGUIN) {
        state.authorColor = color;
        updateText();
    } else {
        showNotification("Color change is only available for Penguin brand.");
    }
}

function downloadCanvas() {
    const ctxDl = ctx.dl;
    if (!ctxDl || !elements.photoCanvas || !elements.bgCanvas || !elements.canvas || !elements.dlCanvas) {
        showNotification('Error preparing download: Canvas element missing.');
        return;
    }

    elements.dlCanvas.width = config.canvas.width;
    elements.dlCanvas.height = config.canvas.height;

    ctxDl.clearRect(0, 0, config.canvas.width, config.canvas.height);
    ctxDl.drawImage(elements.photoCanvas, 0, 0);
    ctxDl.drawImage(elements.bgCanvas, 0, 0);
    ctxDl.drawImage(elements.canvas, 0, 0);

    const imageURL = elements.dlCanvas.toDataURL('image/png');
    const fileNameBase = getInputValues().title || 'classic-cover';
    const fileName = fileNameBase.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.png';

    const downloadLink = document.createElement('a');
    downloadLink.href = imageURL;
    downloadLink.download = fileName;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    showNotification('Downloading your cover!');
}

function applyZoom() {
    if (!elements.zoomRange || !elements.zoomValueSpan) return;
    const scaleValue = parseInt(elements.zoomRange.value, 10);
    state.transform.scale = scaleValue / 100;
    elements.zoomValueSpan.textContent = `${scaleValue}%`;
    updatePanRange();
    updateCoverPhoto();
}

function applyPan() {
    if (!elements.panXRange || !elements.panYRange || !elements.panXValueSpan || !elements.panYValueSpan) return;
    state.transform.panX = parseInt(elements.panXRange.value, 10);
    state.transform.panY = parseInt(elements.panYRange.value, 10);
    elements.panXValueSpan.textContent = state.transform.panX;
    elements.panYValueSpan.textContent = state.transform.panY;
    updateCoverPhoto();
}

function updatePanRange() {
    const scale = state.transform.scale;
    const baseRange = 100;
    const extraRange = Math.floor((scale - 1) * 200);
    const panLimit = baseRange + Math.max(0, extraRange);

    elements.panXRange.min = -panLimit;
    elements.panXRange.max = panLimit;
    elements.panYRange.min = -panLimit;
    elements.panYRange.max = panLimit;
}

function resetImageTransform() {
    if (!elements.zoomRange || !elements.panXRange || !elements.panYRange || !elements.zoomValueSpan || !elements.panXValueSpan || !elements.panYValueSpan) return;

    state.transform = { scale: 1.0, panX: 0, panY: 0 };

    elements.zoomRange.value = 100;
    elements.panXRange.value = 0;
    elements.panYRange.value = 0;
    elements.zoomValueSpan.textContent = `100%`;
    elements.panXValueSpan.textContent = `0`;
    elements.panYValueSpan.textContent = `0`;

    updateCoverPhoto();
}

function handleFileInput() {
    if (!elements.fileInput || !elements.fileInput.files || elements.fileInput.files.length === 0) {
        elements.fileName.textContent = 'No file chosen';
        return;
    }
    const file = elements.fileInput.files[0];

    const acceptedImageTypes = [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
        'image/bmp', 'image/svg+xml', 'image/avif', 'image/jxl',
        'image/tiff', 'image/heif', 'image/heic', 'image/jp2',
        'image/jpx', 'image/jpm', 'image/jpf', 'image/jxr',
        'image/tga', 'image/tiff'
    ];

    if (!acceptedImageTypes.includes(file.type)) {
        showNotification(`File type "${file.type}" is not (yet) supported. Supported types are: ${acceptedImageTypes.join(', ')}`);
        elements.fileInput.value = '';
        elements.fileName.textContent = 'No file chosen';
        return;
    }

    elements.fileName.textContent = file.name;

    const reader = new FileReader();
    reader.onloadend = () => {
        const tempImg = new Image();
        tempImg.onload = () => {
            fitImageProportionally(tempImg.naturalWidth, tempImg.naturalHeight);
            state.coverPhoto.src = reader.result;
        };
        tempImg.onerror = () => {
            showNotification('Error reading image dimensions.');
            state.isPhotoLoaded = false;
            if (ctx.photo) ctx.photo.clearRect(0, 0, config.canvas.width, config.canvas.height);
        }
        tempImg.src = reader.result;
    };
    reader.onerror = () => {
        showNotification('Error reading file.');
        elements.fileInput.value = '';
        elements.fileName.textContent = 'No file chosen';
    };
    reader.readAsDataURL(file);
}

function fitImageProportionally(imgWidth, imgHeight) {
    if (imgWidth <= 0 || imgHeight <= 0) {
        console.error("Invalid image dimensions for fitting.");
        return;
    }
    const targetWidth = config.canvas.width;
    const targetPhotoHeight = config.photoArea.height;
    const targetPhotoYOffset = config.photoArea.yOffset;

    const imageRatio = imgWidth / imgHeight;
    const targetRatio = targetWidth / targetPhotoHeight;

    let fitWidth, fitHeight;

    if (imageRatio >= targetRatio) {
        fitHeight = targetPhotoHeight;
        fitWidth = fitHeight * imageRatio;
    } else {
        fitWidth = targetWidth;
        fitHeight = fitWidth / imageRatio;
    }

    const fitX = (targetWidth - fitWidth) / 2;
    const fitY = targetPhotoYOffset + (targetPhotoHeight - fitHeight) / 2;

    state.originalFit = { x: fitX, y: fitY, width: fitWidth, height: fitHeight };

    resetImageTransform();
}

function initEventListeners() {
    if (elements.fileButton) elements.fileButton.addEventListener('click', () => elements.fileInput.click());
    if (elements.fileInput) elements.fileInput.addEventListener('change', handleFileInput);

    const debouncedZoom = debounce(applyZoom, 50);
    const debouncedPan = debounce(applyPan, 50);
    if (elements.zoomRange) elements.zoomRange.addEventListener('input', debouncedZoom);
    if (elements.panXRange) elements.panXRange.addEventListener('input', debouncedPan);
    if (elements.panYRange) elements.panYRange.addEventListener('input', debouncedPan);

    if (elements.resetImageButton) elements.resetImageButton.addEventListener('click', resetImageTransform);

    elements.brandButtons.forEach(button => {
        button.addEventListener('click', () => switchBrand(button.dataset.brand));
    });

    elements.colorButtons.forEach(button => {
        button.addEventListener('click', () => changeAuthorColor(button.dataset.color));
    });

    const handleTextInput = (event) => {
        if (event.target.tagName === 'INPUT' && event.target.closest('.brand-inputs')?.id === `${state.brand}-inputs`) {
            updateText();
        }
    };
    if (elements.penguinInputs) elements.penguinInputs.addEventListener('input', handleTextInput);
    if (elements.oxfordInputs) elements.oxfordInputs.addEventListener('input', handleTextInput);

    if (elements.downloadButton) elements.downloadButton.addEventListener('click', downloadCanvas);

    state.templateImg.onload = () => {
        state.isTemplateLoaded = true;
        drawTemplate();
    };
    state.templateImg.onerror = () => {
        showNotification('Error: Failed to load background template image.');
        state.isTemplateLoaded = false;
    };

    state.coverPhoto.onload = () => {
        state.isPhotoLoaded = true;
        updateCoverPhoto();
    };
    state.coverPhoto.onerror = () => {
        showNotification('Error loading the selected image.');
        state.isPhotoLoaded = false;
        if (ctx.photo) ctx.photo.clearRect(0, 0, config.canvas.width, config.canvas.height);
    };
}

function init() {
    if (!areContextsValid) {
        showNotification("Jinkies! Canvas not supported or initialized correctly. Please refresh or use a different browser.");
        document.getElementById('controls').style.pointerEvents = 'none';
        document.getElementById('controls').style.opacity = '0.5';
        return;
    }

    elements.canvas.width = config.canvas.width;
    elements.canvas.height = config.canvas.height;
    elements.photoCanvas.width = config.canvas.width;
    elements.photoCanvas.height = config.canvas.height;
    elements.bgCanvas.width = config.canvas.width;
    elements.bgCanvas.height = config.canvas.height;
    elements.dlCanvas.width = config.canvas.width;
    elements.dlCanvas.height = config.canvas.height;

    initEventListeners();

    switchBrand(BRAND_PENGUIN);

    console.log("Cover generator initialized.");
}

document.addEventListener('DOMContentLoaded', init);
