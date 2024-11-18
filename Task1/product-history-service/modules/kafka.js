import { Consumer, KafkaClient } from 'kafka-node';
import { prismaClient } from './prisma.js';
import { HistoryActionType, HistoryEntityType } from '../enums.js';


const TOPIC_NAME = 'history-updates';

export const kafkaClient = new KafkaClient({
    kafkaHost: process.env.KAFKA_ADDRESS,
    clientId: 'product-history-service'
});

kafkaClient.topicExists([TOPIC_NAME], (response) => {
    if(response === null)
        return initConsumer();

    kafkaClient.createTopics([{
        topic: TOPIC_NAME,
        partitions: 1,
        replicationFactor: 1
    }], (error, result) => {
        initConsumer();
    })
})

function initConsumer() {
    const consumer = new Consumer(
        kafkaClient,
        [{ topic: TOPIC_NAME }],
        { autoCommit: false }
    );

    consumer.on('message', async (message) => {
        console.log(message);

        let messageData;
        try {
            messageData = JSON.parse(message.value);
        } catch(e) {
            console.warn("Invalid JSON message from Kafka");
            return commit(consumer, message);
        }

        await addEventToDatabase(messageData);

        commit(consumer, message);
    })
}

async function addEventToDatabase(messageData) {
    return await prismaClient.event.create({
        data: {
            timestamp: messageData.timestamp,
            shop_id: messageData.shop_id,
            action_type_id: HistoryActionType[messageData.action_type]?.valueOf(),
            entity_type_id: HistoryEntityType[messageData.entity_type]?.valueOf(),
            entity_id: messageData.entity_id,
            entity_column: messageData.entity_column,
            value: messageData.value
        }
    })
}

function commit(consumer, message, cb) {
    consumer.setOffset(TOPIC_NAME, message.partition, message.offset+1);
    consumer.commit(cb ?? (()=>{}));
}