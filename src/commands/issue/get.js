const { Client, getProjectConfiguration, constants, format } = require('../../lib');
const ora = require('ora');
const opn = require('opn');

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
    open: {
      alias: 'o',
      describe: 'Open the issue on the browser',
      type: 'boolean',
      default: false
    },
    name: constants.options.name
  },
  handler: argv => {
    const { id, name, open } = argv;
    const spinner = ora('Looking at issue...').start();

    getConfig()
      .then(getIssue)
      .then(printIssue)
      .then(issue => (open ? opn(issue.web_url, { wait: false }) : ''))
      .catch(err => spinner.fail(`Failed to get issue: ${err.message}`));

    function getConfig() {
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

      return client.getIssueForProject({ id, name: config.name });
    }

    function printIssue(issue) {
      if (!issue) {
        return spinner.fail(`Issue #${id} not found`);
      }

      spinner.stop();

      const text = format.issueAsText(issue);
      const meta = [format.getState(issue.state), '•', issue.assignee ? `Assigned to @${issue.assignee.username}` : 'Not assigned'].join(' ');

      console.log([text, meta].join('\n'));

      return issue;
    }
  }
};

