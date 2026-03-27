import { shouldShowLabel, snsLabels } from './font-adjustments.js';
import { wrapTextByWidth } from './text-layout.js';

function getFooterTexts(dom) {
    const footerParts = [];
    const author = dom.authorInput.value.trim();

    if (author) {
        footerParts.push(shouldShowLabel(dom, 'author') ? `作者: ${author}` : author);
    }

    dom.snsCheckboxes.forEach((checkbox) => {
        if (!checkbox.checked) {
            return;
        }

        const key = checkbox.dataset.sns;
        const input = dom.snsInputByKey[key];
        const account = input?.value.trim();

        if (account) {
            footerParts.push(shouldShowLabel(dom, key) ? `${snsLabels[key]}: ${account}` : account);
        }
    });

    return footerParts;
}

export function drawFooter(ctx, dom, width, height) {
    const footerParts = getFooterTexts(dom);

    if (footerParts.length === 0) {
        return 0;
    }

    const footerText = footerParts.join(' / ');
    const footerFontSize = Math.max(16, Math.round(Math.min(width, height) * 0.025));
    const footerPadding = Math.round(Math.min(width, height) * 0.04);
    const footerLineHeight = Math.round(footerFontSize * 1.45);
    const maxWidth = width - (footerPadding * 2);

    ctx.font = `${footerFontSize}px ${dom.fontSelect.value}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';

    const lines = wrapTextByWidth(ctx, footerText, maxWidth);
    const footerHeight = (lines.length * footerLineHeight) + footerPadding;
    const baseY = height - footerPadding;

    lines.forEach((line, index) => {
        const y = baseY - ((lines.length - 1 - index) * footerLineHeight);
        ctx.fillText(line, width / 2, y);
    });

    return footerHeight;
}

export function renderLayout(ctx, glyphs, fontSize, fontFace, color) {
    if (glyphs.length === 0) {
        return;
    }

    ctx.font = `${fontSize}px ${fontFace}`;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    glyphs.forEach((glyph) => {
        const drawX = glyph.x + glyph.offsetX;
        const drawY = glyph.y + glyph.offsetY;

        ctx.save();

        if (glyph.rotate !== 0 || glyph.scale !== 1) {
            ctx.translate(drawX, drawY);
            if (glyph.rotate !== 0) {
                ctx.rotate(glyph.rotate);
            }
            if (glyph.scale !== 1) {
                ctx.scale(glyph.scale, glyph.scale);
            }
            ctx.translate(-drawX, -drawY);
        }

        ctx.fillText(glyph.char, drawX, drawY);
        ctx.restore();
    });
}
