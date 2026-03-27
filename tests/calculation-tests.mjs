import assert from 'node:assert/strict';

import { getPresetLayoutConfig } from '../js/layout-settings.js';
import { calculateVerticalBlockMetrics, createVerticalLayout } from '../js/text-layout.js';
import { getAdjustmentProfileBySection, getGlyphAdjustment } from '../js/font-adjustments.js';

function testPresetLayoutConfig() {
    const config = getPresetLayoutConfig('multiline', 960, 1280);
    assert.equal(config.fontSize, 50);
    assert.equal(config.lineSpacing, 84);
    assert.equal(config.topMargin, 128);
    assert.equal(config.charSpacingRatio, 1.1);
}

function testMetricsWithTopMargin() {
    const lines = ['あいう', 'かき'];
    const config = {
        width: 960,
        availableHeight: 1200,
        fontSize: 50,
        lineSpacing: 84,
        charSpacingRatio: 1.1,
        topMargin: 120
    };

    const metrics = calculateVerticalBlockMetrics(lines, config);
    assert.equal(metrics.startY, 120);
    assert.equal(metrics.rightMostX, 497);
    assert.equal(metrics.blockWidth, 134);
    assert.equal(metrics.blockHeight, 160);
}

function testMetricsWithoutMargins() {
    const lines = ['ああ', 'いい'];
    const config = {
        width: 960,
        availableHeight: 1200,
        fontSize: 50,
        lineSpacing: 84,
        charSpacingRatio: 1.1
    };

    const metrics = calculateVerticalBlockMetrics(lines, config);
    assert.equal(metrics.startY, 547.5);
    assert.equal(metrics.rightMostX, 497);
}

function testGlyphAdjustmentRotation() {
    const section = getAdjustmentProfileBySection('明朝・セリフ系');
    const fontSettings = { offsetXRatio: 0, offsetYRatio: 0, scale: 1 };
    const adjusted = getGlyphAdjustment('ー', 50, section, fontSettings);

    assert.ok(adjusted.rotate > 0);
    assert.equal(adjusted.scale, 1);
}

function testVerticalLayoutCentersHorizontally() {
    const glyphs = createVerticalLayout('あ\nい', {
        width: 960,
        availableHeight: 1200,
        fontSize: 50,
        lineSpacing: 84,
        charSpacingRatio: 1.1,
        topMargin: 140
    }, 'ゴシック・サンセリフ系', { offsetXRatio: 0, offsetYRatio: 0, scale: 1 });

    assert.equal(glyphs.length, 2);
    assert.equal(glyphs[0].x, 497);
    assert.equal(glyphs[0].y, 140);
    assert.equal(glyphs[1].x, 413);
    assert.equal(glyphs[1].y, 140);
}

function run() {
    testPresetLayoutConfig();
    testMetricsWithTopMargin();
    testMetricsWithoutMargins();
    testGlyphAdjustmentRotation();
    testVerticalLayoutCentersHorizontally();
    console.log('All calculation tests passed.');
}

run();
