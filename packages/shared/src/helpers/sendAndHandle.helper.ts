import { HttpException, ServiceUnavailableException } from "@nestjs/common"
import { firstValueFrom } from "rxjs";
import { ClientProxy } from '@nestjs/microservices';
import { ErrorCatalog } from "../constants/error-catalog";

export const sendAndHandle = async <T>(
  client: ClientProxy,
  pattern: string,
  data: any,
): Promise<T> => {
  try {
    return await firstValueFrom(client.send<T>(pattern, data));
  } catch (error: any) {
    if (error?.statusCode && error?.message) {
      throw new HttpException(
        {
          code: error.code,
          message: error.message,
        },
        error.statusCode,
      );
    }

    throw new ServiceUnavailableException(
      ErrorCatalog.SERVICE_UNAVAILABLE.message,
    );
  }
};

