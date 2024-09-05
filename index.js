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
      sourceId: 'ccof:GaJGNaZa8x4OgDJn4GB',
      idempotencyKey: '7b0f3ec5-086a-4871-8f13-3c81b3875218',
      amountMoney: {
        amount: 15,
        currency: 'USD'
      },
      appFeeMoney: {
        amount: 0,
        currency: 'USD'
      },
      autocomplete: true,
      customerId: 'W92WH6P11H4Z77CTET0RNTGFW8',
      locationId: 'LMJY97S69RNWK',
      referenceId: '123456',
      note: 'lakerise painting print'
    });
  
    console.log(response.result);
  } catch(error) {
    console.log(error);
  }
    });
  
  
app.use(express.static(__dirname))
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

module.exports = app;
