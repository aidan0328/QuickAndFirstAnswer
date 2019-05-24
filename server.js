//Import
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//Global variable
var serverIP;

//-------------------------------
//取得本地 IP
var os = require('os');  
var networkInterfaces = os.networkInterfaces(); 
 
for(var i in networkInterfaces){
  for(var j in networkInterfaces[i])
  if(networkInterfaces[i][j].family=='IPv4')
  {
    if('127.0.0.1' !== networkInterfaces[i][j].address){
      serverIP = networkInterfaces[i][j].address;
    }      
  }
}
//--------------------------------


app.use(express.static(__dirname +'/public'));

io.on('connection', function(socket){
  onConnect(socket);
});

//io

http.listen(8080, function(){
  console.log('在瀏覽器的網址請輸入 ' + serverIP +':8080');
  //openBrowser(serverIP +':8080');
});

var teacherSocket = null;
var students = [];

function onConnect(socket){
  console.log(socket.id + ' 已連上線了');
  socket.emit("connection")
  //console.log("User id:"+socket.id);

  socket.on('disconnect', function(e){
    console.log(socket.id + ' 已連離線了');
    if( socket == teacherSocket ) {
      teacherSocket = null;
    } else {
      if(null != teacherSocket) {
        var name;
        for(var i in students) {
          if(socket.id == students[i].ID) {
            name = students[i].Name;
            students.splice(i, 1);
          }
        }

        teacherSocket.emit("event",{
          eventName:'student_exit',
          data:name,
          id:socket.id
        });
      }
      console.log(students);
      /*var pos = students.indexOf(socket.id);
      if(pos>0)
        students.slice(pos,1);*/
    }
  });

  socket.on("event_call",e=>{
    //console.log("Some call the event: "+socket.id +  "," + e.eventName);
    e.id = socket.id;
    socket.broadcast.emit("event",e);
  })

  socket.on("TeacherEnter",e=>{
    console.log('I am teacher. Teacher Socket is ' +　socket.id);
    teacherSocket = socket;
    if(students.length>0) {
      students.forEach(function(e){
        teacherSocket.emit("event",{
          eventName:'student_enter',
          data:e.Name,
          id:e.ID,
        });
      });
    }
  })

  socket.on("student_enter",e=>{

    if( null != teacherSocket ) {
      teacherSocket.emit("event",{
        eventName:'student_enter',
        data:e,
        id:socket.id,
      });     
    }

    for(var i in students) {
      if( e === students[i].Name){
        console.log(e + '已經上線了');
        return;
      }
    }
    console.log('I am ['+ e + ']. Socket ID : ' +　socket.id);
    var obj = {
      ID : socket.id,
      Name : e
    };
    students.push(obj);
  })
}
