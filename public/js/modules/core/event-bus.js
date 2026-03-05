export function createEventBus(target = window) {
    return {
        emit(eventName, detail = {}) {
            target.dispatchEvent(new CustomEvent(eventName, { detail }));
        },
        on(eventName, handler) {
            target.addEventListener(eventName, handler);
            return () => target.removeEventListener(eventName, handler);
        }
    };
}
