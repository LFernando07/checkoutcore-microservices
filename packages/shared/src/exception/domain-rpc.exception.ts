import { RpcException } from "@nestjs/microservices";
import { ErrorCode } from "../constants/error-codes";
import { ErrorCatalog } from "../constants/error-catalog";

export class DomainRpcException extends RpcException {
  constructor(code: ErrorCode) {
    super({
      code,
      ...ErrorCatalog[code],
    });
  }
}