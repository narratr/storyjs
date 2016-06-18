import { Utils } from "./utils";

export enum StoryState {
  Running,
  Success,
  Failed
}

export class Story {
  private _id = Utils.newGuid();
  private _logger = new Logger();
  private _beginDate = Date.now();
  private _endDate;
  private _data = {};
  private _state = StoryState.RUNNING;
  private _chapters = [];

  constructor() {
  }

  public debug(message: string) {
    this._logger.debug(message);
  }
}
