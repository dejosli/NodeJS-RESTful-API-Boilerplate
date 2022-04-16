# NodeJS RESTful API Boilerplate

This is a production-ready skeleton for building RESTful APIs in Node.JS using Express and MongoDB.
The skeleton has many built-in features, such as authentication using JWT, request validation, unit and integration tests, continuous integration, API documentation, etc. For more details, please check the features list below.

## Features

- **NoSQL database**: [MongoDB](https://www.mongodb.com) object data modeling using [Mongoose](https://mongoosejs.com)
- **Authentication and authorization**: using [JWT](https://github.com/auth0/node-jsonwebtoken) and [Passport](http://www.passportjs.org)
- **Two-factor authentication**: using [Speakeasy](https://github.com/speakeasyjs/speakeasy)
- **Validation**: request data validation using [Express Validator](https://github.com/express-validator/express-validator) and environment vars validation with [Joi](https://github.com/hapijs/joi)
- **Files uploading**: using [Multer](https://github.com/expressjs/multer)
- **Email sending**: using [Nodemailer](https://nodemailer.com/about/)
- **SMS sending**: using [Twilio](https://github.com/twilio/twilio-node)
- **Logging**: using [Winston](https://github.com/winstonjs/winston) and [Morgan](https://github.com/expressjs/morgan)
- **Testing**: unit and integration tests using [Jest](https://jestjs.io) and [SuperTest](https://github.com/visionmedia/supertest) and mocks with [node-mocks-http](https://www.npmjs.com/package/node-mocks-http)
- **Error handling**: centralized error handling mechanism
- **API documentation**: with [swagger-jsdoc](https://github.com/Surnet/swagger-jsdoc) and [swagger-ui-express](https://github.com/scottie1984/swagger-ui-express) `or` with [Postman](https://www.postman.com/) and [docgen](https://github.com/thedevsaddam/docgen)
- **Process management**: advanced production process management using [PM2](https://pm2.keymetrics.io)
- **Dependency management**: with [Yarn](https://yarnpkg.com)
- **Environment variables**: using [dotenv](https://github.com/motdotla/dotenv)
- **Security**: set security HTTP headers using [Helmet](https://helmetjs.github.io)
- **Sanitizing**: sanitize request data against xss and query injection
- **CORS**: Cross-Origin Resource-Sharing enabled using [Cors](https://github.com/expressjs/cors)
- **Compression**: gzip compression with [Compression](https://github.com/expressjs/compression)
- **CI**: continuous integration with [Github actions](https://travis-ci.org)
- **Code coverage**: using [Coveralls](https://coveralls.io)
- **Git hooks**: with [Husky](https://github.com/typicode/husky) and [Lint-staged](https://github.com/okonet/lint-staged)
- **Git commit**: with Conventional commit messages using [Commitizen](https://github.com/commitizen/cz-cli)
- **Linting**: with [ESLint](https://eslint.org) and [Prettier](https://prettier.io)
- **Editor config**: consistent editor configuration using [EditorConfig](https://editorconfig.org)

## Requirements

- [Node.js v16.14.2+](https://nodejs.org/en/)
- [Yarn v1.22.18+](https://classic.yarnpkg.com/en/docs/getting-started)
- [MongoDB v4.4.1+](https://www.mongodb.com/try/download/compass)
- Install Node.js using [Node Version Manager](https://github.com/nvm-sh/nvm#install--update-script)

## Quick Start

### Clone the repo and make it yours

```bash
git clone https://github.com/dejosli/NodeJS-RESTful-API-Boilerplate.git
cd NodeJS-RESTful-API-Boilerplate
rm -rf .git
```

### Install Yarn

```bash
npm install -g yarn # if yarn is not installed
```

### Install dependencies

```bash
yarn install
or
yarn install --frozen-lockfile # recommended
```

### Set environment variables

```bash
cp .env.example .env

# open .env and modify the environment variables (if needed)
```

## Folder Structure

```bash
src
│   index.js
│
├───api
│   ├───controllers
│   │   └───tests
│   ├───docs
│   ├───lib
│   │   └───tests
│   ├───middleware
│   ├───models
│   │   └───plugins
│   ├───routes
│   │   └───v1
│   ├───services
│   │   └───tests
│   ├───utils
│   │   └───tests
│   ├───validators
│   │   └───tests
│   └───workers
├───config
├───core
└───tests
```

## How to Run

### Running Locally

```bash
yarn dev
```

### Running in Production

```bash
yarn start
```

## Response Format

### Success Response

```json
{
  "success": true,
  "code": 200,
  "message": "Success Response Message",
  "data": {}
}
```

### Error Response

```json
{
  "success": false,
  "code": 400,
  "message": "Error Response Message",
  "errors": [
    {
      "field": "phoneNumber",
      "message": "Phone number already exists for another user."
    }
  ]
}
```

## Commands

### Linting

Linting is done using [ESLint](https://eslint.org/) and [Prettier](https://prettier.io).

```bash
# lint code with ESLint
yarn lint

# try to fix ESLint errors
yarn lint:fix

# style code with Prettier
yarn prettier

# try to fix Prettier errors
yarn prettier:fix
```

In this project, ESLint is configured to follow the [Airbnb JavaScript style guide](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb-base) with some modifications. It also extends [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier) and [eslint-plugin-security](https://github.com/nodesecurity/eslint-plugin-security) to turn off all rules that are unnecessary or might conflict with Prettier.

To modify the ESLint configuration, update the `.eslintrc.json` file. To modify the Prettier configuration, update the `.prettierrc.json` file.

To prevent a certain file or directory from being linted, add it to `.eslintignore` and `.prettierignore`.

To maintain a consistent coding style across different IDEs, the project contains `.editorconfig`

### Testing

```bash
# run all tests
yarn test

# run all tests in watch mode
yarn test:watch

# run test coverage
yarn test:coverage

# run test coverage with coveralls
yarn test:coveralls
```

### Conventional Commits

```bash
# add all changes to staged
git add .

# run for conventional commits message
yarn commit
```

### Husky Install

```bash
yarn prepare
```

## List of things that need to be done

- [ ] Test the utilities
- [ ] Test the libraries
- [ ] Test the validators
- [ ] Test the middleware
- [ ] Test the services
- [ ] Test the controllers
- [ ] Test the API's endpoints

## Inspirations

- [hagopj13/node-express-boilerplate](https://github.com/hagopj13/node-express-boilerplate)
- [danielfsousa/express-rest-es2017-boilerplate](https://github.com/danielfsousa/express-rest-es2017-boilerplate)
- [diegohaz/rest](https://github.com/diegohaz/rest)
- [maitraysuthar/rest-api-nodejs-mongodb](https://github.com/maitraysuthar/rest-api-nodejs-mongodb)
- [madhums/node-express-mongoose](https://github.com/madhums/node-express-mongoose)
- [kunalkapadia/express-mongoose-es6-rest-api](https://github.com/kunalkapadia/express-mongoose-es6-rest-api)

## Bugs or improvements

Every project needs improvements, Feel free to report any bugs or improvements. Pull requests are always welcome.

## License

Open-sourced software licensed under the [MIT License](LICENSE)
