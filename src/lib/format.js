const chalk = require('chalk');
const truncate = require('truncate');
const moment = require('moment');

module.exports = {
  getState,
  issueAsText
};

function issueAsText(issue, truncateLength) {
  return [
    chalk.bold(`#${issue.iid} • ${issue.title}`),
    chalk.gray(truncateLength ? truncate(issue.description, truncateLength, { ellipsis: '...' }) : issue.description),
    (`Created ${moment(issue.created_at).fromNow()} by @${issue.author.username}, updated ${moment(issue.updated_at).fromNow()}`),
  ].join('\n');
}

function getState(state) {
  state = state.replace(/\b\w/g, l => l.toUpperCase());
  return (state === 'Opened' ? chalk.bgGreen(state) : chalk.bgRed(state));
}
