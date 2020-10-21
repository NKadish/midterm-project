const { updateOrderOnPickup } = require('../server/database');

require('dotenv').config();

const sid = process.env.TWILIO_SID;
const token = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(sid, token);
const phoneNumber = '+12898073394';

const sendText = function(message, number, timeToSend, orderId) {
  if (timeToSend) {
    setTimeout(function(){
      return client.messages.create({
      body: `${message}`,
      to: `${number}`,  // Text this number
      from: phoneNumber // From a valid Twilio number
      })
      .then((message) => console.log(message.sid))
      .then(() => updateOrderOnPickup(orderId));
    }, timeToSend * 60000);
  } else {
    return client.messages.create({
      body: `${message}`,
      to: `${number}`,  // Text this number
      from: phoneNumber // From a valid Twilio number
      })
  }
};
exports.sendText = sendText;
