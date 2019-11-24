/*
 * @Author: tim huang 
 * @Date: 2019-11-24 16:51:12 
 * @Last Modified by: tim huang
 * @Last Modified time: 2019-11-24 17:48:17
 */



const path = require("path");
const chalk = require("chalk");
const InputWatcher = require("./inputWatcher");
const Lighter = require("./lighter");

// load the env vars
require("dotenv").config();


// use env var to de-couple  
const inputFilePath = process.env.INPUT_FILE_PATH || path.resolve(__dirname, "../input.txt");



function main(inputFilePath) {

  // lighter: 根据输入信号（数字数组）,时时计算/开关 灯；可通过subscribe监听每一秒的电灯的状态
  const lighter = new Lighter();
  lighter.subscribe(lightingStatusShow)
  // 通过 inputWather 监听input文件的变化，当其发生变化时，会触发回调函数 fileChangeCallback，
  const inputWatcher = new InputWatcher(inputFilePath, inputChangeCallback);
  inputWatcher.watch()

  // input 文件变化的回调函数
  function inputChangeCallback(secondPerPersons) {
    lighter.resetPersonQueue(secondPerPersons)
  }

  function lightingStatusShow(lighting) {
    if (lighting === true) {
      // 开灯状态
      console.log(chalk.white.bgGreen("1        "))
    } else {
      // 关灯状态
      console.log(chalk.white.bgBlackBright("0        "))
    }
  }



}



main(inputFilePath);