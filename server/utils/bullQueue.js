const Bull = require('bull');
const nodemailer = require('nodemailer');
const models = require('models');
const elastic=require('utils/elastic')

const updateBook=new Bull('Book_Update');
const Queue = new Bull('Mailer');
const cleanUp = new Bull('Update');


const options = {
  attempts: 2,
};

const addTask = (data) => {
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
        console.log("Mail Delivered To : " + email);
        resolve(info);
      }
    });
  });
}

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

const heavyTask = () => {
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



Queue.process(async (job) => {
  console.log("Processing : ");
  return await sendMail(job.data.email);
});

Queue.on('completed', (job) => {
  console.log("Job Completed")
})



const addUpdateBook=(data)=>{
       updateBook.add(data,options)
}
updateBook.process(async(job)=>{
  return await elastic.updateBook(job.data.content,job.data.id);

})
updateBook.on('completed',(job)=>{
  console.log("Job Completed");
})



module.exports = { addTask, heavyTask ,addUpdateBook}







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