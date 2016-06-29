import { StringBuilder } from "./utils";
import { Story } from "./story";

export interface StoryFormatter {
  format(story: Story, ruleName: string): string;
}

export class TextStoryFormatter implements StoryFormatter {

  public format(story: Story, ruleName: string): string {
    var str = new StringBuilder();
    var storyDate = story.beginDate();

    str.appendLine(new Date(storyDate).toString(), '\n  ', 'Story ', story.name(), '(', story.id(), ') on rule ', ruleName);

    var data = story.allData();
    for (var i = 0; i < data.length; i++) {
      var keyValue = data[i];
      str.appendLine('  ', keyValue.key, ' - ', keyValue.value);
    }

    str.appendLine();

    var logs = story.allLogs();

    for (var j = 0; j < logs.length; j++) {
      var log = logs[j];
      str.appendLine('  +', log.date - storyDate, ' ms ', log.severity, ' ', log.message);
    }

    this.appendStory(story, str, 1);
    str.appendLine();

    return str.toString();
  }

  public appendStory(story: Story, str: StringBuilder, level: number) {
    var spaces = new StringBuilder();
    for (var i = 0; i < level * 2; i++) {
      str.append(' ');
    }

    str.appendLine('- Story ', story.name(), ' took ', story.duration(), ' ms');

    var chapters = story.chapters();

    for (var i = 0; i < chapters.length; i++) {
      this.appendStory(chapters[i], str, level + 1);
    }
  }
}
