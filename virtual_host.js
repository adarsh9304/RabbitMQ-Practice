/*

# Create vhost for ClientA
rabbitmqctl add_vhost /ClientA

# Create vhost for ClientB
rabbitmqctl add_vhost /ClientB



# Create a user for ClientA
rabbitmqctl add_user clientA_user passwordA

# Set permissions for ClientA's user on their vhost
rabbitmqctl set_permissions -p /ClientA clientA_user ".*" ".*" ".*"

# Create a user for ClientB
rabbitmqctl add_user clientB_user passwordB

# Set permissions for ClientB's user on their vhost
rabbitmqctl set_permissions -p /ClientB clientB_user ".*" ".*" ".*"

*/


const amqp = require('amqplib');

async function setupClientA() {
    const connection = await amqp.connect('amqp://clientA_user:passwordA@localhost/ClientA');
    const channel = await connection.createChannel();

    await channel.assertQueue('clientA_queue');
    console.log('Queue created in /ClientA vhost');

    // Close the connection
    await channel.close();
    await connection.close();
}

setupClientA();

async function setupClientB() {
    const connection = await amqp.connect('amqp://clientB_user:passwordB@localhost/ClientB');
    const channel = await connection.createChannel();

    await channel.assertQueue('clientB_queue');
    console.log('Queue created in /ClientB vhost');

    // Close the connection
    await channel.close();
    await connection.close();
}

setupClientB();
