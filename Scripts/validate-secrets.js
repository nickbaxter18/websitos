#!/usr/bin/env node

const fs = require('fs');

try {
  const schema = require('../config/secrets.schema.json');
  const missing = [];

  schema.required.forEach((secret) => {
    if (!process.env[secret]) {
      missing.push(secret);
    }
  });

  if (missing.length > 0) {
    console.error(`❌ Missing required secrets: ${missing.join(', ')}`);
    process.exit(1);
  }

  console.log('✅ All required secrets are present.');
} catch (err) {
  console.error('❌ Secrets validation failed:', err);
  process.exit(1);
}