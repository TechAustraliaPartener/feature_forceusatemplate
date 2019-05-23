# Decathlon USA Shopify Theme

## Table of Contents
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Project Setup](#project-setup)
- [Gulp Config](#gulp-config)
- [Watch](#watch)
- [Stylesheets](#stylesheets)
- [JavaScript](#javascript)
- [SVG Icons](#svg-icons)
- [Decathlon Patterns Submodule](#decathlon-patterns-submodule)
- [Persistent Cart (PC)](#persistent-cart-pc)
- [Local Deployment](#local-deployment)
- [Deployment via DeployBot](#deployment-via-deploybot)
- [Updating README Table of Contents](#updating-readme-table-of-contents)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Project Setup
1. Clone the project, making sure to also clone the `decathlonusa-patterns` submodule (which is checked out to the folder `/patterns` within the Shopify theme repo):
   - Optimally (on Git 2.13+ - check using `git --version`),
   ```
   git clone --recurse-submodules -j2 https://github.com/decathlon-usa/shopify-theme-decathlonusa.git
   ```
   - Alternatively (on older Git),
   ```
   git clone --recursive https://github.com/decathlon-usa/shopify-theme-decathlonusa.git
   ``` 
   - If you forgot the flags on first clone, run 
   ```
   git submodule update --init
   ```
   - After anyone has updated the `decathlonusa-patterns` submodule within this repo and committed that change to a branch of `shopify-theme-decathlonusa`, be sure to locally run 
   ```
   git submodule update
   ```
1. In Mac Terminal navigate to your project's root folder.
1. Make sure ThemeKit is installed. If it's not go to https://shopify.github.io/themekit/
    - The latest version of ThemeKit will not deploy any Shopify-generated files (e.g. `timber.js.liquid` → `timber.js`) failing the deploy. If you run into this challenge, downgrade ThemeKit after installing:
      ```
      theme update --version=0.8.2-prerelease
      ```
1. There should be a `config.yml.sample` in the root of the project. Duplicate this file and name it `config.yml`. This will have the default api information for Shopify. If you're working on a cloned theme because multiple developers are on the project, this is where you'd update your theme id. Make sure `config.yml` is not under version control.
1. Create a copy of the `.env.sample` file making sure to rename it to `.env`. Update the environment variables removing the sample values. Make sure the `.env` file is not under version control.
1. Type the command `npm install` and press enter. This will install all node dependencies for the project.
1. Type `npx gulp` and press enter. This will run all project gulp tasks and also ensure that all dependencies are installed properly. If a dependency does not exist you'll see an error in terminal. If you see this error, install the missing dependency by typing the command `npm install <package_name> --save-dev`. After this make sure to commit your `package.json` file so that the next user has the dependencies they need.

## Gulp Config
There is a file in the root directory called `gulp-config.json`. This file maintains the list of directories, stylesheets, sprites, and JavaScript files. All configuration for gulp should be here.

## Watch
Typing `npm run dev` will watch a variety of directories for changes and then perform the needed gulp task. In addition to running gulp watch it will also run Themekit. You must have Shopify Themekit installed locally and the project connected in order for this to work.

* If svgs are dropped into `src/svg/icons` sass and svg sprite will run.
* If changes are made to any files in the `src/scss/**` folder then the `gulp sass` task will run which generates the css file, combines the media queries, and then converts it into a `style.css.liquid` file.
* If changes are made to any file inside the `src/js/**` folder, `gulp uglify` will run which lints all JS files in that directory, concats and files that need it, and then minify all files.

## Stylesheets
In `gulp-config.json` is an array of stylesheets. Each item in the array should correlate with a `.scss` file in `src/scss/`. So for example if there's a node in the stylesheets array called "index", you'll need a file at `src/scss/index.scss` in order for that to generate a css file.

If you need sub scss modules to be included in your stylesheet, simply create a folder that matches the name in the array and the watch task will watch those directories for changes. For instance if you had a `_hero.scss` snippet that you wanted to only call in the `index.scss` file, you could place the file in `src/scss/index/` and include the path in your `index.scss` sheet. After that if `npm run dev` is active any changes to `index.scss` and any of the files in the index folder will trigger a compilation.

## JavaScript

### JavaScript optimization via Gulp

**Note:** Legacy Decathlon Shopify theme JavaScript is linted, concatenated and minified via Gulp tasks only. The following describes the setup:

In the gulp-config file there is a large JS object. This object maintains a list of files to concat and then minify. The structure for this is a top level key denotes the name of the file that will be generated by the concat and minify tasks. The value for this top level key is another object which lists all the files that need to be concatenated into a single JavaScript file. Each node within this sub object must include the name of the file without the **.js** extension, and the directory where the file resides.

While running `npm run dev` each file listed in this object will be watched for changes and only concatenate the block that's been changed, and then run through JSLint. Note that files inside the `src/js/plugins/` folder will not go through 
the JSLint task.

**@todo:** Are the JS and CSS Gulp tasks still relevant/used?

### JavaScript builds & optimization via Rollup

The following Decathlon USA JavaScript features are optimized and built by Rollup (see `scripts/build.js`):

- Persistent Cart
- Checkout
- Store Finder
- Product Page

The `scripts/` directory houses the source JavaScript files for these Rollup built features. Files named `index.js` in subdirectories of `scripts/` will be assumed to be bundle entry points. The output bundle will be transpiled from `scripts/<directory-name>/index.js` → `assets/built-<directory-name>.js` when `npm run build` is run. 

All `assets/built-<directory-name>.js` JavaScript files are Git-ignored.

You control whether or not files are optimized for production via the `NODE_ENV` environment variable in the `.env` file. Make sure the `NODE_ENV` environment variable is set to `production` for production DeployBot environments.

| Environment Variable | Description|
|----------------------|------------|
| `NODE_ENV` | Use `production` to optimize the JS builds; use `development` for local development/debugging |


## SVG Icons
There's a task in gulp to create an SVG icon sprite, and to update the src/scss/globals/\_*spritename* .scss file with the appropriate classes to call the icon. If you would like to add new icons do the following:

* To create new sprites add the name of your sprite to the gulp-config array under "sprites".
* Upload your svg icon to **/src/svg/*spritename*/** With spritename matching the name you placed in the array in gulp-config.
* Run the command **gulp sprites** in your root directory.
* To add your icon to a html document use the classes ** icon icon--*filename* **
* If you'd like to change the css that is output into **\_icons.scss** you do so by going to **src/scss/globals/mixins/_svg-template.scss**. The file is built using mustache templating.
* If you'd like to add additional sprites you can add them to createSprites object towards the top of the gulp file. The names you enter must match with the folder you create inside the SVG directory.
* While **npm run dev** is going dropping new svgs into the folder will update the sprite.

## Decathlon Patterns Submodule

The `decathlonusa-patterns` repository is a submodule (checked out under the path `patterns/`) of this Shopify theme repo.

**Important:** Any new `snippets/*` or `assets/*` files added to the Shopify theme repo should not be named using the `patterns-` prefix. Files named using a `patterns-` prefix will be deleted as part of the "[Updating Patterns Submodule](#updating-patterns-submodule)" flow described below.

__As a rule, avoid manually creating files with the prefix `patterns-`.__

### Updating Patterns Submodule

Do this any time updates were committed in the decathlon-patterns repo and merged into that repo's master branch.

The following happens when running the `updatePatterns` Gulp task:

- Images are copied from the `patterns/` submodule directory into the Shopify theme `assets/` directory and the filenames are prefixed with `patterns-`.
- HTML/SVG patterns are copied from the `patterns/` submodule directory into the Shopify theme `snippets/` directory and filenames are prefixed with `patterns-` as well.

Here are the steps followed to create this PR:

1. Enter the directory for the Shopify theme repo: `cd shopify-theme-decathlonusa`
1. Checkout the `cloudfour-dev` branch: `git checkout cloudfour-dev`
1. Make sure the branch is up-to-date: `git pull`
1. Checkout a new branch from there: `git checkout -b chore/update-patterns`
1. Update the patterns: `npx gulp updatePatterns`
1. Double-check that updated files appear correct (all begin with `patterns`): `git status`
1. Add modified and new files: `git add -A`
1. Commit the changes: `git commit -m "Update patterns to latest"`
1. Push to the remote: `git push -u origin chore/update-patterns`

## Persistent Cart (PC)

The Persistent Cart feature is a combination of client-side code and a server-side application with a database, that together do the following:

1. Create an association between a customer and a cart
1. Keep a customer tracking a specific cart by using a single cart token (ID) for as long as possible
1. Reconcile cart contents for a customer, combining cart contents from before they login with their persisted cart during logged-in session.
1. Rehydrate carts from the database if Shopify expires a cart a customer has been using
1. Listen to Shopify webhooks to keep up-to-date with cart contents as well as checkout events and customer deletions

### Building the client-side Persistent Cart JS

To properly build the client-side JS for Persistent Cart make sure to set the proper environment variable values for the specific environment in the `.env` file. 

For local development, use "staging" values. For staging/production (in the DeployBot environment `.env` files) use staging/production values per the environment. The `.env` file should have the following environment variables configured for a proper client-side Persistent Cart JS build:

| Environment Variable | Description|
|----------------------|------------|
| `NODE_ENV` | Use `production` to optimize the JS builds; use `development` for local development/debugging |
| `DECATHLON_PERSISTENT_CART_URL` | The Decathlon USA Persistent Cart Heroku app URL |
| `STOREFRONT_API_KEY` | The storefront API key used by Persistent Cart |

### Where can I find the Decathlon USA Persistent Cart Heroku app URL?

#### Staging URL

1. Log into https://dashboard.heroku.com/apps/persistent-cart-decathlonusa-s/settings
1. In the "**Domains and certificates**" section, look for the "**Domain**"

#### Production URL

1. Log into https://dashboard.heroku.com/apps/persistent-cart-decathlonusa-p/settings
1. In the "**Domains and certificates**" section, look for the "**Domain**"

### Where can I find the Storefront API key?

#### Staging API key

1. Log into https://testing-decathlon-usa.myshopify.com/admin/apps/private
1. Click into the "**CloudFour Persistent Cart**" private app
1. In the "**Storefront API**" section, look for the "**Storefront access token**"

#### Production API key

1. Log into https://decathlon-usa.myshopify.com/admin/apps/private
1. Click into the "**CloudFour Persistent Cart**" private app
1. In the "**Storefront API**" section, look for the "**Storefront access token**"

### Default Domains & API URLs

#### Production Default Domains & API URLs

Production Domains Default: `['www.decathlon.com']`

This can be overridden via a `PRODUCTION_DOMAINS` environment variable consisting of a comma-delimited list. Example:

```
PRODUCTION_DOMAINS='foo.com,bar.com' npm run build
```

Production API URL Default: `'https://persistent-cart-decathlonusa-p.herokuapp.com'`

This can be overridden via a `PRODUCTION_API_URL` environment. Example:

```
PRODUCTION_API_URL='foo.com' npm run build
```

#### Staging Default Domains & API URLs

Staging Domains Default: `['testing-decathlon-usa.myshopify.com']`

This can be overridden via a `STAGING_DOMAINS` environment variable consisting of a comma-delimited list. Example:

```
STAGING_DOMAINS='foo.com,bar.com' npm run build
```

Staging API URL Default: `'https://persistent-cart-decathlonusa-s.herokuapp.com'`

This can be overridden via a `STAGING_API_URL` environment. Example:

```
STAGING_API_URL='foo.com' npm run build
```

#### How are the default Domain & API URLs used?

There is a check for `window.location.hostname` to determine if the result is a "production" or "staging" domain. Based on that, the "production" or "staging" API URL will be used.

All of this logic can be overridden by using the `DECATHLON_PERSISTENT_CART_URL` environment variable as shown [above](#building-the-client-side-persistent-cart-js). The purpose of providing yet another PC App URL would be if you created a Heroku Review app, which may be setup/deployed any time a PR is made to `persistent-cart-decathlonusa`.

### Cypress tests

_Note:_ Cypress has been added to the project but no E2E tests have been written. The following documentation will be most helpful once tests are added to the project.

Cypress tests have been added to help test the Persistent Cart E2E flow.

#### Requirements

You will need a Decathlon user account to be able to add items to cart and store them in the Persistent Cart. You can create a user via the Shopify theme you are testing against.

#### Setup

Create a copy of the `.env.sample` file making sure to rename it to `.env`. Update the environment variables removing the sample values.

| Environment Variable | Description|
|----------------------|------------|
| `SHOPIFY_PREVIEW_URL` | The [Cypress base URL](https://docs.cypress.io/guides/references/best-practices.html#Setting-a-global-baseUrl) used by all tests. This should be a [Shopify Shared Preview URL](https://help.shopify.com/en/manual/using-themes/adding-themes#share-a-theme-preview-with-others). |
| `DEC_USERNAME` | The username for the Decathlon test account. |
| `DEC_PASSWORD` | The password for the Decathlon test account. |
| `DEC_ONE_SIZE_PRODUCT_PATH` | Some Persistent Cart tests need a product to test against. This sets the path to that product. The product must not require a size selection ("one-size" products only). See `.env.sample` file for example. |

### Cypress test dashboard

```
npm run cypress:open
```

## Local Deployment

1. Make sure your local `.env` file has the correct environment variables (see [Building the client-side Persistent Cart JS](#building-the-client-side-persistent-cart-js))

1. Build the files:
    ```
    npm run build
    ```

1. Deploy the files from your local machine to your Shopify theme via ThemeKit:
    ```
    theme deploy
    ```

It's a good practice to deploy your local files via ThemeKit as a reset. From there, you can use the [Watch](#watch) setup to continue updating your Shopify theme as you work locally.

## Deployment via DeployBot

This project follows modern development practices by implementing a [Continuous Delivery](https://www.atlassian.com/continuous-delivery/principles/continuous-integration-vs-delivery-vs-deployment) setup via DeployBot. The `staging` and agency-specific branches (e.g. `<agency-name>-dev`) are automatically deployed to Shopify themes by DeployBot. Any merges into these branches will trigger a new deployment to the appropriate Shopify themes.

The `master` branch is _not_ automatically deployed.

### Automated Builds

Automated builds have also been configured as part of the deployment via DeployBot.

This means `npm run build` is executed by DeployBot when a deployment is triggered. This allows built files to not be committed into the repository (see "[JavaScript builds & optimization via Rollup](#javascript-builds--optimization-via-rollup)"). 

### Configuring DeployBot Environment Automated Builds

DeployBot has ["getting started" guides](https://deploybot.com/guides-code-deployment-tools/getting-started-with-deploybot) and blog posts documenting [how to setup DeployBot environments](https://deploybot.com/blog/using-multiple-environments-to-improve-your-development-workflow). Refer to DeployBot docs as needed for general DeployBot environment setup.

In addition to general DeployBot environment setup, though, you'll also need to set up an automated build step for each new DeployBot environment.

This includes:

- [add a `.env` configuration file](#add-env-configuration-file)
- [set up the build command](#set-up-the-build-command)
- [set up and cache the build commands](#set-up-and-cache-build-commands)

<!-- <figure>
  <img src="https://user-images.githubusercontent.com/459757/56153146-55132180-5f6a-11e9-9c1b-057f4b0c30fe.png">
  <figcaption><em>Example DeployBot automated build configuration</em></figcaption>
</figure> -->

### Add `.env` Configuration File

Just as you have a local `.env` file for your environment variables, you will need to add a `.env` file to the DeployBot environment. This allows you to set up staging/production environment variable values specifically for each DeployBot environment.

- [Store and deploy configuration files through DeployBot](https://deploybot.com/blog/store-and-deploy-configuration-files-through-deploybot)

You can add a new `.env` configuration file via the "Configuration files" tab:

![Add configuration files](https://user-images.githubusercontent.com/459757/56154348-2d718880-5f6d-11e9-9bb6-329ff6f72512.png)

Then add the environment variables (see [Building the client-side Persistent Cart JS](#building-the-client-side-persistent-cart-js)):

![Add environment variables to the .env file](https://user-images.githubusercontent.com/459757/56154420-54c85580-5f6d-11e9-88c5-2274ce3e55c7.png)

### Set Up the Build Command

To allow DeployBot to automatically build source code, you tell it to run the `build` NPM task. Add the following in the **Compile, compress, or minimize your code** section:

```
npm run build
```

![DeployBot will build the source files and deploy them to your server automatically.](https://user-images.githubusercontent.com/459757/56155949-f309ea80-5f70-11e9-9761-3bcc91e525e2.png)

### Set Up and Cache Build Commands

To make the deploys more efficient, take advantage of cached build commands:

> Sometimes your build script needs to install certain dependencies in order to be executed. You can do that right in the build script field, but that means every time your code is deployed the dependencies will be installed again, making the build slower.
> 
> A better option is to use Cached build commands option in advanced settings. Any script placed in this field will be executed only when the following files changed in your repository: Gemfile, Gemfile.lock, package.json, gulpfile.js, Gruntfile.js, project.clj, composer.json.

- [Setting up and using Build Tools](https://support.deploybot.com/article/61-setting-up-and-using-build-tools)

Add the following commands under the **Advanced options** > **Cached build commands**:
```
nvm install
nvm use
npm ci
```

![Decathlon USA Shopify theme cached build commands](https://user-images.githubusercontent.com/459757/56155589-29933580-5f70-11e9-959c-b8104e39d05f.png)

Notice the commands include `nvm install` and `nvm use`. This works in combination with the `.nvmrc` file at the root of the project to ensure the right node versions are used by DeployBot when building the files.

## Updating README Table of Contents

The table of contents for this README was generated using [DocToc](https://github.com/thlorenz/doctoc). If new README sections are added and the table of contents needs to be updated, do not update manually, instead run the following command:

```
npx doctoc --maxlevel 2 README.md
```
