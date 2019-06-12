//Import
const socket = io();
const database = firebase.database();

//Global variables

//System config const
const sysConfig = {  
  canvas:{
    width: window.innerWidth/*700,*/,
    height: window.innerHeight/*500*/
  }
};

//System varibales
var system = {
  canvas:null
}

//Games object
var Games = {
  ForceClick:{
    init:()=>{
      var self = Games.ForceClick.vars; //Define self variable

      self.button1 = createButton('按我!');
      self.button1.hide();
      self.button1.position(0, 0);  

      self.button1.mousePressed(function(){
        eventCall("student_answer", {"Name" : studentName});
        $("#countdown_timer").text('哇！你找到了，好棒棒哦！');
        self.button1.hide();
        self.started = false;
        $("canvas").fadeOut();
      });
    },

    setup:function (data){
      var self = Games.ForceClick.vars; //Define self variable

      $("canvas").fadeIn(100);

      self.started = true;

      var buttonPosition = JSON.parse(data);
      self.button1.style("z-index","12");
      self.button1.addClass("randomButton");
      self.button1.position(
        buttonPosition.x * (window.innerWidth / 20),
        buttonPosition.y * (window.innerHeight / 20)
      );

      Vue.set(StudentRank,"rank",[]); //Clean the Student Rank list

      self.button1.show(); //Show the button to start the game
    },

    draw:()=>{
      var self = Games.ForceClick.vars;
      if(!self.started) return;

      $("#countdown_timer").text('按鈕在哪裡？');
    },

    end: function(){
      var self = Games.ForceClick.vars; //Define self variable

      self.button1.hide(); //Hide button1 when the game is ended.
      $("canvas").fadeOut();
      self.started = false; //Set started to false which will disable onClick event.
    },
    
    vars:{
      button1:null,
      started: false
    }
  },

  RandomForceClick:{
    init:()=>{
      var self = Games.RandomForceClick.vars; //Define self variable
      self.button1 = createButton('按不到我!');
      self.button1.hide();
      self.button1.position(0, 0);

      self.button1.mousePressed(function(){
        eventCall("student_answer", {"Name" : studentName});
        self.started = false;
        self.button1.hide();

        $("#countdown_timer").text('遊戲結束');

        $("canvas").fadeOut();
      });
    },

    setup:(data)=>{
      var self = Games.RandomForceClick.vars; //Define self variable

      self.started = true;

      Vue.set(StudentRank,"rank",[]); //Clean the Student Rank list

      self.config = JSON.parse(data); //Set some config data lile:
      /*  * rect
          * interval
          * timeout
      */

      self.button1.style("z-index","12");
      self.button1.addClass("randomButton");
      self.button1.show(); //Show the button to start the game
      self.lasttime.timeLimit = millis(); //Start timer.
      self.lasttime.loopTime = millis();

      $("canvas").fadeIn(100);
    },

    draw:function(){
      var self = Games.RandomForceClick.vars; //Define self variable
      if(!self.started) return; //If this game isn't start yet, break it.

      if(millis() - self.lasttime.loopTime > self.config.interval){
        var rect = self.config.rect;

        var x = getRandomInt(rect.left, rect.right);
        var y = getRandomInt(rect.top, rect.bottom);
        self.button1.position(x, y);

        self.lasttime.loopTime = millis();
      }

      $("#countdown_timer").text('倒數 : ' + ((self.config.timeout - (millis() - self.lasttime.timeLimit))  /1000).toFixed(2) + ' 秒');

      if(millis() - self.lasttime.timeLimit > self.config.timeout){ //If limit of time is over, stop the game
        self.started = false;
        self.button1.hide();
        $("#countdown_timer").text('時間到了');
      }
    },

    end: ()=>{
      var self = Games.RandomForceClick.vars; //Define self variable

      //Why not end the game?
      self.button1.hide();
      self.started = false;

      $("canvas").fadeOut();
    },

    vars:{
      button1:null,
      started:false,
      lasttime:{
        timeLimit:0,
        loopTime:0
      },
      config:{} //Some of config files
    }
  },

  FindColorDiff:{
    init:()=>{
      system.canvas.clear();
    },
    setup:(data)=>{
      var self = Games.FindColorDiff.vars;
      var methods = Games.FindColorDiff.methods;

      self.config = JSON.parse(data);

      self.timer.timeout = millis();
      system.canvas.show();

      self.started = true;

      methods.renderingBlocks(); //Rendering the block

    },
    draw:()=>{
      var self = Games.FindColorDiff.vars;
      if(!self.started) return;
      
      $("#countdown_timer").text('倒數 : ' + ((self.config.timeout - (millis() - self.timer.timeout))  /1000).toFixed(2) + ' 秒');
      
      if(millis() - self.timer.timeout > self.config.timeout){
        self.started = false;
        clear();
        //system.canvas.hide()
        $("canvas").fadeOut();
        $("#countdown_timer").text('時間到了');
      }
    },
    mouseClicked:()=>{
      var self = Games.FindColorDiff.vars;
      if(!self.started) return;

      var colorBlock = self.config.ColorBlock;

      var c = get(mouseX, mouseY);

      if(!colorBlock.differentColor) return;

      if (( c[0] == colorBlock.differentColor[0])
      &&  ( c[1] == colorBlock.differentColor[1])
      &&  ( c[2] == colorBlock.differentColor[2])){
        eventCall("student_answer", {"Name" : studentName});
        $("#countdown_timer").text('遊戲結束');
        self.started = false;
        //system.canvas.hide();
        $("canvas").fadeOut();
      }else{1
        console.log("failed")
      }
    },

    end:()=>{

    },

    vars:{
      timer:{
        timeout:0
      },
      started: false,
      config:{}
    },
    
    methods:{
      renderingBlocks:()=>{
        // colorBlock.refresh = false;
        //

        var topPadding = 70,
          leftPadding = 60;
        var self = Games.FindColorDiff.vars;

        var colorBlock = self.config.ColorBlock;
        var blockWidth = 
          (sysConfig.canvas.width - leftPadding) / colorBlock.maxHoriBlockNumber;
        var blockHeight = (sysConfig.canvas.height - topPadding) / colorBlock.maxVertBlockNumber;;
        for(hori=0; hori <colorBlock.maxHoriBlockNumber; hori++) {
          for(vert=0; vert <colorBlock.maxVertBlockNumber ; vert++) {
            if ((hori == colorBlock.differentX) && vert == colorBlock.differentY){
              fill(colorBlock.differentColor);
            }else
              fill(colorBlock.mainColor);
            
            noStroke();
            rect(hori*blockWidth + (leftPadding /2), vert*blockHeight + topPadding, blockWidth-2, blockHeight-2, 4);
          }
        }

        //End of method
      }
    }
  },
  
  SystemMenu:{
    init:()=>{
      var self = Games.SystemMenu.vars;

      $(".menu, .closeMenu").click(e=>{
        var drawerMenu = document.querySelector(".drawerMenu");

        self.toggleMenu = !self.toggleMenu;

        if(self.toggleMenu){
          console.log($(".drawer_menu"));
          $(".drawer_menu").fadeIn(); 
          console.log("open");

          $(".m-toolbar").fadeOut();
        }else{
          console.log($(".drawer_menu"));
          $(".drawer_menu").fadeOut(); 
          console.log("close");

          $(".m-toolbar").fadeIn();
        }
      });

      $("#gotoConsole").click(e=>{
        window.location.href = '/teacher.html';
      });
    },

    setup:()=>{
    },
     
    draw:()=>{
    },

    mouseClicked:()=>{
    },

    end:()=>{
    },

    vars:{
      toggleMenu:false
    }
  }
}

