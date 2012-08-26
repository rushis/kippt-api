/*
* Node.JS Kippt API Wrapper
* @author Ruslan Khissamov 
* @class Kippt
*
*/

var request = require('request');
var noOp = function(){};

var Kippt = function(opts){
  //defaults
  opts = opts || {};
  this.username           = opts.username    || '';
  this.password           = opts.password    || '';
  // oAuth Token
  this.accessToken        = opts.accessToken || '';
};

var createInstance = function(opts){
  return new Kippt(opts);
};

module.exports = (function(){
  var kippt = createInstance();
  kippt.createInstance = createInstance;
  return kippt;
})();

Kippt.prototype.setCredentials = function(username, password) {
  this.username = username;
  this.password = password;
};

Kippt.prototype.setAccessToken = function(token) {
  this.accessToken = token;
};

Kippt.prototype._request = function (options, callback) {
  var base;
  callback = callback || noOp;
  if (this.username && this.password) {
    base = 'https://'+this.username+':'+this.password+'@kippt.com/api';
  } else {
    base = 'https://kippt.com/api';
  }
  if (typeof(options) != "string") {
    options.uri = base + options.uri;
  }
  if (this.accessToken) {
    options.headers.Authorization = 'token ' + this.accessToken;
  }
  return request(options, function(error, response, body) {
    if (error) {
      callback(error, null);
    } else {
      switch(response.statusCode) {
        case 404:
          callback(new Error('Path not found'), null);
          break;
        case 422:
          callback(new Error(response.body.message), null);
          break;
        default:
          try {
            var data = JSON.parse(body);
            callback(null, data);
          } catch (error2) {
            callback(error2, null);
          }
      }
    }
  });
};

Kippt.prototype._get = function(path, callback) {
  return this._request({
    uri: path,
    headers: {
      'content-type':'application/json'
    }
  }, callback);
};

Kippt.prototype._put = function(path, body, callback) {
  body = body || '{}';
  return this._request({
    uri:path,
    method:'PUT',
    headers: {
      'content-type':'application/json',
      'Content-Length':body.length
    },
    body:body
  },
  callback);
};

Kippt.prototype._post = function(path, body, callback) {
  body = body || '{}';
  return this._request({
    uri:path,
    method:'POST',
    headers: {
      'content-type':'application/json',
      'Content-Length':body.length
    },
    body:body
  },
  callback);
};

Kippt.prototype._del = function(path, callback) {
  return this._request({
    uri:path,
    method: 'DELETE',
    headers: {
      'content-type':'application/json' 
    }
  },
  callback);
};

Kippt.prototype.getAccount = function(callback){
  return this._get('/account', callback);
};

Kippt.prototype.getLists = function(callback){
  return this._get('/lists', callback);
};

Kippt.prototype.getList = function(id, callback){
  return this._get('/lists/' + id, callback);
};

Kippt.prototype.postList = function(data, callback){
  return this._post('/lists', JSON.stringify(data), callback);
};

Kippt.prototype.putList = function(id, data, callback){
  return this._put('/lists/' + id, JSON.stringify(data), callback);
};

Kippt.prototype.delList = function(id, callback){
  return this._del('/lists/' + id, callback);
};

Kippt.prototype.getClipsList = function(offset, limit, id_list, callback){
  return this._get('/clips/?offset=' + offset + '&limit=' + limit + '&list=' + id_list + '&include_data=user', callback);
};

Kippt.prototype.getClips = function(callback){
  return this._get('/clips', callback);
};

Kippt.prototype.getClip = function(id, callback){
  return this._get('/clips/' + id, callback);
};

Kippt.prototype.postClip = function(data, callback){
  return this._post('/clips', JSON.stringify(data), callback);
};

Kippt.prototype.putClip = function(id, data, callback){
  return this._put('/clips/' + id, JSON.stringify(data), callback);
};

Kippt.prototype.delClip = function(id, callback){
  return this._del('/clips/' + id, callback);
};

Kippt.prototype.search = function(keyword, callback){
  return this._del('/search/clips/?q=' + keyword, callback);
};

Kippt.prototype.feed = function(limit, callback){
  return this._get('/?limit=' + limit + '&include_data=user,list,via', callback);
};

Kippt.prototype.articles = function(id, callback){
  return this._get(/articles/ + id, callback)
};