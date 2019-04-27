//const SCHOOL = "/zlm"
const SCHOOL = "/kyps"
const RealTime_DB_Path = SCHOOL+"/students/";

const TEACHER_PASSWORD = '123'
var password="";

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key) && obj[key])  size++;
    }
    return size;
};

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  }
