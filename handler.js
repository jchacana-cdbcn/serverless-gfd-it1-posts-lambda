'use strict';


module.exports.hello = async event => {
  var AWS = require('aws-sdk');
  AWS.config.update({ region: 'us-east-1' });
  var parse = AWS.DynamoDB.Converter.output;


  // Create the DynamoDB service object
  var ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

  var params = {
    TableName: 'serverless-gfd-it1-posts-database',
    Key: {
      'id': { S: '1234' }
    },
    ProjectionExpression: 'posts'
  };

  return await new Promise((resolve, reject) => {
    ddb.getItem(params, function (err, data) {
      if (err) {
        console.log("Error", err);
      } else {
        resolve({
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
          },
          statusCode: 200,
          body: JSON.stringify(
             parse({ "M": data.Item}).posts,
            null,
            2
          ),
        })
      }
    });
  });
  // Call DynamoDB to read the item from the table





  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
