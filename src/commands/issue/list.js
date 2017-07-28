const Table = require('cli-table2');
const { Client, getProjectConfiguration, constants, format } = require('../../lib');
const ora = require('ora');

module.exports = {
  command: 'list',
  desc: 'list issues',
  builder: {
    search: constants.options.search,
    name: constants.options.name
  },
  handler: argv => {
    const { search, name } = argv;
    const spinner = ora('Looking at issues...').start();

    getConfig()
      .then(searchIssues)
      .then(printIssues)
      .catch(err => spinner.fail(`Failed to get issues: ${err.message}`));

    function getConfig() {
      spinner.text = 'Getting project config...';
      return getProjectConfiguration(name).then(config => {
        if (!config) {
          throw new Error('No valid project configuration found');
        }

        return config;
      });
    }

    function searchIssues(config) {
      spinner.text = `Searching issues for ${config.name} project`;
      const client = new Client(config);

      return client.getIssuesForProject({ name: config.name, search });
    }

    function printIssues(issues = []) {
      if (!issues.length) {
        return spinner.succeed('No issues');
      }

      spinner.succeed(`Displaying ${issues.length} issues`);

      const table = new Table({ head: ['Summary', 'State', 'Assigned to'] });

      issues.forEach(issue => table.push([
        format.issueAsText(issue, 80),
        format.centerText(format.getState(issue.state)),
        format.centerText(issue.assignee ? `@${issue.assignee.username}` : '')
      ]));
      console.log(table.toString());

      return table;
    }
  }
};

