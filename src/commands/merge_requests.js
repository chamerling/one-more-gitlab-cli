const command = {
  command: 'mr',
  desc: 'Merge Requests Management',
  builder: yargs => yargs.commandDir('merge_requests').demandCommand(1, 'Please specify a subcommand'),
  handler: () => {}
};

module.exports = command;
