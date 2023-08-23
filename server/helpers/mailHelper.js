const Bull = require('bull');
const nodemailer = require('nodemailer');
const models = require('models');

const Queue = new Bull('Mailer');


const options = {
  attempts: 2,
};

const addTaskMail = (data) => {
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

Queue.process(async (job) => {
  console.log("Processing : ");
  return await sendMail(job.data.email);
});

Queue.on('completed', (job) => {
  console.log("Job Completed")
})

module.exports={addTaskMail}