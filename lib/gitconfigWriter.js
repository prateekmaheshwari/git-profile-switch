const os = require('os');
const path = require('path');
const { exists, readFile, appendFile } = require('./fs');
const { backupFile } = require('./backup');

function buildIncludeBlock(directory, profileFile) {
  return `
[includeIf "gitdir:${directory}/"]
  path = ${profileFile}
`;
}

function alreadyConfigured(configContent, directory) {
  return configContent.includes(`gitdir:${directory}/`);
}

function updateGlobalGitConfig(workDir, personalDir) {
  const homeDir = os.homedir();
  const gitconfigPath = path.join(homeDir, '.gitconfig');

  if (!exists(gitconfigPath)) {
    // Create empty gitconfig if it doesn't exist
    appendFile(gitconfigPath, '');
  }

  const configContent = readFile(gitconfigPath);

  backupFile(gitconfigPath);

  let blocksToAppend = '';

  if (!alreadyConfigured(configContent, workDir)) {
    blocksToAppend += buildIncludeBlock(
      workDir,
      '~/.gitconfig-work'
    );
  }

  if (!alreadyConfigured(configContent, personalDir)) {
    blocksToAppend += buildIncludeBlock(
      personalDir,
      '~/.gitconfig-personal'
    );
  }

  if (!blocksToAppend.trim()) {
    return { updated: false };
  }

  appendFile(gitconfigPath, blocksToAppend);
  return { updated: true, blocksToAppend };
}

module.exports = {
  updateGlobalGitConfig
};
