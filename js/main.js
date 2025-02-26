const config = {
    canvas: {
        width: 500,
        height: 775
    },
    brands: {
        penguin: {
            authorFont: {
                small: "20px 'FuturaPTW01-Book', sans-serif",
                medium: "26px 'FuturaPTW01-Book', sans-serif",
                large: "32px 'FuturaPTW01-Book', sans-serif"
            },
            titleFont: "24px 'MrsEavesItalic', serif",
            authorColor: '#D28928',
            titleColor: '#FFFFFF',
            authorPosition: { align: 'center', x: 250, y: 651 },
            titlePosition: { align: 'center', x: 250, y: 700 }
        },
        oxford: {
            authorFont: {
                small: "20px 'Capitolium', serif",
                medium: "26px 'Capitolium', serif",
                large: "29px 'Capitolium', serif"
            },
            titleFont: "29px 'Capitolium', serif",
            authorColor: '#cc2233',
            titleColor: '#42393E',
            authorPosition: { align: 'left', x: 500 / 13, y: 568 },
            titlePosition: { align: 'left', x: 500 / 13, y: 602 }
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
    widthRange: document.getElementById('width_range'),
    heightRange: document.getElementById('height_range'),
    xRange: document.getElementById('x_range'),
    yRange: document.getElementById('y_range'),
    downloadButton: document.getElementById('download-button'),
    notification: document.getElementById('notification'),
    brandButtons: document.querySelectorAll('.brand-button'),
    colorButtons: document.querySelectorAll('.color-button')
};

const ctx = {
    main: elements.canvas.getContext('2d'),
    photo: elements.photoCanvas.getContext('2d'),
    bg: elements.bgCanvas.getContext('2d'),
    dl: elements.dlCanvas.getContext('2d')
};

const state = {
    brand: '',
    authorColor: config.brands.penguin.authorColor,
    coverPhoto: new Image(),
    templateImg: new Image(),
    coverProperties: { x: 0, y: 0, width: 500, height: 533 },
    isTemplateLoaded: false,
    isPhotoLoaded: false
};

// helper functions
function getInputValues() {
    return {
        author: document.getElementById(`${state.brand}_author`)?.value || '',
        title: document.getElementById(`${state.brand}_title`)?.value || ''
    };
}

function getBrandConfig() {
    return config.brands[state.brand] || config.brands.penguin;
}

function getAuthorFontSize(authorLength) {
    const fonts = getBrandConfig().authorFont;
    if (authorLength > 30) return fonts.small;
    if (authorLength > 15) return fonts.medium;
    return fonts.large;
}

function showNotification(message, duration = 4000) {
    elements.notification.textContent = message;
    elements.notification.style.display = 'block';
    setTimeout(() => elements.notification.style.display = 'none', duration);
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
    const ctx = state.ctx.main;

    ctx.textBaseline = 'alphabetic';
    ctx.font = getAuthorFontSize(author.length);
    ctx.fillStyle = state.authorColor;
    ctx.textAlign = brandConfig.authorPosition.align;
    ctx.fillText(author, brandConfig.authorPosition.x, brandConfig.authorPosition.y);
}

function drawTitle(title) {
    const brandConfig = getBrandConfig();
    const ctx = state.ctx.main;

    ctx.textBaseline = 'alphabetic';
    ctx.font = brandConfig.titleFont;
    ctx.fillStyle = brandConfig.titleColor;
    ctx.textAlign = brandConfig.titlePosition.align;
    ctx.fillText(title, brandConfig.titlePosition.x, brandConfig.titlePosition.y);
}

function drawTemplate() {
    if (state.isTemplateLoaded) {
        ctx.bg.drawImage(state.templateImg, 0, 0, config.canvas.width, config.canvas.height);
    }
}

function updateCoverPhoto() {
    ctx.photo.clearRect(0, 0, elements.photoCanvas.width, elements.photoCanvas.height);
    if (state.isPhotoLoaded) {
        ctx.photo.drawImage(
            state.coverPhoto,
            state.coverProperties.x,
            state.coverProperties.y,
            state.coverProperties.width,
            state.coverProperties.height
        );
    }
}

function updateText() {
    const { author, title } = getInputValues();

    ctx.main.clearRect(0, 0, elements.canvas.width, elements.canvas.height);
    if (state.brand) {
        drawAuthor(author);
        drawTitle(title);
    }
}

function switchBrand(brandName) {
    if (!config.brands[brandName]) {
        showNotification(`Brand "${brandName}" not found`);
        return;
    }

    state.brand = brandName;
    state.isTemplateLoaded = false;
    updateBrandUI(brandName);

    // load image template
    ctx.bg.clearRect(0, 0, elements.bgCanvas.width, elements.bgCanvas.height);
    state.templateImg.src = `template_${brandName}.png`;

    // reset color to default
    state.authorColor = config.brands[brandName].authorColor;

    setupTextListeners();
}

function changeAuthorColor(color) {
    state.authorColor = color;
    updateText();
}

function downloadCanvas() {
    ctx.dl.clearRect(0, 0, elements.dlCanvas.width, elements.dlCanvas.height);
    ctx.dl.drawImage(elements.photoCanvas, 0, 0);
    ctx.dl.drawImage(elements.bgCanvas, 0, 0);
    ctx.dl.drawImage(elements.canvas, 0, 0);

    const imageURL = elements.dlCanvas.toDataURL('image/png');
    const fileName = getInputValues().title || 'cover';

    const downloadLink = document.createElement('a');
    downloadLink.href = imageURL;
    downloadLink.download = fileName;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    showNotification('Downloading!');
}

function scaleImage() {
    state.coverProperties.width = 10 * elements.widthRange.value;
    state.coverProperties.height = 10 * elements.heightRange.value;
    updateCoverPhoto();
}

function translateImage() {
    state.coverProperties.x = 10 * elements.xRange.value;
    state.coverProperties.y = -5 * elements.yRange.value;
    updateCoverPhoto();
}

function setupTextListeners() {
    const authorInput = document.getElementById(`${state.brand}_author`);
    const titleInput = document.getElementById(`${state.brand}_title`);

    if (authorInput && titleInput) {
        const newAuthorInput = authorInput.cloneNode(true);
        const newTitleInput = titleInput.cloneNode(true);

        authorInput.parentNode.replaceChild(newAuthorInput, authorInput);
        titleInput.parentNode.replaceChild(newTitleInput, titleInput);

        newAuthorInput.addEventListener('input', updateText);
        newTitleInput.addEventListener('input', updateText);
    }
}

// event listeners
function initEventListeners() {
    elements.fileButton.addEventListener('click', () => elements.fileInput.click());
    elements.fileInput.addEventListener('change', handleFileInput);

    const debouncedScale = debounce(scaleImage, 100);
    const debouncedTranslate = debounce(translateImage, 100);

    elements.widthRange.addEventListener('input', debouncedScale);
    elements.heightRange.addEventListener('input', debouncedScale);
    elements.xRange.addEventListener('input', debouncedTranslate);
    elements.yRange.addEventListener('input', debouncedTranslate);

    elements.brandButtons.forEach(button => {
        button.addEventListener('click', () => switchBrand(button.dataset.brand));
    });

    elements.colorButtons.forEach(button => {
        button.addEventListener('click', () => changeAuthorColor(button.dataset.color));
    });

    elements.downloadButton.addEventListener('click', downloadCanvas);

    state.templateImg.onload = () => {
        state.isTemplateLoaded = true;
        drawTemplate();
        updateText();
    };

    state.templateImg.onerror = () => {
        showNotification('Failed to load template image.');
    };

    state.coverPhoto.onload = () => {
        state.isPhotoLoaded = true;
        updateCoverPhoto();
    };
}

function handleFileInput() {
    const file = elements.fileInput.files[0];
    if (!file) return;

    // common file types
    const acceptedImageTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/bmp',
        'image/tiff',
        'image/svg+xml',
        'image/avif',
        'image/jxl'
    ];

    if (!acceptedImageTypes.includes(file.type)) {
        showNotification(`${file.type} file type not accepted!`);
        elements.fileInput.value = '';
        elements.fileName.textContent = 'No file chosen';
        return;
    }

    elements.fileName.textContent = file.name;

    const reader = new FileReader();
    reader.onloadend = () => {
        state.coverPhoto.src = reader.result;
    };
    reader.readAsDataURL(file);
}

function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

function init() {
    state.ctx = ctx;

    initEventListeners();

    switchBrand('penguin');
}

document.addEventListener('DOMContentLoaded', init);