//Socket events
var socketEvents = {
  TeacherState,
  TeacherSendQuestion,
  TeacherSendStudentRank,
  TeacherEnter,
  TeacherExit,
  StudentReload:e=>{
    location.reload();
  }
};

const ANSWAER_TYPE = {
  Gerenal : 0,
  FixedButtonPosition : 1,
  RandomButtonPosition : 2,
  ColorBlock : 3,
  ColorNumberBtn : 4
};

var dataBaseRoot;
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

//Events
window.addEventListener("load",function(){  
  var cookie = getCookie("student");
  console.log("getCookie(student) : " + cookie);
  
  if(null !== getCookie("student"))
  {
    document.getElementById("inputName").value = cookie;
  }
});


function setup() {
  // answerArea.canvas = createCanvas(answerArea.canvasWidth, answerArea.canvasHeight);
  // answerArea.canvas.parent('canvas');

  system.canvas = createCanvas(sysConfig.canvas.width, sysConfig.canvas.height);
  system.canvas.style("display","none");
  // system.canvas.parent('canvas');

  //Run each game init
  for(var index in Games){
    var game = Games[index];

    if(typeof game != "object") continue;

    try{
      game.init();
    }catch(e){
      console.log(e);
    }
  }

  // button1 = createButton('按我!');
  // button1.hide();
  // button1.position(0, 0);  
  // button1.mousePressed(click);
}

