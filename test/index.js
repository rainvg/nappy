'use strict';

// Vendor

var vendor = require('./vendor.js');
var sinon = vendor.sinon;
var should = vendor.should; // jshint ignore: line

// Mocks

var needle = require('needle');

// Files to be tested

var nappy = require('../src/index.js');

// Tests

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

  before(function()
  {
    var _retries = 0;
    sinon.stub(needle, 'get', function(url, callback)
    {
      if(_retries === 5)
      {
        var ip = '2.224.212.173';
        callback(undefined, {statusCode: 200, body: ip});
      }
      else
      {
        _retries++;
        callback({error: true}, {statusCode: 404, body: undefined});
      }
    });
  });

  it('should wait for connection', function(done)
  {
    this.timeout(5500);
    nappy.wait.connection().then(done);
  });

  after(function()
  {
    needle.get.restore();
  });
});

describe('alarm', function()
{
  it('constructor must be called with new', function(done)
  {
    var constructor_exception = {code: 0, description: 'Constructor must be called with new.', url: ''};
    nappy.alarm.should.throw(constructor_exception);
    done();
  });

  it('should be reset');
  it('should abort');
  it('should throw already went off exception');
});
