import { calculateHash256 } from "./crypto";
import { backupPath, databasePath } from "../config";
import { readFileSync, writeFileSync } from "fs";

export interface DatabaseEntry {
  data: string;
  hash: string;
}
export interface Database {
  [key: string]: DatabaseEntry;
}
export interface DatabaseRequest {
  success: boolean;
  data: null | string;
  error: string;
  recoveredData: boolean;
  originalData: null | string;
}

export class DatabaseClient {
  private __database: Database;

  constructor() {
    const databaseAlreadyExists = this.read();
    if (databaseAlreadyExists) {
      this.__database = JSON.parse(databaseAlreadyExists);
    } else {
      this.__database = {};
    }
  }

  // backup functions
  // recovery functions
  private recover(key: string): boolean {
    try {
      const backup: Database = JSON.parse(readFileSync(backupPath, "utf-8"));
      const dataExists = backup[key];

      if (dataExists && calculateHash256(dataExists.data) === dataExists.data) {
        this.__database[key] = dataExists;
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  private read(): string | null {
    try {
      const existingDatabase: string = readFileSync(databasePath, "utf-8");
      return existingDatabase;
    } catch (error) {
      return null;
    }
  }
  private save() {
    writeFileSync(databasePath, JSON.stringify(this.__database), "utf-8");
  }
  private backup() {
    writeFileSync(backupPath, JSON.stringify(this.__database), "utf-8");
  }

  public get(key: string): DatabaseRequest {
    if (this.__database[key]) {
      const hash = calculateHash256(this.__database[key].data);
      // if data has been tampered with
      // return the data tampered with and the original data
      // warn user that data has been tampered with
      if (hash !== this.__database[key].hash) {
        const tamperedData = this.__database[key].data;

        // TODO: recover data mechanism
        // if data recovery is successful then return the recovered data
        // else just inform user data recovery has failed
        const dataWasRecoverable = this.recover(key);
        if (!dataWasRecoverable) {
          return {
            error: "Data has been tampered with and is not recoverable",
            success: false,
            data: tamperedData,
            recoveredData: true,
            originalData: "",
          };
        } else {
          return {
            error: "Data has been tampered with",
            success: false,
            data: tamperedData,
            recoveredData: true,
            originalData: this.__database[key].data,
          };
        }
      }
    }
    return {
      error: "Data request not found",
      success: false,
      data: null,
      recoveredData: false,
      originalData: null,
    };
  }

  public list(): Database {
    return { ...this.__database };
  }

  public set(key: string, value: string): string {
    const hash = calculateHash256(value);
    this.__database[key] = { data: value, hash: hash };

    // save database
    // and back it up
    this.save();
    this.backup();

    return hash;
  }
}

// instance of database with first data;
const databaseClient = new DatabaseClient();
databaseClient.set("data", "Hello World");

export { databaseClient };
