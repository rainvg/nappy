var needle = require('needle');

// Settings

var _settings = {needle: {open_timeout: 5000, read_timeout: 5000}};

var wait = {
  for: function(milliseconds)
  {
    'use strict';
    return milliseconds <= 0 ? Promise.resolve() : new Promise(function(resolve)
    {
      setTimeout(resolve, milliseconds);
    });
  },
  till: function(timestamp)
  {
    'use strict';
    return wait.for(timestamp - new Date().getTime());
  },
  connection: function()
  {
    'use strict';
    var settings = {retry: 1000};

    return new Promise(function(resolve)
    {
      (function poll()
      {
        needle.get('https://api.ipify.org', _settings.needle, function(error, response)
        {
          if(!error && response.statusCode === 200 && /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$|^(([a-zA-Z]|[a-zA-Z][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z]|[A-Za-z][A-Za-z0-9\-]*[A-Za-z0-9])$|^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/.test(response.body))
            resolve();
          else
            wait.for(settings.retry).then(poll);
        });
      })();
    });
  }
};

function alarm(step, options)
{
  'use strict';

  if(!(this instanceof alarm))
    throw {code: 0, description: 'Constructor must be called with new.', url: ''};

  var self = this;

  // Constructor

  var _step = step;
  var _set = new Date().getTime() + _step;
  var _options = options || {};

  var _promise = {resolved: false};
  _promise.promise = new Promise(function(resolve, reject)
  {
    _promise.resolve = resolve;
    _promise.reject = reject;
  });

  // Main loop

  (function loop()
  {
    wait.till(_set).then(function()
    {
      var now = new Date().getTime();
      if(now >= _set)
      {
        if(_options.sleep_threshold && (now - _set) > _options.sleep_threshold)
        {
          self.reset();
          loop();
        }
        else
        {
          _promise.resolve();
          _promise.resolved = true;
        }
      }
      else
        loop();
    });
  })();

  // Methods

  self.reset = function(milliseconds)
  {
    if(typeof milliseconds === 'undefined')
      milliseconds = _step;

    if(_promise.resolved)
      throw {code: 1, description: 'Alarm already went off.', url: ''};

    _set = new Date().getTime() + milliseconds;
  };

  self.abort = function()
  {
    if(_promise.resolved)
      throw {code: 1, description: 'Alarm already went off.', url: ''};

    _promise.reject();
    _promise.resolved = true;
  };

  self.then = function(callback)
  {
    if(_promise.resolved)
      throw {code: 1, description: 'Alarm already went off.', url: ''};

    return _promise.promise.then(callback);
  };

  self.catch = function(callback)
  {
    if(_promise.resolved)
      throw {code: 1, description: 'Alarm already went off.', url: ''};

    return _promise.promise.catch(callback);
  };
}

module.exports = {
  wait: wait,
  alarm: alarm
};
