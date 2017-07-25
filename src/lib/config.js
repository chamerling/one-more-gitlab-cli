const gitConfig = require('git-config');

module.exports = {
  getGitConfig
};

function getGitConfig() {
  return new Promise((resolve, reject) => {
    gitConfig((err, config) => {
      if (err) {
        return reject(err);
      }

      resolve(config);
    });
  });
}