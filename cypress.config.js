const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://automation-engineer-test.onrender.com",

    setupNodeEvents(on, config) {
    },
  },
});
