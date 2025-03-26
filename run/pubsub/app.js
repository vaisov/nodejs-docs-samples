/**
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// [START cloudrun_pubsub_publisher_setup]
const express = require('express');
const {PubSub} = require('@google-cloud/pubsub');

const app = express();
const pubsub = new PubSub();

// This middleware is available in Express v4.16.0 onwards
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Hardcoded topic name
const TOPIC_NAME = 'test-topic';
// [END cloudrun_pubsub_publisher_setup]

// [START cloudrun_pubsub_publisher_handler]
// Publish a message to the specified Pub/Sub topic
async function publishMessage(message) {
  const topic = pubsub.topic(TOPIC_NAME);
  
  try {
    const messageBuffer = Buffer.from(message);
    const messageId = await topic.publish(messageBuffer);
    console.log(`Message ${messageId} published: ${message}`);
    return messageId;
  } catch (error) {
    console.error(`Error publishing message: ${error}`);
    throw error;
  }
}

// Generate a random number between 1 and 1000
function generateRandomNumber() {
  return Math.floor(Math.random() * 1000) + 1;
}

// Publish a random number every 5 seconds
let intervalId = null;

function startPublishingRandomNumbers() {
  if (intervalId) {
    clearInterval(intervalId);
  }
  
  intervalId = setInterval(async () => {
    try {
      const randomNumber = generateRandomNumber();
      await publishMessage(randomNumber.toString());
    } catch (error) {
      console.error('Failed to publish scheduled message:', error);
    }
  }, 5000);
  
  console.log(`Started publishing random numbers to ${TOPIC_NAME} every 5 seconds`);
}

// Start publishing when the app starts
startPublishingRandomNumbers();

// Simple form for publishing messages
app.get('/', (req, res) => {
  res.send(`
    <html>
      <body>
        <h1>Pub/Sub Publisher</h1>
        <p>Publishing random numbers to topic "${TOPIC_NAME}" every 5 seconds</p>
        <p>Last few messages:</p>
        <ul id="messages">
          <li>Waiting for messages...</li>
        </ul>
        
        <h2>Publish Custom Message</h2>
        <form method="POST" action="/publish">
          <label for="message">Message:</label>
          <input type="text" id="message" name="message" required><br><br>
          <button type="submit">Publish</button>
        </form>
        
        <script>
          // This is just for demonstration purposes in the browser
          const messagesList = document.getElementById('messages');
          const messages = [];
          
          function addMessage(msg) {
            messages.unshift(msg);
            if (messages.length > 5) messages.pop();
            
            messagesList.innerHTML = '';
            messages.forEach(m => {
              const li = document.createElement('li');
              li.textContent = m;
              messagesList.appendChild(li);
            });
          }
          
          // Simulate receiving messages (in a real app, this would use websockets or SSE)
          setInterval(function() {
            const randomNumber = Math.floor(Math.random() * 1000) + 1;
            addMessage("Random number " + randomNumber + " published at " + new Date().toLocaleTimeString());
          }, 5000);
        </script>
      </body>
    </html>
  `);
});

// API endpoint to publish a message
app.post('/publish', async (req, res) => {
  try {
    if (!req.body.message) {
      return res.status(400).send('Message content is required');
    }
    
    const message = req.body.message;
    const messageId = await publishMessage(message);
    
    res.status(200).send({
      status: 'success',
      messageId: messageId,
      message: `Message published: ${message}`
    });
  } catch (error) {
    res.status(500).send({
      status: 'error',
      message: `Failed to publish message: ${error.message}`
    });
  }
});

// API endpoint to get the status of the publisher
app.get('/status', (req, res) => {
  res.status(200).send({
    status: 'active',
    topic: TOPIC_NAME,
    publishInterval: '5 seconds'
  });
});
// [END cloudrun_pubsub_publisher_handler]

module.exports = app;
