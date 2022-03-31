"use strict";

module.exports.randomNumber = (event) => {
  const random = parseInt(Math.random() * 100);
  console.log(`generating random number: ${random}`);
  return random
};
