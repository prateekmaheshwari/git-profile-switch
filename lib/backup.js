const path = require('path');
const fs = require('fs');
const { exists, readFile, writeFile } = require('./fs');

/**
 * Generate a timestamp safe for filenames
 * Example: 2026-01-05T14-32-10
 */
function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

/**
 * Create a backup of a file if it exists
 * Returns backup file path or null if no backup created
 */
function backupFile(filePath) {
  if (!exists(filePath)) {
    return null;
  }

  const dir = path.dirname(filePath);
  const base = path.basename(filePath);

  const backupPath = path.join(
    dir,
    `${base}.backup.${timestamp()}`
  );

  const content = readFile(filePath);
  writeFile(backupPath, content);

  return backupPath;
}

module.exports = {
  backupFile
};