function draw() {
  // if ( true == colorBlock.refresh) {
  //   try{
  //     rendering();
  //   }catch(e){
  //     console.log(e);
  //   }
  // }

  //Run each game of draw()
  for(var index in Games){
    var game = Games[index];

    try{
      if(game.draw)
        game.draw();
    }catch(e){
      console.log(e);
    }
  }

  function rendering(){
    colorBlock.refresh = false;
    var blockWidth = (answerArea.canvasWidth)/colorBlock.maxHoriBlockNumber;
    var blockHeight = (answerArea.canvasHeight)/colorBlock.maxVertBlockNumber;;
    for(hori=0; hori <colorBlock.maxHoriBlockNumber; hori++) {
      for(vert=0; vert <colorBlock.maxVertBlockNumber ; vert++) {
        if ((hori == colorBlock.differentX) && vert == colorBlock.differentY){
          fill(colorBlock.differentColor);
        }else
          fill(colorBlock.mainColor);
        
        noStroke();
        rect(hori*blockWidth, vert*blockHeight, blockWidth-2, blockHeight-2, 4);
      }
    }
  }
}

// function click(){
//   eventCall("student_answer", {"Name" : studentName});

//   for(var index in Games){
//     var game = Games[index];

//     try{
//       game.on.click();
//     }catch(e){
//       console.log(e);
//     }
//   }
//   // button1.hide();
// }


function windowResized() {  
  resizeCanvas(windowWidth, windowHeight);
  colorBlock.refresh = true;
}

function sendStudentName()
{
  if($("#inputName").val().trim() == "") return;
  studentName = $("#inputName").val().trim();
  $("#inputNameDiv").addClass("fadeOut");
  $(".student_name").text(studentName);
  
  setCookie("student", studentName);  
  setTimeout(()=>{
    $("#inputNameDiv").hide();
  },510);  
}
function btnSumbitClick() {
  sendStudentName();
  socket.emit("student_enter", studentName);
  console.log('Tx student_enter');
}

function keyTyped() {
  if(keyCode != 13) return;

  sendStudentName();
  socket.emit("student_enter", studentName);
  console.log('Tx student_enter');

  Vue.set(scoreStudentRank, "username", studentName);
}

function mouseClicked() {
  for(var index in Games){
    var game = Games[index];

    try{
      if(game.mouseClicked)
      game.mouseClicked();
    }catch(e){
      console.log(e);
    }
  }
}

(function(){
  console.log("Programming is running...");
 
  socket.on("AnswerRank",answerList=>{
    StudentRank.rank = answerList;
  });
})();

var StudentRank = new Vue({
  el:"#studentRank",
  data:{
    rank:[]
  }  
});

var scoreStudentRank = new Vue({
  el:"#UserScore",
  data:{
    userScore:{},
    username:""
  }
});

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

function TeacherState(e)
{
  console.log('TeacherState');
  switch(JSON.parse(e).type){
    case "Ready": 
      var dbPath = JSON.parse(e).DB_Path;
      database.ref(dbPath).on('value', function(snapshot) {
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
        scoreStudentRank.userScore = list;
      });
      break;
  }
}
function TeacherSendQuestion(e){
  
  console.log("Type : " + JSON.parse(e).type);
  
  if(timeoutTimer)
    clearTimeout(timeoutTimer);

  if(processTimer)
    clearInterval(processTimer);

  //Stop all games when another game is starting
  for(var index in Games){
    var game = Games[index];

    try{
      game.end();
    }catch(e){
      console.log(e);
    }
  }

  system.canvas.hide();

  countDownTimer = 0;
  
  $("#description").text('');
  colorNumberButtons.forEach(function(button){     
    button.remove();
  });

  switch(JSON.parse(e).type){
    case "BtnFixedPosition": 
      Games.ForceClick.setup(e);
      break;

    case 'BtnRandomPosition' :
      Games.RandomForceClick.setup(e);
      break;

    case "ColorBlock" : 
      Games.FindColorDiff.setup(e);
      break;

    case "NumberOrderByColor" : 
        answerType = ANSWAER_TYPE.ColorNumberBtn;
        DrawColorNumberBtn(e);
        //answerArea.canvas.show();
        break;        
  }
  $("#countdown_timer").text('倒數 : ' + countDownTimer/1000 + ' 秒');  
}

