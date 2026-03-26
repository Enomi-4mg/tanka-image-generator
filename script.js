import { Analytics } from "@vercel/analytics/next"

const canvas = document.getElementById('tankaCanvas');
const ctx = canvas.getContext('2d');

const tankaInput = document.getElementById('tankaInput');
const fontSelect = document.getElementById('fontSelect');
const textColor = document.getElementById('textColor');
const bgColor = document.getElementById('bgColor');
const downloadBtn = document.getElementById('downloadBtn');
const sizeHint = document.getElementById('sizeHint');
const settingsTabButtons = document.querySelectorAll('.tab-button[data-settings-tab]');
const tankaSettingsPanel = document.getElementById('tankaSettingsPanel');
const authorSettingsPanel = document.getElementById('authorSettingsPanel');
const imageSizeRadios = document.querySelectorAll('input[name="imageSize"]');
const layoutPresetRadios = document.querySelectorAll('input[name="layoutPreset"]');
const layoutModeTabs = document.querySelectorAll('.tab-button[data-layout-mode]');
const presetPanel = document.getElementById('presetPanel');
const detailPanel = document.getElementById('detailPanel');
const fontSizeInput = document.getElementById('fontSizeInput');
const lineSpacingInput = document.getElementById('lineSpacingInput');
const topMarginInput = document.getElementById('topMarginInput');
const rightMarginInput = document.getElementById('rightMarginInput');
const charSpacingInput = document.getElementById('charSpacingInput');
const authorInput = document.getElementById('authorInput');
const snsCheckboxes = document.querySelectorAll('input[type="checkbox"][data-sns]');
const snsInputs = document.querySelectorAll('input[type="text"][data-sns-input]');
const labelToggleCheckboxes = document.querySelectorAll('input[type="checkbox"][data-label-toggle]');

let layoutMode = 'preset';
let settingsTabMode = 'tanka';

const snsLabels = {
    x: 'X',
    instagram: 'Instagram',
    threads: 'Thread'
};

function shouldShowLabel(labelKey) {
    const checkbox = document.querySelector(`input[data-label-toggle="${labelKey}"]`);
    return checkbox ? checkbox.checked : true;
}

function getSelectedPreset() {
    return document.querySelector('input[name="layoutPreset"]:checked')?.value || 'multiline';
}

function getPresetLayoutConfig(preset, width = canvas.width, height = canvas.height) {
    const base = Math.min(width, height);

    if (preset === 'singleline') {
        return {
            fontSize: Math.round(base * 0.03),
            lineSpacing: Math.round(base * 0.12),
            topMargin: Math.round(height * 0.08),
            rightMargin: Math.round(width * 0.5),
            charSpacingRatio: 1.2
        };
    }

    return {
        fontSize: Math.round(base * 0.0525),
        lineSpacing: Math.round(base * 0.0875),
        topMargin: Math.round(height * 0.1),
        rightMargin: Math.round(width * 0.125),
        charSpacingRatio: 1.1
    };
}

function setDetailInputs(config) {
    fontSizeInput.value = String(config.fontSize);
    lineSpacingInput.value = String(config.lineSpacing);
    topMarginInput.value = String(config.topMargin);
    rightMarginInput.value = String(config.rightMargin);
    charSpacingInput.value = String(config.charSpacingRatio);
}

function syncDetailInputsFromPreset() {
    setDetailInputs(getPresetLayoutConfig(getSelectedPreset()));
}

function isNearlyEqual(a, b, epsilon = 0.001) {
    return Math.abs(a - b) <= epsilon;
}

