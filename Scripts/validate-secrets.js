#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Load schema
const schemaPath = path.join(__dirname, '..', 'config', 'secrets.schema.json');
const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'));

// Load .env.example if present
let envExample = {};
const envPath = path.join(__dirname, '..', '.env.example');
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf-8').split(/\r?\n/);
  for (const line of lines) {
    if (!line || line.startsWith('#')) continue;
    const [key, val] = line.split('=');
    envExample[key.trim()] = val || '';
  }
}

// Validate against schema
let missing = [];
for (const key of schema.required) {
  if (!(key in envExample)) {
    missing.push(key);
  }
}

if (missing.length > 0) {
  console.error('❌ Secrets missing in .env.example:', missing.join(', '));
  process.exit(1);
} else {
  console.log('✅ All required secrets present in .env.example');
}
