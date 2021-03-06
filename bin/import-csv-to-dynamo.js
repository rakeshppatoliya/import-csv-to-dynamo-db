#!/usr/bin/env node
const getArgs = require('../lib/get-args');
const { readCSV, getSchema } = require('../lib/csv');
const { init, createPutRequest } = require('../lib/dynamo-db-client');

const args = getArgs();

(async () => {
  const data = await readCSV(args.file);
  const schema = getSchema(data[0]);
  const putRequests = data.slice(1).map(createPutRequest.bind(null, schema));
  const config = {
    region: 'ap-southeast-1',
    endpoint: 'http://127.0.0.1:8008',
  };
  const dynamodbClient = init(config);
  const result = await dynamodbClient.batchWriteItem(args.table, putRequests);
  console.info(result);
})();
