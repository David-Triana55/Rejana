import { Global, Module } from '@nestjs/common';
import { LOGGER_PORT } from '../../domain/ports/out/logger.port.js';
import { NestLoggerAdapter } from './nest-logger.adapter.js';

@Global()
@Module({
  providers: [{ provide: LOGGER_PORT, useClass: NestLoggerAdapter }],
  exports: [LOGGER_PORT],
})
export class LoggerModule {}
