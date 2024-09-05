const express = require('express');
const bodyParser = require('body-parser');
const { Client, Environment, ApiError } = require('square');

const app = express();
app.use(bodyParser.json());

const client = new Client({
    environment: Environment.Production, // or Environment.Production
    accessToken: 'EAAAlvd0owabWAkzKXlgauXdesy8ahHbIdJFMODM7leb7Z_SdXJv1RaQ84ZeuGmz',
});

app.post('/create-payment', async (req, res) => {
  try {
    const response = await client.paymentsApi.createPayment({
      sourceId: 'card-nonce-ok',
      idempotencyKey: 'cd2e3872-32c2-4aae-856a-af8c274adfe3',
      amountMoney: {
        amount: 15,
        currency: 'USD'
      }
    });
  
    console.log(response.result);
    res.status(200).json({ message: 'Payment created successfully' });
  } catch(error) {
    console.log(error);
  }
  });
app.use(express.static(__dirname))
app.use(express.static("/create-payment"))
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

module.exports = app;
