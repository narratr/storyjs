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

  public logs(): Array<LogEntry> {
    return this._logs;
  }

  public debug(message: string) {
    this.addLog(message, Severity.Debug);
  }

  public verbose(message: string) {
    this.addLog(message, Severity.Verbose);
  }

  public info(message: string) {
    this.addLog(message, Severity.Info);
  }

  public warn(message: string) {
    this.addLog(message, Severity.Warning);
  }

  public error(message: string) {
    this.addLog(message, Severity.Error);
  }

  public critical(message: string) {
    this.addLog(message, Severity.Critical);
  }

  private addLog(message: string, severity: Severity) {
    this._logs.push(<LogEntry>{message: message, date: Date.now(), severity: severity});
  }
}
