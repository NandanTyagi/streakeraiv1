import { Collection } from "mongodb";
import { EventStore } from "../../application/ports";
import { DomainEvent } from "../../domain/events";
import { ID, ISODateTime } from "../../domain/types";

export class MongoEventStore implements EventStore {
  constructor(private readonly collection: Collection<DomainEvent>) {}

  async append(events: DomainEvent[]): Promise<void> {
    if (events.length === 0) return;
    await this.collection.insertMany(events);
  }

  async listByUser(userId: ID): Promise<DomainEvent[]> {
    return this.collection
      .find({ userId })
      .sort({ createdAt: 1, _id: 1 })
      .toArray();
  }

  async listByUserAndRange(userId: ID, from: ISODateTime, to: ISODateTime): Promise<DomainEvent[]> {
    return this.collection
      .find({ userId, createdAt: { $gte: from, $lte: to } })
      .sort({ createdAt: 1, _id: 1 })
      .toArray();
  }
}
