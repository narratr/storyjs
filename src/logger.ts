import { Utils } from "./utils";

export enum Severity {
  Debug,
  Verbose,
  Info,
  Warning,
  Error,
  Critical
}

export interface LogEntry {
  message: string,
  date: number,
  severity: Severity
}

export class Logger {
  private _logs: Array<LogEntry> = [];

  constructor() {
  }

  public debug(message: string) {

  }

  private addLog(message: string, severity: Severity) {
    this.logs.push(<LogEntry>{message: message, date: Date.now(), severity: severity});
  }
}
