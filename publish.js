var exec = require('child_process').exec;
var path = require('path');
var argv = process.argv;
var os = require('os');
var platform = os.platform(); // darwin linux win32

var COLOR = {
  RED: '31',
  GREEN: '32',
  WATER: '36'
};

function colorFont(text, color){
  return '\033[;' + color + 'm' + text + '\033[0m';
}

function run(command, echo = true) {
  return new Promise(function(resolve, reject) {
    if (echo) {
      console.log(colorFont('run: ', COLOR.WATER), command);
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

var runBeforePublish;
if(argv[2] === 'ok') {
  runBeforePublish = run('npx babel src --out-dir '+ path.resolve(__dirname, "lib"))
  .then((stdout) => {
    return run('git add .');
  })
  .then((stdout) => {
    var message = argv[3];
    message = message === undefined ? new Date().toString().replace(/\s+/g,'-') : message;
    return run("git commit -m '" + message + "'");
  })
  .then((stdout) => {
    return run("git push");
  });
} else {
  runBeforePublish = Promise.resolve();
}

runBeforePublish
.then(function() {
  return run('npm publish --registry=https://registry.npmjs.org');
})
.then(function() {
  console.log(colorFont('publish done!', COLOR.GREEN));
  if (platform === 'win32') {
    setTimeout(function() {
      return run('exit', false);
    }, 3000);
  }
})
.catch(function(err) {
  console.log(colorFont('publish error!', COLOR.RED));
});
