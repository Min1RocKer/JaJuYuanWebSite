$(document).ready(function() {
	var postparam = {
		"pageNo": 1,
		"pageSize": 10
	}
	postData("/web/aboutus/activityList", postparam, function(msg) {
		console.log(msg.result);
		var total = msg.result.count;
		pages = Math.ceil(total / 2);
		//		//分页
		laypage({
			cont: 'paging',
			pages: pages,
			groups: 6,
			jump: function(obj) {
				getRecent(obj.curr);
			}
		})
	}, function(msg) {
		alert('登录失败');
	});
	//
	function getRecent(pages) {
		$('#recentActive').empty();
		var postparam = {
			"pageNo": pages,
			"pageSize": 2
		}
		postData("/web/aboutus/activityList", postparam, function(msg) {
			console.log(msg.result);
			var total = msg.result.count;
			var l = msg.result.activities.length;
			pages = Math.ceil(total / 12);
			for (var i = 0; i < l; i++) {
				var rid = msg.result.activities[i].id;
				var stime = msg.result.activities[i].startTime;
				var rtitle = msg.result.activities[i].title;
				var str = "<a href=\""+serverdomain+"recentActiveDetails.html?h="+rid+"\" target=\"_blank\"><li><span class=\"rAc-item\"></span><span class=\"rAc-content\">" + rtitle + "</span><span class=\"rAc-date\">" + stime + "</span></li></a>"
				$('#recentActive').append(str);
			}
		}, function(msg) {
			alert('登录失败');
		});
	}
})