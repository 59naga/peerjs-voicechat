// Dependencies
var express= require('express')
var http= require('http')
var socketIo= require('socket.io')
var ExpressPeerServer= require('peer').ExpressPeerServer

// Environment
var port= process.env.PORT || 59798
var options= {
    debug: true
}

// Routes
var app= express()
var server= http.Server(app)
var io= socketIo(server)
var expressPeerServer= ExpressPeerServer(server, options)
app.get('/', (req, res, next)=>{
  res.sendFile(__dirname+'/index.html')
})

app.use('/api', expressPeerServer)

server.listen(port)

// audio rooms
var keys= []
expressPeerServer.on('connection',(key)=>{
  keys.push(key)

  console.log('connected',keys)
  
  io.emit('keys',keys)
})
expressPeerServer.on('disconnect',(key)=>{
  var index= keys.indexOf(key)
  if(index>-1){
    keys.splice(index,1)
  }
  console.log('disconnect',keys)

  io.emit('keys',keys)
})