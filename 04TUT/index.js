const { log } = require('console');
const logEvents = require('./logEvents');

const eventEmitter = require('events');

class MyEmitter extends eventEmitter {};

//initialize object
const myEmitter = new MyEmitter();

//add listener for the log event
myEmitter.on('log', (msg) => logEvents(msg, 'eventLog.txt'));

setTimeout(() => {
  //Emit event
  myEmitter.emit('log', 'Log event emitted!');
}, 2000);