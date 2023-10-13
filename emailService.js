const API_KEY = '5fc30a0f4fc7ca3e8531d668e15a65fc-77316142-03d17f22';
const DOMAIN = 'sandboxa6981227c06b407e81cb8f859a47f2a3.mailgun.org';

const FormData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(FormData);

const client = mailgun.client({ username: 'api', key: API_KEY });

const messageData = {
  from: 'info@tanamtech.online',
  to: 'luaina.mada@gmail.com',
  subject: 'Hello from Mailgun',
  text: 'This is a test email sent from Mailgun with a custom URL: https://example.com'
};

client.messages.create(DOMAIN, messageData)
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.error(err);
  });
