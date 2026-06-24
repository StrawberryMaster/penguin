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
            authorPosition: { align: 'left', x: Math.round(500 / 12.25), y: 568 },
            titlePosition: { align: 'left', x: Math.round(500 / 12.25), y: 602 },
            subtitlePosition: { align: 'left', x: Math.round(500 / 12.25), y: 630 }
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
    colorButtons: document.querySelectorAll('#penguin-inputs .color-button'),
    exportSize: document.getElementById('export_size')
};

const getContext = (canvas) => {
    if (!canvas || !canvas.getContext) {
        console.error("Could not get canvas or context for:", canvas);
        return null;
    }
    const context = canvas.getContext('2d');
    if (context) {
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = 'high';
    }
    return context;
};

const ctx = {
    main: getContext(elements.canvas),
    photo: getContext(elements.photoCanvas),
    bg: getContext(elements.bgCanvas),
    dl: getContext(elements.dlCanvas)
};

const areContextsValid = Object.values(ctx).every(c => c !== null);

const penguinLogoImg = new Image();
penguinLogoImg.src = './assets/penguin-logo.svg';
penguinLogoImg.onload = () => {
    if (state.brand === BRAND_PENGUIN) {
        drawTemplate();
    }
};

const oxfordSvgString = `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 555 24" style="enable-background:new 0 0 555 24;" xml:space="preserve"><style type="text/css">.st0{fill:#AB182F;}</style><g><path class="st0" d="M180.5,0.8c3.2,0,6.1,0,9.2,0c-0.2,0.3-0.3,0.5-0.5,0.5c-1.6,0.4-1.8,0.7-1.4,2.3c1.2,4.3,2.5,8.5,3.7,12.8c0.1,0.5,0.3,1,0.4,1.7c1.3-4.1,2.6-8.1,3.9-12.1c0.5-1.4,1-2.8,1.3-4.2c0.2-0.8,0.6-1.1,1.4-1.2c0.7-0.1,1,0,1.3,0.8c1.7,5.5,3.4,11,5.1,16.5c0-0.1,0.1-0.1,0.1-0.2c1.4-4.7,2.8-9.4,4.2-14.1c0-0.1,0.1-0.2,0.1-0.4c0.3-1.3,0.1-1.6-1.3-1.9c-0.2,0-0.4-0.2-0.5-0.4c0-0.1,0.1-0.1,0.1-0.2c2.1,0,4.2,0,6.5,0c-0.2,0.2-0.3,0.5-0.4,0.5c-0.9,0.2-1.4,0.9-1.7,1.7c-1,2.8-2,5.5-3,8.3c-1.3,3.8-2.7,7.6-4,11.4c-0.2,0.5-0.4,0.8-1,0.9c-1.9,0.3-1.9,0.4-2.5-1.5c-1.5-4.6-2.9-9.3-4.4-14.1c-0.1,0.3-0.2,0.5-0.3,0.7c-1.5,4.7-3,9.3-4.5,14c-0.2,0.5-0.4,0.8-1,0.8c-0.8,0.1-1.5,0.2-2.3,0.4c-0.6-2-1.2-3.9-1.9-5.8c-1.5-4.7-3-9.5-4.5-14.2c-0.1-0.4-0.3-0.9-0.5-1.3c-0.2-0.7-0.7-1.1-1.4-1.3C180.8,1.3,180.7,1.1,180.5,0.8z"/><path class="st0" d="M261.1,12.9c1,1.1,1.9,2.3,2.9,3.4c1.5,1.7,2.9,3.4,4.5,5c0.7,0.7,1.6,1.1,2.4,1.6c0.1,0.1,0.3,0.2,0.3,0.3c0,0.1-0.2,0.3-0.3,0.3c-2.1,0.1-4.3,0.5-6.3-0.4c-0.8-0.3-1.5-1-2.1-1.6c-1.7-2.2-3.4-4.4-5-6.7c-0.5-0.8-1.1-1.1-2-0.8c0,0-0.1,0.1-0.1,0.1c0,2.3,0,4.5,0.1,6.8c0,1.1,0.6,1.8,1.7,2c0.2,0,0.3,0.3,0.5,0.4c0,0.1-0.1,0.1-0.1,0.2c-3,0-6,0-9.2,0c0.3-0.3,0.4-0.5,0.6-0.6c1.1-0.3,1.7-1,1.8-2.1c0-0.5,0.1-1.1,0.1-1.6c0-4.8,0-9.6,0-14.4c0-0.5-0.1-0.9-0.1-1.4c-0.1-1.1-0.6-1.7-1.7-2c-0.2-0.1-0.3-0.3-0.5-0.4c0-0.1,0.1-0.1,0.1-0.2c0.1,0,0.2,0,0.4,0c2.8,0,5.7,0,8.5,0c1.4,0,2.8,0.1,4.1,0.4c2.6,0.6,4.1,2.3,4.4,4.7c0.3,2.6-0.8,5-3.1,6.2C262.4,12.4,261.8,12.6,261.1,12.9z M255.4,2c0,3.6,0,6.9,0,10.5c0.6,0,1.3,0,1.9,0c1.8-0.1,2.9-0.9,3.4-2.6c0.5-1.7,0.5-3.4,0.1-5c-0.3-1.1-0.9-2.1-2.1-2.4C257.7,2.1,256.6,2.1,255.4,2z"/><path class="st0" d="M110.7,0.9c4.2,0,8.1,0,12,0c0.4,0,0.9,0.1,1.3,0.2c2.7,0.7,4.2,2.5,4.4,5.1c0.2,2.6-1.2,4.9-3.6,6.1c-0.4,0.2-0.9,0.4-1.4,0.6c0.6,0.7,1.2,1.3,1.7,2c1.6,1.9,3.3,3.8,4.9,5.6c0.9,1,1.8,2.1,3.3,2.4c0.1,0,0.2,0.2,0.2,0.3c0,0.1-0.2,0.3-0.3,0.3c-2.1,0.1-4.3,0.5-6.3-0.4c-0.8-0.3-1.5-1-2.1-1.6c-1.7-2.2-3.4-4.4-5-6.7c-0.5-0.8-1.1-1.2-2-0.8c0,0-0.1,0.1-0.1,0.1c0,2.2,0,4.5,0.1,6.7c0,1.1,0.6,1.8,1.7,2c0.2,0,0.3,0.3,0.5,0.4c0,0.1-0.1,0.1-0.1,0.2c-3,0-6,0-9.2,0c0.3-0.3,0.4-0.5,0.5-0.6c1.1-0.3,1.7-1,1.8-2.2c0-0.5,0.1-1,0.1-1.5c0-4.8,0-9.6,0-14.4c0-0.5-0.1-0.9-0.1-1.4c-0.1-1.1-0.6-1.7-1.6-2C111.2,1.4,111,1.1,110.7,0.9z M117.7,12.5c0.7,0,1.3,0,1.9,0c1.8-0.1,3-0.8,3.4-2.6c0.3-1.3,0.4-2.7,0.3-4c-0.2-3-2.6-4.5-5.6-3.5C117.7,5.6,117.7,8.9,117.7,12.5z"/><path class="st0" d="M301.2,23.3c0.2-0.1,0.3-0.4,0.5-0.4c1.1-0.3,1.7-1,1.8-2.2c0-0.5,0.1-1,0.1-1.5c0-4.8,0-9.6,0-14.4c0-0.5-0.1-0.9-0.1-1.4c-0.1-1.1-0.6-1.7-1.7-2c-0.2-0.1-0.3-0.3-0.7-0.6c0.4-0.1,0.5-0.1,0.6-0.1c3,0,5.9,0,8.9,0c2.1,0,4.3,0.2,6.3,0.9c3.5,1.2,5.7,3.6,6.3,7.3c0.5,2.6,0.3,5.2-0.6,7.7c-1.5,4.1-4.7,6.1-8.9,6.6c-1.6,0.2-3.1,0.2-4.7,0.2c-2.6,0-5.1,0-7.7,0C301.3,23.4,301.2,23.4,301.2,23.3z M308.3,2.5c0,0.3,0,0.5,0,0.6c0,5.6,0,11.3,0,16.9c0,0.2,0,0.5,0,0.7c0.1,0.8,0.4,1.2,1.3,1.2c0.7,0,1.4,0,2.1,0c3.2-0.2,5.1-1.6,5.9-4.5c0.9-3.4,1-6.9,0-10.4c-0.6-2-1.9-3.5-3.9-4.2C311.9,2.2,310.1,2.4,308.3,2.5z"/><path class="st0" d="M139.6,0.7c4.4,0.1,8.8,0.2,13.1,0.4c1.3,0.1,2.7,0.6,3.9,1.2c2.5,1.2,4,3.3,4.6,6c0.6,2.8,0.5,5.6-0.5,8.3c-1.5,4.1-4.7,6.1-8.9,6.7c-1.9,0.2-3.8,0.2-5.7,0.2c-2.2,0-4.5,0-6.8-0.2c0.1-0.1,0.3-0.4,0.4-0.4c1.2-0.3,1.8-1,1.8-2.2c0-0.8,0.1-1.6,0.1-2.4c0-4.5,0-8.9,0-13.4c0-0.5-0.1-0.9-0.1-1.4c-0.1-1.1-0.6-1.8-1.7-2c-0.2,0-0.3-0.3-0.5-0.4C139.5,0.9,139.5,0.8,139.6,0.7z M146.5,2.5c0,0.2,0,0.4,0,0.6c0,5.6,0,11.3,0,16.9c0,0.3,0,0.5,0,0.8c0.1,0.8,0.5,1.1,1.2,1.2c0.7,0,1.4,0,2.1,0c3.1-0.2,5.2-1.6,6-4.5c1-3.5,1-7,0-10.4c-0.8-2.5-2.4-4.1-5.1-4.5C149.3,2.3,148,2.5,146.5,2.5z"/><path class="st0" d="M103,11.9c0,3.5-0.9,6.6-3.6,9.1c-2.8,2.6-6.2,3.1-9.9,2.8c-2.8-0.3-5.2-1.3-7.1-3.4c-1.5-1.7-2.2-3.8-2.4-6c-0.3-2.7,0-5.3,1.3-7.8c1.9-3.8,5.2-5.5,9.3-5.8c2.4-0.2,4.8,0.1,7,1.2c3.6,1.8,5.1,4.9,5.4,8.7C103,11,103,11.4,103,11.9z M97.8,12.3c0-2.2-0.2-4.4-1.1-6.4c-0.7-1.6-1.7-2.9-3.3-3.5c-3-1.1-6.1,0.2-7.3,3.5c-1.5,4.2-1.5,8.5,0.1,12.7c0.5,1.3,1.3,2.4,2.6,3.1c3,1.7,6.6,0.3,8-3.1C97.6,16.5,97.8,14.4,97.8,12.3z"/><path class="st0" d="M23,11.9c0,3.4-0.8,6.4-3.3,8.8c-2.8,2.7-6.3,3.3-10.1,3c-2.8-0.3-5.2-1.3-7.1-3.5c-1.5-1.7-2.2-3.8-2.4-6c-0.3-2.7,0-5.4,1.3-7.9c1.9-3.7,5.2-5.5,9.2-5.8c2.4-0.2,4.8,0.1,7,1.2c3.5,1.8,5.1,4.9,5.4,8.7C23.1,11,23,11.4,23,11.9z M17.9,12.3c0-2.2-0.2-4.4-1.1-6.4c-0.7-1.6-1.7-2.9-3.3-3.5c-3-1.1-6.2,0.3-7.3,3.6c-1.5,4.1-1.4,8.3,0.1,12.4c0.5,1.3,1.3,2.4,2.6,3.2c3,1.7,6.6,0.3,8-3.2C17.7,16.5,17.9,14.4,17.9,12.3z"/><path class="st0" d="M241.3,11.9c0,3.5-0.9,6.7-3.6,9.1c-2.8,2.5-6.2,3.1-9.8,2.7c-2.8-0.3-5.2-1.3-7.1-3.4c-1.5-1.7-2.2-3.8-2.4-6c-0.3-2.7,0-5.3,1.3-7.8c1.9-3.8,5.2-5.5,9.3-5.8c2.4-0.2,4.8,0.1,7,1.2c3.6,1.8,5.1,4.9,5.4,8.7C241.3,11,241.3,11.4,241.3,11.9z M236.2,12.3c0-2.2-0.2-4.4-1.1-6.5c-0.7-1.5-1.6-2.8-3.3-3.4c-3-1.2-6.2,0.3-7.3,3.6c-1.5,4.1-1.4,8.3,0.1,12.4c0.5,1.3,1.3,2.5,2.6,3.2c3,1.7,6.6,0.3,8-3.2C236,16.5,236.2,14.4,236.2,12.3z"/><path class="st0" d="M50.6,23.5c-3.1,0-6.2,0-9.2,0c0-0.1-0.1-0.1-0.1-0.2c0.2-0.1,0.4-0.3,0.6-0.4c1.1-0.3,1.5-1,1-2c-1.4-2.4-2.9-4.7-4.5-7.1c-0.7,1.1-1.4,2.2-2,3.2c-0.8,1.2-1.6,2.4-2.3,3.7c-0.7,1.3-0.5,1.8,0.9,2.2c0.2,0.1,0.3,0.3,0.5,0.6c-2.4,0-4.6,0-7,0c0.2-0.3,0.3-0.5,0.5-0.6c0.5-0.4,1.1-0.6,1.4-1.1c2.3-3,4.5-6.1,6.7-9.2c0.1-0.2,0.1-0.5,0-0.7c-1.9-3-3.9-6.1-5.9-9c-0.4-0.6-1.1-1-1.7-1.5c-0.1-0.1-0.2-0.3-0.4-0.6c3.2,0,6.2,0,9.3,0c0.3,0.5-0.2,0.5-0.5,0.6c-1.1,0.3-1.5,1-0.9,2c1.1,1.9,2.3,3.7,3.6,5.7c1.2-2,2.4-3.8,3.5-5.7c0.6-1,0.3-1.9-0.9-2.1c-0.2,0-0.3-0.3-0.6-0.5c2.4,0,4.5,0,6.9,0c-0.2,0.3-0.4,0.5-0.5,0.6c-0.5,0.4-1.1,0.6-1.4,1.1c-2,2.7-4,5.3-5.9,8c0.1,0.2,0.2,0.4,0.3,0.5c2.2,3.3,4.3,6.6,6.5,9.9c0.5,0.8,1,1.7,2,1.9C50.4,22.9,50.5,23.2,50.6,23.5z"/><path class="st0" d="M446.1,23.5c-2.8,0-5.6,0-8.4,0c-0.1,0-0.3-0.2-0.4-0.3c0.1-0.1,0.3-0.3,0.4-0.3c1.5-0.3,1.8-0.7,1.3-2.2c-0.6-1.7-1.2-3.4-1.8-5.2c-0.1-0.4-0.4-0.5-0.8-0.5c-1.8,0-3.5,0-5.3,0c-0.4,0-0.7,0.1-0.8,0.5c-0.6,1.8-1.3,3.6-1.9,5.4c-0.5,1.4-0.2,1.8,1.2,2c0.2,0,0.3,0.2,0.5,0.4c0,0.1-0.1,0.1-0.1,0.2c-2.1,0-4.2,0-6.5,0c0.2-0.2,0.3-0.5,0.4-0.5c1-0.2,1.4-0.9,1.7-1.7c1.1-2.6,2.2-5.2,3.3-7.8c1.7-4,3.3-8,4.9-12c0.2-0.6,0.5-0.9,1.2-0.9c0.5,0,1-0.2,1.7-0.3c0.3,0.9,0.6,1.8,0.9,2.6c2.1,5.8,4.1,11.6,6.2,17.4c0.2,0.5,0.3,1,0.6,1.4c0.3,0.5,0.9,0.8,1.3,1.2c0.2,0.1,0.3,0.3,0.5,0.4C446.3,23.4,446.2,23.4,446.1,23.5z M434,5.9c-1,2.6-1.9,5-2.8,7.5c1.8,0,3.5,0,5.3,0C435.7,10.9,434.9,8.5,434,5.9z"/><path class="st0" d="M73.3,0.8c0,1.5,0,3,0,4.4c-0.4,0.1-0.6,0.1-0.7-0.5c-0.2-1.3-0.9-2.1-2.3-2.2c-1.7-0.1-3.4,0-5.2,0c0,2.7,0,5.5,0,8.4c1.6-0.1,3.2-0.1,4.7-0.3c1.1-0.1,1.6-0.9,1.7-1.9c0.1-0.5,0.3-0.6,0.8-0.5c0,2.2,0,4.4,0,6.7c-0.4,0.1-0.7,0.1-0.7-0.4c-0.2-1.2-0.9-1.9-2.1-2c-1.4-0.1-2.9,0-4.2,0c0,2.9-0.1,5.7,0,8.6c0,1,0.7,1.5,2.2,1.7c0.4,0.1,0.6,0.1,0.5,0.6c-3.3,0-6.5,0-10,0c0.2-0.3,0.3-0.5,0.5-0.5c1.2-0.3,1.8-1.1,1.8-2.3c0-0.5,0.1-1,0.1-1.4c0-4.8,0-9.5,0-14.3c0-0.5-0.1-1-0.1-1.5c-0.1-1-0.6-1.6-1.6-1.9C58.3,1.4,58.2,1.2,58,1c0-0.1,0.1-0.1,0.1-0.2C63.1,0.8,68.1,0.8,73.3,0.8z"/><path class="st0" d="M343.9,18.7c0.3-0.1,0.5-0.1,0.7,0.4c0.4,1.8,1.4,2.7,3.2,2.8c1.1,0.1,2.2,0.1,3.2-0.1c1.3-0.2,2.2-1,2.5-2.4c0.3-1.4,0.1-2.7-1-3.6c-0.8-0.7-1.7-1.2-2.5-1.8c-1.2-0.8-2.4-1.5-3.5-2.4c-2-1.7-2.6-3.9-2-6.4c0.6-2.5,2.4-3.7,4.7-4.3c2.8-0.6,5.5-0.3,8.4,0c0,1.4,0,2.8,0,4.3c-0.4,0.2-0.7,0.1-0.8-0.4c-0.3-1.3-1.2-2.2-2.5-2.4c-1.2-0.2-2.4-0.3-3.5,0c-2.4,0.5-3.2,3.4-1.5,5.2c0.5,0.6,1.2,1,1.9,1.4c1.4,0.9,2.8,1.7,4.1,2.6c2.5,1.7,3.2,4.2,2.6,7.1c-0.6,2.7-2.6,4-5.1,4.6c-2.8,0.6-5.5,0.4-8.3-0.2c-0.2,0-0.5-0.3-0.5-0.5C343.8,21.3,343.9,20,343.9,18.7z"/><path class="st0" d="M452.9,18.6c0.4-0.1,0.6,0,0.7,0.5c0.4,1.7,1.4,2.6,3.2,2.8c1.1,0.1,2.2,0.1,3.2-0.1c1.3-0.2,2.3-1,2.6-2.4c0.3-1.4,0.1-2.7-1-3.7c-0.8-0.7-1.7-1.2-2.6-1.8c-1.2-0.8-2.4-1.5-3.5-2.4c-2-1.7-2.5-3.9-1.9-6.3c0.6-2.4,2.3-3.7,4.6-4.2c2.8-0.7,5.6-0.3,8.4,0c0,1.5,0,2.9,0,4.3c-0.4,0.2-0.7,0.1-0.8-0.4c-0.3-1.5-1.3-2.3-2.7-2.5c-1-0.2-2-0.2-3,0c-1.1,0.1-2.1,0.7-2.4,1.9c-0.4,1.2-0.3,2.4,0.7,3.3c0.5,0.5,1.2,1,1.8,1.4c1.4,0.9,2.8,1.7,4.1,2.6c2.4,1.7,3.3,4.3,2.7,7.2c-0.6,2.7-2.6,4-5.1,4.6c-2.8,0.7-5.6,0.4-8.4-0.2c-0.2,0-0.5-0.3-0.5-0.5C452.9,21.3,452.9,20,452.9,18.6z"/><path class="st0" d="M489.7,0.9c0,1.5,0,2.9,0,4.3c-0.4,0.2-0.7,0.1-0.8-0.4c-0.3-1.4-1.3-2.3-2.7-2.5c-1-0.2-2.1-0.2-3.1-0.1c-1.1,0.1-2,0.7-2.4,1.9c-0.4,1.2-0.3,2.4,0.6,3.4c0.5,0.5,1.1,1,1.7,1.4c1.4,0.9,2.8,1.7,4.1,2.6c2.6,1.7,3.3,4.2,2.8,7.1c-0.5,2.7-2.5,4.1-5,4.7c-2.8,0.7-5.6,0.5-8.4-0.2c-0.2,0-0.5-0.3-0.5-0.5c0-1.3,0-2.6,0-3.9c0.3-0.1,0.6-0.1,0.7,0.5c0.3,1.5,1.2,2.5,2.7,2.7c1.2,0.2,2.5,0.1,3.7,0c1.3-0.2,2.2-1,2.6-2.4c0.3-1.4,0.1-2.7-1-3.7c-0.8-0.7-1.8-1.3-2.7-1.9c-1.1-0.8-2.3-1.5-3.4-2.3c-2-1.7-2.5-3.9-2-6.3c0.6-2.5,2.3-3.7,4.7-4.3c2.8-0.6,5.5-0.5,8.4-0.2c-0.2,0-0.5-0.3-0.5-0.5C548.9,0.3,551.7,0.6,554.5,0.9z"/><path class="st0" d="M554.5,0.9c0,1.5,0,2.9,0,4.3c-0.4,0.2-0.7,0.1-0.8-0.4c-0.3-1.4-1.3-2.3-2.7-2.5c-1-0.2-2.1-0.2-3.1-0.1c-1.1,0.1-2,0.7-2.4,1.9c-0.4,1.2-0.3,2.4,0.6,3.4c0.5,0.5,1.1,1,1.7,1.4c1.4,0.9,2.8,1.7,4.1,2.6c2.6,1.7,3.3,4.2,2.8,7.1c-0.5,2.7-2.5,4.1-5,4.7c-2.8,0.7-5.6,0.5-8.4-0.2c-0.2,0-0.5-0.3-0.5-0.5c0-1.3,0-2.6,0-3.9c0.3-0.1,0.6,0,0.7,0.5c0.3,1.5,1.2,2.5,2.7,2.7c1.2,0.2,2.5,0.1,3.7,0c1.3-0.2,2.2-1,2.6-2.4c0.3-1.4,0.1-2.7-1-3.7c-0.8-0.7-1.8-1.3-2.7-1.9c-1.1-0.8-2.3-1.5-3.4-2.3c-2-1.7-2.5-3.9-2-6.3c0.6-2.5,2.3-3.7,4.7-4.3C548.9,0.3,551.7,0.6,554.5,0.9z"/><path class="st0" d="M396.6,0.8c0,1.6,0,3,0,4.5c-0.4,0.1-0.6,0.1-0.8-0.5c-0.2-0.6-0.6-1.3-1.1-1.6c-2.8-2.1-8.2-0.9-9.9,2.1c-0.9,1.5-1.2,3.1-1.4,4.8c-0.2,2.1-0.2,4.1,0.3,6.1c0.9,4,3.5,6,7.6,5.8c0.6,0,1.2-0.1,1.7-0.2c1.4-0.3,2.4-1.2,2.6-2.7c0-0.2,0.3-0.4,0.4-0.6c0.1,0,0.1,0.1,0.2,0.1c0,1.3,0,2.7,0,4c0,0.2-0.4,0.4-0.7,0.4c-1.8,0.2-3.7,0.4-5.5,0.5c-2,0.1-4-0.3-5.9-1.1c-3.2-1.3-5.1-3.7-5.7-7c-0.7-3.9-0.2-7.5,2.3-10.6c2.3-2.8,5.3-4.1,8.9-4.2C392,0.6,394.3,0.7,396.6,0.8z"/><path class="st0" d="M532.5,18.7c0,1.3,0,2.6,0,3.8c0,0.6-0.5,0.6-0.8,0.7c-2.7,0.6-5.4,0.7-8.1,0.3c-1.8-0.3-3.6-0.8-5.2-1.9c-2.5-1.7-3.6-4.2-4-7.1c-0.4-3.9,0.3-7.4,3.2-10.3c2.2-2.2,4.9-3.3,7.9-3.5c2.4-0.1,4.8,0.1,7.2,0.1c0,1.6,0,3,0,4.5c-0.4,0.1-0.6,0.1-0.8-0.4c-0.2-0.6-0.6-1.3-1.1-1.7c-2.8-2.1-8.2-0.9-9.9,2.1c-0.9,1.5-1.2,3.1-1.3,4.8c-0.2,2.1-0.2,4.1,0.3,6.1c0.9,4,3.5,5.9,7.5,5.8c0.7,0,1.4-0.1,2-0.3c1.3-0.4,2.2-1.2,2.4-2.6C531.9,18.7,532.1,18.5,532.5,18.7z"/><path class="st0" d="M277,23.3c0.2-0.1,0.3-0.3,0.5-0.4c1.1-0.3,1.7-1,1.8-2.1c0-0.5,0.1-1.1,0.1-1.6c0-4.8,0-9.6,0-14.4c0-0.5-0.1-0.9-0.1-1.4c-0.1-1.1-0.6-1.7-1.7-2c-0.2,0-0.3-0.3-0.5-0.5c0,0,0.1-0.1,0.1-0.1c3.3,0,6.6,0,10.2,0c-0.3,0.3-0.4,0.5-0.6,0.6c-0.3,0.1-0.7,0.1-1.1,0.2c-0.9,0.3-1.4,0.9-1.5,1.8c-0.1,0.7-0.1,1.4-0.1,2.1c0,4.7,0,9.4,0,14.2c0,0.3,0,0.6,0,0.8c0.1,0.9,0.3,1.2,1.2,1.2c1.2,0,2.4,0.1,3.6-0.1c1.5-0.1,2.3-1,2.5-2.6c0.1-0.5,0.2-0.6,0.7-0.5c0,1.6,0,3.2,0,4.8c-5.1,0-10.1,0-15.1,0C277.1,23.4,277.1,23.3,277,23.3z"/><path class="st0" d="M419.9,23.4c-5.1,0-10.1,0-15.3,0c0.2-0.3,0.4-0.5,0.5-0.6c1.1-0.3,1.7-1,1.8-2.2c0-0.5,0.1-1,0.1-1.5c0-4.8,0-9.6,0-14.4c0-0.5-0.1-0.9-0.1-1.4c-0.1-1.1-0.6-1.7-1.7-2c-0.2-0.1-0.4-0.3-0.5-0.4c0-0.1,0.1-0.1,0.1-0.2c3.3,0,6.7,0,10.3,0c-0.3,0.3-0.4,0.5-0.6,0.6c-0.4,0.1-0.7,0.1-1.1,0.2c-0.9,0.3-1.4,0.9-1.5,1.8c-0.1,0.7-0.1,1.4-0.1,2.1c0,4.8,0,9.5,0,14.3c0,0.2,0,0.4,0,0.5c0.1,1.2,0.3,1.5,1.5,1.5c1.1,0,2.2,0,3.3-0.1c1.5-0.1,2.4-1,2.6-2.6c0.1-0.5,0.2-0.7,0.7-0.5C419.9,20.2,419.9,21.8,419.9,23.4z"/><path class="st0" d="M497.9,0.8c3,0,6.1,0,9.4,0c-0.3,0.3-0.4,0.5-0.6,0.6c-1.4,0.5-1.8,1-1.8,2.4c0,5.6,0,11.2,0,16.8c0,1.2,0.5,2,1.8,2.3c0.2,0,0.3,0.3,0.6,0.6c-3.3,0-6.4,0-9.7,0c0.3-0.3,0.4-0.5,0.6-0.6c1.2-0.3,1.8-1.1,1.8-2.3c0-0.5,0.1-1,0.1-1.4c0-4.8,0-9.5,0-14.3c0-0.5-0.1-0.9-0.1-1.4c-0.1-1.1-0.6-1.8-1.7-2.1c-0.2,0-0.3-0.3-0.5-0.4C497.8,0.9,497.9,0.9,497.9,0.8z"/><path class="st0" d="M335.9,2.5c0-1.4-1.1-2.5-2.5-2.5S331,1.1,331,2.5c0,0.8,0.4,1.5,0.9,1.9c0,0,0,0,0,0c0.6,0.4,0.9,1.2,0.6,2.7c-0.3,1.4-1.9,2.6-1.4,3.1C331.6,10.8,336.1,7.4,335.9,2.5z"/></g></svg>`;

