const path = require('path');
const os = require('os');
const { exists, readFile, writeFile } = require('./fs');
const { backupFile } = require('./backup');

function renderTemplate(template, variables) {
  let output = template;
  for (const key of Object.keys(variables)) {
    output = output.replace(
      new RegExp(`{{${key}}}`, 'g'),
      variables[key]
    );
  }
  return output;
}

function writeProfileConfig(profileName, profile) {
  const homeDir = os.homedir();
  const filePath = path.join(homeDir, `.gitconfig-${profileName.toLowerCase()}`);

  if (exists(filePath)) {
    const backupPath = backupFile(filePath);
    console.log(`Backup created: ${backupPath}`);
  }

  const template = readFile(
    path.join(__dirname, '..', 'templates', 'gitconfig-profile')
  );

  const content = renderTemplate(template, {
    NAME: profile.name,
    EMAIL: profile.email
  });

  writeFile(filePath, content);
  return filePath;
}

module.exports = {
  writeProfileConfig
};