function syncPresetFromDetailInputs() {
    const detail = {
        fontSize: getNumberValue(fontSizeInput, 42),
        lineSpacing: getNumberValue(lineSpacingInput, 70),
        topMargin: getNumberValue(topMarginInput, 80),
        rightMargin: getNumberValue(rightMarginInput, 100),
        charSpacingRatio: getNumberValue(charSpacingInput, 1.1)
    };

    const presets = ['multiline', 'singleline'];

    for (const preset of presets) {
        const config = getPresetLayoutConfig(preset);
        const matched =
            isNearlyEqual(detail.fontSize, config.fontSize) &&
            isNearlyEqual(detail.lineSpacing, config.lineSpacing) &&
            isNearlyEqual(detail.topMargin, config.topMargin) &&
            isNearlyEqual(detail.rightMargin, config.rightMargin) &&
            isNearlyEqual(detail.charSpacingRatio, config.charSpacingRatio);

        if (matched) {
            const radio = document.querySelector(`input[name="layoutPreset"][value="${preset}"]`);
            if (radio) {
                radio.checked = true;
            }
            return;
        }
    }
}

function getNumberValue(inputEl, fallback) {
    const value = Number(inputEl?.value);
    return Number.isFinite(value) ? value : fallback;
}

function getLayoutConfig() {
    if (layoutMode === 'detail') {
        return {
            fontSize: getNumberValue(fontSizeInput, 42),
            lineSpacing: getNumberValue(lineSpacingInput, 70),
            topMargin: getNumberValue(topMarginInput, 80),
            rightMargin: getNumberValue(rightMarginInput, 100),
            charSpacingRatio: getNumberValue(charSpacingInput, 1.1)
        };
    }

    return getPresetLayoutConfig(getSelectedPreset());
}

function updateLayoutModeUI() {
    const isPreset = layoutMode === 'preset';

    presetPanel.classList.toggle('is-hidden', !isPreset);
    detailPanel.classList.toggle('is-hidden', isPreset);

    layoutModeTabs.forEach(tab => {
        const isActive = tab.dataset.layoutMode === layoutMode;
        tab.classList.toggle('is-active', isActive);
        tab.setAttribute('aria-selected', String(isActive));
    });
}

function updateCanvasSize(sizeValue) {
    const [width, height] = sizeValue.split('x').map(Number);
    canvas.width = width;
    canvas.height = height;

    syncDetailInputsFromPreset();

    if (width === height) {
        sizeHint.textContent = `※${width}×${height}px の正方形で出力されます`;
    } else {
        sizeHint.textContent = `※${width}×${height}px で出力されます`;
    }
}

function updateSettingsTabUI() {
    const isTankaTab = settingsTabMode === 'tanka';

    tankaSettingsPanel.classList.toggle('is-hidden', !isTankaTab);
    authorSettingsPanel.classList.toggle('is-hidden', isTankaTab);

    settingsTabButtons.forEach(button => {
        const isActive = button.dataset.settingsTab === settingsTabMode;
        button.classList.toggle('is-active', isActive);
        button.setAttribute('aria-selected', String(isActive));
    });
}

function getFooterTexts() {
    const footerParts = [];
    const author = authorInput.value.trim();

    if (author) {
        footerParts.push(shouldShowLabel('author') ? `作者: ${author}` : author);
    }

    snsCheckboxes.forEach((checkbox) => {
        if (!checkbox.checked) {
            return;
        }

        const key = checkbox.dataset.sns;
        const input = document.querySelector(`input[data-sns-input="${key}"]`);
        const account = input?.value.trim();

        if (account) {
            footerParts.push(shouldShowLabel(key) ? `${snsLabels[key]}: ${account}` : account);
        }
    });

    return footerParts;
}

function wrapTextByWidth(text, maxWidth) {
    const chars = Array.from(text);
    const lines = [];
    let current = '';

    chars.forEach((char) => {
        const candidate = current + char;
        if (current && ctx.measureText(candidate).width > maxWidth) {
            lines.push(current);
            current = char;
            return;
        }

        current = candidate;
    });

    if (current) {
        lines.push(current);
    }

    return lines;
}

