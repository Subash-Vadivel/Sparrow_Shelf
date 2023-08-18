const Bull = require('bull');
const nodemailer = require('nodemailer');


const Queue = new Bull('Mailer');
const CPUQueue = new Bull('Intensive');


const options = {
  attempts: 2,
  // repeat: { cron: '* * * * *' }
};

const addTask=(data)=>{
  Queue.add(data, options);

}

function sendMail(email) {
  return new Promise((resolve, reject) => {
    let mailOptions = {
      from: 'sparrowshelf.com',
      to: email,
      subject: 'Welcome to Sparrow Shelf',
      html: "<p>Start buying your favourite books and novels at Discounted Price. <a href='http://localhost:8080/'> Click here to Explore</a></p>",
    };
    let mailConfig = {
      service: 'gmail',
      auth: {
        user: 'sparrowshelf@gmail.com',
        pass: 'vuodiiikhwikjdyq'
      }
    };
    nodemailer.createTransport(mailConfig).sendMail(mailOptions, (err, info) => {
      if (err) {
        reject(err);
      } else {
        console.log("Mail Delivered To : "+email);
        resolve(info);
      }
    });
  });
}

function cpuIntense(){
  return new Promise((resolve,reject)=>{
    for(var i=0;i<10000000000;i++)
    {

    }
    console.log("Completed")
    resolve();
  })
}

const heavyTask=()=>{
  CPUQueue.add({name:"suabsh"});
}
CPUQueue.process(async(job)=>{
  console.log("CPU Intense Operation : ");
  return await cpuIntense();
})




Queue.process(async (job) => { 
  console.log("Processing : ");
  return await sendMail(job.data.email); 
});

Queue.on('completed',(job)=>{
  console.log("Job Completed")
})

module.exports={addTask,heavyTask}







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