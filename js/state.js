export function createState() {
    return {
        layoutMode: 'preset',
        settingsTabMode: 'tanka',
        renderRequestId: 0,
        initialAutoCenter: true
    };
}

export function nextRenderRequestId(state) {
    state.renderRequestId += 1;
    return state.renderRequestId;
}
