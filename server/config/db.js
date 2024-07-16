const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");

const isLocal = process.env.NODE_ENV !== 'production';

let clientConfig = {};

if (isLocal) {
  clientConfig = {
    region: 'localhost',
    endpoint: 'http://localhost:8000',
    credentials: {
      accessKeyId: 'dummy',
      secretAccessKey: 'dummy'
    }
  };
} else {
  clientConfig = {
    region: process.env.AWS_REGION || 'eu-west-1'
  };
}

const client = new DynamoDBClient(clientConfig);
const dynamoDb = DynamoDBDocumentClient.from(client);

module.exports = dynamoDb;