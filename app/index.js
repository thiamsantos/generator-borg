const Generator = require('yeoman-generator')
const slugify = require('@sindresorhus/slugify')
const isScoped = require('is-scoped')
const superb = require('superb')
const normalizeUrl = require('normalize-url')
const humanizeUrl = require('humanize-url')
const camelCase = require('camelcase')

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts)
  }

  init() {
    return this.prompt([
      {
        name: 'moduleName',
        message: 'What do you want to name your module?',
        default: slugify(this.appname),
        filter: name => (isScoped(name) ? name : slugify(name))
      },
      {
        name: 'moduleDescription',
        message: 'What is your module description?',
        default: `My ${superb()} module`
      },
      {
        name: 'githubUsername',
        message: 'What is your GitHub username?',
        store: true,
        validate: x => (x.length > 0 ? true : 'You have to provide a username')
      },
      {
        name: 'website',
        message: 'What is the URL of your website?',
        store: true,
        validate: x =>
          x.length > 0 ? true : 'You have to provide a website URL',
        filter: x => normalizeUrl(x)
      }
    ]).then(props => {
      const assigns = {
        moduleName: props.moduleName,
        moduleDescription: props.moduleDescription,
        camelModuleName: camelCase(props.moduleName),
        githubUsername: props.githubUsername,
        name: this.user.git.name(),
        email: this.user.git.email(),
        website: props.website,
        humanizedWebsite: humanizeUrl(props.website)
      }

      this.fs.copyTpl(
        [`${this.templatePath()}/**`],
        this.destinationPath(),
        assigns,
        {},
        {globOptions: {dot: true}}
      )
    })
  }

  git() {
    this.spawnCommandSync('git', ['init'])
  }

  install() {
    this.npmInstall()
  }
}
