const sanitizeInput = (input) => (typeof input === 'string' ? input.replace(/[<>&"']/g, '').trim() : '');
const formatPrice = (price) => `${price.toLocaleString('vi-VN')} VNĐ`;
const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};
const safeGetStorage = (key, defaultValue = null) => {
    try {
        const value = localStorage.getItem(key) || sessionStorage.getItem(key);
        return value ? JSON.parse(value) : defaultValue;
    } catch {
        return defaultValue;
    }
};
const safeSetStorage = (key, value, rememberMe = false) => {
    try {
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.error(`Storage error: ${e.message}`);
    }
};
const generateCSRFToken = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
});

let toastQueue = [];
function showToast(message, type = 'bg-green-600') {
    toastQueue.push({ message: sanitizeInput(message), type });
    if (toastQueue.length === 1) displayNextToast();
}
function displayNextToast() {
    if (!toastQueue.length) return;
    const { message, type } = toastQueue[0];
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.className = `toast ${type} text-white px-4 py-2 rounded-lg fixed bottom-4 right-4 z-50 shadow-lg`;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.remove();
        toastQueue.shift();
        displayNextToast();
    }, 3000);
}