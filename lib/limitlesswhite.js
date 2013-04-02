
var stream = require('stream')
  , util = require('util')
  , dgram = require('dgram')    
  ;

// Give our module a stream interface
util.inherits(LimitlessWhite,stream);
 
 
// Export it
module.exports=LimitlessWhite;

bridge_ip = "0.0.0.0"

/**
 * Creates a new Device Object
 *
 * @property {Boolean} readable Whether the device emits data
 * @property {Boolean} writable Whether the data can be actuated
 *
 * @property {Number} G - the channel of this device
 * @property {Number} V - the vendor ID of this device
 * @property {Number} D - the device ID of this device
 *
 * @property {Function} write Called when data is received from the cloud
 *
 * @fires data - Emit this when you wish to send data to the cloud
 */
function LimitlessWhite(channel,ip,nm,index,em) {
  
  var self = this;
  
  this.bridge_ip = ip;
  
  this.index = index; 
  this.em = em;
  this.state = false;
  // Ther channle corresponds to the light group  0 is all
  
  
   
  // This device will emit data
  this.readable = true;
  // This device can be actuated
  this.writeable = true;

  var name = channel + nm;
    
  this.G = name; // 0 = ALL Lights, 1,2,3,4 are the channels
  this.V = 0; // 0 is Ninja Blocks' device list
  this.D = 224; //  Gone with 224 / 1000 as generic RGB wheel needs to be replacd with a Dimmer light
  
  this.group = channel;
  
  this.em.on('change', function(message){
     self.updateState(message);
   });

  this._interval = setInterval(function() {
          // what is the write thing to do
            //    self.emit("data",self.state);
               self.updateState(self.state); 
                
        },3000);
        
      
  
};

/**
 * Called whenever there is data from the cloud
 * This is required if Device.writable = true
 *
 * @param  {String} data The data received
 */
 
LimitlessWhite.prototype.write = function(data) {

     var self= this;
     var state = JSON.parse(data);
     this.state = state.on; 
     var group = self.group;
    
    
   if (group == 0) { this.em.emit('change', this.state); }   

   if (state.on == true) {  SendLightMsg(group,1,self.G, self.bridge_ip);    }
   
   else if (state.on == false) { SendLightMsg(group,0,self.G, self.bridge_ip);  }  
   // todo is to dimm etc left to reader as exercise :-)
   

  
};

LimitlessWhite.prototype.updateState = function(newState) {

    var st = new Object
    st.on = newState;
    update = JSON.stringify(st);
    this.emit('data',update);   
    this.state = newState;

 }   


function SendLightMsg(group,state, name, ip)
{
             
       //  buffer is state 0 OFF, STATE 1 is ON, Group 0,1,2,3,4 0 is ALL
       //  Refer http://www.limitlessled.com/dev/ for Byte values
     
       var bufferArray = new Array();
       
       bufferArray[0] = new Array(0x39,0x3B,0x33,0x3A,0x36);
       bufferArray[1] = new Array(0x35,0x38,0x3D,0x37,0x32); 
              
       var message = new Buffer([bufferArray[state][group],0x0,0x55]);
        
        var client = dgram.createSocket('udp4');
        client.send(message, 0, message.length, 50000, ip, function(err, bytes)
        {
            if(err) throw err;
            client.close();
            
        });
       
               
       console.log("Changed Light " + group + " to State " + state + " for " + name + " at " + ip);                
};


      
 