const oxfordLogoImg = new Image();
const oxfordSvgBlob = new Blob([oxfordSvgString], { type: 'image/svg+xml' });
oxfordLogoImg.src = URL.createObjectURL(oxfordSvgBlob);
oxfordLogoImg.onload = () => {
    if (state.brand === BRAND_OXFORD) {
        drawTemplate();
    }
};

const state = {
    brand: '',
    authorColor: '',
    coverPhoto: new Image(),
    templateImg: new Image(),
    originalFit: { x: 0, y: 0, width: 0, height: 0 },
    transform: { scale: 1.0, panX: 0, panY: 0 },
    isTemplateLoaded: false,
    isPhotoLoaded: false,
    activePhotoObjectURL: null
};

let renderFrameId = null;
function queuePhotoRender() {
    if (renderFrameId) return;
    renderFrameId = requestAnimationFrame(() => {
        updateCoverPhoto();
        renderFrameId = null;
    });
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

function getScaledFont(fontStr, scale) {
    return fontStr.replace(/(\d+)px/, (match, p1) => {
        return `${Math.round(parseInt(p1, 10) * scale)}px`;
    });
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

function drawAuthor(author, context = ctx.main, scale = 1) {
    if (!context) return;
    const brandConfig = getBrandConfig();

    context.textBaseline = 'alphabetic';
    const originalFont = getAuthorFontSize(author.length);
    context.font = getScaledFont(originalFont, scale);
    context.textAlign = brandConfig.authorPosition.align;
    context.fillStyle = state.authorColor;
    context.fillText(
        author,
        Math.round(brandConfig.authorPosition.x * scale),
        Math.round(brandConfig.authorPosition.y * scale)
    );
}

function drawTitle(title, context = ctx.main, scale = 1) {
    if (!context) return;
    const brandConfig = getBrandConfig();

    context.textBaseline = 'alphabetic';
    context.font = getScaledFont(brandConfig.titleFont, scale);
    context.fillStyle = brandConfig.titleColor;
    context.textAlign = brandConfig.titlePosition.align;
    context.fillText(
        title,
        Math.round(brandConfig.titlePosition.x * scale),
        Math.round(brandConfig.titlePosition.y * scale)
    );
}

function drawSubtitle(subtitle, context = ctx.main, scale = 1) {
    if (!subtitle || !context) return;
    const brandConfig = getBrandConfig();

    context.textBaseline = 'alphabetic';
    context.font = getScaledFont(brandConfig.subtitleFont, scale);
    context.fillStyle = brandConfig.subtitleColor;
    context.textAlign = brandConfig.subtitlePosition.align;
    context.fillText(
        subtitle,
        Math.round(brandConfig.subtitlePosition.x * scale),
        Math.round(brandConfig.subtitlePosition.y * scale)
    );
}

function drawTemplate(context = ctx.bg, scale = 1, clear = true) {
    if (!context) return;

    if (clear) {
        context.clearRect(0, 0, config.canvas.width * scale, config.canvas.height * scale);
    }

    if (state.brand === BRAND_PENGUIN) {
        context.fillStyle = '#000000';
        context.fillRect(0, Math.round(533 * scale), config.canvas.width * scale, (config.canvas.height - 533) * scale);

        const bannerY = Math.round(533 * scale);
        const bannerHeight = Math.round(38 * scale);
        context.fillStyle = '#FFFFFF';
        context.fillRect(0, bannerY, config.canvas.width * scale, bannerHeight);

        const isSpanish = document.documentElement.lang === 'es' || localStorage.getItem('i18nextLng')?.startsWith('es');
        const txtPenguin = "PENGUIN";
        const txtClassics = isSpanish ? "CLÁSICOS" : "CLASSICS";

        context.fillStyle = '#000000';
        context.textBaseline = 'middle';
        context.font = `${Math.round(11 * scale)}px 'Banner', 'FuturaPT-Heavy', sans-serif`;

        if ('letterSpacing' in context) {
            context.letterSpacing = Math.round(11 * 0.94 * scale) + 'px';
        }
        context.textAlign = 'right';
        context.fillText(txtPenguin, Math.round(220 * scale), Math.round(bannerY + bannerHeight / 2));

        if ('letterSpacing' in context) {
            context.letterSpacing = Math.round(11 * 0.85 * scale) + 'px';
        }
        context.textAlign = 'left';
        context.fillText(txtClassics, Math.round(290 * scale), Math.round(bannerY + bannerHeight / 2));

        if ('letterSpacing' in context) {
            context.letterSpacing = '0px';
        }

        if (penguinLogoImg.complete) {
            const logoWidth = Math.round(28 * scale);
            const logoHeight = Math.round(35 * scale);
            context.drawImage(
                penguinLogoImg,
                Math.round(((config.canvas.width - 28) / 2) * scale),
                Math.round(bannerY + (bannerHeight - logoHeight) / 2),
                logoWidth,
                logoHeight
            );
        }
    } else if (state.brand === BRAND_OXFORD) {
        const bottomMargin = Math.round(64 * scale);
        const containerHeight = (config.canvas.height - 533) * scale - bottomMargin;

        context.fillStyle = '#FFFFFF';
        context.fillRect(0, Math.round(530 * scale), config.canvas.width * scale, containerHeight);

        if (oxfordLogoImg.complete) {
            const logoX = Math.round(41 * scale);
            const logoY = Math.round(672 * scale);
            const logoWidth = Math.round(255 * scale);
            const logoHeight = Math.round(logoWidth * (24 / 555));

            context.drawImage(
                oxfordLogoImg,
                logoX,
                logoY,
                logoWidth,
                logoHeight
            );
        }
    } else {
        if (state.isTemplateLoaded) {
            context.drawImage(state.templateImg, 0, 0, config.canvas.width * scale, config.canvas.height * scale);
        }
    }
}

function updateCoverPhoto(context = ctx.photo, scale = 1, clear = true) {
    if (!context) return;

    if (clear) {
        context.clearRect(0, 0, config.canvas.width * scale, config.canvas.height * scale);
    }

    if (state.isPhotoLoaded && state.originalFit.width > 0) {
        const base = state.originalFit;
        const transform = state.transform;

        const scaledWidth = base.width * transform.scale * scale;
        const scaledHeight = base.height * transform.scale * scale;

        const centerX = (base.x + base.width / 2) * scale;
        const centerY = (base.y + base.height / 2) * scale;

        let drawX = centerX - scaledWidth / 2;
        let drawY = centerY - scaledHeight / 2;

        drawX += transform.panX * scale;
        drawY += transform.panY * scale;

        context.drawImage(
            state.coverPhoto,
            Math.round(drawX),
            Math.round(drawY),
            Math.round(scaledWidth),
            Math.round(scaledHeight)
        );
    }
}

function updateText(context = ctx.main, scale = 1, clear = true) {
    if (!context) return;

    if (clear) {
        context.clearRect(0, 0, config.canvas.width * scale, config.canvas.height * scale);
    }

    if (state.brand) {
        const { author, title, subtitle } = getInputValues();
        drawAuthor(author, context, scale);
        drawTitle(title, context, scale);
        drawSubtitle(subtitle, context, scale);
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

    if (brandName === BRAND_PENGUIN || brandName === BRAND_OXFORD) {
        state.isTemplateLoaded = true;
        drawTemplate();
    } else {
        state.templateImg.src = `template_${brandName}.png`;
    }

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

    const scale = elements.exportSize ? parseInt(elements.exportSize.value, 10) : 1;
    elements.dlCanvas.width = config.canvas.width * scale;
    elements.dlCanvas.height = config.canvas.height * scale;

    ctxDl.imageSmoothingEnabled = true;
    ctxDl.imageSmoothingQuality = 'high';

    ctxDl.clearRect(0, 0, elements.dlCanvas.width, elements.dlCanvas.height);

    updateCoverPhoto(ctxDl, scale, false);
    drawTemplate(ctxDl, scale, false);
    updateText(ctxDl, scale, false);

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
    queuePhotoRender();
}

function applyPan() {
    if (!elements.panXRange || !elements.panYRange || !elements.panXValueSpan || !elements.panYValueSpan) return;
    state.transform.panX = parseInt(elements.panXRange.value, 10);
    state.transform.panY = parseInt(elements.panYRange.value, 10);
    elements.panXValueSpan.textContent = state.transform.panX;
    elements.panYValueSpan.textContent = state.transform.panY;
    queuePhotoRender();
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

    queuePhotoRender();
}

function handleFileInput() {
    if (!elements.fileInput || !elements.fileInput.files || elements.fileInput.files.length === 0) {
        elements.fileName.textContent = 'No file chosen';
        return;
    }
    const file = elements.fileInput.files[0];

    if (!file.type.startsWith('image/')) {
        showNotification(`File type "${file.type}" is not supported. Please select an image file.`);
        elements.fileInput.value = '';
        elements.fileName.textContent = 'No file chosen';
        return;
    }

    elements.fileName.textContent = file.name;

    if (state.activePhotoObjectURL) {
        URL.revokeObjectURL(state.activePhotoObjectURL);
    }

    state.activePhotoObjectURL = URL.createObjectURL(file);

    const tempImg = new Image();
    tempImg.onload = () => {
        fitImageProportionally(tempImg.naturalWidth, tempImg.naturalHeight);
        state.coverPhoto.src = state.activePhotoObjectURL;
    };
    tempImg.onerror = () => {
        showNotification('Error loading selected image dimensions.');
        state.isPhotoLoaded = false;
        if (ctx.photo) ctx.photo.clearRect(0, 0, config.canvas.width, config.canvas.height);
    };
    tempImg.src = state.activePhotoObjectURL;
}

function fitImageProportionally(imgWidth, imgHeight) {
    if (imgWidth <= 0 || imgHeight <= 0) {
        console.error("Invalid dimensions for proportional fit.");
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

    if (elements.zoomRange) elements.zoomRange.addEventListener('input', applyZoom);
    if (elements.panXRange) elements.panXRange.addEventListener('input', applyPan);
    if (elements.panYRange) elements.panYRange.addEventListener('input', applyPan);

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
        showNotification('Error loading background template image.');
        state.isTemplateLoaded = false;
    };

    state.coverPhoto.onload = () => {
        state.isPhotoLoaded = true;
        queuePhotoRender();
    };
    state.coverPhoto.onerror = () => {
        showNotification('Error loading image.');
        state.isPhotoLoaded = false;
        if (ctx.photo) ctx.photo.clearRect(0, 0, config.canvas.width, config.canvas.height);
    };

    if (document.fonts) {
        document.fonts.ready.then(() => {
            if (state.brand === BRAND_PENGUIN || state.brand === BRAND_OXFORD) {
                drawTemplate();
                updateText();
            }
        });
    }
}

function init() {
    if (!areContextsValid) {
        showNotification("Jinkies! Canvas features not initialized correctly. Please check compatibility or refresh your browser.");
        const controls = document.getElementById('controls');
        if (controls) {
            controls.style.pointerEvents = 'none';
            controls.style.opacity = '0.5';
        }
        return;
    }

    const setCanvasDimensions = (canvas) => {
        canvas.width = config.canvas.width;
        canvas.height = config.canvas.height;
    };

    setCanvasDimensions(elements.canvas);
    setCanvasDimensions(elements.photoCanvas);
    setCanvasDimensions(elements.bgCanvas);
    setCanvasDimensions(elements.dlCanvas);

    initEventListeners();
    switchBrand(BRAND_PENGUIN);

    console.log("Cover generator initialized.");
}

document.addEventListener('DOMContentLoaded', init);
