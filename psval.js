#!/usr/bin/env node
const owasp = require('owasp-password-strength-test');
const readline = require('readline');

owasp.config({
  allowPassphrases       : true,
  maxLength              : 128,
  minLength              : 8,
  minPhraseLength        : 20,
  minOptionalTestsToPass : 4,
});

const BANNED_LIST = [
  'Welcome',
  'Welcome0',
  'welcome',
  'welcome0',
  'welc0me',
];

const BLANK = '\n'.repeat(process.stdout.rows)
// readline.cursorTo(process.stdout, 0, 0)
// readline.clearScreenDown(process.stdout)

const doShow = process.argv[2] !== 'hide';
let psw = '';
const checkPs = () => {
  let catStr = '\x1b[31mpoop\x1b[0m';
  const result =  owasp.test(psw);
  console.log(BLANK);
  if (result.strong) {
    catStr = '\x1b[32mGOOD enought\x1b[0m';
  } else {
    console.log(result.errors);
    console.log('-------------------------------------------------------------\x1b[K\r');
  }
  if (BANNED_LIST.includes(psw)) {
    catStr = '\x1b[31ma BIG STINKY HEAP OF POOP!!!\x1b[0m'
  }
  process.stdout.write(`> ${doShow ? `Password "${psw}"` : 'The password'} is ${catStr}.\x1b[K\r`);
};
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.on('keypress', (str, key) => {
  if (key.ctrl && key.name === 'c') {
    console.log();
    process.exit();
  } if (key.name === 'backspace') {
    psw = psw.slice(0, -1);
    checkPs();
  } else if (str) {
    psw = psw.concat(str);
    checkPs();
  }
});
console.log('Start entering a password...');