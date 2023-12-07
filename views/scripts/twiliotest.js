require('dotenv').config({path:"../../.env"});


const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);


client.messages
  .create({
     body: '',
     from: '+1 914 425 5822',
     to: ''
   })
  .then(message => console.log(message.sid));