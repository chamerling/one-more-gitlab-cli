const axios = require('axios');
const querystring = require('querystring');

class Client {
  constructor(config) {
    this.config = config;
    this.axios = axios.create({
      baseURL: config.api,
      headers: {
        'PRIVATE-TOKEN': config.privateToken
      }
    });
  }

  searchProject(name) {
    return this.axios.get('/projects', {params: {search: name}}).then(result => result.data);
  }

  getProject(name) {
    return this.searchProject(name).then(projects => {
      const project = (projects || []).filter(p => !p.forked_from_project)[0];
        if (!project) {
          throw new Error(`No such gitlab project ${name}`);
        }
        return project;
    });
  }

  getIssues(query) {
    return this.axios.get(`/projects/${query.id}/issues`, {params: {search: query.search}}).then(result => result.data);
  }

  getIssue(query) {
    return this.axios.get(`/projects/${query.id}/issues`, {params: {iids: query.iids}}).then(result => result.data[0]);
  }

  getIssuesForProject({name, search = ''}) {
    return this.getProject(name).then(project => {
      return this.getIssues({id: project.id, search});
    });
  }

  getIssueForProject({name, id}) {
    return this.getProject(name).then(project => this.getIssue({id: project.id, iids: [id]}));
  }

  getMergeRequest(query) {
    // WARN: In v3 tests, the iids params does not work but iid does, this is why params are duplicated here. Will have to check on v4.
    return this.axios.get(`/projects/${query.id}/merge_requests`, {params: {iid: query.iids, iids: query.iids}}).then(result => result.data[0]);
  }

  getMergeRequestForProject({name, id}) {
    return this.getProject(name).then(project => this.getMergeRequest({id: project.id, iids: [id]}));
  }

  getMergeRequests(query) {
    return this.axios.get(`/projects/${query.id}/merge_requests`, { params: { state: query.state }}).then(result => result.data);
  }

  getMergeRequestsForProject({name, state}) {
    return this.getProject(name).then(project => this.getMergeRequests({id: project.id, state}));
  }

  createIssue(issue) {
    return this.axios.post(`/projects/${issue.id}/issues`, querystring.stringify({title: issue.title, description: issue.description})).then(result => result.data);
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
