const Client = require('./client');
const constants = require('./constants');
const conf = require('./config');
const format = require('./format');
const gitOrigin = require('git-remote-origin-url');
const gitUrlParse = require('git-url-parse');

module.exports = {
  format,
  constants,
  getProjectConfiguration,
  Client
};

function getGitlabConfig() {
  return conf.getGitConfig().then(config => {
    if (!config.gitlab || !config.gitlab.url || !config.gitlab.token) {
      console.log('Not configured, please add gitlab.url and gitlab.token to your git configuration');
      console.log('Check https://github.com/chamerling/one-more-gitlab-cli/blob/master/README.md#configure for more details');
      throw new Error('Not configured');
    }
    return { url: config.gitlab.url, token: config.gitlab.token };
  });
}

function getCurrentProject() {
  return gitOrigin()
    .then(origin => {
      const parsed = gitUrlParse(origin);

      if (!parsed || !parsed.name) {
        throw new Error('Can not find local project from git origin, specify project with --name option');
      }

      return parsed.name;
    });
}

function getProjectConfiguration(name) {
  return getGitlabConfig()
    .then(config => getProjectName(name)
      .then(projectName => ({
        name: projectName,
        url: config.url,
        privateToken: config.token
      })));
}

function getProjectName(name) {
  return name ? Promise.resolve(name) : getCurrentProject();
}
