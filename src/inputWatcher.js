/*
 * @Author: tim huang 
 * @Date: 2019-11-24 16:51:20 
 * @Last Modified by: tim huang
 * @Last Modified time: 2019-11-24 17:48:14
 */


const fs = require("fs");


class Watcher {
  constructor(fullFileName, callback) {

    this.fullFileName = fullFileName;
    this.listener = callback;
    this.data = [];
  }
  watch() {
    // TODO validate the fullFileName
    // fire the read once, then watch the fileChange
    console.log("start watch...")
    this.read()
    fs.watchFile(this.fullFileName, () => this.read());
  }
  read() {


    // read file
    const current = fs.readFileSync(this.fullFileName);

    // TODO use MD5 compare: either the file content changed or not

    // toString
    let str = current.toString("utf8");

    // split to an array
    let secondPerPersons = str.split("\n");

    // parse to a number
    secondPerPersons = secondPerPersons.map(val => parseInt(val));

    // filter un number
    secondPerPersons = secondPerPersons.filter(val => !isNaN(val));

    // fire the listener
    if (this.listener) {
      this.listener(secondPerPersons)
    }
  }
}

module.exports = Watcher