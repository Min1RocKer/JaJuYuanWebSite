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
				subm = "<div class=\"col-xs-140\"><div class=\"per_triangle\">" +
					"</div><div class=\"per_aside_subnav col-xs-140\" code=\"" + menuJson[mainl].MenuId + "\" isparent=\"1\" id=\"first\">全部</div></div>";
			} else {
				subm = "<div class=\"col-xs-140\"><div class=\"per_triangle\">" +
					"</div><div class=\"per_aside_subnav col-xs-140\" code=\"" + menuJson[mainl].MenuId + "\" isparent=\"1\">全部</div></div>";
			}
			var menuStr = "<div class=\"col-xs-140\">\<div id=\"per_aside_nav\" class=\"per_aside_nav col-xs-140\" >" + menuJson[mainl].MenuName + "</div></div>";
			if (menuJson[mainl].sub.length != 0) {
				for (var subl = 0; subl < menuJson[mainl].sub.length; subl++) {
					subm += "<div class=\"col-xs-140\"><div class=\"per_triangle\">" +
						"</div><div class=\"per_aside_subnav col-xs-140\" code=\"" + menuJson[mainl].sub[subl].subId + "\" isparent=\"0\">" + menuJson[mainl].sub[subl].subName + "</div></div>"
				}
			}
			var content = menuStr + subm;
			$('#perMenuArea').append(content);
		}
		//首次展示
		var firstShow = $('#first')
		resetContent(firstShow, '', 0);
		$(".per_aside_subnav").removeClass("per_aside_subnav_active");
		$(".per_triangle").removeClass("triangle-right");
		firstShow.addClass("per_aside_subnav_active");
		firstShow.siblings(".per_triangle").addClass("triangle-right");
		//调用花色汇==》最新花色 菜单切换效果
		persubnavClick(0);
	}, function(msg) {
		alert(msg.msg);
	});
});
//公共全局变量
var cpId = $('#per_companyname').html();
//花色汇==》分公司花色 菜单切换效果
function persubnavClick(type) {
	var per_aside_subnav = $(".per_aside_subnav");
	var triangle = $(".per_triangle");
	per_aside_subnav.click(function() {
		per_aside_subnav.removeClass("per_aside_subnav_active");
		triangle.removeClass("triangle-right");
		$(this).addClass("per_aside_subnav_active");
		$(this).siblings(".per_triangle").addClass("triangle-right");
		//组织参数
		var t = $(this);
		resetContent(t, '', type);
	});
}
//最新花色 ====>更新右边的区域
function resetContent(thisJDom, name, type) {
	$('#perMsgArea').empty();
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
		"type": type,
		"companyId": cpId,
		"isParent": isp,
		"proType": typeCode,
		"name": name
	}
	postData("/web/decorative/webDecorativeList", postparam, function(msg) {
		console.log(msg.result);
		var menudetail = msg.result.papers;
		//处理花色数据
		var ml = menudetail.length;
		var total = msg.result.count;
		pages = Math.ceil(total / 12);
		console.log(pages);
		//分页
		laypage({
			cont: 'paging',
			pages: pages,
			groups: 6,
			jump: function(obj) {
				pageClick(thisJDom, obj.curr, name, type);
			}
		})
	}, function(msg) {
		alert(msg.msg);
	});
}
//最新花色 分页时的切换
function pageClick(thisJDom, pageNumber, name, type) {
	$('#perMsgArea').empty();
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
		"type": type,
		"companyId": cpId,
		"isParent": isp,
		"proType": typeCode,
		"name": name
	}
	postData("/web/decorative/webDecorativeList", postparam, function(msg) {
		console.log(msg.result);
		var menudetail = msg.result.papers;
		//处理花色数据
		var ml = menudetail.length;
		for (var msgl = 0; msgl < ml; msgl++) {
			var msgStr = "<div class=\"latest_content_list_i col-xs-35\">";
			var msgcon1 = "<div class=\"checkdetail\"><img class=\"latest_list_image\" src=\"" + menudetail[msgl].smallimage + "\" alt=\"latestColor\" /><div class=\"latest_list_mouseover\" colorId=\"" + menudetail[msgl].id + "\"><div class=\"latest_list_mouseover_bg\"></div><i></i><label>点击查看大图</label></div></div>";
			var msgcon2 = "<label class=\"latest_list_name\">" + menudetail[msgl].name + "</label><div class=\"latest_list_label\">" + menudetail[msgl].proTypeName + "</div>";
			var msgcon3 = "";
			if (menudetail[msgl].hasInfo == 1) {
				msgcon3 = "<div class=\"grey_btn center-block\" colorId=\"" + menudetail[msgl].id + "\" style=\"margin-top:10px;\">查看详情</div></div></div>";
			} else {
				msgcon3 = "<div class=\"latest_more center-block\" colorId=\"" + menudetail[msgl].id + "\" style=\"margin-top:10px;\">查看详情</div></div></div>";
			}
			$('#perMsgArea').append(msgStr + msgcon1 + msgcon2 + msgcon3);
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
		$('.latest_list_mouseover').click(function() {
				var imageId = $(this).attr('colorId');
				//			setCookie('imageId', imageId,'0.1');
				window.location.href = serverdomain + "viewBigImage.html?h=" + imageId + "";
			})
			//查看详情
		$('.latest_more').click(function() {
			var colorId = $(this).attr('colorId');
			//			setCookie('colorId', colorId,'0.1');
			window.location.href = serverdomain + "colorDetails.html?h=" + colorId + "";
		})
	}, function(msg) {
		alert(msg.msg);
	});
}
//最新花色  经典花色  电子样册 的切换效果
function changeContent(a) {
	$('.per_title').removeClass('per_title_active');
	//最新花色
	if (a == 1) {
		resetContent($('#first'), '', 0);
		persubnavClick(0);
		$('.per_nav').show();
		$('.per_content_main').show();
		$('.per_elecalbum_main').hide();
		$('#per_latest_color').addClass('per_title_active')
		$('.per_searchbox').hide();
		$('#per_elecalbum_modal').hide();
		$('#perMenuArea').show();
		$('#photoMenuArea').hide();
		$('#perMsgArea').show();
		$('#PhotoMsgArea').hide();
	}
	//经典花色
	else if (a == 2) {
		resetContent($('#first'), '', 1);
		persubnavClick(1);
		$('.per_nav').show();
		$('.per_content_main').show();
		$('.per_elecalbum_main').hide();
		$('#per_classical_color').addClass('per_title_active');
		$('.per_searchbox').show();
		$('#per_elecalbum_modal').hide();
		$('#perMenuArea').show();
		$('#photoMenuArea').hide();
		$('#perMsgArea').show();
		$('#PhotoMsgArea').hide();
		//经典花色的搜索
		$('#perDoSearch').click(function() {
			console.log("111");
			var key = $('#per_search_text').val();
			resetContent($('#first'), key, 1);
			persubnavClick(1);
		})
	}
	//电子样册
	else {
		ischecked();
		$('.per_searchbox').hide();
	}
}
//电子样册导航获取
function getPhotoMenu() {
	$('#photoMenuArea').empty();
	postData("/web/decorative/decorativeTypeList", '', function(msg) {
		var rs = msg.result;
		var Str = "<div class=\"col-xs-140\"><div class=\"photo_triangle\"></div><div class=\"photo_aside_subnav col-xs-140\" code=\"\" id=\"first1\">所有</div></div>";
		$('#photoMenuArea').append(Str);
		for (var mainl = 0; mainl < rs.length; mainl++) {
			var strColor = "<div class=\"col-xs-140\"><div class=\"photo_triangle\"></div><div class=\"photo_aside_subnav col-xs-140\" code=\"" + rs[mainl].name + "\" id=\"first\">" + rs[mainl].name + "</div></div>";
			$('#photoMenuArea').append(strColor);
		}
		//首次展示
		var firstShow = $('#first1')
		resetPhotoContent(firstShow, true)
		$(".photo_aside_subnav").removeClass("photo_aside_subnav_active");
		$(".photo_triangle").removeClass("triangle-right");
		firstShow.addClass("photo_aside_subnav_active");
		firstShow.siblings(".photo_triangle").addClass("triangle-right");
		//调用花色汇==》最新花色 菜单切换效果
		photosubnavClick();
	}, function(msg) {
		alert(msg.msg);
	});
}
//查看是否有权限
function ischecked() {
	var _userid = getCookie('userId');
	var _token = getCookie('token');
	var postparam = {
		"userId": _userid,
		"token": _token,
		"pageNo": 1,
		"pageSize": 1,
		"companyId": cpId,
		"decorativeType": ''
	}
	postData("/web/decorative/decorativeStoreList", postparam, function(msg) {
		if (msg.code == 1) {
			$('.per_nav').show();
			$('#perMenuArea').hide();
			$('#photoMenuArea').show();
			$('#per_elecalbum_modal').hide();
			$('.per_content_main').show();
			$('#perMsgArea').hide();
			$('#PhotoMsgArea').show();
			$('#per_elecalbum').addClass('per_title_active');
			//
			getPhotoMenu();
		}
		//没权限====》引导申请
		else {
			$('#per_elecalbum').addClass('per_title_active');
			$('.per_nav').hide();
			$('.per_content_main').hide();
			$('.per_elecalbum_main').show();
			$('.per_searchbox').hide();
			//
			$('#per_elecalbum_applybtn').click(function() {
					$('#per_elecalbum_modal').show();
					//申请查看电子样册
					$("#per_elecalbum_modal_submit").click(function() {
						var _userid = getCookie('userId');
						var _token = getCookie('token');
						var postparam = {
							"userId": _userid,
							"token": _token,
							"companyId": cpId
						}
						postData("/web/decorative/apply", postparam, function(msg) {
							if (msg.code == 1) {
								alert("提交申请成功!");
							}
						}, function(msg) {
							alert(msg.msg);
						});
					})
				})
				//
			$('#per_elecalbum_modal_cancel,#per_elecalbum_modal_close').click(function() {
				$('#per_elecalbum_modal').hide();
			})
		}
	}, function(msg) {
		alert(msg.msg);
	});
}
//电子样册 内容 切换
function resetPhotoContent(thisJDom, sign) {
	$('#PhotoMsgArea').empty();
	var _userid = getCookie('userId');
	var _token = getCookie('token');
	var typeCode = '';
	if (sign) {
		typeCode = thisJDom.attr('code');
	} else {
		typeCode = '';
	}
	var pages = '';
	var postparam = {
		"userId": _userid,
		"token": _token,
		"pageNo": 1,
		"pageSize": 1,
		"companyId": cpId,
		"decorativeType": typeCode
	}
	postData("/web/decorative/decorativeStoreList", postparam, function(msg) {
		if (msg.code == 1) {
			console.log(msg.result);
			var menudetail = msg.result.papers;
			//处理花色数据
			var ml = menudetail.length;
			var total = msg.result.count;
			pages = Math.ceil(total / 1);
			console.log(pages);
			//分页
			laypage({
				cont: 'paging',
				pages: pages,
				groups: 6,
				jump: function(obj) {
					photoClick(thisJDom, obj.curr, '');
				}
			})
		}
	}, function(msg) {
		alert(msg.msg);
	});
}
//电子相册  分页时的切换
function photoClick(thisJDom, pageNumber, searchcode) {
	$('#PhotoMsgArea').empty();
	var _userid = getCookie('userId');
	var _token = getCookie('token');
	var typeCode = thisJDom.attr('code');
	var pages = '';
	var postparam = {
		"userId": _userid,
		"token": _token,
		"pageNo": pageNumber,
		"pageSize": 1,
		"companyId": cpId,
		"decorativeCode": searchcode,
		"decorativeType": typeCode
	}
	postData("/web/decorative/decorativeStoreList", postparam, function(msg) {
		console.log(msg.result);
		var menudetail = msg.result.papers;
		//处理花色数据
		var ml = menudetail.length;
		for (var msgl = 0; msgl < ml; msgl++) {
			var content = "<div class=\"photo_content_list_i col-xs-35\"><div class=\"checkdetail\">" + "<img class=\"photo_list_image\" src=\"http://www.tzhiyuan.net/data/upload/qiongtong/1439336729.jpg\" alt=\"perColor\"/>" +
				"<div class=\"photo_list_mouseover\" colorId=\""+menudetail[msgl].id+"\"><div class=\"per_list_mouseover_bg\"></div><i></i><label>点击查看大图</label></div></div>" +
				"<div class=\"photo_list_label\">" + menudetail[msgl].woodtypename + "</div><div class=\"photo_code center-block\">" + menudetail[msgl].code + "</div></div>"
			$('#PhotoMsgArea').append(content);
		}
		$('.checkdetail').bind({
				mouseover: function(e) {
					$(this).children('.photo_list_mouseover').show();
				},
				mouseout: function(e) {
					$(this).children('.photo_list_mouseover').hide();
				}
			})
			//
			//查看大图
		$('.photo_list_mouseover').click(function() {
				var imageId = $(this).attr('colorId');
				window.location.href = serverdomain + "viewBigImage.html?h=" + imageId + "";
		})
	}, function(msg) {
		alert(msg.msg);
	});
}
//花色汇==》分公司电子样册花色 菜单切换效果
function photosubnavClick() {
	var photo_aside_subnav = $(".photo_aside_subnav");
	var triangle = $(".photo_triangle");
	photo_aside_subnav.click(function() {
		photo_aside_subnav.removeClass("photo_aside_subnav_active");
		triangle.removeClass("triangle-right");
		$(this).addClass("photo_aside_subnav_active");
		$(this).siblings(".photo_triangle").addClass("triangle-right");
		var thisdom = $(this);
		resetPhotoContent(thisdom, true)
	});
}