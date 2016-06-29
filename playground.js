var storytelling = require('./build/storytelling').Storytelling;

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
