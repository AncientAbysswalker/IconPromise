let EventEmitter = require('events');
let fs = require('fs');
let child_process = require('child_process');
let os = require('os');
let path = require('path');
let _ = require('lodash');

let emitter = new EventEmitter();

function IconPromise(){

  //this.emitter = new EventEmitter();

  this.getIcon = function(context, path){
    this.iconProcess = child_process.spawn(getPlatformIconProcess(),['-x']);

    let json = JSON.stringify({context: context, path: path}) + "\n";
    let iconDataBuffer = "";

    this.iconProcess.stdin.write(json);

    // Here we create an await our promise:
    return new Promise((resolve, reject) => {
      //let self = this;

      //console.log(json);
      this.iconProcess.stdout.on('data', data => {
        let str = (new Buffer.from(data, 'utf8')).toString('utf8');

        iconDataBuffer += str;

        //Bail if we don't have a complete string to parse yet.
        if (!_.endsWith(str, '\n')){
          console.log("endswith n");
          return;
        }

        //We might get more than one in the return, so we need to split that too.
        _.each(iconDataBuffer.split('\n'), function(buf){

          if(!buf || buf.length == 0){
            console.log("no buffer");
            return;
          }

          try{
            console.log("try");
            //console.log(JSON.parse(buf))
            return resolve(JSON.parse(buf));
            console.log("fail");
            //self.emitter.emit('icon', JSON.parse(buf));
          } catch(ex){
            console.log("failed JSON parse");
            return resolve(false);
            //self.emitter.emit('error', ex);
          }

        });
      }); // call resolve when its done
      this.iconProcess.stdout.on('error', err => {
        console.log("stdout error");
        return reject(err);
      }); // don't forget this

      this.iconProcess.on('error', err => {
        console.log("general error");
        return reject(err.toString());
      });

      this.iconProcess.stderr.on('data', err => {
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
