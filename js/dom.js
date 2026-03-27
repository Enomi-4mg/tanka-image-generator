export function getDomRefs() {
    const canvas = document.getElementById('tankaCanvas');
    const snsInputs = document.querySelectorAll('input[type="text"][data-sns-input]');
    const labelToggleCheckboxes = document.querySelectorAll('input[type="checkbox"][data-label-toggle]');

    const snsInputByKey = {};
    snsInputs.forEach((input) => {
        snsInputByKey[input.dataset.snsInput] = input;
    });

    const labelToggleByKey = {};
    labelToggleCheckboxes.forEach((checkbox) => {
        labelToggleByKey[checkbox.dataset.labelToggle] = checkbox;
    });

    return {
        canvas,
        ctx: canvas.getContext('2d'),
        tankaInput: document.getElementById('tankaInput'),
        fontSelect: document.getElementById('fontSelect'),
        textColor: document.getElementById('textColor'),
        bgColor: document.getElementById('bgColor'),
        renderModeRadios: document.querySelectorAll('input[name="renderMode"]'),
        downloadBtn: document.getElementById('downloadBtn'),
        sizeHint: document.getElementById('sizeHint'),
        settingsTabButtons: document.querySelectorAll('.tab-button[data-settings-tab]'),
        tankaSettingsPanel: document.getElementById('tankaSettingsPanel'),
        authorSettingsPanel: document.getElementById('authorSettingsPanel'),
        imageSizeRadios: document.querySelectorAll('input[name="imageSize"]'),
        layoutPresetRadios: document.querySelectorAll('input[name="layoutPreset"]'),
        layoutModeTabs: document.querySelectorAll('.tab-button[data-layout-mode]'),
        presetPanel: document.getElementById('presetPanel'),
        detailPanel: document.getElementById('detailPanel'),
        fontSizeInput: document.getElementById('fontSizeInput'),
        lineSpacingInput: document.getElementById('lineSpacingInput'),
        topMarginInput: document.getElementById('topMarginInput'),
        charSpacingInput: document.getElementById('charSpacingInput'),
        authorInput: document.getElementById('authorInput'),
        snsCheckboxes: document.querySelectorAll('input[type="checkbox"][data-sns]'),
        snsInputs,
        snsInputByKey,
        labelToggleCheckboxes,
        labelToggleByKey
    };
}
