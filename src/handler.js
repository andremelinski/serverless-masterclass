"use strict";

module.exports.randomNumber = (event) => {
  const random = parseInt(Math.random() * 100);
  console.log(`generating random number: ${random}`);
  return random

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
