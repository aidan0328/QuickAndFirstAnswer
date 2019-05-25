const socket = io();
var realTimeDBPath;
var studentList = [];
var database = firebase.database();
var dataBaseRoot;

var schoolSelector;
var classSelector;
var realTimeDB_data;

function eventCall(eventName,data){
  socket.emit("event_call",{
    eventName,
    data
  })
}

function SendRealTimeDBPath()
{
  if( null != realTimeDBPath){
    var value = JSON.stringify({
      type:"Ready",
      DB_Path:realTimeDBPath,
    });    
    eventCall("TeacherState",value); //Send a event with value  
    console.log('Send TeacherState');
  }
}
function selectClassrom() {
  var selectedSchoole = schoolSelector.value();
  var selectedClassroom = classSelector.value();
  realTimeDBPath = '/'+ selectedSchoole  + '/' + selectedClassroom + '/';

  /* 根據選定的班級，載入學生名單與分數 */
  for(var schoole in realTimeDB_data){
    if(schoole == selectedSchoole) {
      for(var classroom in realTimeDB_data[schoole]){
        if(classroom == selectedClassroom) {        
          var studentList = [];
          for(var student in realTimeDB_data[schoole][classroom]){
            studentList.push(student);
          }
          var text="";
          for(var index in studentList){
            text += studentList[index];
            if(index < (studentList.length-1))
              text += '\n';
          }
          displayStudentList(text);
          break;
        }
      }
    }
  }

  database.ref(realTimeDBPath).on('value', function(snapshot) 
  {
      app.studentScore = [];
      var temp = snapshot.val();
      for(var index in temp){      
        var obj = {
          Name : index,
          Score : temp[index]
        };
        app.studentScore.push(obj);
      }
      for(var i in app.student ){
        for(var j in app.studentScore){
          if( app.student[i].Name == app.studentScore[j].Name) {
            app.student[i].Score = app.studentScore[j].Score;

            Vue.set(app.student, i,{
              Name : app.studentScore[j].Name,
              Score : app.studentScore[j].Score,
              State : app.student[i].State
            });
          }
        }
      }
    });
    SendRealTimeDBPath();
}

function selectSchool() {
  var selectedSchoole = schoolSelector.value();

  /* 根據選定的學校，從 RealTime DB 載入班級清單 */
  if( selectedSchoole in realTimeDB_data){  
    for(var schoole in realTimeDB_data){
      if(schoole == selectedSchoole) {
        if( null != classSelector)
          classSelector.remove();
        classSelector = createSelect();
        classSelector.position(550, 8);
        classSelector.option('請選擇班級');
        for(var classroom in realTimeDB_data[schoole]){
          classSelector.option(classroom);
        }
        classSelector.changed(selectClassrom);
      }
    }
  }  
}

function setup() {   
  /* 從 RealTime DB 載入學校清單 */
  database.ref("/").once('value', function(snapshot) {
    realTimeDB_data = snapshot.val();
    schoolSelector = createSelect();
    schoolSelector.option('請選擇學校');
    schoolSelector.position(300, 8);
    for(var item in realTimeDB_data){
      schoolSelector.option(item);
    }
    schoolSelector.changed(selectSchool);
  });  
}

function displayStudentList(text){

  var originList = text.split("\n");
  app.student_list = [];
  app.student = [];
  for(var index in originList){
    var name = originList[index].split(":")[0]
    app.student_list[index] = name;
    app.student[index] = {Name:name, Score:0, State:''};
  }
  
  for(var i in app.student ){
    for(var j in app.studentScore){
      if( app.student[i].Name == app.studentScore[j].Name) {
        app.student[i].Score = app.studentScore[j].Score;          
      }
    }
  }

  for(var i in app.student ){
    for(var j in app.connectedList){
      if( app.student[i].Name == app.connectedList[j]) {
        app.student[i].State = 'V  ';
      }
    }
  }
}

