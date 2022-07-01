import * as functions from "firebase-functions";
import Stripe from 'stripe';
const stripe = new Stripe(functions.config().stripe.key.test, {
  apiVersion: '2020-08-27',
});

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const refund = functions.https.onCall(async (data: any, context) => {
    const refund = await stripe.refunds.create({
        charge: data.chargeId,
        refund_application_fee: true,
    }, {
        stripeAccount: data.stripeId,  
    });
    functions.logger.info(refund);
});

export const subscriptionCancel = functions.https.onCall(async (data: any, context) => {
    const cancel = await stripe.subscriptions.del(data.subscriptionId, {}, {
        stripeAccount: data.stripeId
    });
    functions.logger.info(cancel);
});

export const subscriptionEnd = functions.https.onCall(async (data: any, context) => {
    const end = await stripe.subscriptions.update(data.subscriptionId, {}, {
        stripeAccount: data.stripeId
    });
    functions.logger.info(end);
});

export const subscriptionRetrieve = functions.https.onCall(async (data: any, context) => {
    const subscription = await stripe.subscriptions.retrieve(data.subscriptionId);
    const retrieve = await stripe.subscriptions.update(data.subscriptionId, {
        cancel_at_period_end: false,
        proration_behavior: 'create_prorations',
        items: [{
            id: subscription.items.data[0].id,
            // price: data.priceId,
        }]
    }, {
        stripeAccount: data.stripeId
    });
    functions.logger.info(retrieve);
});

export const subscriptionCreate = functions.https.onCall(async (data: any, context) => {
    const subscription = await stripe.subscriptions.create({
        customer: data.customerId,
        items: [
          { price: data.priceId },
        ],
    },{
        stripeAccount: data.stripeId
    });
    functions.logger.info(subscription);
});

export const productDelete = functions.https.onCall(async (data: any, context) => {
    const deleted = await stripe.products.del(
        data.productId, {}, {
            stripeAccount: data.stripeId
        }
    );
    functions.logger.info(deleted);
});

export const productUpdate = functions.https.onCall(async (data: any, context) => {
    const updated = await stripe.products.update(
        data.productId, {
            name: data.productName,
            images: data?.images||null,
            url: data?.url||null,
            statement_descriptor: data?.desc||null
        }, {
            stripeAccount: data.stripeId
        }
    );
    functions.logger.info(updated);
});

export const productList = functions.https.onCall(async (data: any, context) => {
    const listed = await stripe.products.list({
        stripeAccount: data.stripeId
    });
    functions.logger.info(listed);
});

export const productCreate = functions.https.onCall(async (data: any, context) => {
    const product = await stripe.products.create({
        name: data.productName,
        images: data?.images||null,
        url: data?.url||null,
        statement_descriptor: data?.desc||null
    },{
        stripeAccount: data.stripeId
    });
    functions.logger.info(product);
});

// NEEDS WORK
export const priceUpdate = functions.https.onCall(async (data: any, context) => {
    const price = await stripe.prices.update(
        data.priceId, {
            metadata: {order_id: '6735'}
        },{
            stripeAccount: data.stripeId
        }
      );
    functions.logger.info(price);
});

/*
= functions.https.onCall(async (data: any, context) => {
    functions.logger.info();
});
*/