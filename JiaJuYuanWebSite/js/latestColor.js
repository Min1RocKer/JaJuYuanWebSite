$(document).ready(function() {
	//花色汇-最新花色
	//获取花色菜单
	postData("/web/decorative/proTypeList", '', function(msg) {
		var rs = msg.result;
		var menuJson = pickMenu(rs);
		console.log(menuJson);
		for (var mainl = 0; mainl < menuJson.length; mainl++) {
			var subm = '';
			if (mainl == 0) {
				subm = "<div class=\"col-xs-140\"><div class=\"triangle\">" +
					"</div><div class=\"latest_aside_subnav col-xs-140\" code=\"" + menuJson[mainl].MenuId + "\" isparent=\"1\" id=\"first\">全部</div></div>";
			} else {
				subm = "<div class=\"col-xs-140\"><div class=\"triangle\">" +
					"</div><div class=\"latest_aside_subnav col-xs-140\" code=\"" + menuJson[mainl].MenuId + "\" isparent=\"1\">全部</div></div>";
			}
			var menuStr = "<div class=\"col-xs-140\">\<div id=\"latest_aside_nav\" class=\"latest_aside_nav col-xs-140\" >" + menuJson[mainl].MenuName + "</div></div>";
			if (menuJson[mainl].sub.length != 0) {
				for (var subl = 0; subl < menuJson[mainl].sub.length; subl++) {
					subm += "<div class=\"col-xs-140\"><div class=\"triangle\">" +
						"</div><div class=\"latest_aside_subnav col-xs-140\" code=\"" + menuJson[mainl].sub[subl].subId + "\" isparent=\"0\">" + menuJson[mainl].sub[subl].subName + "</div></div>"
				}
			}
			var content = menuStr + subm;
			$('#latestMenuArea').append(content);
		}
		//首次展示
		var firstShow = $('#first')
		resetContent(firstShow, 1);
		$(".latest_aside_subnav").removeClass("latest_aside_subnav_active");
		$(".triangle").removeClass("triangle-right");
		firstShow.addClass("latest_aside_subnav_active");
		firstShow.siblings(".triangle").addClass("triangle-right");
		//调用花色汇==》最新花色 菜单切换效果
		subnavClick();
	}, function(msg) {
		alert(msg.msg);
	});
	//花色汇-最新花色
	//获取分公司花色菜单
	postData("/web/decorative/proTypeList", '', function(msg) {
		var rs = msg.result;
		var menuJson = pickMenu(rs);
		for (var mainl = 0; mainl < menuJson.length; mainl++) {
			var menuStr = "<div class=\"col-xs-140\">\<div id=\"per_aside_nav\" class=\"per_aside_nav col-xs-140\" >" + menuJson[mainl].MenuName + "</div></div>";
			var subm = '';
			if (menuJson[mainl].sub.length != 0) {
				for (var subl = 0; subl < menuJson[mainl].sub.length; subl++) {
					subm += "<div class=\"col-xs-140\"><div class=\"per_triangle\">" +
						"</div><div class=\"per_aside_subnav col-xs-140\">" + menuJson[mainl].sub[subl].subName + "</div></div>"
				}
			}
			var content = menuStr + subm;
			$('#perMenuArea').append(content);
		}
	}, function(msg) {
		alert(msg.msg);
	});
});

