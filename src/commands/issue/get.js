const Table = require('cli-table');
const {Client, getProjectConfiguration, constants} = require('../../lib');
const ora = require('ora');

module.exports = {
  command: 'get',
  desc: 'get issue',
  builder: {
    id: {
      alias: 'i',
      describe: 'Issue ID',
      type: 'number',
      demandOption: true
    },
    name: constants.options.name
  },
  handler: argv => {
    const {id, name} = argv;
    const spinner = ora(`Looking at issue...`).start();

    getConfig(name)
      .then(getIssue)
      .then(printIssue)
      .catch(err => spinner.fail(`Failed to get issue: ${err.message}`));

    function getConfig(name) {
      spinner.text = 'Getting project config...';
      return getProjectConfiguration(name).then(config => {
        if (!config) {
          throw new Error('No valid project configuration found');
        }

        return config;
      });
    }

    function getIssue(config) {
      spinner.text = `Getting issue #${id} for ${config.name} project`;
      const client = new Client(config);
      
      return client.getIssueForProject({id, name: config.name});
    }

    function printIssue(issue) {
      if (!issue) {
        return spinner.fail(`Issue #${id} not found`);
      }

      spinner.stop();
      console.log(`#${issue.iid} (${issue.state}) - ${issue.title}`);
      console.log();
      console.log(issue.description);
      console.log();
      console.log(issue.assignee ? `Assigned to @${issue.assignee.username}` : 'Not assigned');
      console.log(`Created by @${issue.author.username} on ${issue.created_at}, updated on ${issue.updated_at}`);
    }
  }
};

