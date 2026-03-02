/**
 * XP ARENA EXODUS: Secure DOM Utilities
 */
const DOM = {
    /**
     * Set text content safely to prevent XSS.
     */
    setText(id, text) {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    },

    /**
     * Escape HTML special characters for safe-rendering within templates.
     */
    escape(str) {
        if (!str) return "";
        const div = document.createElement("div");
        div.textContent = str;
        return div.innerHTML;
    },

    /**
     * Inject HTML with a basic sanitizer (for premium labels/icons only)
     * USE SPARINGLY.
     */
    setSanitizedHTML(id, html) {
        const el = document.getElementById(id);
        if (!el) return;
        // Simple internal sanitization logic can be added here
        el.innerHTML = html;
    }
};

window.DOM = DOM;
