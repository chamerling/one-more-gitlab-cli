const updateNotifier = require('update-notifier');
const pkg = require('../package.json');

module.exports = () => {
  const notifier = updateNotifier({ pkg });

  if (notifier.update) {
    notifier.notify();
  }

  return notifier;
};
