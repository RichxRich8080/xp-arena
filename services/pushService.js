const webpush = require('web-push');

// Configure web-push with your VAPID keys
// These keys must be set in your .env file
if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
    webpush.setVapidDetails(
        'mailto:support@xp-arena.com',
        process.env.VAPID_PUBLIC_KEY,
        process.env.VAPID_PRIVATE_KEY
    );
} else {
    console.warn("⚠️ VAPID keys not configured in .env! Push notifications will not work.");
}

/**
 * Sends a push notification to a specified subscription.
 * @param {Object} subscription - The push subscription object from the client.
 * @param {Object} payload - The payload to send (title, body, icon, url, etc.).
 * @returns {Promise} Resolves when sent, rejects on error.
 */
const sendNotification = async (subscription, payload) => {
    try {
        const payloadString = JSON.stringify({
            title: payload.title || 'XP Arena',
            body: payload.body || '',
            icon: payload.icon || '/assets/images/logo.png',
            data: payload.data || { url: '/' }
        });

        await webpush.sendNotification(subscription, payloadString);
        return { success: true };
    } catch (error) {
        console.error('Error sending push notification:', error);

        // Return structured error to allow removing stale subscriptions
        if (error.statusCode === 410 || error.statusCode === 404) {
            return { success: false, stale: true };
        }

        return { success: false, error: error.message };
    }
};

module.exports = {
    sendNotification,
    webpush
};
