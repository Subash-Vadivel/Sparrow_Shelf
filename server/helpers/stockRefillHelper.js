const Bull = require('bull');
const models = require('models');

const cleanUp = new Bull('Update');



const options = {
  attempts: 2,
};


function update() {
  return new Promise(async (resolve, reject) => {
    try {
      await models.books.update({ stock: 10 }, {
        where: {
          stock: 0
        }
      });
      resolve();
    }
    catch (err) {
      reject();
    }

  })
}

const refillStock = () => {
  cleanUp.add({ name: "suabsh" }, {
    repeat: { cron: '*/15 * * * *' },
  });
}
cleanUp.process(async (job) => {
  console.log("Crons : ");
  return await update();
})
cleanUp.on('completed', (job) => {
  console.log("Cron Update");

})




module.exports = {  refillStock }







// Future Reference All Options in BULL 

// const queueOptions = {
//   limiter: { max: 10, duration: 1000 },
//   redis: { port: 6379, host: 'localhost' },
//   settings: { lockDuration: 3000 },
//   defaultJobOptions: {
//     attempts: 3,
//     priority: 5,
//     timeout: 60000,
//     removeOnComplete: true,
//     removeOnFail: true,
//     stackTraceLimit: 10,
//   },
//   name: 'myQueue',
// };

// const jobData = { someKey: 'someValue' };
// const jobOptions = {
//   delay: 5000, // Delay job by 5 seconds
//   priority: 1, // Higher priority
//   attempts: 3, // Retry up to 3 times on failure
//   backoff: { type: 'exponential', delay: 2000 }, // Exponential backoff strategy
//   timeout: 30000, // Maximum execution time of 30 seconds
//   removeOnComplete: true, // Automatically remove job after completion
// };

// myQueue.add(jobData, jobOptions);