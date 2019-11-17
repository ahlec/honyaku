import { isArray } from "lodash";
import { createPool, Pool } from "mysql2/promise";

import { SchemaEntryProtoTypes, SchemaEntryTypes, Schemas } from "./schemas";

export interface ConnectionInfo {
  host: string;
  port: number;
  user: string;
  password: string;
  schema: string;
}

export interface CreationResult {
  id: number;
}

export const CURRENT_TIMESTAMP = {
  toSqlString() {
    return "CURRENT_TIMESTAMP()";
  }
};

export default class Database {
  public static open(info: ConnectionInfo): Database {
    const pool = createPool({
      connectionLimit: 3,
      database: info.schema,
      host: info.host,
      password: info.password,
      port: info.port,
      queueLimit: 3,
      timezone: "Z",
      user: info.user,
      waitForConnections: true
    });

    return new Database(pool);
  }

  private constructor(private readonly pool: Pool) {}

  public async create<TSchema extends Schemas>(
    schema: TSchema,
    proto: SchemaEntryProtoTypes[TSchema]
  ): Promise<CreationResult> {
    const [result] = await this.pool.query(
      `INSERT INTO ${schema} SET ?`,
      proto
    );
    if (isArray(result)) {
      throw new Error("Query SQL returned an array rather than an object.");
    }

    return { id: result.insertId };
  }

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

      results.push(row);
    }

    return results;
  }
}
