const Job = require('./models/job');
const Execution = require('./models/execution');
const Event = require('./models/event');
const Subscription = require('./models/subscription');

const models = {
  job: (id) => new Job(id),
  execution: (id) => new Execution(id),
  event: (id) => new Event(id),
  subscription: (id) => new Subscription(id),
}

const modelClasses = {
  job:Job,
  execution:Execution,
  event:Event,
  subscription:Subscription
}

module.exports = {
  get: (name,id) => {
    if(!models[name]){
      throw new Error(`Model ${name} does not exist`);
    }
    return models[name](id);
  },
  getClass: (name) => {
    if(!modelClasses[name]){
      throw new Error(`Model ${name} does not exist`);
    }
    return modelClasses[name];
  }
}
