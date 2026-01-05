const os = require('os');
const path = require('path');
const { exists, readFile } = require('./fs');

function parseIncludeIf(configContent) {
  const lines = configContent.split('\n');
  const includes = [];

  let current = null;

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith('[includeIf')) {
      const match = trimmed.match(/gitdir:(.+?)\/"\]/);
      if (match) {
        current = { directory: match[1] };
      }
    } else if (current && trimmed.startsWith('path')) {
      const [, value] = trimmed.split('=');
      current.path = value.trim();
      includes.push(current);
      current = null;
    }
  }

  return includes;
}

function runStatus() {
  const homeDir = os.homedir();
  const gitconfigPath = path.join(homeDir, '.gitconfig');

  console.log('\nGit Profile Switch — Status\n');

  if (!exists(gitconfigPath)) {
    console.log('Global .gitconfig not found.');
    return;
  }

  const configContent = readFile(gitconfigPath);
  const includes = parseIncludeIf(configContent);

  if (includes.length === 0) {
    console.log('No profile-based configuration detected.');
    return;
  }

  console.log('Detected profile configurations:\n');

  for (const inc of includes) {
    const profileFile = inc.path.replace('~', homeDir);
    const profileExists = exists(profileFile);

    console.log(`• Repository directory: ${inc.directory}/`);
    console.log(`  Profile file:        ${inc.path}`);
    console.log(
      `  Profile file exists: ${profileExists ? 'Yes' : 'No'}\n`
    );
  }
}

module.exports = {
  runStatus
};
