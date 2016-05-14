# Nappy

[![Build Status](https://travis-ci.org/rainvg/nappy.svg?branch=master)](https://travis-ci.org/rainvg/nappy)
[![Dependecies Status](https://david-dm.org/rainvg/nappy.svg)](https://david-dm.org)
​

**Nappy** is a little and simple **promise-based** library able to manage timeouts using promises.
It can be useful when you need to run a function after a certain time-condition.

Nappy provides an object `wait` that can be used to achieve a synchronized behavior in your application.
In particular, with this object you can:

*  Wait for a time expressed in millisecond
``` javascript
nappy.wait.for(1000).then(function()
{
    console.log("Hello, world!");
});
```
* Wait till a timestamp​
``` javascript
var timestamp = new Date().getTime() + 1000;
var date = new Date(timestamp);
nappy.wait.till(timestamp).then(function()
{
  console.log("I have been waiting till: " + date);
});
```

* Wait for a connection
​
``` javascript
nappy.wait.connection().then(function()
{
  console.log("Connection established!");
});
```
