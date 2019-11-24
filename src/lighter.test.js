/*
 * @Author: tim huang 
 * @Date: 2019-11-24 17:48:04 
 * @Last Modified by: tim huang
 * @Last Modified time: 2019-11-24 18:23:16
 */


// one case
const Lighter = require("./lighter");
test("calcLighting function, while light off; person stayed 1-4 seconds, the light should light off", () => {
  const lighter = new Lighter();
  let result = lighter.calcLighting(1, false, [0, 0, 0, 0, 0])
  expect(result).toBe(false);
  result = lighter.calcLighting(0, false, [0, 0, 0, 0, 1])
  expect(result).toBe(false);
  result = lighter.calcLighting(0, false, [0, 0, 0, 1, 0])
  expect(result).toBe(false);
  result = lighter.calcLighting(0, false, [0, 0, 1, 0, 0])
  expect(result).toBe(false);
})

test("calcLighting function, while light off; person stayed 5 seconds, the light should light on", () => {
  const lighter = new Lighter();
  const result = lighter.calcLighting(0, false, [0, 1, 0, 0, 0])
  expect(result).toBe(true);
})


test("calcLighting function, while light on; person left 1-4 seconds, the light should light on", () => {
  const lighter = new Lighter();
  let result = lighter.calcLighting(-1, true, [1, 0, 0, 0, 0]);
  expect(result).toBe(true);
  result = lighter.calcLighting(0, true, [1, 0, 0, 0, -1]);
  expect(result).toBe(true);
  result = lighter.calcLighting(0, true, [1, 0, 0, -1, 0]);
  expect(result).toBe(true);
  result = lighter.calcLighting(0, true, [1, 0, -1, 0, 0]);
  expect(result).toBe(true);
})

test("calcLighting function, while light on; person left 5 seconds, the light should light off", () => {
  const lighter = new Lighter();
  const result = lighter.calcLighting(0, true, [1, -1, 0, 0, 0]);
  expect(result).toBe(false);
})


test("calcLighting function, while light on; person left 5 seconds, but other persons coming in before next 5 seconds, the light should light on", () => {
  let lighter = new Lighter();
  let result = lighter.calcLighting(0, true, [1, -1, 3, 0, 0]);
  expect(result).toBe(true);
  lighter = new Lighter();
  result = lighter.calcLighting(0, true, [1, -1, 0, 2, 0]);
  expect(result).toBe(true);
  lighter = new Lighter();
  result = lighter.calcLighting(0, true, [1, -1, 0, 0, 1]);
  expect(result).toBe(true);
})


test("calcLighting function,roomPersonPerSeconds's first element should not be a negative number.", () => {
  let lighter;
  try {
    lighter = new Lighter();
    lighter.calcLighting(0, false, [-1, -1, 0, 0, 0]);
  } catch (e) {
    expect(e).toEqual(new Error("roomPersonPerSeconds's first element should not be a negative number."));
  }

  // try {
  //   result = lighter.calcLighting(0, true, [-1, -1, 0, 0, 0]);
  // } catch (error) {
  //   expect(error).toBe({
  //     error: "roomPersonPerSeconds's first element should not be a negative number.",
  //   });
  // }
})
