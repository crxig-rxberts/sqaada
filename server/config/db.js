const { DynamoDB } = require('aws-sdk');

const dynamoDb = new DynamoDB.DocumentClient({
    endpoint: process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000',
    region: 'eu-west-1',
    accessKeyId: 'dummy',
    secretAccessKey: 'dummy'
});

module.exports = dynamoDb;
