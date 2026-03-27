import {
    syncDetailInputsFromPreset,
    syncPresetFromDetailInputs,
    updateCanvasSize,
    updateLayoutModeUI,
    updateSettingsTabUI
} from './layout-settings.js';

export function setupUIEventListeners(dom, state, drawTanka) {
    [dom.tankaInput, dom.fontSelect, dom.textColor, dom.bgColor].forEach((el) => {
        el.addEventListener('input', drawTanka);
    });

    dom.renderModeRadios.forEach((radio) => {
        radio.addEventListener('change', drawTanka);
    });

    [dom.authorInput, ...dom.snsInputs].forEach((el) => {
        el.addEventListener('input', drawTanka);
    });

    dom.snsCheckboxes.forEach((checkbox) => {
        checkbox.addEventListener('change', drawTanka);
    });

    dom.labelToggleCheckboxes.forEach((checkbox) => {
        checkbox.addEventListener('change', drawTanka);
    });

    dom.imageSizeRadios.forEach((radio) => {
        radio.addEventListener('change', (event) => {
            updateCanvasSize(dom, event.target.value);
            drawTanka();
        });
    });

    dom.layoutPresetRadios.forEach((radio) => {
        radio.addEventListener('change', () => {
            syncDetailInputsFromPreset(dom);
            drawTanka();
        });
    });

    dom.layoutModeTabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            state.layoutMode = tab.dataset.layoutMode;
            updateLayoutModeUI(dom, state);
            drawTanka();
        });
    });

    dom.settingsTabButtons.forEach((button) => {
        button.addEventListener('click', () => {
            state.settingsTabMode = button.dataset.settingsTab;
            updateSettingsTabUI(dom, state);
        });
    });

    [dom.fontSizeInput, dom.lineSpacingInput, dom.topMarginInput, dom.charSpacingInput].forEach((input) => {
        input.addEventListener('input', () => {
            syncPresetFromDetailInputs(dom);
            if (state.layoutMode === 'detail') {
                drawTanka();
            }
        });
    });

    dom.downloadBtn.addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = 'my-tanka.png';
        link.href = dom.canvas.toDataURL('image/png');
        link.click();
    });
}
