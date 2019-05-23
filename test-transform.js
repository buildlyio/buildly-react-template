const config = {
  babelrc: false,
  "presets": ["@babel/env", "@babel/preset-react"]
};

module.exports = require("babel-jest").createTransformer(config);
