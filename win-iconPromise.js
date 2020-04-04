let fs = require('fs');
let child_process = require('child_process');
let os = require('os');
let path = require('path');
let _ = require('lodash');

function IconPromise(){

  /**
   * Extracts image data from a file's icon and provides it wrapped in a
   *     promise, with an optional argument that allows for the adjustment of
   *     size. Default size is 32x32 pixels.
   * @param {string} path The file path for the document that we would like to
   *     extract the icon data of.
   * @param {string} sizeArg The size argument string to be passed through to
   *     the .NET framework code
   * @param {string} context A context string that will be returned with the
   *     JSON object to lend insight into the function caller
   * @return {Promise} Returns a promise for a javascript object that contains the
   *     icon image data.
   */
  this.getIcon = function(path, sizeArg = '--size-32', context = "No Context Provided"){
    let iconProcess = child_process.spawn(getPlatformIconProcess(), ['--x', sizeArg]);

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

        // There may be more than one event for the buffer; consider each
        _.each(iconDataBuffer.split('\n'), function(buf){

          // Wait until later if the buffer is empty
          if(!buf || buf.length == 0){
            return;
          }

          // Attempt to parse the full buffer
          try{
            return resolve(JSON.parse(buf));
          } catch(ex){
            return reject(ex);
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

  /**
   * Extracts image data from a file's icon and provides it wrapped in a
   *     promise, with the size set as 16x16 pixels.
   * @param {string} path The file path for the document that we would like to
   *     extract the icon data of.
   * @param {string} context A context string that will be returned with the
   *     JSON object to lend insight into the function caller
   * @return {Promise} Returns a promise for a javascript object that contains the
   *     icon image data.
   */
  this.getIcon16 = function(path, context = "No Context Provided"){
    return this.getIcon(path, '--size-16', context);
  }

  /**
   * Extracts image data from a file's icon and provides it wrapped in a
   *     promise, with the size set as 32x32 pixels.
   * @param {string} path The file path for the document that we would like to
   *     extract the icon data of.
   * @param {string} context A context string that will be returned with the
   *     JSON object to lend insight into the function caller
   * @return {Promise} Returns a promise for a javascript object that contains the
   *     icon image data.
   */
  this.getIcon32 = function(path, context = "No Context Provided"){
    return this.getIcon(path, '--size-32', context);
  }

  /**
   * Extracts image data from a file's icon and provides it wrapped in a
   *     promise, with the size set as 48x48 pixels.
   * @param {string} path The file path for the document that we would like to
   *     extract the icon data of.
   * @param {string} context A context string that will be returned with the
   *     JSON object to lend insight into the function caller
   * @return {Promise} Returns a promise for a javascript object that contains the
   *     icon image data.
   */
  this.getIcon48 = function(path, context = "No Context Provided"){
    return this.getIcon(path, '--size-48', context);
  }

  /**
   * Extracts image data from a file's icon and provides it wrapped in a
   *     promise, with the size set as 256x256 pixels.
   * @param {string} path The file path for the document that we would like to
   *     extract the icon data of.
   * @param {string} context A context string that will be returned with the
   *     JSON object to lend insight into the function caller
   * @return {Promise} Returns a promise for a javascript object that contains the
   *     icon image data.
   */
  this.getIcon256 = function(path, context = "No Context Provided"){
    return this.getIcon(path, '--size-256', context);
  }

  function getPlatformIconProcess(){
    if(os.type() == 'Windows_NT'){
      return path.join(__dirname,'/bin/IconExtractor.exe');
      //Do stuff here to get the icon that doesn't have the shortcut thing on it
    } else {
      throw('This platform (' + os.type() + ') is unsupported =(');
    }
  }
}

module.exports = new IconPromise();
