var exec = require('child_process').exec;

var COLOR = {
  BLACK: '0;30',
  RED: '0;31',
  GREEN: '0;32',
  WATER: '1;36',
  GREY: '1;30',
  YELLOW: '1;33',
  BLUE: '0;34',
  L_BLUE: '1;34',
  L_PURPE: '1;35' 
};

function colorFont(text, color) {
  if(!color) {
    return text;
  }
  return '\033[' + color + 'm' + text + '\033[0m';
}

function run(command, echo = true) {
  return new Promise(function(resolve, reject) {
    if (echo) {
      console.log(colorFont('run: ', COLOR.L_BLUE), command);
    }
    exec(command, function(err, stdout, stderr){
      if(err) {
        console.log(stderr);
        reject(stderr);
      } else {
        console.log(stdout);
        resolve(stdout);
      }
    });
  });
}

module.exports = {
  COLOR,
  colorFont,
  run
};