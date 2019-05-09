const ANSWAER_TYPE = {
  Gerenal : 0,
  FixedButtonPosition : 1,
  RandomButtonPosition : 2,
  ColorBlock : 3
};

var dataBaseRoot;

const socket = io();
var studentName = null;
var btnUserIsStudent;
var btnUserIsTeacher;
var answerType = null;

var colorBlock = {
  originX : 10,
  originY : 10,

  refresh : false,
  mainColor : null,
  differentColor : null,
  differentX : 0,
  differentY : 0,

  maxHoriBlockNumber : 10,
  maxVertBlockNumber : 10,
};

var answerArea = {
  canvas : null,
  canvasWidth : 700,
  canvasHeight : 500
};
var countDownTimer;
var processTimer;
var timeoutTimer;


function load()
{  
  var cookie = getCookie("student");
  console.log("getCookie(student) : " + cookie);
  
  if(null !== getCookie("student"))
  {
    document.getElementById("inputName").value = cookie;
  }
}

function setup() {
  answerArea.canvas = createCanvas(answerArea.canvasWidth, answerArea.canvasHeight);
  answerArea.canvas.parent('canvas');

  button1 = createButton('按我!');      
  button1.hide();
  button1.position(0, 0);  
  button1.mousePressed(click);

    
  database.ref(RealTime_DB_Path).on('value', function(snapshot) {
    //console.log(snapshot.val());
    var temp = snapshot.val();
    var list = [];

    for(var index in temp){      
      var obj = {
        Name : index,
        Score : temp[index]
      };
      list.push(obj);
    }
    list = list.sort(function(a, b){
      return a.Score > b.Score ? -1: 1;
    });
    scoreApp.userScore = list;
  });  
}

function draw() {
  if ( true == colorBlock.refresh) {
    colorBlock.refresh = false;
    var blockWidth = (answerArea.canvasWidth)/colorBlock.maxHoriBlockNumber;
    var blockHeight = (answerArea.canvasHeight)/colorBlock.maxVertBlockNumber;;
    for(hori=0; hori <colorBlock.maxHoriBlockNumber; hori++) {
      for(vert=0; vert <colorBlock.maxVertBlockNumber ; vert++) {
        if ((hori == colorBlock.differentX) && vert == colorBlock.differentY)
          fill(colorBlock.differentColor);
        else
          fill(colorBlock.mainColor);
        
        noStroke();
        rect(hori*blockWidth, vert*blockHeight, blockWidth-2, blockHeight-2, 4);
      }
    }
  }
}

//Send a event
function sendEvent(message,value){
  socket.emit(message,value); //The sendEvnt will send Event name, 
                          //Like broadcast in Scratch, and a value to another event listener.
}

function windowResized() {  
  resizeCanvas(windowWidth, windowHeight);
  colorBlock.refresh = true;
}

function click(){
  eventCall("student_answer", {"Name" : studentName});
  button1.hide();
}

function sendStudentName()
{
  if($("#inputName").val().trim() == "") return;
  studentName = $("#inputName").val().trim();
  $("#inputNameDiv").addClass("fadeOut");
  $("#student_name").text(studentName);

  console.log("sendStudentName");
  setCookie("student", studentName);
  
  setTimeout(()=>{
    $("#inputNameDiv").hide();
  },510);  
}
function btnSumbitClick() {
  sendStudentName();
  socket.emit("student_enter", studentName);
}

function keyTyped() {
  if(keyCode != 13) return;

  sendStudentName();
  socket.emit("student_enter", studentName);
}

function mouseClicked() {
  let c = get(mouseX, mouseY);  
  console.log('Mouse Clicked');
  switch(answerType)
  {
    case ANSWAER_TYPE.FixedButtonPosition:
      break;

    case ANSWAER_TYPE.FixedButtonPosition:
      clearInterval(processTimer);
      break;
      

    case ANSWAER_TYPE.ColorBlock:
      if(!colorBlock.differentColor) break;

      if (( c[0] == colorBlock.differentColor[0])
      &&  ( c[1] == colorBlock.differentColor[1])
      &&  ( c[2] == colorBlock.differentColor[2])){
        eventCall("student_answer", {"Name" : studentName});
        answerArea.canvas.hide();
      }
      break;
  }
}