function TeacherSendStudentRank(e){
  StudentRank.rank = e;
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
  if(countDownTimer>0)
  {
    $("#countdown_timer").text('倒數 : ' + countDownTimer/1000 + ' 秒');
  }
  else
  {
    $("#countdown_timer").text('時間到了');
  }
}

function RandomBtnPos(e){
  var json = JSON.parse(e);
  var rect = json.rect;
  var interval = json.interval;
  var timeout = json.timeout;

  countDownTimer = timeout;  
  setInterval()
  processTimer = setInterval(intervalFunc, interval, rect, interval);
  timeoutTimer = setTimeout(function(){
    clearInterval(processTimer);
    button1.hide();
  }
  ,timeout);
}

// function BtnPos(e){
//   var pos = JSON.parse(e);
//   button1.position(pos.x, pos.y);
//   $("#studenRank").html('');
// }

function countDown(interval){
  countDownTimer -= interval;

  if(countDownTimer>0)
  {
    $("#countdown_timer").text('倒數 : ' + countDownTimer/1000 + ' 秒');
  }
  else
  {
    $("#countdown_timer").text('時間到了');
  }  
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

var colorNumberResult = false;
var colorOrder = [];
var colorNumberLength = 0;
var colorNumberColor;
var colorNumberButtons = [];
function colorNumberClicked(){

  var number = Number(this.elt.innerText); 
  var result = true;
  
  this.hide();

  if(colorOrder.length>0){
    if('Pinky' == colorNumberColor)
    {
      console.log('#1 : ' + colorNumberColor);
      console.log('In : ' + number);
      console.log('last : ' + colorOrder[colorOrder.length-1])
      if(number>colorOrder[colorOrder.length-1])
        result = false;
    }
    else  
    {
      console.log('#2 : ' + colorNumberColor);
      console.log('In : ' + number);
      console.log('last : ' + colorOrder[colorOrder.length-1])

      if(number<colorOrder[colorOrder.length-1])
        result = false;
    }
  }
  
  if( false == result){
    colorNumberButtons.forEach(function(button){     
      button.show();
    });
    colorOrder = [];
    return;
  }
  colorOrder.push(number);

  
  if(colorOrder.length == colorNumberLength)
  {
    colorNumberResult = true;
  }
  if ( true == colorNumberResult)
    eventCall("student_answer", {"Name" : studentName});

  console.log (colorOrder);    
}

function DrawColorNumberBtn(obj)
{
  var timeout = JSON.parse(obj).Timeout;
  var color = JSON.parse(obj).Color;
  var numbers = JSON.parse(obj).Numbers;
  var xPosition = JSON.parse(obj).XPosition;
  var yPosition = JSON.parse(obj).YPosition;

  colorNumberResult = false;
  colorOrder = [];
  colorNumberLength = numbers.length;
  colorNumberColor = color;

  colorNumberButtons = new Array(numbers.length);

  var i=0;
  numbers.forEach(function(number) {
    //console.log(number);
    colorNumberButtons[i] = createButton(number);
    colorNumberButtons[i].position(xPosition[i], yPosition[i]);
    colorNumberButtons[i].mousePressed(colorNumberClicked)
    if('Pinky' == color){
      colorNumberButtons[i].attribute("class", "button pinky");
      $("#description").text('由大到小');
    }
    else{
      colorNumberButtons[i].attribute("class", "button blue");
      $("#description").text('由小到大');
    }
    i++;
  });

  
  
  countDownTimer = timeout;
  processTimer = setInterval(countDown, 1000, 1000);
  timeoutTimer = setTimeout(function(){
    clearInterval(processTimer);

    colorNumberButtons.forEach(function(button){     
      button.remove();
    });
  }
  ,timeout);  
  
}
