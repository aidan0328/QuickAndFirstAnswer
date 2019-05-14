
const TEACHER_PASSWORD = '123'
var password="";

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key) && obj[key])  size++;
    }
    return size;
};

//取得介於 min ~ max 之間的亂數整數
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

//兩個引數，一個是 Cookies 的名子，一個是值
function setCookie(name, value, timeout) {
    var cookie = "";
    if(timeout>0) {
        var expires = new Date();
        expires.setTime(expires.getTime() + 172800000);
        cookie = name + "=" + escape(value) + ";expires=" + expires.toGMTString();
    } else {
        cookie = name + "=" + escape(value);
    }
    document.cookie = cookie;
}

//取得 Cookies
function getCookie(name){
    var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
    if (arr != null) return unescape(arr[2]); return null;
}

//刪除  Cookies
function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null) document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
 }