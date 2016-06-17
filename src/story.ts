import { Utils } from "./utils";

export enum StoryState {
  Running,
  Success,
  Failed
}

export enum Severity {
  Debug,
  Verbose,
  Info,
  Warning,
  Error,
  Critical
}

export class Story {
  private _id = Utils.newGuid();
  constructor() {
  }
}
