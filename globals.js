module.exports = function() {

  // Global variables
  global.VERSION = 'v1.0.0';
  global.PROCESS = 'MAIN';
  global.REST    = 'REST';
  global.BLE     = 'BLE';
  global.SPEED   = [ { alias: 'stop', speed: 0 }, { alias: 'slow', speed: 300 }, { alias: 'medium', speed: 500 }, { alias: 'fast', speed: 800 } ];
  global.LANES   = [ { alias: 'inner', laneOfset: -68 }, { alias: 'middleinner', laneOfset: -24 }, { alias: 'middleouter', laneOfset: 24 }, { alias: 'outer', laneOfset: 68 } ];
  global.ANKIMANUFACTURERID = new Buffer([ 0xbe, 0xef, 0x00 ]);
}
