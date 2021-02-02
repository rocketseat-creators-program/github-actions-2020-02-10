process.env.AWS_REGION = 'sa-east-1';

import app from './app';
const serverless: any = require('aws-serverless-koa');

module.exports.handler = serverless(app);
