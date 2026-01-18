import { ID, ISODateTime } from "../../domain/types";

export interface Command<TPayload = unknown> {
  type: string;
  userId: ID;
  payload: TPayload;
  timestamp: ISODateTime;
  idempotencyKey: string;
}
