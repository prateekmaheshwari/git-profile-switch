const fs = require('fs');
const path = require('path');

/**
 * Check whether a file or directory exists
 */
function exists(filePath) {
    try {
        fs.accessSync(filePath);
        return true;
    } catch (err) {
        return false;
    }
}

/**
 * Reads a file safely (utf-8)
 * returns null if file does not exist or error occurs
 */
function readFile(filePath) {
    if(!exists(filePath)) {
            return null;
        }
    try {
        return fs.readFileSync(filePath, 'utf-8');
    } catch (err) {
        return null;
    }
}

/**
 * Writes file safely
 * Creates parent directories if needed
 */
function writeFile(filePath, content) {
    try {
        const dir = path.dirname(filePath);
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(filePath, content, 'utf-8');
    } catch (err) {
        return null;
    }
}

/**
 * Appends content to a file safely
 * Creates file if does not exist
 */
function appendFile(filePath, content) {
    try {
        const dir = path.dirname(filePath);
        fs.mkdirSync(dir, { recursive: true });
        fs.appendFileSync(filePath, content, 'utf-8');
    } catch (err) {
        return null;
    }
}

/**
 * Get absolute path (resolves ~ and relative paths)
 */
function resolvePath(inputPath) {
    if(!inputPath) {
        return inputPath;
    }
    if (inputPath.startsWith('~')) {
        return path.join(require('os').homedir(), inputPath.slice(1));
    }
    return path.resolve(inputPath);
}

module.exports = {
    exists,
    readFile,
    writeFile,
    appendFile,
    resolvePath
};