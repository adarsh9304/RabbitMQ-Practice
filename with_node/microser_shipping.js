const amqp = require('amqplib');

async function arrangeShipping(orderDetails) {
    // Logic to arrange shipping based on the order
    console.log(`Arranging shipping for order: ${orderDetails.orderId}`);
}

async function consumeOrdersForShipping() {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        const exchange = 'orders_exchange';

        await channel.assertExchange(exchange, 'fanout', { durable: true });

        const queue = await channel.assertQueue('shipping_queue', { durable: true });
        await channel.bindQueue(queue.queue, exchange, '');

        console.log('Waiting for orders to arrange shipping...');

        channel.consume(queue.queue, async (msg) => {
            const orderDetails = JSON.parse(msg.content.toString());
            await arrangeShipping(orderDetails);
            channel.ack(msg);
        });
    } catch (error) {
        console.error('Error in consuming orders for shipping:', error);
    }
}

consumeOrdersForShipping();
const amqp = require('amqplib');

async function arrangeShipping(orderDetails) {
    // Logic to arrange shipping based on the order
    console.log(`Arranging shipping for order: ${orderDetails.orderId}`);
}

async function consumeOrdersForShipping() {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        const exchange = 'orders_exchange';

        await channel.assertExchange(exchange, 'fanout', { durable: true });

        const queue = await channel.assertQueue('shipping_queue', { durable: true });
        await channel.bindQueue(queue.queue, exchange, '');

        console.log('Waiting for orders to arrange shipping...');

        channel.consume(queue.queue, async (msg) => {
            const orderDetails = JSON.parse(msg.content.toString());
            await arrangeShipping(orderDetails);
            channel.ack(msg);
        });
    } catch (error) {
        console.error('Error in consuming orders for shipping:', error);
    }
}

consumeOrdersForShipping();
