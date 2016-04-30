'use strict';

var chai = require('chai');
var chai_promised = require('chai-as-promised');
var sinon = require('sinon');
var sinon_chai = require('sinon-chai');

chai.use(chai_promised);
chai.use(sinon_chai);

exports.chai = chai;
exports.sinon = sinon;
exports.should = chai.should();
exports.exect = chai.expect;
exports.load = {
  test: function(name, path)
  {
    describe(name, function()
    {
      require(path)();
    });
  }
};
