module.exports = {
  verbose: true,
  moduleNameMapper: {
    "\\.(css|scss)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/fileMock.js",
    "\\.(svg)$": "<rootDir>/__mocks__/svgMock.js",
    "^root(.*)$": "<rootDir>$1",
    "^assets(.*)$": "<rootDir>/static/build$1",
    "^theme(.*)$": "<rootDir>/app/theme$1",
    "^containers(.*)$": "<rootDir>/app/containers$1",
    "^components(.*)$": "<rootDir>/app/components$1",
    "^reducers(.*)$": "<rootDir>/app/reducers$1",
    "^actions(.*)$": "<rootDir>/app/actions$1",
    "^helpers(.*)$": "<rootDir>/app/helpers$1",
    "^utils(.*)$": "<rootDir>/app/utils$1",
    "^constants(.*)$": "<rootDir>/app/constants$1",
    "^appConfig(.*)$": "<rootDir>/config$1",
    "^app(.*)$": "<rootDir>/app$1",
    "^modules(.*)$": "<rootDir>/app-v2/modules$1",
    "^screens(.*)$": "<rootDir>/app-v2/screens$1",
    "^middlewares(.*)$": "<rootDir>/middlewares$1"
  },
  transform: {
    "^.+\\.js?$": "babel-jest"
  },
  transformIgnorePatterns: [
    "!node_modules/react-runtime",
    "<rootDir>/node_modules"
  ],
  "globals": {
    "__CLIENT__": true,
    "__SERVER__": false,
    "__PRODUCTION__": false,
    "__DEVELOPMENT__": true,
    "__DEVTOOLS__": true
  },
  "testEnvironment": "jsdom",
  "reporters": [
    "default",
    ["./node_modules/jest-html-reporter", {
        "pageTitle": "Test Report"
    }]
  ]
};
