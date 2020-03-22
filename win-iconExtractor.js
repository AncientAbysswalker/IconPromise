let fs = require('fs');
let child_process = require('child_process');
let os = require('os');
let path = require('path');
let _ = require('lodash');

function IconPromise(){
  this.getIcon = function(context, path){
    let iconProcess = child_process.spawn(getPlatformIconProcess(), ['-x']);

    // Initialize buffer
    let iconDataBuffer = "";

    // Start process to parse icon data
    let json = JSON.stringify({context: context, path: path}) + "\n";
    iconProcess.stdin.write(json);

    // Return a promise that we will return a json object for the icon:
    return new Promise((resolve, reject) => {

      // Trigger event on stdout buffer
      iconProcess.stdout.on('data', data => {
        let str = (new Buffer.from(data, 'utf8')).toString('utf8');

        // Add data to buffer
        iconDataBuffer += str;

        //Wait until later if we do not have the full icon data to parse
        if (!_.endsWith(str, '\n')){
          return;
        }

        // There may e more than one event for the buffer; consider each
        _.each(iconDataBuffer.split('\n'), function(buf){

          // Wait until later if the buffer is empty
          if(!buf || buf.length == 0){
            return;
          }

          // Attempt to parse the full buffer
          try{
            return resolve(JSON.parse(buf));
          } catch(ex){
            return resolve(ex);
          }
        });
      });

      // Throw promise reject if error in iconProcess
      iconProcess.on('error', err => {
        return reject(err.toString());
      });

      // Throw promise reject if stderr
      iconProcess.stderr.on('data', err => {
        return reject(err.toString());
      });
    });
  }

  function getPlatformIconProcess(){
    if(os.type() == 'Windows_NT'){
      return path.join(__dirname,'/bin/IconPromise.exe');
      //Do stuff here to get the icon that doesn't have the shortcut thing on it
    } else {
      throw('This platform (' + os.type() + ') is unsupported =(');
    }
  }
}

module.exports = new IconPromise();
