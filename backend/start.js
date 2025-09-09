#!/usr/bin/env node

/**
 * This is a script to run both the server and data generator concurrently.
 * It uses Node.js child_process to spawn both processes.
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('Starting VoltGuard Server & Data Generator...');

// Function to spawn a process and handle its output
function spawnProcess(command, args, name) {
  const proc = spawn(command, args, {
    stdio: 'pipe',
    shell: true
  });

  // Add prefix to distinguish logs
  const prefix = `[${name}] `;

  proc.stdout.on('data', (data) => {
    const lines = data.toString().trim().split('\n');
    lines.forEach(line => {
      console.log(`${prefix}${line}`);
    });
  });

  proc.stderr.on('data', (data) => {
    const lines = data.toString().trim().split('\n');
    lines.forEach(line => {
      console.error(`${prefix}${line}`);
    });
  });

  proc.on('close', (code) => {
    console.log(`${prefix}Process exited with code ${code}`);
  });

  return proc;
}

// Start the main server
const server = spawnProcess('node', ['server.js'], 'SERVER');

// Wait 3 seconds before starting the data generator to ensure the server is ready
setTimeout(() => {
  const generator = spawnProcess('node', ['dataGenerator.js'], 'DATA-GEN');
  
  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\nShutting down all processes...');
    server.kill('SIGINT');
    generator.kill('SIGINT');
    process.exit(0);
  });
}, 3000);

console.log('✅ Both processes started. Press Ctrl+C to stop.');
