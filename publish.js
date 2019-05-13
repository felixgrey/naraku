var exec = require('child_process').exec;
var path = require('path');
var {COLOR, colorFont, run} = require('./tools');
var argv = process.argv;
// var os = require('os');
// var platform = os.platform(); // darwin linux win32

var runBeforePublish;
if(argv[2] === 'ok' || argv[2] === 'git') {
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
if(argv[2] !== 'git') {
  runBeforePublish
  .then(function() {
    return run('npm publish --registry=https://registry.npmjs.org');
  })
  .then(function() {
    console.log(colorFont('publish done!', COLOR.GREEN));
  })
  .catch(function(err) {
    console.log(err);
    console.log(colorFont('publish error!', COLOR.RED));
  });
}
