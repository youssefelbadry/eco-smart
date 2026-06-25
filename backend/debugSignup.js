const { execute } = require('./dist/database/index');
const { onboardUser } = require('./dist/services/onboardingService');
(async () => {
  try {
    console.log('Testing signup insert');
    const result = await execute(
      'INSERT INTO users (name, email, password, remember_token, created_at, updated_at) VALUES (?, ?, ?, NULL, NOW(), NOW())',
      ['Test Debug 4', 'testdebug4@example.com', 'hashedpass'],
    );
    console.log('inserted user', result.insertId);
    await onboardUser(result.insertId);
    console.log('onboarding complete');
  } catch (err) {
    console.error('ERROR', err && err.message ? err.message : err);
    process.exit(1);
  }
})();
