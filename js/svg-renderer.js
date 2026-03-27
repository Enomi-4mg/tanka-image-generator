import { getAdjustmentProfileBySection } from './font-adjustments.js';
import { calculateVerticalBlockMetrics, createVerticalLayout } from './text-layout.js';
import { renderLayout } from './canvas-renderer.js';

function escapeXml(value) {
    return value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&apos;');
}

function buildVerticalSvgMarkup(lines, config, fontSettings, sectionProfile) {
    const {
        width,
        height,
        availableHeight,
        fontSize,
        lineSpacing,
        charSpacingRatio,
        fontFace,
        color
    } = config;

    const { rightMostX, startY } = calculateVerticalBlockMetrics(lines, config);
    const baseOffsetX = fontSize * fontSettings.offsetXRatio;
    const baseOffsetY = fontSize * fontSettings.offsetYRatio;
    const letterSpacing = (charSpacingRatio - 1) * fontSize;
    const punctuationHint = `translate(${fontSize * sectionProfile.punctuationOffsetXRatio} ${fontSize * sectionProfile.punctuationOffsetYRatio})`;

    const textElements = lines.map((line, lineIndex) => {
        const x = rightMostX - (lineIndex * lineSpacing) + baseOffsetX;
        const y = startY + baseOffsetY;
        return `<text x="${x}" y="${y}" class="vt">${escapeXml(line)}</text>`;
    }).join('');

    return `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <style>
    .vt {
      writing-mode: vertical-rl;
      text-orientation: mixed;
      font-family: ${fontFace};
      font-size: ${fontSize}px;
      fill: ${color};
      letter-spacing: ${letterSpacing}px;
      dominant-baseline: text-before-edge;
      transform-origin: center;
    }
    .punctuation-hint {
      transform: ${punctuationHint};
    }
  </style>
  ${textElements}
</svg>`;
}

export function renderSvgVerticalLayout(args) {
    const {
        ctx,
        text,
        config,
        fontSettings,
        sectionLabel,
        isStale
    } = args;

    const lines = text
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

    if (lines.length === 0) {
        return;
    }

    const sectionProfile = getAdjustmentProfileBySection(sectionLabel);
    const svgMarkup = buildVerticalSvgMarkup(lines, config, fontSettings, sectionProfile);
    const svgBlob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' });
    const objectUrl = URL.createObjectURL(svgBlob);
    const image = new Image();

    image.onload = () => {
        URL.revokeObjectURL(objectUrl);
        if (isStale()) {
            return;
        }
        ctx.drawImage(image, 0, 0);
    };

    image.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        if (isStale()) {
            return;
        }

        const glyphs = createVerticalLayout(text, {
            width: config.width,
            availableHeight: config.availableHeight,
            fontSize: config.fontSize,
            lineSpacing: config.lineSpacing,
            charSpacingRatio: config.charSpacingRatio,
            topMargin: config.topMargin
        }, sectionLabel, fontSettings);

        renderLayout(ctx, glyphs, config.fontSize, config.fontFace, config.color);
    };

    image.src = objectUrl;
}
