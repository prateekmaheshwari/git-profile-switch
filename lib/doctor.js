const os = require('os');
const path = require('path');
const { exists, readFile } = require('./fs');
const { getGitEnvironment } = require('./git');
const { parse } = require('path');

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

function runDoctor() {
  console.log('\nGit Profile Switch — Doctor\n');

  const gitEnv = getGitEnvironment();

  if (!gitEnv.installed) {
    console.log('❌ Git is not installed or not available in PATH.');
    return;
  }

  console.log(`✔ Git detected (${gitEnv.version})`);

  const gitconfigPath = gitEnv.globalConfigPath;

  if (!exists(gitconfigPath)) {
    console.log('⚠ Global .gitconfig not found.');
    return;
  }

  console.log('✔ Global .gitconfig found');

  const configContent = readFile(gitconfigPath);
  const includes = parseIncludeIf(configContent);

  if (includes.length === 0) {
    console.log('⚠ No includeIf rules detected.');
    return;
  }

  console.log(`✔ Found ${includes.length} includeIf rule(s)\n`);

  for (const inc of includes) {
    const resolvedPath = inc.path.replace('~', os.homedir());
    const profileExists = exists(resolvedPath);

    console.log(`• Repo directory: ${inc.directory}/`);
    console.log(`  Profile file:  ${inc.path}`);

    if (!profileExists) {
      console.log('  ⚠ Profile file does not exist');
    } else {
      console.log('  ✔ Profile file exists');
    }

    console.log('');
  }

  console.log('Doctor check completed.\n');
}

module.exports = {
  runDoctor
};
