import { Container } from '../../types'
import { LifeCycle } from '../../util/LifeCycle'
import express from 'express';
import expressPinoLogger from 'express-pino-logger';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import compress from 'compression';
import { makeErrorHandlers } from '../util/express-errors'
import Ddos from 'ddos';

const getCorsConfig = whitelist => ({
  exposedHeaders: 'authorization, x-refresh-token, x-token-expiry-time',
  origin: (origin, callback) => {
    if (!whitelist || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
});

function getError(error) {
  const port = error.port;
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof port === "string" ? `Pipe ${port}` : `Port ${port}`;
  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      return Error(`${bind} requires elevated privileges`);
    case "EADDRINUSE":
      return Error(`${bind} is already in use`);
    default:
      return error;
  }
}

export class ExpressServer extends LifeCycle {
  private container: Container;

  constructor(container: Container) {
    super();
    this.container = container;
    const config = container.config;
    const pino = container.pino;
    const expressPino = expressPinoLogger({
      logger: pino
    });

    const server = express();
    server.use(bodyParser.json());
    server.use(bodyParser.urlencoded({ extended: true }));
    server.use(cookieParser());
    server.use(expressPino);
    // gzip compression
    server.use(compress());
    // secure servers by setting various HTTP headers
    // @ts-ignore
    server.use(helmet());
    // enable CORS - Cross Origin Resource Sharing
    server.use(cors(getCorsConfig(config.corsWhitelist)));

    const errorHandlers = makeErrorHandlers(config.env);
    // if error is not an instanceOf APIError, convert it.
    server.use(errorHandlers.converter);
    // catch 404 and forward to error handler
    server.use(errorHandlers.notFound);
    // error handler, send stacktrace only during development
    server.use(errorHandlers.handler);

    const ddosConfig = {
      burst: config.ddosBurst,
      limit: config.ddosLimit,
    };
    const ddosInstance = new Ddos(ddosConfig);
    // npm module for preventing ddos attack. See more https://www.npmjs.com/package/ddos
    server.use(ddosInstance.express);
    /**
     * When running Express app behind a proxy we need to detect client IP address correctly.
     * For NGINX the following must be configured 'proxy_set_header X-Forwarded-For $remote_addr;'
     * @link http://expressjs.com/en/guide/behind-proxies.html
     */
    server.set('trust proxy', true);

    this.save(server);
  }

  async start() {
    const container = this.container;
    const port = container.config.serverPort;

    const server = this.get();

    return new Promise((resolve, reject) => {
      server
        .listen(port, () => {
          return resolve(`server listening on port ${port}.`);
        })
        .on('error', (err) => {
          return reject(getError(err))
        })
    })
  }


  get(): express.Application {
    // overriding return type of parent
    return super.get()
  }

  async stop() {
    const expressServer = this.get();
    if (expressServer) {
      // close server
    }
  }
}
