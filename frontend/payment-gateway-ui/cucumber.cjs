module.exports = {
  default: {
    import: [
      'e2e/features/support/**/*.ts',
      'e2e/features/step_definitions/**/*.ts',
    ],
    paths: ['e2e/features/**/*.feature'],
    format: ['@serenity-js/cucumber'],
    formatOptions: { specDirectory: 'e2e/features' },
    tags: 'not @gap',
  },
}
