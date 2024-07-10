const { DynamoDB } = require('aws-sdk');

// On deployment IAM is used to authenticate the server
const dynamoDb = new DynamoDB.DocumentClient({
    endpoint: process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000',
    region: process.env.AWS_REGION || 'eu-west-1',
});

module.exports = dynamoDb;
