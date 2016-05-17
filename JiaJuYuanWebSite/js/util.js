//ajax数据交互
var serverDomain = "http://192.168.1.20:8080";

function postData(actionPath, jsonParam, successFunc, errorFunc) {
	$.ajax({
		url: serverDomain + actionPath,
		data: JSON.stringify(jsonParam),
		type: "post",
		async: true,
		dataType: "json",
		success: function(msg) {
			if (msg.code == 1) {
				if (successFunc) {
					successFunc(msg);
				}
			}
			else{
				alert(msg.msg);
			}
		},
		error: function(msg) {
			if (errorFunc) {
				errorFunc(msg);
			}
		}
	})
}
//返回顶部function1
function toTop(obj) {
	var timer = null;
	obj.onclick = function() {
		timer = setInterval(function() {
			var topscroll = document.documentElement.scrollTop || document.body.scrollTop;
			var speed = Math.floor(-topscroll / 5);
			document.documentElement.scrollTop = document.body.scrollTop = topscroll + speed;
			if (topscroll == 0) {
				clearInterval(timer);
			}
		}, 100);
	}
}
//返回顶部function2
function pageScroll() {
	//把内容滚动指定的像素数（第一个参数是向右滚动的像素数，第二个参数是向下滚动的像素数）
	if (!+[1, ]) {
		window.scrollBy(0, -40);
		scrolldelay = setTimeout('pageScroll()', 5);
		var sTop = document.documentElement.scrollTop + document.body.scrollTop;
		if (sTop == 0) clearTimeout(scrolldelay);
	}　　
	else {
		window.scrollBy(0, -10);
		scrolldelay = setTimeout('pageScroll()', 5);
		var sTop = document.documentElement.scrollTop + document.body.scrollTop;
		if (sTop == 0) clearTimeout(scrolldelay);
	}
}
//设置cookie
function setCookie(c_name, value, expiredays) {　　　　
	var exdate = new Date();　　　　
	exdate.setDate(exdate.getDate() + expiredays);　　　　
	document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());　　
}
//取cookie
function getCookie(c_name) {　　　　
	if (document.cookie.length > 0) {　　 //先查询cookie是否为空，为空就return ""	　　　　　　
		c_start = document.cookie.indexOf(c_name + "=")　　 //通过String对象的indexOf()来检查这个cookie是否存在，不存在就为 -1　　
		if (c_start != -1) {　　　　　　　　
			c_start = c_start + c_name.length + 1;
			c_end = document.cookie.indexOf(";", c_start)
			if (c_end == -1) c_end = document.cookie.length　　　　　　　　　　
			return unescape(document.cookie.substring(c_start, c_end)) //通过substring()得到了值。想了解unescape()得先知道escape()是做什么的，都是很重要的基础，想了解的可以搜索下，在文章结尾处也会进行讲解cookie编码细节						　　　　　　
		}　　　　
	}　　　　
	return ""　　
}　
//删除cookie
function delCookie(name) {
	var exp = new Date();
	exp.setTime(exp.getTime() - 1);
	var cval = getCookie(name);
	if (cval != null)
		document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}
//从url中取参数
function GetRequest() {
	var url = location.search; //获取url中"?"符后的字串
	var theRequest = new Object();
	if (url.indexOf("?") != -1) {
		var str = url.substr(1);
		strs = str.split("&");
		for (var i = 0; i < strs.length; i++) {
			theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
		}
	}
	return theRequest;
}
//剥离花色部分菜单
function pickMenu(rs) {
	var menuJson = new Array;
	for (var i = 0; i < rs.length; i++) {
		var menugp = new Object;
		if (rs[i].parentCode == 0) {
			menugp.MenuName = rs[i].name;
			menugp.MenuId = rs[i].code;
			var subMenu = new Array;
			for (var j = 0; j < rs.length; j++) {
				var sub = new Object;
				if (rs[i].code == rs[j].parentCode) {
					sub = {
						subName: rs[j].name,
						subId: rs[j].code
					}
					subMenu.push(sub);
				}
			}
			menugp.sub = subMenu;
			menuJson.push(menugp);
		}
	}
	return menuJson;
}
//模拟接口数据
//var menuJson = [{
//		'MenuName': '三胺纸',
//		'MenuId': '01',
//		'SubMenu': [{
//			'subname': '全部',
//			'subId': 'all'
//		}, {
//			'subname': '木门',
//			'subId': '01-1'
//		}, {
//			'subname': '橱柜',
//			'subId': '01-2'
//		}, {
//			'subname': '地板',
//			'subId': '01-3'
//		}, {
//			'subname': '其他',
//			'subId': '01-3'
//		}]
//	}, {
//		'MenuName': 'PVC',
//		'MenuId': '02',
//		'SubMenu': [{
//			'subname': '全部',
//			'subId': 'all'
//		}, {
//			'subname': '木门',
//			'subId': '01-1'
//		}, {
//			'subname': '橱柜',
//			'subId': '01-2'
//		}, {
//			'subname': '地板',
//			'subId': '01-3'
//		}, {
//			'subname': '其他',
//			'subId': '01-3'
//		}]
//	}]
//mock接口数据
function mockData1(obj,n){
	var data = new Array;
	for(var i=0;i<n;i++){
		data.push(obj)	
	}
	return data;
}
//
var menudetail = mockData1({
	"img": 'http://www.tzhiyuan.net/data/upload/qiongtong/1439336729.jpg',
	"title": "呵呵哒!",
	"companyname": "moekee",
	"type": "木门"
},50)
//
function log(fn){
	return function(_args){
		var  start = Date.now();
		fn(_args);
		var used = Date.now() - start;
		console.log("function"+fn+"used"+used+"time");
	}
}

