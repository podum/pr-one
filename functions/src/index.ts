import * as functions from "firebase-functions";
import Stripe from 'stripe';
const stripe = new Stripe(functions.config().stripe.key.test, {
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

export const subscriptionCancel = functions.https.onCall(async (data: any, context) => {
    const cancel = await stripe.subscriptions.del(data.subscriptionId);
    functions.logger.info(cancel);
});

export const subscriptionEnd = functions.https.onCall(async (data: any, context) => {
    const end = await stripe.subscriptions.del(data.subscriptionId);
    functions.logger.info(end);
});

export const subscriptionRetrieve = functions.https.onCall(async (data: any, context) => {
    const subscription = await stripe.subscriptions.retrieve(data.subscriptionId);
    stripe.subscriptions.update(data.subscriptionId, {
        cancel_at_period_end: false,
        proration_behavior: 'create_prorations',
        items: [{
            id: subscription.items.data[0].id,
            // price: data.priceId,
        }]
    });
    functions.logger.info(subscription);
});