# Cloud Run Pub/Sub Publisher Sample

This sample shows how to create a service that publishes messages to Pub/Sub.

## Features

- Automatically publishes a random number to the `test-topic` Pub/Sub topic every 5 seconds
- Provides a web interface to manually publish custom messages
- Offers a REST API endpoint for programmatic message publishing

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Start the application:
   ```
   npm start
   ```

## Usage

The application starts automatically publishing random numbers between 1 and 1000 every 5 seconds to the `test-topic` Pub/Sub topic.

Additionally, you can:

1. Web interface: Access the homepage in your browser to see the publishing status and use the form to send custom messages.
2. API endpoint: Send a POST request to `/publish` with a JSON body: `{"message": "Your message here"}`
3. Status check: Send a GET request to `/status` to check the publisher's status

## Dependencies

* **express**: Web server framework.
* **@google-cloud/pubsub**: Google Cloud Pub/Sub client library.
* **mocha**: [development] Test running framework.
* **supertest**: [development] HTTP assertion test client.
