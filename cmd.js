#!/usr/bin/env node

var os = require('os')
var fs = require('fs')
var path = require('path')
var cp = require('child_process')
var http = require('http')

var platform = os.platform()
var tmp = os.tmpdir()
var scripts = {
  linux: path.join(__dirname, 'llnode-scripts', 'readelf2segments.py'),
  darwin: path.join(__dirname, 'llnode-scripts', 'otool2segments.py') 
}

if (process.argv.length < 3) {
  usage()
  return
}
if (platform !== 'linux' && platform !== 'darwin') {
  throw Error('Operating System not supported')
}

var core = process.argv[process.argv.length - 1]

if (core === 'setup') {
  cp.spawn(path.join(__dirname, 'node_modules', '.bin', 'llnode-setup'), {stdio: 'inherit'})
  return
}

var bin = process.argv.length > 3 ? 
  process.argv[process.argv.length - 2] :
  process.execPath

var ranges = path.join(tmp, path.basename(core) + '.ranges')
var makeRanges = cp.spawn('python', [scripts[platform], core], {stdio: ['inherit', 'pipe', 'inherit']})

makeRanges.stdout.pipe(fs.createWriteStream(ranges))
makeRanges.on('exit', function (code) { 
  if (code !== 0) {
    console.error('Error getting memory ranges')
    process.exit(code)
  }
  var lldb = cp.spawn('lldb', [bin, '-c', core], {
    stdio: 'inherit',
    env: Object.assign({}, process.env, {
      LLNODE_RANGESFILE: ranges
    })
  })
  lldb.on('error', function (err) {
    if (err.code === 'ENOENT') {
      console.error('Cannot find lldb, try running necropsy setup')
      return
    }
    throw err
  })
})

function usage () {
  console.log('\n   necropsy [node-binary] core-file\n')
  console.log('\n   necropsy setup\n')
}
