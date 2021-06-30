# OSLO Validator 2.0

![Build status](https://github.com/informatievlaanderen/OSLO-Validator-EU/actions/workflows/ci.yml/badge.svg)

## Packages

In this repository, 2 packages are present:

### oslo-itb-rdf-validator

This package contains the configuration of the ISA ITB RDF Validator which is used as backend to validate data. It is dockerized, so spinning up the Dockerfile should be the only thing that is required in this package.

**Note**: be sure that the correct path is set in the configuration file (`config.json`) of the frontend package

### oslo-vue-frontend

This package contains the frontend that was built on top of the backend, in Vue.js using the Flemish style guide. In order to install this package, one does need an NPM token that is valid in the private npm registry that contains the Flemish styled components. There are two ways to install the dependencies

1) Set the NPM token as an environment variable with the name **NPM_AUTH_TOKEN**
2) Delete the content of the file `.npmrc`, but that requires you to log into npm in this directory

Then, execute the command `npm install` and all dependencies including the components from the private npm registry will be installed.

#### Compiles and hot-reloads for development
```
npm run serve
```

#### Compiles and minifies for production
```
npm run build
```
