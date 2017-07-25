# one-more-gitlab-cli

One more [GitLab](https://about.gitlab.com/) CLI, because other ones do not fit my needs...

## Use

### Install

```
npm install --global one-more-gitlab-cli
#or
yarn add global one-more-gitlab-cli
```

### Use

For now, it just focues on issues, more resource support to come...

```
gitlab --help
```

```
Usage: gitlab <command> [options]

Commands:
  issue  Issues Management

Options:
  --help     Show help                                                 [boolean]
  --version  Show version number                                       [boolean]

Examples:
  bin/gitlab issue --help  show help of the issue command

for more information, go to https://chamerling.github.io/one-more-gitlab-cli
```

![Issues list](https://media.giphy.com/media/ygtpaB19qgoVi/giphy.gif)

## Configure

You can configure the CLI globally or locally per project. To authenticate the user, it uses a gitlab token you can find on your gitlab profile account (https://your-server-url/profile/account). Just copy/paste the `Private Token`.

### Global configuration

```
git config --global gitlab.url    "http://your-server-url"
git config --global gitlab.token  "your-token"
```

### Local configuration

**WARN: Not implemented for now!**

In the repository of your choice:

```
git config gitlab.url   "http://your-server-url"
git config gitlab.token "your-token"
```

## License

MIT