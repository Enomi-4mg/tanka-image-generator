import { getDomRefs } from './dom.js';
import { createState } from './state.js';
import {
    syncDetailInputsFromPreset,
    updateCanvasSize,
    updateLayoutModeUI,
    updateSettingsTabUI
} from './layout-settings.js';
import { setupUIEventListeners } from './ui-events.js';
import { createDrawTanka } from './tanka-renderer.js';

export function initApp() {
    const dom = getDomRefs();
    const state = createState();
    const drawTanka = createDrawTanka(dom, state);

    setupUIEventListeners(dom, state, drawTanka);

    document.fonts.ready.then(() => {
        const selectedSize = Array.from(dom.imageSizeRadios).find((radio) => radio.checked);
        if (selectedSize) {
            updateCanvasSize(dom, selectedSize.value);
        }
        syncDetailInputsFromPreset(dom);
        updateSettingsTabUI(dom, state);
        updateLayoutModeUI(dom, state);
        drawTanka();
    });
}