(function(){
  //Import
  

  //Global Variables
  var btnLoadStudentList = document.querySelector("#loadStudentList");
  var btnSendGeneralQuestion = document.querySelector("#sendGeneralQuestion");
  var btnSendReactionlQuestion = document.querySelector("#sendReactionlQuestion");
  var btnSendColorBlockQuestion = document.querySelector("#sendColorBlockQuestion");
  var btnSendColorNumberkQuestion = document.querySelector("#sendColorNumberQuestion");
  
  var colorBlock = {
    originX : 10,
    originY : 10,
  
    refresh : false,
    mainColor : [0,0,0],
    differentColor : [0,0,0],
    differentX : 0,
    differentY : 0,
  
    maxHoriBlockNumber : 20,
    maxVertBlockNumber : 20,
  };

  
  function chooseFile(name, callback) {
    var chooser = document.querySelector(name);
    chooser.addEventListener("change", function(evt) {
      loadFileAsText(name, callback);
    }, false);

    chooser.click();  
  }
  
  function loadFileAsText(query,callback){
    var fileToLoad = document.querySelector(query).files[0];
  
    var fileReader = new FileReader();
    fileReader.onload = function(fileLoadedEvent){
        var textFromFileLoaded = fileLoadedEvent.target.result;
        // document.getElementById("inputTextToSave").value = textFromFileLoaded;

        callback(textFromFileLoaded);
    };
    fileReader.readAsText(fileToLoad, "UTF-8");
  }

  //Event 
  btnLoadStudentList.addEventListener("click",e=>{
    chooseFile('#fileDialog',displayStudentList);
  });

  
  
  function sendCleanAnswerRang(message)
  {
    studentList = [];
    $("#answerRank").text(JSON.stringify(studentList));
    eventCall(message,studentList); //Send a event with value
  }
  var rect = {
    top : 100,
    bottom : 800,
    left : 0,
    right : 1000
  };
  
  function sendRandomButton(message, type, rect){
    if('BtnRandomPosition' === type)
    {
      var value = JSON.stringify({
        type : type,
        rect : rect,
        interval : 800,
        timeout : 800*10
      });
    }
    else
    {
      var x = getRandomInt(rect.left, rect.right);
      var y = getRandomInt(rect.top, rect.bottom);
      var value = JSON.stringify({
        type : type,
        x : x,
        y : y,      
      });
    }

    eventCall(message,value); //Send a event with value
  }

  btnSendGeneralQuestion.addEventListener("click",e=>{
    sendCleanAnswerRang('TeacherSendStudentRank');
    sendRandomButton('TeacherSendQuestion', 'BtnFixedPosition', rect);
  });
 
  
  btnSendReactionlQuestion.addEventListener("click",e=>{
    sendCleanAnswerRang('TeacherSendStudentRank');
    sendRandomButton('TeacherSendQuestion', 'BtnRandomPosition', rect);
  });

  btnSendColorBlockQuestion.addEventListener("click",e=>{
    var rOffset = getRandomInt(-20, 20);
    var gOffset = getRandomInt(-20, 20);
    var bOffset = getRandomInt(-20, 20);

    var c = [getRandomInt(0,255), getRandomInt(0, 255), getRandomInt(0, 255)];
    colorBlock.mainColor = c;
    colorBlock.differentColor = [
      c[0] + rOffset,
      c[1] + gOffset,
      c[2] + bOffset
    ];

    colorBlock.differentX = getRandomInt(0, colorBlock.maxHoriBlockNumber-1);
    colorBlock.differentY = getRandomInt(0, colorBlock.maxVertBlockNumber-1);;

    var value = JSON.stringify({
      type:"ColorBlock",
      ColorBlock:colorBlock,
      timeout : 8000
    });

    studentList = [];
    $("#answerRank").text(JSON.stringify(studentList));
    eventCall("TeacherSendQuestion",value); //Send a event with value
    eventCall("TeacherSendStudentRank",studentList); //Send a event with value
  });

  btnSendColorNumberkQuestion.addEventListener("click",e=>{
    var color = (getRandomInt(1, 100)%2 == 1) ? "Pinky" : "Blue";
    var numbers = [];
    var xPosition = [];
    var yPosition = [];
    while(true){
      var temp = getRandomInt(0, 100);
      var x = getRandomInt(rect.left, rect.right);
      var y = getRandomInt(rect.top, rect.bottom);

      if( -1 == numbers.indexOf(temp)){
        numbers.push(temp);

        xPosition.push(x);
        yPosition.push(y);
      }
      if(numbers.length >= 8)
        break;
    }    

    var value = JSON.stringify({
      type:"NumberOrderByColor",
      Color:color,
      Numbers: numbers,
      XPosition : xPosition,
      YPosition : yPosition,
      Timeout : 20000
    });
    console.log("Color : " + color);
    console.log("Numbers : " + numbers);
    console.log("X Position : " + xPosition);
    console.log("Y Position : " + yPosition);
    
    studentList = [];
    $("#answerRank").text(JSON.stringify(studentList));
    eventCall("TeacherSendStudentRank",studentList); //Send a event with value
    eventCall("TeacherSendQuestion",value); //Send a event with value    
  });

  var socketEvents = {
    student_answer,
    student_enter,
    student_exit,
  };

  socket.on("event",e=>{
    if(e.eventName){
      socketEvents[e.eventName](e.data,e.id);
    }else{
      throw "Event not exist";
    }
  })



  function student_answer(e,id){
    if(studentList.indexOf(e.Name) > -1) return;

    studentList.push(e.Name);
    var textResult = "";
    for(var index in studentList){
      var item = JSON.stringify(studentList[index]);
      textResult += item+"<br>";      
    }
    $("#answerRank").html(textResult);
    eventCall("TeacherSendStudentRank",studentList); //Send a event with value
    addScore(e.Name,1);
  }
  
  function student_enter(name, id){
    console.log('Rx student_enter');
    Vue.set(app.connectedList,id,name);
    for(var index in app.student){      
      if( name === app.student[index].Name){
        app.student[index].State = 'V  ';
      }
    }
    SendRealTimeDBPath();
  }

  function student_exit(name, id){
    Vue.set(app.connectedList,id,null);
    for(var index in app.student){
      if( name === app.student[index].Name){
        app.student[index].State = '';
      }
    }
  }

  socket.on("connection",e=>{
    socket.emit("TeacherEnter");    
  })
})();

  function addScore(name,value){
    dataBaseRoot = database.ref(realTimeDBPath);
  
    dataBaseRoot.once("value").then(e=>{
      let userRef = database.ref(realTimeDBPath+name);
          
      if( false == e.val().hasOwnProperty(name)){
        userRef.set(value);
      } else {
        userRef.once("value").then(e=>{
          if((Number(e.val()) + value)>=0){
            userRef.set(Number(e.val()) + value)
          }
        });
      }
    });
  }
  
  var app = new Vue({
    el:"#studentLiveList",
    data:{
      connectedList:{},
      student_list:[],
      studentScore:[],
      student:[]
    },
    methods:{
      addScore:(name)=>{
        if( (null !== name) && ('' !== name)){
          addScore(name, 1);
        }
      },
      minusScore:(name)=>{
        if( (null !== name) && ('' !== name)){          
          addScore(name,-1);
        }
      }
    }
  });


function StudentReload(){
  eventCall("StudentReload","");
}