/**
 * Paystack Payment Utility
 * Handles the initialization and callback flow for premium features.
 */

export const initializePaystack = ({ email, amount, metadata, onSuccess, onClose }) => {
    // In a real app, this would use the Paystack Inline JS
    // We'll simulate the script loading if not present
    const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_mock_key'; // Fallback for MVP

    if (!window.PaystackPop) {
        console.error('Paystack SDK not loaded. Ensure the script is included in index.html');
        // Simple fallback/mock for development if script fails
        const mockConfirm = confirm(`[TEST MODE] Pay $${(amount / 100).toFixed(2)} for Elite Audit?`);
        if (mockConfirm) {
            onSuccess({ reference: 'REF-' + Date.now() });
        } else {
            onClose();
        }
        return;
    }

    const handler = window.PaystackPop.setup({
        key: publicKey,
        email: email,
        amount: amount, // in kobo/cents
        currency: 'NGN', // Defaulting to NGN given Paystack's primary market, but can be USD
        metadata: metadata,
        callback: (response) => {
            onSuccess(response);
        },
        onClose: () => {
            onClose();
        },
    });

    handler.openIframe();
};
