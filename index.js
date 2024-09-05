const express = require('express');
const bodyParser = require('body-parser');
const { Client, Environment, ApiError } = require('square');

const app = express();
app.use(bodyParser.json());

const client = new Client({
    environment: Environment.Production, // or Environment.Production
    accessToken: 'EAAAlvd0owabWAkzKXlgauXdesy8ahHbIdJFMODM7leb7Z_SdXJv1RaQ84ZeuGmz',
});

async function createPayment(req, res) {
  const payload = await bodyParser.json(req);
  console.debug(JSON.stringify(payload));
  // We validate the payload for specific fields. You may disable this feature
  // if you would prefer to handle payload validation on your own.
  if (!validatePaymentPayload(payload)) {
    throw createError(400, 'Bad Request');
  }

  await retry(async (bail, attempt) => {
    try {
      console.debug('Creating payment', { attempt });

      const payment = {
        idempotencyKey: payload.idempotencyKey,
        locationId: payload.locationId,
        sourceId: payload.sourceId,
        // While it's tempting to pass this data from the client
        // Doing so allows bad actor to modify these values
        // Instead, leverage Orders to create an order on the server
        // and pass the Order ID to createPayment rather than raw amounts
        // See Orders documentation: https://developer.squareup.com/docs/orders-api/what-it-does
        amountMoney: {
          // the expected amount is in cents, meaning this is $1.00.
          amount: '100',
          // If you are a non-US account, you must change the currency to match the country in which
          // you are accepting the payment.
          currency: 'USD',
        },
      };

      if (payload.customerId) {
        payment.customerId = payload.customerId;
      }

      // VerificationDetails is part of Secure Card Authentication.
      // This part of the payload is highly recommended (and required for some countries)
      // for 'unauthenticated' payment methods like Cards.
      if (payload.verificationToken) {
        payment.verificationToken = payload.verificationToken;
      }

      const { result, statusCode } =
        await square.paymentsApi.createPayment(payment);

      console.info('Payment succeeded!', { result, statusCode });

      send(res, statusCode, {
        success: true,
        payment: {
          id: result.payment.id,
          status: result.payment.status,
          receiptUrl: result.payment.receiptUrl,
          orderId: result.payment.orderId,
        },
      });
    } catch (ex) {
      if (ex instanceof ApiError) {
        // likely an error in the request. don't retry
        console.error(ex.errors);
        bail(ex);
      } else {
        // IDEA: send to error reporting service
        console.error(`Error creating payment on attempt ${attempt}: ${ex}`);
        throw ex; // to attempt retry
      }
    }
  });
}
app.post('/api/app', createPayment);
  
  
app.use(express.static(__dirname))
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

module.exports = app;
