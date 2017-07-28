const chalk = require('chalk');
const truncate = require('truncate');
const moment = require('moment');
const emoji = require('node-emoji');

module.exports = {
  centerText,
  getState,
  issueAsText,
  mrAsText
};

function issueAsText(issue, truncateLength) {
  return [
    chalk.bold(`#${issue.iid} • ${issue.title}`),
    chalk.gray(truncateLength ? truncate(issue.description, truncateLength, { ellipsis: '...' }) : issue.description),
    (`Created ${moment(issue.created_at).fromNow()} by @${issue.author.username}, updated ${moment(issue.updated_at).fromNow()}`)
  ].join('\n');
}

function mrAsText(mr, truncateLength) {
  return [
    chalk.bold(`#${mr.iid} • ${mr.title}`),
    chalk.gray(truncateLength ? truncate(mr.description, truncateLength, { ellipsis: '...' }) : mr.description),
    /* eslint max-len: "off" */
    (`Created ${moment(mr.created_at).fromNow()} by @${mr.author.username}, updated ${moment(mr.updated_at).fromNow()} • ${mr.user_notes_count || 0} ${emoji.get('speech_balloon')}  ${mr.upvotes || 0} ${emoji.get('thumbsup')}`)
  ].join('\n');
}

function getState(state) {
  const s = state.replace(/\b\w/g, l => l.toUpperCase());
  return (s === 'Opened' ? chalk.bgGreen(s) : chalk.bgRed(s));
}

function centerText(text) {
  return { hAlign: 'center', vAlign: 'center', content: text };
}
