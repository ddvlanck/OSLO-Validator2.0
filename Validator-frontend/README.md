# oslo-validator2.0

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

To deploy the validator on data.vlaanderen.be 3 variables in env have to configured:
```
VUE_APP_FRONTEND_PATH=/shacl-validator
VUE_APP_BACKEND_PATH=/shacl-validator-backend
VUE_APP_HOSTNAME_URL=http://data.dev-vlaanderen.be
```

This file is copied by the Dockerfile configuration into build process.
