const {Client, getProjectConfiguration, constants, format} = require('../../lib');
const ora = require('ora');
const chalk = require('chalk');
const opn = require('opn');

module.exports = {
  command: 'get',
  desc: 'get mr',
  builder: {
    id: {
      alias: 'i',
      describe: 'MR ID',
      type: 'number',
      demandOption: true
    },
    open: {
      alias: 'o',
      describe: 'Open the MR on the browser',
      type: 'boolean',
      default: false
    },
    name: constants.options.name
  },
  handler: argv => {
    const {id, name, open} = argv;
    const spinner = ora(`Looking for MR...`).start();

    getConfig(name)
      .then(getMR)
      .then(printMR)
      .then(issue => open ? opn(issue.web_url, { wait: false }) : '')
      .catch(err => spinner.fail(`Failed to get MR: ${err.message}`));

    function getConfig(name) {
      spinner.text = 'Getting project config...';
      return getProjectConfiguration(name).then(config => {
        if (!config) {
          throw new Error('No valid project configuration found');
        }

        return config;
      });
    }

    function getMR(config) {
      spinner.text = `Getting MR #${id} for ${config.name} project`;
      const client = new Client(config);
      
      return client.getMergeRequestForProject({id, name: config.name});
    }

    function printMR(mr) {
      if (!mr) {
        return spinner.fail(`MR #${id} not found`);
      }

      spinner.stop();
      console.log([format.mrAsText(mr), format.getState(mr.state)].join('\n'));

      return mr;
    }
  }
};

