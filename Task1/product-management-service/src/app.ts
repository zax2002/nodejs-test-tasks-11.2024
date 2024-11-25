import { join } from 'path';
import AutoLoad, {AutoloadPluginOptions} from '@fastify/autoload';
import { FastifyPluginAsync, FastifyServerOptions } from 'fastify';
import { productsSchemas } from './routes/products/products.schema';
import { stockSchemas } from './routes/stocks/stocks.schema';
import fastifyKafkaJS from 'fastify-kafkajs';

export interface AppOptions extends FastifyServerOptions, Partial<AutoloadPluginOptions> {

}
// Pass --options via CLI arguments in command to enable these options.
const options: AppOptions = {
}

const app: FastifyPluginAsync<AppOptions> = async (
    fastify,
    opts
): Promise<void> => {
  // Place here your custom code!

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  void fastify.register(AutoLoad, {
    dir: join(__dirname, 'plugins'),
    options: opts
  })

  // This loads all plugins defined in routes
  // define your routes in one of these
  void fastify.register(AutoLoad, {
    dir: join(__dirname, 'routes'),
    options: opts
  })

  if(process.env.KAFKA_ADDRESS === undefined)
    throw new Error("Variable KAFKA_ADDRESS in not set");

  fastify.register(fastifyKafkaJS, {
    clientConfig: {
        brokers: [process.env.KAFKA_ADDRESS],
        clientId: 'product-management-service'
    },
  })

  for (const schema of [...productsSchemas, ...stockSchemas]) {
    fastify.addSchema(schema);
  }
}; 

export default app;
export { app, options }
