import { isArray } from "lodash";
import { createPool, OkPacket, Pool, RowDataPacket } from "mysql2/promise";

import { SchemaEntryTypes, Schemas } from "./schemas";

function isDataRow(row: RowDataPacket | OkPacket): row is RowDataPacket {
  return row.constructor.name === "RowDataPacket";
}

export interface ConnectionInfo {
  host: string;
  port: number;
  user: string;
  password: string;
  schema: string;
}

export default class Database {
  public static open(info: ConnectionInfo): Database {
    const pool = createPool({
      connectionLimit: 3,
      database: info.schema,
      host: info.host,
      password: info.password,
      port: info.port,
      queueLimit: 3,
      user: info.user,
      waitForConnections: true
    });

    return new Database(pool);
  }

  private constructor(private readonly pool: Pool) {}

  public async all<TSchema extends Schemas, TEntry = SchemaEntryTypes[TSchema]>(
    schema: TSchema
  ): Promise<ReadonlyArray<TEntry>> {
    const [rows] = await this.pool.query(`SELECT * FROM ${schema}`);
    if (!isArray(rows)) {
      throw new Error("Query SQL did not return an array-type of results.");
    }

    const results: any[] = [];
    for (const row of rows) {
      if (isArray(row)) {
        throw new Error("Database does not support multi-queries yet.");
      }

      if (!isDataRow(row)) {
        throw new Error("query() cannot be used for execution SQL queries.");
      }

      results.push(row);
    }

    return results;
  }
}
