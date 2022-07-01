import * as functions from "firebase-functions";
import Stripe from 'stripe';
const stripe = new Stripe('sk_test_...', {
  apiVersion: '2020-08-27',
});

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const refund = functions.https.onRequest(async (data: any, context) => {
  const refund = await stripe.refunds.create({
    charge: data.chargeId,
    refund_application_fee: true,
  }, {
    stripeAccount: data.stripeId,  
  });
  functions.logger.info(refund);
});
