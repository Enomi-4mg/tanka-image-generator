function getNumberValue(inputEl, fallback) {
    const value = Number(inputEl?.value);
    return Number.isFinite(value) ? value : fallback;
}

function isNearlyEqual(a, b, epsilon = 0.001) {
    return Math.abs(a - b) <= epsilon;
}

function getSelectedPreset(dom) {
    return Array.from(dom.layoutPresetRadios).find((radio) => radio.checked)?.value || 'multiline';
}

export function getPresetLayoutConfig(preset, width, height) {
    const base = Math.min(width, height);

    if (preset === 'singleline') {
        return {
            fontSize: Math.round(base * 0.03),
            lineSpacing: Math.round(base * 0.12),
            topMargin: Math.round(height * 0.08),
            charSpacingRatio: 1.2
        };
    }

    return {
        fontSize: Math.round(base * 0.0525),
        lineSpacing: Math.round(base * 0.0875),
        topMargin: Math.round(height * 0.1),
        charSpacingRatio: 1.1
    };
}

export function setDetailInputs(dom, config) {
    dom.fontSizeInput.value = String(config.fontSize);
    dom.lineSpacingInput.value = String(config.lineSpacing);
    dom.topMarginInput.value = String(config.topMargin);
    dom.charSpacingInput.value = String(config.charSpacingRatio);
}

export function syncDetailInputsFromPreset(dom) {
    const preset = getSelectedPreset(dom);
    setDetailInputs(dom, getPresetLayoutConfig(preset, dom.canvas.width, dom.canvas.height));
}

export function syncPresetFromDetailInputs(dom) {
    const detail = {
        fontSize: getNumberValue(dom.fontSizeInput, 42),
        lineSpacing: getNumberValue(dom.lineSpacingInput, 70),
        topMargin: getNumberValue(dom.topMarginInput, 80),
        charSpacingRatio: getNumberValue(dom.charSpacingInput, 1.1)
    };

    const presets = ['multiline', 'singleline'];

    for (const preset of presets) {
        const config = getPresetLayoutConfig(preset, dom.canvas.width, dom.canvas.height);
        const matched =
            isNearlyEqual(detail.fontSize, config.fontSize) &&
            isNearlyEqual(detail.lineSpacing, config.lineSpacing) &&
            isNearlyEqual(detail.topMargin, config.topMargin) &&
            isNearlyEqual(detail.charSpacingRatio, config.charSpacingRatio);

        if (matched) {
            const radio = Array.from(dom.layoutPresetRadios).find((item) => item.value === preset);
            if (radio) {
                radio.checked = true;
            }
            return;
        }
    }
}

export function getLayoutConfig(dom, state) {
    if (state.layoutMode === 'detail') {
        return {
            fontSize: getNumberValue(dom.fontSizeInput, 42),
            lineSpacing: getNumberValue(dom.lineSpacingInput, 70),
            topMargin: getNumberValue(dom.topMarginInput, 80),
            charSpacingRatio: getNumberValue(dom.charSpacingInput, 1.1)
        };
    }

    return getPresetLayoutConfig(getSelectedPreset(dom), dom.canvas.width, dom.canvas.height);
}

export function getRenderMode(dom) {
    return Array.from(dom.renderModeRadios).find((radio) => radio.checked)?.value || 'svg';
}

export function updateLayoutModeUI(dom, state) {
    const isPreset = state.layoutMode === 'preset';

    dom.presetPanel.classList.toggle('is-hidden', !isPreset);
    dom.detailPanel.classList.toggle('is-hidden', isPreset);

    dom.layoutModeTabs.forEach((tab) => {
        const isActive = tab.dataset.layoutMode === state.layoutMode;
        tab.classList.toggle('is-active', isActive);
        tab.setAttribute('aria-selected', String(isActive));
    });
}

export function updateCanvasSize(dom, sizeValue) {
    const [width, height] = sizeValue.split('x').map(Number);
    dom.canvas.width = width;
    dom.canvas.height = height;

    syncDetailInputsFromPreset(dom);

    if (width === height) {
        dom.sizeHint.textContent = `※${width}×${height}px の正方形で出力されます`;
    } else {
        dom.sizeHint.textContent = `※${width}×${height}px で出力されます`;
    }
}

export function updateSettingsTabUI(dom, state) {
    const isTankaTab = state.settingsTabMode === 'tanka';

    dom.tankaSettingsPanel.classList.toggle('is-hidden', !isTankaTab);
    dom.authorSettingsPanel.classList.toggle('is-hidden', isTankaTab);

    dom.settingsTabButtons.forEach((button) => {
        const isActive = button.dataset.settingsTab === state.settingsTabMode;
        button.classList.toggle('is-active', isActive);
        button.setAttribute('aria-selected', String(isActive));
    });
}
