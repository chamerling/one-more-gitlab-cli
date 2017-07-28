const { Client, getProjectConfiguration, constants } = require('../../lib');
const ora = require('ora');
const opn = require('opn');

module.exports = {
  command: 'create',
  desc: 'create a new issue',
  builder: {
    name: constants.options.name,
    title: {
      alias: 't',
      describe: 'Title of the issue',
      type: 'string',
      demandOption: true
    },
    description: {
      alias: 'd',
      describe: 'Description of the issue',
      type: 'string'
    },
    open: {
      alias: 'o',
      describe: 'Open the issue on the browser once created',
      type: 'boolean',
      default: false
    }
  },
  handler: argv => {
    const { name, title, description, open } = argv;
    const spinner = ora(`Creating issue ${title}`).start();

    getConfig()
      .then(createIssue)
      .then(printIssue)
      .then(issue => (open ? opn(issue.web_url, { wait: false }) : ''))
      .catch(err => spinner.fail(`Failed to create issue: ${err.message}`));

    function getConfig() {
      spinner.text = 'Getting project config...';
      return getProjectConfiguration(name).then(config => {
        if (!config) {
          throw new Error('No valid project configuration found');
        }

        return config;
      });
    }

    function createIssue(config) {
      spinner.text = `Creating issue in ${config.name} project`;
      const client = new Client(config);

      return client.createIssueInProject(config.name, { title, description });
    }

    function printIssue(issue) {
      spinner.succeed(`The issue #${issue.id} is available at ${issue.web_url}`);
    }
  }
};
