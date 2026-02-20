/**
 * Utility helpers for formatting
 */

/**
 * Formats a number as Colombian Peso (COP)
 * Example: 1500000 => "$1.500.000"
 */
export const formatCOP = (amount) => {
    const num = Number(amount) || 0;
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(num);
};

/**
 * Formats a date string to a legible Spanish format
 */
export const formatDate = (dateStr) => {
    if (!dateStr) return '--';
    return new Date(dateStr).toLocaleString('es-CO', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

/**
 * Formats a date string to time only
 */
export const formatTime = (dateStr) => {
    if (!dateStr) return '--';
    return new Date(dateStr).toLocaleTimeString('es-CO', {
        hour: '2-digit',
        minute: '2-digit',
    });
};
