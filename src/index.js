const fs = require('fs');
const path = require('path');
const commandsPath = path.resolve(path.join(__dirname, 'commands'));
const yargs = require('yargs');
require('./update-notifier')();

fs.readdir(commandsPath, (err, files) => {
  files.forEach(function(filename) {
    const filePath = path.join(commandsPath, filename);

    if (fs.statSync(filePath).isFile()) {
      const command = require('./commands/' + filename).command;

      yargs.command(command);
    }
  });

  yargs
    .usage('Usage: $0 <command> [options]')
    .demand(1, 'You need to specify a command')
    .help()
    .version()
    .epilogue('for more information, go to https://chamerling.github.io/one-more-gitlab-cli')
    .example('$0 issues --help', 'show help of the issues command')
    .argv;
});
