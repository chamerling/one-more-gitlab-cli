const {Client, getProjectConfiguration, constants} = require('../../lib');
const ora = require('ora');

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
    }
  },
  handler: argv => {
    const { name, title, description } = argv;
    const spinner = ora(`Creating issue ${title}`).start();

    getConfig(name)
      .then(createIssue)
      .then(printIssue)
      .catch(err => spinner.fail(`Failed to create issue: ${err.message}`));

     function getConfig(name) {
      spinner.text = 'Getting project config...';
      return getProjectConfiguration(name).then(config => {
        if (!config) {
          throw new Error('No valid project configuration found');
        }

        return config;
      });
    }

    function createIssue(config) {
      spinner.text = `Creating issue in ${name} project`;
      const client = new Client(config);
      
      return client.createIssueInProject(name, {title, description});
    }

    function printIssue(issue) {
      spinner.succeed(`The issue #${issue.id} is available at ${issue.web_url}`);
    }
  }
};
