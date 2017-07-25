const gitlab = require('node-gitlab');

class Client {
  constructor(config) {
    this.config = config;
    this.client = gitlab.createPromise({api: config.api, privateToken: config.privateToken});
  }

  getProject(name) {
    return this.client.projects.list({search: name}).then(projects => {
      const project = (projects || []).filter(p => !p.forked_from_project)[0];
        if (!project) {
          throw new Error(`No such gitlab project ${name}`);
        }
        return project;
    });
  }

  getIssues(query) {
    return this.client.issues.list(query);
  }

  getIssuesForProject({name, search = ''}) {
    return this.getProject(name).then(project => {
      return this.getIssues({id: project.id, search});
    });
  }

  createIssue(issue) {
    return this.client.issues.create(issue);
  }

  createIssueInProject(name, options) {
    const issue = {
      title: options.title
    };

    if (options.description) {
      issue.description = options.description;
    }

    return this.getProject(name).then(project => {
      issue.id = project.id;

      return this.createIssue(issue);
    });
  }
}

module.exports = Client;
