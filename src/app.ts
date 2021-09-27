import 'reflect-metadata';
import express from 'express';
import config from './config';


async function startServer() {
  const app = express();

  await require('./loaders').default({ expressApp: app });

  app
    .listen(config.port, () => {
      console.log(
        `Server is running on port: ${config.port}`
      );
    })
    .on('error', () => {
      process.exit(1);
    });
}

startServer().then();
