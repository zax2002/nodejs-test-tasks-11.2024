import express from 'express'

import { kafkaClient } from './modules/kafka.js';
import { prismaClient } from './modules/prisma.js';
import { HistoryActionType } from './enums.js';



const app = express()

app.get('/history', async (request, response) => {
    const offset = parseInt(request.query.offset) || 0;
    const limit = parseInt(request.query.limit) || 20;
    
    if(limit > 100 || limit < 0)
        return response.status(400).json({error: "limit cannot be <0 and >100"});

    const timestampFrom = parseInt(request.query.timestamp_from) || undefined;
    const timestampTo = parseInt(request.query.timestamp_to) || undefined;

    const actionTypeId = HistoryActionType[request.query.action_type]?.valueOf();
    if(request.query.action_type !== undefined && actionTypeId === undefined) {
        return response.json([]);
    }

    const events = await prismaClient.event.findMany({
        where: {
            shop_id: parseInt(request.query.shop_id) || undefined,
            plu: {
                equals: request.query.plu,
                mode: 'insensitive'
            },
            timestamp: {
                gte: timestampFrom,
                lte: timestampTo
            },
            action_type_id: actionTypeId
        },
        skip: offset,
        take: limit
    })

    response.json(events)
})


const server = app.listen(4000)