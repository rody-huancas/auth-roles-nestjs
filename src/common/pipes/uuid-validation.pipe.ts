import { BadGatewayException, Injectable, ParseUUIDPipe,  } from '@nestjs/common';

@Injectable()
export class UUIDValidationPipe extends ParseUUIDPipe {
  constructor() {
    super({
      exceptionFactory: () => new BadGatewayException("ID no válido")
    })
  }
}