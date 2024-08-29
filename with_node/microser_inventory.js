const amqp = require('amqplib');

async function updateInventory(orderDetails) {
    // Logic to update inventory based on the order
    console.log(`Updating inventory for order: ${orderDetails.orderId}`);
}

async function consumeOrdersForInventory() {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        const exchange = 'orders_exchange';

        await channel.assertExchange(exchange, 'fanout', { durable: true });

        const queue = await channel.assertQueue('inventory_queue', { durable: true });
        await channel.bindQueue(queue.queue, exchange, '');

        console.log('Waiting for orders to update inventory...');

        channel.consume(queue.queue, async (msg) => {
            const orderDetails = JSON.parse(msg.content.toString());
            await updateInventory(orderDetails);
            channel.ack(msg);
        });
    } catch (error) {
        console.error('Error in consuming orders for inventory:', error);
    }
}

consumeOrdersForInventory();