//花色汇==》最新花色 菜单切换效果
function subnavClick() {
	var latest_aside_subnav = $(".latest_aside_subnav");
	var triangle = $(".triangle");
	latest_aside_subnav.click(function() {
		latest_aside_subnav.removeClass("latest_aside_subnav_active");
		triangle.removeClass("triangle-right");
		$(this).addClass("latest_aside_subnav_active");
		$(this).siblings(".triangle").addClass("triangle-right");
		//组织参数
		var t = $(this);
		resetContent(t);
	});
}
//最新花色 ====>更新右边的区域
function resetContent(thisJDom) {
	$('#latestMsgArea').empty();
	var _userid = getCookie('userId');
	var _token = getCookie('token');
	var typeCode = thisJDom.attr('code');
	var isp = parseInt(thisJDom.attr('isparent'));
	var pages = '';
	var postparam = {
		"userId": _userid,
		"token": _token,
		"pageNo": 1,
		"pageSize": 12,
		"type": 0,
		"isParent": isp,
		"proType": typeCode
	}
	postData("/web/decorative/webDecorativeList", postparam, function(msg) {
		console.log(msg.result);
		var menudetail = msg.result.papers;
		//处理花色数据
		var ml = menudetail.length;
		var total = msg.result.count;
		pages = Math.ceil(total / 12);
		console.log(pages);
		//		//分页
		laypage({
			cont: 'paging',
			pages: pages,
			groups: 6,
			jump: function(obj) {
				pageClick(thisJDom, obj.curr);
			}
		})
	}, function(msg) {
		alert(msg.msg);
	});
}
//最新花色 分页时的切换
function pageClick(thisJDom, pageNumber) {
	$('#latestMsgArea').empty();
	var _userid = getCookie('userId');
	var _token = getCookie('token');
	var typeCode = thisJDom.attr('code');
	var isp = parseInt(thisJDom.attr('isparent'));
	var pages = '';
	var postparam = {
		"userId": _userid,
		"token": _token,
		"pageNo": pageNumber,
		"pageSize": 12,
		"type": 0,
		"isParent": isp,
		"proType": typeCode
	}
	postData("/web/decorative/webDecorativeList", postparam, function(msg) {
		console.log(msg.result);
		var menudetail = msg.result.papers;
		//处理花色数据
		var ml = menudetail.length;
		for (var msgl = 0; msgl < ml; msgl++) {
			var msgStr = "<div class=\"latest_content_list_i col-xs-35\">";
			var msgcon1 = "<div class=\"checkdetail\"><img class=\"latest_list_image\" src=\"" + menudetail[msgl].smallimage + "\" alt=\"latestColor\" /><div class=\"latest_list_mouseover\" colorId=\"" + menudetail[msgl].id + "\"><div class=\"latest_list_mouseover_bg\"></div><i></i><label>点击查看大图</label></div></div>";
			var msgcon2 = "<label class=\"latest_list_name\">" + menudetail[msgl].name + "</label><div class=\"latest_list_label\">" + menudetail[msgl].proTypeName + "</div><p class=\"latest_company\" companyId=\"" + menudetail[msgl].companyId + "\">" + menudetail[msgl].companyName + "</p>";
			var msgcon3 = "";
			if(menudetail[msgl].hasInfo == 1){
				 msgcon3 = "<div class=\"grey_btn center-block\" colorId=\"" + menudetail[msgl].id + "\">查看详情</div></div></div>";
			}
			else{
				 msgcon3 = "<div class=\"latest_more center-block\" colorId=\"" + menudetail[msgl].id + "\">查看详情</div></div></div>";
			}
			$('#latestMsgArea').append(msgStr + msgcon1 + msgcon2 + msgcon3);
		}
		$('.checkdetail').bind({
				mouseover: function(e) {
					$(this).children('.latest_list_mouseover').show();
				},
				mouseout: function(e) {
					$(this).children('.latest_list_mouseover').hide();
				}
			})
		//查看大图
		$('.latest_list_mouseover').click(function(){
			var imageId = $(this).attr('colorId');
//			setCookie('imageId', imageId,'0.1');
			window.location.href = serverdomain+"viewBigImage.html?h="+imageId+"";
		})
		//查看详情
		$('.latest_more').click(function() {
			var colorId = $(this).attr('colorId');
//			setCookie('colorId', colorId,'0.1');
			window.location.href = serverdomain+"colorDetails.html?h="+colorId+"";
		})
			//供应商
		$('.latest_company').click(function(){
			var cpId = $(this).attr('companyId');
//			setCookie('companyId',cpId,'0.1');
			window.location.href = serverdomain+"perCompanyColor.html?h="+cpId+"";
		})
	}, function(msg) {
		alert(msg.msg);
	});
}