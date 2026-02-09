#!/usr/bin/env node

// Simple script to create a doctor account
// Usage: npm run create-doctor -- --email=doctor@hospital.com --name="Dr. John" --password=secure123 --phone="+1-555-1234"

import fetch from 'node-fetch';

const args = process.argv.slice(2);
const adminKey = process.env.ADMIN_KEY || 'admin-secret-key-change-in-production';
const baseUrl = process.env.API_URL || 'http://localhost:4000';

interface DoctorData {
  adminKey: string;
  email?: string;
  name?: string;
  password?: string;
  phone?: string;
}

const parseArgs = () => {
  const data: DoctorData = { adminKey };

  args.forEach((arg) => {
    if (arg.startsWith('--email=')) {
      data.email = arg.replace('--email=', '');
    } else if (arg.startsWith('--name=')) {
      data.name = arg.replace('--name=', '');
    } else if (arg.startsWith('--password=')) {
      data.password = arg.replace('--password=', '');
    } else if (arg.startsWith('--phone=')) {
      data.phone = arg.replace('--phone=', '');
    }
  });

  return data;
};

const createDoctor = async () => {
  const data = parseArgs();

  if (!data.email || !data.password) {
    console.error('❌ Error: --email and --password are required');
    console.log('Usage: npm run create-doctor -- --email=EMAIL --password=PASSWORD [--name=NAME] [--phone=PHONE]');
    process.exit(1);
  }

  try {
    console.log(`📝 Creating doctor: ${data.email}...`);
    const response = await fetch(`${baseUrl}/api/auth/create-doctor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = (await response.json()) as any;

    if (!response.ok) {
      console.error(`❌ Error: ${result.error}`);
      process.exit(1);
    }

    console.log('✅ Doctor created successfully!');
    console.log(`📧 Email: ${result.data.email}`);
    console.log(`👤 Name: ${result.data.name}`);
    console.log(`📱 Phone: ${result.data.phone}`);
    console.log(`🔐 Role: ${result.data.role}`);
    console.log(`\n🎫 Auth Token (save for testing):`);
    console.log(result.token);
  } catch (err) {
    console.error('❌ Error:', (err as Error).message);
    process.exit(1);
  }
};

createDoctor();
