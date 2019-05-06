var exec = require('child_process').exec;
var path = require('path');
var argv = process.argv;

var COLOR = {
  RED: '31',
  GREEN: '32',
  WATER: '36'
};

function colorFont(text, color){
  return '\033[;' + color + 'm' + text + '\033[0m';
}

function run(command) {
  return new Promise(function(resolve, reject) {
    console.log(colorFont('run: ',COLOR.WATER), command);
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

var publishError = false;

var runBeforePublish;
if(argv[2] === 'ok') {
  runBeforePublish = run('npx babel src --out-dir '+ path.resolve(__dirname, "lib"))
  .then((stdout) => {
    return run('git add .');
  }).then((stdout) => {
    return run("git commit -m 'naraku'");
  }).then((stdout) => {
    return run("git push");
  });
} else {
  runBeforePublish = Promise.resolve();
}

runBeforePublish
.then(function() {
  return run('npm config set registry https://registry.npmjs.org');
})
.then(function() {
  return run('npm publish');
})
.catch(function(err) {
  publishError = true;
})
.then(function() {
  return run('npm config set registry https://registry.npm.taobao.org');
})
.then(function() {
  if(publishError){
      console.log(colorFont('npm publish error!', COLOR.RED));
  } else {
      console.log(colorFont('npm publish done!', COLOR.GREEN));
  }
});
