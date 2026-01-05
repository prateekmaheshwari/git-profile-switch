#!/usr/bin/env node

const { Command } = require('commander');
const { runInit } = require('../lib/init');
const { runStatus } = require('../lib/status');


const program = new Command();

program
  .name('git-profile-switch')
  .description(
    'Set up profile-based Git identity (work / personal) using native Git configuration'
  )
  .version('0.1.0');

/**
 * init command
 */
program
  .command('init')
  .description('Initialize profile-based Git identity configuration')
  .action(async() => {
    await runInit();
  });

/**
 * doctor command
 */
program
  .command('doctor')
  .description('Verify and diagnose git-profile-switch configuration')
  .action(() => {
    console.log('doctor: not implemented yet');
  });

/**
 * status command
 */
program
  .command('status')
  .description('Show current profile-based Git configuration status')
  .action(() => {
    runStatus();
  });

program.parse(process.argv);
