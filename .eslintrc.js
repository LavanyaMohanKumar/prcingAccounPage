module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  parser: "vue-eslint-parser",
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
    parser: "@babel/eslint-parser",
    requireConfigFile: false,
  },
  globals: {
    Razorpay: "readonly",
  },
  extends: [
    "eslint:recommended",
    "plugin:vue/vue3-recommended",
  ],
  rules: {
    "vue/attributes-order": "off", 
    "vue/html-self-closing": "off",
    "vue/max-attributes-per-line": "off", 
    "vue/html-indent": "off", 
    "vue/singleline-html-element-content-newline": "off", 
    "vue/html-closing-bracket-newline": "off", 
  },
};