(function(){
  console.log("Programming is running...");
 
  socket.on("AnswerRank",answerList=>{
    app.rank = answerList;
  });
})();

const database = firebase.database();

var app = new Vue({
  el:"#studentRank",
  data:{
    rank:[]
  }  
});

var scoreApp = new Vue({
  el:"#UserScore",
  data:{
    userScore:{}
  }
});

var socketEvents = {
  TeacherSendQuestion,
  TeacherSendStudentRank,
  TeacherEnter,
  TeacherExit
};

socket.on("event",e=>{
  if(e.eventName && typeof socketEvents[e.eventName] == "function"){
    socketEvents[e.eventName](e.data);
  }else{
    console.log(socketEvents[e.eventName]);
    throw "Event not exist";
  }
});

function eventCall(eventName,data){
  socket.emit("event_call",{
    eventName,
    data
  })
}

function TeacherSendQuestion(e){
  if(timeoutTimer)
    clearTimeout(timeoutTimer);

  if(processTimer)
    clearInterval(processTimer);

  button1.hide();
  answerArea.canvas.hide();

  countDownTimer = 0;
  switch(JSON.parse(e).type){
    case "BtnFixedPosition": 
      answerType = ANSWAER_TYPE.FixedButtonPosition;
      BtnPos(e);
      button1.show();
      break;

      case 'BtnRandomPosition' :
        answerType = ANSWAER_TYPE.RandomButtonPosition;
        RandomBtnPos(e);
        button1.show();
        break;

      case "ColorBlock" : 
        answerType = ANSWAER_TYPE.ColorBlock;
        DrawColorBlock(e);
        answerArea.canvas.show();
        break;
  }
  $("#countdown_timer").text('倒數 : ' + countDownTimer/1000 + ' 秒');  
}

function TeacherSendStudentRank(e){
  app.rank = e;
}

function TeacherExit(e){
}

function TeacherEnter(e){
}

function intervalFunc(rect, interval){
  var x = getRandomInt(rect.left, rect.right);
  var y = getRandomInt(rect.top, rect.bottom);
  button1.position(x, y);

  countDownTimer -= interval;
  // if(countDownTimer>0)
  // {
  //   $("#countdown_timer").text('倒數 : ' + countDownTimer/1000 + ' 秒');
  // }
  // else
  // {
  //   $("#countdown_timer").text('時間到了');
  // }
}

function RandomBtnPos(e){
  var json = JSON.parse(e);
  var rect = json.rect;
  var interval = json.interval;
  var timeout = json.timeout;

  countDownTimer = timeout;  
  processTimer = setInterval(intervalFunc, interval, rect, interval);
  timeoutTimer = setTimeout(function(){
    clearInterval(processTimer);
    button1.hide();
  }
  ,timeout);
}

function BtnPos(e){
  var pos = JSON.parse(e);
  button1.position(pos.x, pos.y);
  $("#studenRank").html('');
}

function countDown(interval){
  countDownTimer -= interval;
  // if(countDownTimer>0)
  // {
  //   $("#countdown_timer").text('倒數 : ' + countDownTimer/1000 + ' 秒');
  // }
  // else
  // {
  //   $("#countdown_timer").text('時間到了');
  // }
}

function DrawColorBlock (obj){
  var timeout = JSON.parse(obj).timeout;
  colorBlock = JSON.parse(obj).ColorBlock;
  colorBlock.refresh = true;
  
  countDownTimer = timeout;
  processTimer = setInterval(countDown, 1000, 1000);
  timeoutTimer = setTimeout(function(){
    clearInterval(processTimer);
    answerArea.canvas.hide();
  }
  ,timeout);
}


