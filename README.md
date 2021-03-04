# report-service

Report service using carbone.io and nodejs

## Linux

### Prerequisite

- Libre office headless
- Node js
- Yarn

### Development

1. Rename .env.example to .env

- HookTokenURL is API endpoint POST to validate token, when value is empty middleware auth is disabled
- ReportDirectory is base folder report for /template for templates report and /output generated reports, default is "./"

2. Yarn install to install all dependencies
3. Command

- `yarn lint` Check lint codes
- `yarn dev` Build and Running development mode with hot reload codes
- `yarn build` Build codes fro `src` and output inside `dist`
- `yarn start` Running builded report service from `dist`
- `yarn test` Running unit tests
