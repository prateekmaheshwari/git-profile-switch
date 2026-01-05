const {execSync} = require('child_process');
const path = require('path');
const os = require('os');
const {exists, readFile, writeFile} = require('./fs');

/**
 * Check if git is installed on the system
 */
function isGitInstalled() {
  try {
    execSync('git --version', { stdio: 'ignore' });
    return true;
  } catch (err) {
    return false;
  }
}

/**
 * Get git version string
 * Example: git version 2.39.3
 */
function getGitVersion() {
  if (!isGitInstalled()) return null;
  try {
    return execSync('git --version', { encoding: 'utf-8' }).trim();
  } catch (err) {
    return null;
  }
}

/**
 * Get global git config path
 * Usually ~/.gitconfig
 */
function getGlobalGitConfigPath() {
  if (!isGitInstalled()) return null;
  try {
    const homeDir = os.homedir();
    const configPath = path.join(homeDir, '.gitconfig');
    return exists(configPath) ? configPath : configPath;
  } catch (err) {
    return null;
  }
}

/**
 * Read-only summary of git environment
 */
function getGitEnvironment() {
  return {
    installed: isGitInstalled(),
    version: getGitVersion(),
    globalConfigPath: getGlobalGitConfigPath()
  };
}

module.exports = {
  isGitInstalled,
  getGitVersion,
  getGlobalGitConfigPath,
  getGitEnvironment
};