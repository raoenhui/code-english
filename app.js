'use strict'

const { MongoClient } = require('mongodb')
const api = require('./lib/api')
const body = require('body-parser')
const co = require('co')
const express = require('express')
const Next = require('next');
const Mongo = require('./env')
const Jsf = require('@jd/jmfe-node-jsf')

const dev = process.env.NODE_ENV !== 'production'
const app = Next({ dev })
const handle = app.getRequestHandler()

const MONGO_URL = Mongo.MongoAddress;
const PORT = 5001;

/*var jss=new Jsf('pregw.jd.local',false);
console.log("jss",jss);
var options={
  className:'com.jd.groupto.client.jsf.WxOpenidPinJsfService',
  aliasName:'wxOpenidPin-stg',
  functionId:'queryListByPinsAndType',
  appId:'1',
  params:[[{"@type": "java.lang.String", "name":"xxx1"}, {"@type": "java.lang.String", "name":"xxx2"}], 2]
}
var res=jss.post(options).then(function(r){
  console.info('r',r)
})
console.info('res',res)*/


const TopicService=require('./topicService');

// import TopicService from './topicService'
console.log('TopicService',TopicService)
// TopicService.getUserTicket('raoenhui','En@13818432723');
TopicService.getUserTicket('raoenhui','En@13818432723').then((r)=>{
  console.log('r',r)
});


/*
const axios = require('axios');

axios.get('http://47.98.138.195:5001/api')
  .then(function (response) {
    console.log('response',response);
  })
  .catch(function (error) {
    console.log('error',error);
  });


*/


const AllowCrossDomain = function (req, res, next) {
  //自定义中间件，设置跨域需要的响应头。
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials','true');
  next();
};

co(function * () {
  yield app.prepare()

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
  console.log(`Listening on ${PORT},open: localhost:${PORT}`);
}).catch(error => console.error(error.stack))
