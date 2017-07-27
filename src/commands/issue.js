const command = {
  command: 'issue',
  desc: 'Issues Management',
  builder: yargs => yargs.commandDir('issue').demandCommand(1, 'Please specify a subcommand'),
  handler: () => {}
};

module.exports = command;
