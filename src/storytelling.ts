import * as story from "./story";
import * as formatters from "./formatters";

export class Storytelling {

  private static formatter = new formatters.TextStoryFormatter();

  public static defaultRuleset = new story.Ruleset('Default Ruleset', [<story.Rule> {
    name: 'Default Rule',
    shouldProcess: () => true,
    process: (story: story.Story) => {
      console.log(Storytelling.formatter.format(story, 'Default Rule'));
    }
  }]);

  public static beginNew(name: string): story.Story {
    return new story.Story(name, Storytelling.defaultRuleset);
  }
}
