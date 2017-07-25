const Table = require('cli-table');
const {Client, getProjectConfiguration, constants} = require('../../lib');
const ora = require('ora');

module.exports = {
  command: 'list',
  desc: 'list issues',
  builder: {
    search: constants.options.search,
    name: constants.options.name
  },
  handler: argv => {
    const {search, name} = argv;
    const spinner = ora(`Looking at issues...`).start();

    getConfig(name)
      .then(searchIssues)
      .then(printIssues)
      .catch(err => spinner.fail(`Failed to get issues: ${err.message}`));

    function getConfig(name) {
      spinner.text = 'Getting project config...';
      return getProjectConfiguration(name).then(config => {
        if (!config) {
          throw new Error('No valid project configuration found');
        }

        return config;
      });
    }

    function searchIssues(config) {
      spinner.text = `Searching issues for ${name} project`;
      const client = new Client(config);
      
      return client.getIssuesForProject({name, search});
    }

    function printIssues(issues = []) {
      if (!issues.length) {
        return spinner.succeed('No issues');
      }

      spinner.succeed(`Displaying ${issues.length} issues`);

      const table = new Table({head: ['#', 'Title', 'By']});

      issues.forEach(issue => {
        table.push([`#${issue.iid}`, issue.title, `@${issue.author.username}`])
      });
      console.log(table.toString());
    }
  }
};

