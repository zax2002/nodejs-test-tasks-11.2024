// Read the .env file.
import * as dotenv from "dotenv";
dotenv.config();

// Require the framework
import Fastify from "fastify";

// Require library to exit fastify process, gracefully (if possible)
import closeWithGrace from "close-with-grace";

// Instantiate Fastify with some config
const server = Fastify({
  logger: true,
});

// Register your application as a normal plugin.
// const appPlugin = import("./src/app");
import { app } from "./src/app";
server.register(app);

// delay is the number of milliseconds for the graceful close to finish 
closeWithGrace({ delay: parseInt(process.env.FASTIFY_CLOSE_GRACE_DELAY || '500') }, async function ({ signal, err, manual }) {
  if (err) {
    server.log.error(err)
  }
  await server.close()
} as closeWithGrace.CloseWithGraceAsyncCallback)

// Start listening.
server.listen({ port: parseInt(process.env.PORT || '3000') }, (err: any) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
});
