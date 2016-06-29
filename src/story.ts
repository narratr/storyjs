import * as utils from "./utils";
import * as logger from "./logger";

export enum StoryState {
  Running,
  Success,
  Failed
}

export class Ruleset {
  constructor(public name: string, public rules?: Array<Rule>) {
    if (!this.rules) {
      this.rules = [];
    }
  }

  public process(story: Story) {
    for (var i = 0; i < this.rules.length; i++) {
      var rule = this.rules[i];
      if (rule && rule.shouldProcess(story)) {
          rule.process(story);
          return;
      }
    }
  }
}

export interface Rule {
  name: string;
  shouldProcess(story: Story): boolean;
  process(story: Story): void;
}

export class Story {
  private _id = utils.Utils.newGuid();
  private _logger = new logger.Logger();
  private _beginDate = Date.now();
  private _endDate: number;
  private _data: any = {};
  private _state = StoryState.Running;
  private _chapters: Array<Story> = [];

  constructor(private _name: string, private _ruleset: Ruleset) {
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
      this._ruleset && this._ruleset.process(this);
    }
  }

  public beginDate(): number {
    return this._beginDate;
  }

  public chapters(): Array<Story> {
    return this._chapters;
  }

  public duration() {
    return (this._endDate || Date.now()) - this._beginDate;
  }

  public allLogs(): Array<logger.LogEntry> {
    var logs: Array<logger.LogEntry> = [];
    Story.appendLogs(this, logs);
    return logs;
  }

  private static appendLogs(story: Story, logs: Array<logger.LogEntry>) {
    story.logs().forEach(log => logs.push(log));

    var chapters = story.chapters();

    for (var i = 0; i < chapters.length; i++) {
      Story.appendLogs(chapters[i], logs);
    }
  }

  public allData(): Array<utils.KeyValue> {
    var data: Array<utils.KeyValue> = [];
    Story.appendData(this, '', data);
    return data;
  }

  private static appendData(story: Story, prefix: string, data: Array<utils.KeyValue>) {
    var storyData = story.data();
    for (var i in storyData) {
      data.push({key: prefix + i, value: storyData[i]});
    }

    var chapters = story.chapters();

    for (var j = 0; j < chapters.length; j++) {
      var chapter = chapters[j];
      Story.appendData(chapter, prefix + chapter.name() + '.', data);
    }
  }

  public beginNew(name: string) {
    var chapter = new Story(name, null);
    this._chapters.push(chapter);
    return chapter;
  }
}
