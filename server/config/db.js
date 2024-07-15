const AWS = require('aws-sdk');

const isLocal = process.env.NODE_ENV !== 'production';

if (isLocal) {
  AWS.config.update({
    region: 'localhost',
    endpoint: 'http://localhost:8000',
    accessKeyId: 'dummy',
    secretAccessKey: 'dummy'
  });
} else {
  // Production configuration (uses IAM role)
  AWS.config.update({ region: process.env.AWS_REGION || 'eu-west-1' });
}

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports = dynamoDb;