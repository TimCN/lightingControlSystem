/*
 * @Author: tim huang 
 * @Date: 2019-11-24 17:00:16 
 * @Last Modified by: tim huang
 * @Last Modified time: 2019-11-24 18:20:39
 */


class Lighter {
  constructor() {
    // keep
    this.init([]);
    this.listeners = [];
  }
  init(personQueue) {
    this.roomPersonPerSeconds = [0, 0, 0, 0, 0]
    this.personQueue = personQueue;
    // reset lighting status
    this.lighting = false;
  }
  append(personQueue) {
    this.personQueue = this.personQueue.concat(personQueue);
  }
  subscribe(listener) {
    // TODO listener should be a function
    this.listeners.push(listener);
    return () => {
      // unsubscribe
      this.listeners = this.listeners.filter(fn => fn !== listener)
    }
  }

  resetPersonQueue(nextPersonQueue) {
    // TODO check nextPersonQueue: should be an number array
    // 有歧义：是需要重置所有的状态，还是在之前的队列中追加新的状态；目前采用全部重置
    this.init(nextPersonQueue);
    // this.append(nextPersonQueue)
    // clear this.timer
    clearTimeout(this.timer);
    this.timer = null

    // restart
    this.start();
  }
  start() {
    // this is a loop once a second
    this.queueLoop();

  }
  switchLight(status) {
    this.lighting = status;
    this.listeners.forEach(fn => fn(this.lighting))

  }
  /**
   * pure function
   * @param {number} currentPersons 当前时刻进入（>0）/离开（<0）房间的人数 
   * @param {boolean} currentLighting 当前时刻灯光的状态（开启/关闭）
   * @param {Array<number>} roomPersonPerSeconds 前5秒中，每一秒房间的人数
   */
  calcLighting(currentPersons, currentLighting, roomPersonPerSeconds) {
    // general case
    // 0 0 0 0 0 1 0 0 0 0 -1 0 0 0 0 
    // 0 0 0 0 1 0 0 0 0 -1 0 0 0 0 
    // 0 0 0 1 0 0 0 0 -1 0 0 0 0 
    // 0 0 1 0 0 0 0 -1 0 0 0 0 
    // 0 1 0 0 0 0 -1 0 0 0 0 
    // 1 0 0 0 0 -1 0 0 0 0 light on
    // 1 0 0 0 -1 0 0 0 0 
    // 1 0 0 -1 0 0 0 0 
    // 1 0 -1 0 0 0 0 
    // 1 -1 0 0 0 0 
    // 0 0 0 0 0 light off

    // 维护一个长度为5的数组，
    // 关灯的状态下：当1个人停留长达5秒，则开灯
    // 开灯的状态下：当0个人停留长达5秒，则关灯
    // 这个地方有点歧义：不同时段进入会议室，但是如果非全量离开，该取什么值
    // 本程序控制为：非全量离开，默认停留较短的人离开/取最先进入会议室的时长判断

    // 先取出5秒前的人员情况
    const prePerson = roomPersonPerSeconds.shift();
    // 将当前时刻的人员情况推入
    roomPersonPerSeconds.push(currentPersons)
    if (prePerson === 0) {
      if (roomPersonPerSeconds[0] > 0) {
        // 如果有人正好停留5秒，则开灯
        return true
      }
    } else if (prePerson > 0) {
      // 5秒前就有人,灯是亮的；如果在这5秒内，都为出现其他人，则
      roomPersonPerSeconds[0] = roomPersonPerSeconds[0] + prePerson;
      // 在5秒内第一批抵达的人员
      const firstComeIndex = roomPersonPerSeconds.findIndex(val => val > 0)
      if (roomPersonPerSeconds[0] === 0 && firstComeIndex === -1) {
        // 如果所有人都离开正好5秒，则关灯
        return false
      } else if (roomPersonPerSeconds[0] === 0 && firstComeIndex > 0) {
        // 在5秒内，有其他人进入；处理：将第一位跟进入为互换
        roomPersonPerSeconds[0] = roomPersonPerSeconds[firstComeIndex];
        roomPersonPerSeconds[firstComeIndex] = 0;
        return currentLighting
      }
    } else {
      throw new Error("roomPersonPerSeconds's first element should not be a negative number.")
    }
    return currentLighting;
  }
  queueLoop() {
    if (this.timer) {
      // work is un finished
      return;
    }


    // lighting for current tick
    const currentPersons = this.personQueue.shift() || 0;
    const lighting = this.calcLighting(currentPersons, this.lighting, this.roomPersonPerSeconds);
    this.switchLight(lighting);



    // loop
    this.timer = setTimeout(() => {
      this.timer = null;
      this.queueLoop();
    }, 1000);

  }
}


module.exports = Lighter