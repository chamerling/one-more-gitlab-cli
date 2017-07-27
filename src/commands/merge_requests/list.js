const Table = require('cli-table2');
const {Client, getProjectConfiguration, constants} = require('../../lib');
const ora = require('ora');

module.exports = {
  command: 'list',
  desc: 'list merge requests',
  builder: {
    state: {
      alias: 's',
      describe: 'MR State',
      type: 'string',
      default: 'opened'
    },
    name: constants.options.name
  },
  handler: argv => {
    const {state, name} = argv;
    const spinner = ora(`Looking at merge requests...`).start();

    getConfig(name)
      .then(searchMergeRequests)
      .then(printMergeRequests)
      .catch(err => spinner.fail(`Failed to get merge requests: ${err.message}`));

    function getConfig(name) {
      spinner.text = 'Getting project config...';
      return getProjectConfiguration(name).then(config => {
        if (!config) {
          throw new Error('No valid project configuration found');
        }

        return config;
      });
    }

    function searchMergeRequests(config) {
      spinner.text = `Searching merge requests for ${config.name} project`;
      const client = new Client(config);
      
      return client.getMergeRequestsForProject({name: config.name, state});
    }

    function printMergeRequests(mrs = []) {
      if (!mrs.length) {
        return spinner.succeed('No merge requests');
      }

      spinner.succeed(`Displaying ${mrs.length} merge requests`);

      const table = new Table({head: ['#', 'Title', 'By', 'State']});

      mrs.forEach(mr => {
        table.push([`#${mr.iid}`, mr.title, `@${mr.author.username}`, mr.state])
      });
      console.log(table.toString());
    }
  }
};

