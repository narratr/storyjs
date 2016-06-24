var storytelling = require('./build/story').Storytelling;

function run() {
  var story = storytelling.beginNew('run');
  story.add('user', 'myuser');
  story.info('running running');
  innerRun(story);
  story.end();
}

function innerRun(story) {
  var chapter = story.beginNew('innerRun');
  chapter.fail('error');
}

run();
