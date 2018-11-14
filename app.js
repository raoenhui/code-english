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
const PORT = 4001

co(function * () {
  yield app.prepare()

  console.log(`Connecting to ${MONGO_URL}`)
  const db = yield MongoClient.connect(MONGO_URL)

  const server = express()

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
  console.log(`Listening on ${PORT}`)
}).catch(error => console.error(error.stack))
