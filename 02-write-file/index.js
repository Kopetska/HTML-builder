const fs = require('fs');
const path = require('path');

const output = fs.createWriteStream(path.join(__dirname, 'notes.txt'), 'utf-8');
process.stdout.write('Hello! Please enter text\n');

function exit() {
  process.stdout.write('Goodbye!');
  process.exit();
}

process.stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') {
    exit();
  } else {
    output.write(data);
  }
});

process.on('SIGINT', () => {
  exit();
});
