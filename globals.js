module.exports = function() {

  // Global variables
  global.VERSION = 'v1.0.0';
  global.PROCESS = 'MAIN';
  global.REST    = 'REST';
  global.BLE     = 'BLE';
  global.SPEED   = [ { alias: 'stop', speed: 0 }, { alias: 'slow', speed: 300 }, { alias: 'medium', speed: 500 }, { alias: 'fast', speed: 800 } ];
  global.LANES   = [ { alias: 'inner', laneOffset: 68 }, { alias: 'middleinner', laneOffset: 24 }, { alias: 'middleouter', laneOffset: -24 }, { alias: 'outer', laneOffset: -68 } ];
  global.ANKIMANUFACTURERID = new Buffer([ 0xbe, 0xef, 0x00 ]);
}
