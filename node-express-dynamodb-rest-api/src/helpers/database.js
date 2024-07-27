var AWS = require("aws-sdk");

AWS.config.update({
  accessKeyId: "my access key",
  secretAccessKey: "my secret key",
  region: "ap-south-1",
  endpoint: "dynamodb.ap-south-1.amazonaws.com",
});

const db = new AWS.DynamoDB.DocumentClient({ convertEmptyValues: true });

module.exports = db;
