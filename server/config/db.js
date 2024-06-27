const { DynamoDB } = require('aws-sdk');

const dynamoDb = new DynamoDB.DocumentClient({
    endpoint: process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000',
    region: 'eu-west-1',
    accessKeyId: process.env.AWS_ACCESS_KEY ||'dummy',
    secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET ||'dummy',
    sessionToken: process.env.AWS_ACCESS_SESSION_TOKEN ||'dummy',
});

module.exports = dynamoDb;
