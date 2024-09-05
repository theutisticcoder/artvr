const express = require('express');
const bodyParser = require('body-parser');
const { Client, Environment, ApiError } = require('square');

const app = express();
app.use(bodyParser.json());

const squareClient = new Client({
    environment: Environment.Sandbox, // or Environment.Production
    accessToken: 'EAAAlvd0owabWAkzKXlgauXdesy8ahHbIdJFMODM7leb7Z_SdXJv1RaQ84ZeuGmz',
});

app.post('/create-payment', async (req, res) => {
    try {
      const response = await client.paymentsApi.createPayment({
        sourceId: 'cnon:card-nonce-ok',
        idempotencyKey: '6f32f7e1-f234-4c8e-9b32-42f7f3cb69fb',
        amountMoney: {
          amount: 15,
          currency: 'USD'
        }
      });

      console.log(response.result);
    } catch(error) {
      console.log(error);
    }
});
app.use(express.static(__dirname))
app.use(express.static("create-payment"))
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

module.exports = app;
