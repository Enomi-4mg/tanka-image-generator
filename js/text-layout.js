import { getAdjustmentProfileBySection, getGlyphAdjustment } from './font-adjustments.js';

export function wrapTextByWidth(ctx, text, maxWidth) {
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

function toFiniteNumber(value) {
    const num = Number(value);
    return Number.isFinite(num) ? num : null;
}

export function calculateVerticalBlockMetrics(lines, config) {
    const {
        width,
        availableHeight,
        fontSize,
        lineSpacing,
        charSpacingRatio,
        topMargin
    } = config;

    const maxCharsInLine = Math.max(...lines.map((line) => line.length));
    const blockWidth = fontSize + ((lines.length - 1) * lineSpacing);
    const blockHeight = fontSize + ((Math.max(maxCharsInLine - 1, 0)) * fontSize * charSpacingRatio);

    const topMarginValue = toFiniteNumber(topMargin);

    const startY = topMarginValue !== null
        ? Math.max(0, topMarginValue)
        : Math.max(0, (availableHeight - blockHeight) / 2);

    const rightMostX = ((width + blockWidth) / 2) - fontSize;

    return {
        maxCharsInLine,
        blockWidth,
        blockHeight,
        startY,
        rightMostX
    };
}

export function createVerticalLayout(text, config, sectionLabel, fontSettings) {
    const lines = text
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

    if (lines.length === 0) {
        return [];
    }

    const {
        width,
        availableHeight,
        fontSize,
        lineSpacing,
        charSpacingRatio
    } = config;

    const sectionProfile = getAdjustmentProfileBySection(sectionLabel);
    const { rightMostX, startY } = calculateVerticalBlockMetrics(lines, config);

    const glyphs = [];

    lines.forEach((line, lineIndex) => {
        const x = rightMostX - (lineIndex * lineSpacing);

        for (let charIndex = 0; charIndex < line.length; charIndex += 1) {
            const char = line[charIndex];
            const y = startY + (charIndex * fontSize * charSpacingRatio);
            const adjustment = getGlyphAdjustment(char, fontSize, sectionProfile, fontSettings);

            glyphs.push({
                char,
                x,
                y,
                rotate: adjustment.rotate,
                offsetX: adjustment.offsetX,
                offsetY: adjustment.offsetY,
                scale: adjustment.scale
            });
        }
    });

    return glyphs;
}
