var LimitlessWhite = require('./lib/limitlesswhite')
  , util = require('util')
  , configHandlers = require('./lib/config')
  , url = require('url')
  , events = require('events')
  , stream = require('stream');

  
// Give our module a stream interface
util.inherits(myModule,stream);

/**
 * Called when our client starts up
 * @constructor
 *
 * @param  {Object} opts Saved/default module configuration
 * @param  {Object} app  The app event emitter
 * @param  {String} app.id The client serial number
 *
 * @property  {Function} save When called will save the contents of `opts`
 * @property  {Function} config Will be called when config data is received from the cloud
 *
 * @fires register - Emit this when you wish to register a device (see Device)
 * @fires config - Emit this when you wish to send config data back to the cloud
 */
function myModule(opts,app) {

  var self = this;
  this.first = true;
  this._opts = opts;
  
  console.log(opts);

  app.on('client::up',function(){

    // The client is now connected to the cloud

    // Do stuff with opts, and then commit it to disk
    if (!opts.hasMutated) {
      opts.hasMutated = true;
    }

    self.save();
    if (self.first)
    {
        console.log(self._opts.urls.length);
        
        self._opts.urls.forEach(function(url,index)
         {
            var n = url.split('.');
            var eventEmitter = new events.EventEmitter();
            
            for(var i = 0; i < 5; i++) {
               light =  new LimitlessWhite(i,url,n[3],index,eventEmitter)
               self.emit('register', light ); 
            }          
         }); 
 
       self.first = false;
    }   
  //  self.emit('
  });
};

/**
 * Called when config data is received from the cloud
 * @param  {Object} config Configuration data
 */
myModule.prototype.config = function(config) {

};

myModule.prototype.updateAll = function(index,state) {
         
};

myModule.prototype.config = function(rpc,cb) {

  var self = this;

  if (!rpc) {
    return configHandlers.probe.call(this,cb);
  }

  switch (rpc.method) {
    case 'manual_set_url':     return configHandlers.manual_set_url.call(this,rpc.params,cb); break;
    case 'manual_get_url':     return configHandlers.manual_get_url.call(this,rpc.params,cb); break;
    case 'manual_show_remove': return configHandlers.manual_show_remove.call(this,rpc.params,cb); break;
    case 'manual_remove_url': return configHandlers.manual_remove_url.call(this,rpc.params,cb); break;

    default:                   return cb(true);                                              break;
  }
};

myModule.prototype.createswitchbyip = function(ipaddress,index) {

  
};

// Export it

module.exports = myModule;
