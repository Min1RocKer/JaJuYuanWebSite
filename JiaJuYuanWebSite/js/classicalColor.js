$(document).ready(function() {
	//动态生成经典花色内容
	var postparam = {
		"pageNo": 1,
		"pageSize": 1
	}
	postData("/web/decorative/sellerCompanyList", postparam, function(msg) {
		console.log(msg.result);
		var total = msg.result.count;
		pages = Math.ceil(total / 2);
		//		//分页
		laypage({
			cont: 'paging',
			pages: pages,
			groups: 6,
			jump: function(obj) {
				resetClassicalArea(obj.curr, '');
			}
		})
	}, function(msg) {
		alert(msg.msg);
	});
	//
//搜索
$('#classicialSearch').click(function() {
	alert(1);
	var searchKeys = $('#classical_search_text').val();
	var postparam = {
		"pageNo": 1,
		"pageSize": 1,
		"name":searchKeys
	}
	postData("/web/decorative/sellerCompanyList", postparam, function(msg) {
		console.log(msg.result);
		var total = msg.result.count;
		pages = Math.ceil(total / 2);
		//		//分页
		laypage({
			cont: 'paging',
			pages: pages,
			groups: 6,
			jump: function(obj) {
				resetClassicalArea(obj.curr, searchKeys);
			}
		})
	}, function(msg) {
		alert(msg.msg);
	});
})
});
//经典花色 分页时的切换
function resetClassicalArea(pageNumber, name) {
	$('#classicalMsgArea').empty();
	var postparam = {
		"pageNo": pageNumber,
		"pageSize": 2,
		"name": name
	}
	postData("/web/decorative/sellerCompanyList", postparam, function(msg) {
		console.log(msg.result);
		$('#classicalMsgArea').empty();
		var companyList = msg.result.companies;
		//处理花色数据
		var ml = companyList.length;
		for (var msgl = 0; msgl < ml; msgl++) {
			var msgStr = "<div class=\"classical_list col-xs-140\">";
			var msgcon1 = "<img class=\"classical_list_image\" src=\"" + companyList[msgl].photo + "\" alt=\"classicalColor\" />";
			var msgcon2 = "<p class=\"classical_company\">" + companyList[msgl].name + "</p>";
			//			var msgcon3 = "<div class=\"classical_list_label\"></div><div class=\"classical_more\"><a href=\"perCompanyColor.html\">查看详情</a></div></div>";
			var msgcon3 = "<div class=\"classical_more\"><a href=\"perCompanyColor.html\">查看详情</a></div></div>";
			$('#classicalMsgArea').append(msgStr + msgcon1 + msgcon2 + msgcon3);
		}
	}, function(msg) {
		alert(msg.msg);
	});
}
