const yargs = require('yargs');
require('./update-notifier')();

yargs
  .strict()
  .usage('Usage: $0 <command> [options]')
  .commandDir('./commands')
  .demand(1, 'Please supply a valid command')
  .alias('help', 'h')
  .help('help')
  .version()
  .epilogue('for more information, go to https://github.com/chamerling/one-more-gitlab-cli')
  .example('$0 issue --help', 'show help of the issue command')
  .argv;
