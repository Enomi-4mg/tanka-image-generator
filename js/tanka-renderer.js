import { getLayoutConfig, getRenderMode } from './layout-settings.js';
import { getFontSpecificSettings, getSelectedFontSection } from './font-adjustments.js';
import { createVerticalLayout } from './text-layout.js';
import { drawFooter, renderLayout } from './canvas-renderer.js';
import { renderSvgVerticalLayout } from './svg-renderer.js';
import { nextRenderRequestId } from './state.js';

export function createDrawTanka(dom, state) {
    return function drawTanka() {
        const requestId = nextRenderRequestId(state);
        const width = dom.canvas.width;
        const height = dom.canvas.height;

        dom.ctx.fillStyle = dom.bgColor.value;
        dom.ctx.fillRect(0, 0, width, height);

        const {
            fontSize,
            lineSpacing,
            charSpacingRatio,
            topMargin
        } = getLayoutConfig(dom, state);

        const shouldAutoCenter = state.initialAutoCenter && state.layoutMode === 'preset';
        const effectiveTopMargin = shouldAutoCenter ? null : topMargin;
        state.initialAutoCenter = false;

        dom.ctx.fillStyle = dom.textColor.value;
        const reservedFooterHeight = drawFooter(dom.ctx, dom, width, height);

        const availableHeight = Math.max(height - reservedFooterHeight, fontSize);
        const fontSettings = getFontSpecificSettings(dom);
        const sectionLabel = getSelectedFontSection(dom);
        const renderConfig = {
            width,
            height,
            availableHeight,
            fontSize,
            lineSpacing,
            charSpacingRatio,
            topMargin: effectiveTopMargin,
            fontFace: dom.fontSelect.value,
            color: dom.textColor.value
        };

        if (getRenderMode(dom) === 'svg') {
            renderSvgVerticalLayout({
                ctx: dom.ctx,
                text: dom.tankaInput.value,
                config: renderConfig,
                fontSettings,
                sectionLabel,
                isStale: () => requestId !== state.renderRequestId
            });
            return;
        }

        const glyphs = createVerticalLayout(dom.tankaInput.value, {
            width,
            availableHeight,
            fontSize,
            lineSpacing,
            charSpacingRatio,
            topMargin: effectiveTopMargin
        }, sectionLabel, fontSettings);

        if (glyphs.length === 0) {
            return;
        }

        renderLayout(dom.ctx, glyphs, fontSize, dom.fontSelect.value, dom.textColor.value);
    };
}
