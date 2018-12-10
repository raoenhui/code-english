'use strict'

const { MongoClient } = require('mongodb')
const api = require('./lib/api')
const body = require('body-parser')
const co = require('co')
const express = require('express')
const Next = require('next');
const Mongo = require('./env')


const dev = process.env.NODE_ENV !== 'production'
const app = Next({ dev })
const handle = app.getRequestHandler()

const MONGO_URL = Mongo.MongoAddress;
const PORT = 5001;
const AllowCrossDomain = function (req, res, next) {
  //自定义中间件，设置跨域需要的响应头。
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials','true');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
};

co(function * () {
  yield app.prepare();

  console.log(`Connecting to mongo`)
  const db = yield MongoClient.connect(MONGO_URL)

  const server = express()
  server.use(AllowCrossDomain);//运用跨域的中间件
  server.use(body.json())
  server.use((req, res, next) => {
    req.db = db
    next()
  })
  server.use('/api', api(db))

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(PORT)
  console.log(`Listening on ${PORT},open: 127.0.0.1:${PORT}`);
}).catch(error => console.error(error.stack))
