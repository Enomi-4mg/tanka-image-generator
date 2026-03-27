export const snsLabels = {
    x: 'X',
    instagram: 'Instagram',
    threads: 'Thread'
};

export function shouldShowLabel(dom, labelKey) {
    const checkbox = dom.labelToggleByKey[labelKey];
    return checkbox ? checkbox.checked : true;
}

export function getSelectedFontSection(dom) {
    const selectedOption = dom.fontSelect.selectedOptions?.[0];
    return selectedOption?.parentElement?.label || '';
}

export function getSelectedFontFamily(dom) {
    const primary = dom.fontSelect.value.split(',')[0]?.trim() || '';
    return primary.replace(/^['\"]|['\"]$/g, '');
}

export function getAdjustmentProfileBySection(sectionLabel) {
    if (sectionLabel === '明朝・セリフ系') {
        return {
            perCharAdjustments: {
                'ー': { rotateAngle: Math.PI / 2 + 0.05, offsetXRatio: -0.07, offsetYRatio: -0.09 },
                '―': { rotateAngle: Math.PI / 2 },
                '—': { rotateAngle: Math.PI / 2 },
                '～': { rotateAngle: Math.PI / 2 },
                '＿': { rotateAngle: Math.PI / 2 },
                '_': { rotateAngle: Math.PI / 2 },
                '…': { rotateAngle: Math.PI / 2 },
                '‥': { rotateAngle: Math.PI / 2 },
                '「': { rotateAngle: Math.PI / 2 },
                '」': { rotateAngle: Math.PI / 2 },
                '『': { rotateAngle: Math.PI / 2 },
                '』': { rotateAngle: Math.PI / 2, offsetXRatio: -0.2 },
                '（': { rotateAngle: Math.PI / 2 },
                '）': { rotateAngle: Math.PI / 2 },
                '【': { rotateAngle: Math.PI / 2 },
                '】': { rotateAngle: Math.PI / 2 },
                '《': { rotateAngle: Math.PI / 2 },
                '》': { rotateAngle: Math.PI / 2 }
            },
            punctuationOffsetXRatio: 0.25,
            punctuationOffsetYRatio: -0.1
        };
    }

    return {
        perCharAdjustments: {
            'ー': { rotateAngle: Math.PI / 2 },
            '―': { rotateAngle: Math.PI / 2 },
            '—': { rotateAngle: Math.PI / 2 },
            '～': { rotateAngle: Math.PI / 2 },
            '＿': { rotateAngle: Math.PI / 2 },
            '_': { rotateAngle: Math.PI / 2 },
            '…': { rotateAngle: Math.PI / 2 },
            '‥': { rotateAngle: Math.PI / 2 },
            '「': { rotateAngle: Math.PI / 2 },
            '」': { rotateAngle: Math.PI / 2 },
            '『': { rotateAngle: Math.PI / 2 },
            '』': { rotateAngle: Math.PI / 2 },
            '（': { rotateAngle: Math.PI / 2 },
            '）': { rotateAngle: Math.PI / 2 },
            '【': { rotateAngle: Math.PI / 2 },
            '】': { rotateAngle: Math.PI / 2 },
            '《': { rotateAngle: Math.PI / 2 },
            '》': { rotateAngle: Math.PI / 2 }
        },
        punctuationOffsetXRatio: 0,
        punctuationOffsetYRatio: 0
    };
}

export function getFontSpecificSettings(dom) {
    const fontFamily = getSelectedFontFamily(dom);
    const fontSpecificSettings = {
        'Yuji Syuku': { offsetXRatio: 0, offsetYRatio: 0.03, scale: 1 },
        'Yuji Mai': { offsetXRatio: 0, offsetYRatio: 0.025, scale: 1 },
        'Yuji Boku': { offsetXRatio: 0, offsetYRatio: 0.02, scale: 1 },
        DotGothic16: { offsetXRatio: 0, offsetYRatio: -0.02, scale: 1 }
    };

    return fontSpecificSettings[fontFamily] || {
        offsetXRatio: 0,
        offsetYRatio: 0,
        scale: 1
    };
}

export function getGlyphAdjustment(char, fontSize, sectionProfile, fontSettings) {
    const defaultAdjustment = {
        rotate: 0,
        offsetX: fontSize * fontSettings.offsetXRatio,
        offsetY: fontSize * fontSettings.offsetYRatio,
        scale: fontSettings.scale
    };

    const perCharAdjustment = sectionProfile.perCharAdjustments[char];
    if (perCharAdjustment) {
        return {
            rotate: perCharAdjustment.rotateAngle || 0,
            offsetX: defaultAdjustment.offsetX + ((perCharAdjustment.offsetXRatio || 0) * fontSize),
            offsetY: defaultAdjustment.offsetY + ((perCharAdjustment.offsetYRatio || 0) * fontSize),
            scale: (perCharAdjustment.scale || 1) * defaultAdjustment.scale
        };
    }

    const punctuation = ['、', '。', '：', '；', '×', '÷', '±', '§', '¶'];
    if (punctuation.includes(char)) {
        return {
            ...defaultAdjustment,
            offsetX: defaultAdjustment.offsetX + (fontSize * sectionProfile.punctuationOffsetXRatio),
            offsetY: defaultAdjustment.offsetY + (fontSize * sectionProfile.punctuationOffsetYRatio)
        };
    }

    return defaultAdjustment;
}
