function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

var defaultRuleset = {
  run: function(story) {
    console.log(story.toString());
  }
};

var StoryState = {
  RUNNING: 'running',
  SUCCESS: 'success',
  FAILED: 'failed'
};

var Severity = {
  DEBUG: 'debug',
  VERBOSE: 'verbose',
  INFO: 'info',
  WARNING: 'warn',
  ERROR: 'error',
  CRITICAL: 'critical'
};

function Story(name, ruleset) {
  var own = this;
  var logger = new Logger();
  var beginDate = Date.now();
  var endDate;
  var id = guid();
  var data = {};
  var state = StoryState.RUNNING;
  var chapters = [];

  this.name = function() { return name; };
  this.beginDate = function() { return beginDate; };
  this.endDate = function() { return endDate; };
  this.id = function() { return id; };
  this.data = function() { return data; };
  this.state = function() { return state; };
  this.logs = function() { return logger.logs; };

  this.add = function(key, value) {
    data[key] = value;
  };

  this.debug = function(message) { logger.debug(message); };
  this.verbose = function(message) { logger.verbose(message); };
  this.info = function(message) { logger.info(message); };
  this.warn = function(message) { logger.warn(message); };
  this.error = function(message) { logger.error(message); };
  this.critical = function(message) { logger.critical(message); };

  this.end = function() {
    if (!endDate) {
      endDate = Date.now();
      state = StoryState.SUCCESS;
      ruleset && ruleset.run(own);
    }
  };

  this.fail = function(error) {
    if (!endDate) {
      endDate = Date.now();
      state = StoryState.FAILED;
      ruleset && ruleset.run(own);
    }
  };

  this.duration = function() {
    return (endDate || Date.now()) - beginDate;
  };

  this.beginNew = function(name) {
    var chapter = Storytelling.beginNew(name);
    chapters.push(chapter);
    return chapter;
  };

  this.toString = function() {
    chaptersString = '\n';

    for (var i in chapters) {
      chaptersString += '\t' + chapters[i].toString() + '\n';
    }

    return beginDate + ' ' + own.duration() + ' ' + JSON.stringify(data) + ' ' + JSON.stringify(own.logs()) + chaptersString;
  };
}

function Logger() {
  var own = this;

  this.logs = [];

  this.debug = function(message) {
    addLog(message, Severity.DEBUG);
  };

  this.verbose = function(message) {
    addLog(message, Severity.VERBOSE);
  };

  this.info = function(message) {
    addLog(message, Severity.INFO);
  };

  this.warn = function(message) {
    addLog(message, Severity.WARNING);
  };

  this.error = function(message) {
    addLog(message, Severity.ERROR);
  };

  this.critical = function(message) {
    addLog(message, Severity.CRITICAL);
  };

  var addLog = function(message, severity) {
    own.logs.push({message: message, date: Date.now(), severity: severity});
  };
}

var Storytelling = {
  ruleset: defaultRuleset,
  beginNew: function(name) {
    var story = new Story(name, Storytelling.ruleset);
    return story;
  }
};

function run() {
  var story = Storytelling.beginNew('run');
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
