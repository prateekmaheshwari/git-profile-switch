const inquirer = require('inquirer');
const path = require('path');
const os = require('os');
const { resolvePath } = require('./fs');
const { updateGlobalGitConfig } = require('./gitconfigWriter');


function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function promptForProfile(label) {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: `${label} Git name:`,
      validate: input => input.trim() !== '' || 'Name cannot be empty'
    },
    {
      type: 'input',
      name: 'email',
      message: `${label} Git email:`,
      validate: input =>
        isValidEmail(input) || 'Please enter a valid email address'
    },
    {
      type: 'input',
      name: 'directory',
      message: `${label} repositories directory (e.g. ~/code/${label.toLowerCase()}):`,
      validate: input => input.trim() !== '' || 'Directory cannot be empty'
    }
  ]);

  return {
    name: answers.name.trim(),
    email: answers.email.trim(),
    directory: resolvePath(answers.directory.trim())
  };
}

async function runInit() {
  console.log('\nGit Profile Switch – Interactive Setup (dry run)\n');

  const workProfile = await promptForProfile('Work');
  const personalProfile = await promptForProfile('Personal');

  console.log('\nPreview of configuration:\n');

  console.log('Work Profile');
  console.log('  Name:      ', workProfile.name);
  console.log('  Email:     ', workProfile.email);
  console.log('  Directory: ', workProfile.directory);

  console.log('\nPersonal Profile');
  console.log('  Name:      ', personalProfile.name);
  console.log('  Email:     ', personalProfile.email);
  console.log('  Directory: ', personalProfile.directory);

  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: '\nProceed with this configuration?',
      default: false
    }
  ]);

  if (!confirm) {
    console.log('\nAborted. No changes were made.\n');
    return;
  }

  const { writeProfileConfig } = require('./profileWriter');

  console.log('\nWriting profile configuration files...\n');

  const workPath = writeProfileConfig('work', workProfile);
  console.log(`Created: ${workPath}`);

  const personalPath = writeProfileConfig('personal', personalProfile);
  console.log(`Created: ${personalPath}`);

  console.log('\nProfile config files created successfully.');
  
  console.log('\nUpdating global .gitconfig...\n');

  const result = updateGlobalGitConfig(
    workProfile.directory,
    personalProfile.directory
  );

  if (!result.updated) {
    console.log('Global .gitconfig already configured. No changes made.');
  } else {
    console.log('Global .gitconfig updated with includeIf rules.');
    console.log('\nAdded configuration:\n');
    console.log(result.blocksToAppend);
  }
}

module.exports = {
  runInit
};
