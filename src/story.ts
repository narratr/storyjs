import { Utils } from "./utils";
import * as logger from "./logger";

export enum StoryState {
  Running,
  Success,
  Failed
}

export interface Ruleset {
  run(story: Story): void;
}

export class Storytelling {

  public static defaultRuleset = <Ruleset> {
    run: (story: Story) => {
      console.log(story.format());
    }
  };

  public static beginNew(name: string): Story {
    var story = new Story(name, Storytelling.defaultRuleset);
    return story;
  }
}

export class Story {
  private _id = Utils.newGuid();
  private _logger = new logger.Logger();
  private _beginDate = Date.now();
  private _endDate: number;
  private _data: any = {};
  private _state = StoryState.Running;
  private _chapters: Array<Story> = [];

  constructor(private _name: string, private _ruleset: any) {
  }

  public name(): string {
    return this._name;
  }

  public id(): string {
    return this._id;
  }

  public state(): StoryState {
    return this._state;
  }

  public logs(): Array<logger.LogEntry> {
    return this._logger.logs();
  }

  public data(): any {
    return this._data;
  }

  public debug(message: string) {
    this._logger.debug(message);
  }

  public verbose(message: string) {
    this._logger.verbose(message);
  }

  public info(message: string) {
    this._logger.info(message);
  }

  public warn(message: string) {
    this._logger.warn(message);
  }

  public error(message: string) {
    this._logger.error(message);
  }

  public critical(message: string) {
    this._logger.critical(message);
  }

  public add(name: string, value: any) {
    this._data[name] = value;
  }

  public end() {
    this.internalEnd(StoryState.Success);
  }

  public fail(error: any) {
    this.add('error', error);
    this.internalEnd(StoryState.Failed);
  }

  private internalEnd(state: StoryState) {
    if (!this._endDate) {
      this._endDate = Date.now();
      this._state = state;
      this._ruleset && this._ruleset.run(this);
    }
  }

  public duration() {
    return (this._endDate || Date.now()) - this._beginDate;
  }

  public beginNew(name: string) {
    var chapter = Storytelling.beginNew(name);
    this._chapters.push(chapter);
    return chapter;
  }

  public format() {
    var chaptersString = '\n';

    for (var i in this._chapters) {
      chaptersString += '\t' + this._chapters[i].format() + '\n';
    }

    return this._beginDate + ' ' + this.duration() + ' ' + JSON.stringify(this._data) + ' ' + JSON.stringify(this.logs) + chaptersString;
  }
}
