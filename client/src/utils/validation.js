/**
 * Validates an email address.
 * @param {string} email
 * @returns {boolean}
 */
export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validates a password.
 * Must be at least 6 characters long.
 * @param {string} password
 * @returns {boolean}
 */
export const validatePassword = (password) => {
    return password && password.length >= 6;
};

/**
 * Validates a username.
 * Must be alphanumeric (underscores allowed) and at least 3 characters long.
 * @param {string} username
 * @returns {boolean}
 */
export const validateUsername = (username) => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;
    return usernameRegex.test(username);
};

/**
 * Validates a file size and type.
 * @param {File} file
 * @param {number} maxSizeMB
 * @param {string[]} allowedTypes
 * @returns {string|null} Error message or null if valid.
 */
export const validateFile = (file, maxSizeMB, allowedTypes = []) => {
    if (!file) return null;

    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
        return `File size exceeds ${maxSizeMB}MB limit.`;
    }

    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
        // Check for wildcard types like 'image/*' or 'video/*'
        const isAllowed = allowedTypes.some(type => {
            if (type.endsWith('/*')) {
                const baseType = type.split('/')[0];
                return file.type.startsWith(`${baseType}/`);
            }
            return file.type === type;
        });

        if (!isAllowed) {
            return `Invalid file type. Allowed: ${allowedTypes.join(", ")}`;
        }
    }

    return null;
};
