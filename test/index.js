'use strict';

var chai = require('chai');
var sinon = require('sinon');
var needle = require('needle');
var sinon_chai = require('sinon-chai');
var expect = chai.expect;

chai.use(sinon_chai);

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

  before(function()
  {
    sinon.stub(needle, 'get', function(url, callback)
    {
      var ip = '2.224.212.173';
      callback(undefined, {statusCode: 200, body: ip});
    });
  });

  it('should wait for connection', function(done)
  {
    nappy.wait.connection().then(done);
  });

  after(function()
  {
    needle.get.restore();
  });
});

describe('alarm', function()
{
  it('constructor must be called with new', function()
  {
    var constructor_exception = {code: 0, description: 'Constructor must be called with new.', url: ''};
    return expect(nappy.alarm).to.throw(constructor_exception);
  });

  it('should be reset');
  it('should abort');
  it('should throw already went off exception');
});
