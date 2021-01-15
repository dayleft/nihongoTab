'use strict';

module.exports.hellotest2 = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      "hellotest2 from severless"
    ),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