function drawFooter(width, height) {
    const footerParts = getFooterTexts();

    if (footerParts.length === 0) {
        return 0;
    }

    const footerText = footerParts.join(' / ');
    const footerFontSize = Math.max(16, Math.round(Math.min(width, height) * 0.025));
    const footerPadding = Math.round(Math.min(width, height) * 0.04);
    const footerLineHeight = Math.round(footerFontSize * 1.45);
    const maxWidth = width - (footerPadding * 2);

    ctx.font = `${footerFontSize}px ${fontSelect.value}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';

    const lines = wrapTextByWidth(footerText, maxWidth);
    const footerHeight = (lines.length * footerLineHeight) + footerPadding;
    const baseY = height - footerPadding;

    lines.forEach((line, index) => {
        const y = baseY - ((lines.length - 1 - index) * footerLineHeight);
        ctx.fillText(line, width / 2, y);
    });

    return footerHeight;
}

/**
 * キャンバスに短歌を描画するメイン関数
 */
function drawTanka() {
    const width = canvas.width;
    const height = canvas.height;

    // 1. 背景の塗りつぶし
    ctx.fillStyle = bgColor.value;
    ctx.fillRect(0, 0, width, height);

    // 2. テキスト描画の設定
    const lines = tankaInput.value
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);

    const {
        fontSize,
        lineSpacing,
        charSpacingRatio
    } = getLayoutConfig();

    ctx.fillStyle = textColor.value;
    const reservedFooterHeight = drawFooter(width, height);

    ctx.font = `${fontSize}px ${fontSelect.value}`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    // 3. 縦書き描画
    if (lines.length === 0) {
        return;
    }

    const maxCharsInLine = Math.max(...lines.map(line => line.length));
    const blockWidth = fontSize + ((lines.length - 1) * lineSpacing);
    const blockHeight = fontSize + ((Math.max(maxCharsInLine - 1, 0)) * fontSize * charSpacingRatio);
    const rightMostX = ((width + blockWidth) / 2) - fontSize;
    const availableHeight = Math.max(height - reservedFooterHeight, fontSize);
    const startY = Math.max(0, (availableHeight - blockHeight) / 2);

    lines.forEach((line, index) => {
        // 右から左へ行を配置
        const x = rightMostX - (index * lineSpacing);

        // 1文字ずつ縦に描画
        for (let i = 0; i < line.length; i++) {
            const char = line[i];

            // 句読点や小さい「つ」などの位置微調整が必要な場合はここで判定可能
            // 今回はシンプルに等間隔で配置
            ctx.fillText(char, x, startY + (i * fontSize * charSpacingRatio));
        }
    });
}

// 入力値が変更されたら即座に再描画
[tankaInput, fontSelect, textColor, bgColor].forEach(el => {
    el.addEventListener('input', drawTanka);
});

[authorInput, ...snsInputs].forEach(el => {
    el.addEventListener('input', drawTanka);
});

snsCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', drawTanka);
});

labelToggleCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', drawTanka);
});

imageSizeRadios.forEach(radio => {
    radio.addEventListener('change', (event) => {
        updateCanvasSize(event.target.value);
        drawTanka();
    });
});

layoutPresetRadios.forEach(radio => {
    radio.addEventListener('change', () => {
        syncDetailInputsFromPreset();
        drawTanka();
    });
});

layoutModeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        layoutMode = tab.dataset.layoutMode;
        updateLayoutModeUI();
        drawTanka();
    });
});

settingsTabButtons.forEach(button => {
    button.addEventListener('click', () => {
        settingsTabMode = button.dataset.settingsTab;
        updateSettingsTabUI();
    });
});

[fontSizeInput, lineSpacingInput, topMarginInput, rightMarginInput, charSpacingInput].forEach(input => {
    input.addEventListener('input', () => {
        syncPresetFromDetailInputs();
        if (layoutMode === 'detail') {
            drawTanka();
        }
    });
});

// 画像保存機能
downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'my-tanka.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
});

// フォントの読み込み完了を待ってから初期描画
document.fonts.ready.then(() => {
    const selectedSize = document.querySelector('input[name="imageSize"]:checked');
    if (selectedSize) {
        updateCanvasSize(selectedSize.value);
    }
    syncDetailInputsFromPreset();
    updateSettingsTabUI();
    updateLayoutModeUI();
    drawTanka();
});