# Common packages

## Introduction
This repo stores the majority of the packages. It is organized as a monorepo with each individual integration packaged and deployed as their own modules.

## Getting Started
To start, please ensure you have the following installed on your local machine:

- [node](https://nodejs.org/en/)
- [lerna](https://lerna.js.org/)

#### Installing Node.js

- ##### Using NVM

  - ###### Installing NVM 
    
    Refer to [Installing NVM](https://github.com/creationix/nvm#install-script)

  - ###### Installing Node.js 12.18.0

    ```bash
      nvm install v12.18.0
    ```

#### Installing lerna.js

install lerna globally using below command.
```bash
npm install --global lerna
```

Once these pre-requisites are met, feel free to clone the repo locally and install the required dependencies:

```bash
git clone https://github.com/rahuljain840/yolobus_frontend.git && cd yolobus_frontend
```

Run the following command to install all the dependencies (including the symbolic links).
```bash
lerna clean // to clean node_modules folder in all child repo.
lerna bootstrap // to install node_modules in all child repo.
lerna link // to symlink dependencies together.
npm run build // to create dist of packages so that they can link together.
```

### Start project
Navigate to <b>yolobus-fe</b> `cd packages/yolobus-fe` folder and run
```
npm run dev
```

To start <b>tt-ui.mweb</b> run below command in that package directory.

```
npm run start
```

## Commands
**1. Add new npm package**
```
lerna add module_name --scope repo_name
```
by default package will install in all repos. to restrict installation use --scope.

**NOTE:** Adding new package will add npm in all packages node_module folder. But this make duplicate package in multiple location, hence increase in repo size. To solve this we have enabled hoisting of packages.
In lerna.json file we have added hoist: true flag with bootstrap command. 

After adding any package just run 
```
lerna bootstrap
```

**2. Delete node_modules**

To delete node_modules in all packages.
```
lerna clean
```

## [Conventional commits](https://www.conventionalcommits.org/en/v1.0.0/)
Conventional commits helps in generating change logs automatically when you create release of your changes. 
This convention dovetails with SemVer, by describing the features, fixes, and breaking changes made in commit messages.

Commits should have the following structure:
```
<type>[optional scope]: <description>

[optional body]

[optional footer]
```

Types of commit:
```
feat: Add a new feature to the codebase (MINOR in semantic versioning).
fix: Fix a bug (equivalent to a PATCH in Semantic Versioning).
docs: Documentation changes.
style: Code style change (semicolon, indentation...).
refactor: Refactor code without changing public API.
perf: Update code performances.
test: Add test to an existing feature.
chore: Update something without impacting the user (ex: bump a dependency in package.json).
```


## Create Release
- To authenticate with GitHub, create github token.

```Your GitHub authentication token (under Settings > Developer settings > Personal access tokens).```

- Login to github packages (NPM)

```
npm login --registry=https://npm.pkg.github.com [Login on npm]
username: <GIT Username>
pwd: <Github token>
email: <your email>
```

- Publish package to github packages (NPM)

```
lerna publish --graph-type all --no-git-tag-version --force-publish=*
```

> `--no-git-tag-version` is used if you dont want to push git tag and wants to bump version. 
> `--graph-type all` to show published changes

To check which packages has changes, run
```
lerna changed
```
