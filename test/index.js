'use strict';

var nappy = require('../src/index.js');

describe('wait', function()
{
  it('should wait for 1 second', function(done)
  {
    this.timeout(1500);
    return nappy.wait.for(1000).then(done);
  });

  var now = new Date().getTime() + 2000;
  it('should wait until ' + now, function(done)
  {
    this.timeout(2500);
    return nappy.wait.till(now).then(done);
  });

  it('should wait for connection');
});

describe('alarm', function()
{
  it('constructor must be called with new');
  it('should be reset');
  it('should abort');
  it('should throw already went off exception');
});
