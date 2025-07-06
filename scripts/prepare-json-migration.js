"use strict";

const fs = require('fs');
const path = require('path');

// 1. First, restore the schema to use String/Text fields instead of Json
console.log('Reverting schema to use String/Text fields temporarily...');

const tempSchemaPath = path.join(__dirname, '..', 'prisma', 'schema.temp.prisma');
const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
const backupPath = path.join(__dirname, '..', 'prisma', 'schema.backup.prisma');

// Backup current schema
fs.copyFileSync(schemaPath, backupPath);
console.log('Current schema backed up to schema.backup.prisma');

// Copy temp schema to main schema location
fs.copyFileSync(tempSchemaPath, schemaPath);
console.log('Temporary schema installed');

console.log('\nMigration Strategy:');
console.log('1. Deploy your application with this updated code');
console.log('2. After successful deployment, run the data migration script locally:');
console.log('   npm run migrate:json');
console.log('3. Once data is migrated, update the schema to use Json fields:');
console.log('   npx prisma db push');

console.log('\nThis approach avoids JSON parsing errors during deployment while still allowing you to use the new JSON structure in your code.');
