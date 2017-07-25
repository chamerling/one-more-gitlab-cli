module.exports = {
  options: {
    name: {
      alias: 'n',
      describe: 'The gitlab project. If not defined, it will try to run in the current folder project',
      type: 'string'
    },
    search: {
      alias: 's',
      describe: 'Search term',
      type: 'string'
    }
  }
};
