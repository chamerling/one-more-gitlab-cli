const Client = require('./client');
const constants = require('./constants');
const conf = require('./config');

module.exports = {
  constants,
  getProjectConfiguration,
  Client
};

function getGitlabConfig() {
  return conf.getGitConfig().then(config => {
    if (!config.gitlab || !config.gitlab.url || !config.gitlab.token) {
      console.log('Not configured, please add gitlab.url and gitlab.token to your git configuration');
      console.log('Check https://github.com/chamerling/one-more-gitlab-cli/blob/master/README.md#configure for more details');
      throw new Error('Not configured');
    }
    return {url: config.gitlab.url, token: config.gitlab.token};
  });
}

function getCurrentProject() {
  return Promise.reject(new Error('Can not find local project (well, not implemented for now...), specify project with --name option'));
}

function getProjectConfiguration(name) {
  return getGitlabConfig()
    .then(config => {
      return getProjectName(name).then(name => {
        return {
          name,
          api: config.url + '/api/v3',
          privateToken: config.token
        };
      }); 
    });
}

function getProjectName(name) {
  return name ? Promise.resolve(name) : getCurrentProject();
}
