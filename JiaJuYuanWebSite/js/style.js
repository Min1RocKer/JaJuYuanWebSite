$(document).ready(function() {
	//回到顶部效果
	$('#backTop').click(function() {
			pageScroll();
		})
		//获取验证码
	var countdown = 60;

	function settime(val) {
		if (countdown == 0) {
			val.value = "获取验证码";
		} else {
			val.setAttribute("disabled", true);
			val.value = "重发(" + countdown + ")";
			countdown--;
		}
		setTimeout(function() {
			settime(val);
		}, 1000)
	}
	$('#getValidate').click(function(val) {
			//手机号判断非空和是否符合1开头11位数字
			var phone = $('#loginMobile').val();
			var re = /^1\d{10}$/;
			if (!re.test(phone) || phone.length == 0) {
				alert('请输入有效的手机号码！');
				return;
			}
			var postparam = {
				"loginName": phone,
				"type": '1'
			};
			settime(this);
			postData("/api/common/getValidateCode", postparam, function(msg) {
				//				console.log(msg.result);
				//倒计时
			}, function(msg) {
				alert("发送失败");
				//				console.log(msg);
			});
		})
		//用户登录
	$('#loginBtn').click(function() {
			var iskeep = document.getElementById("loginCheckbox").checked;
			//手机号判断
			var phone = $('#loginMobile').val();
			var re = /^1\d{10}$/;
			if (!re.test(phone) || phone.length == 0) {
				alert('请输入有效的手机号码！');
				return;
			}
			//验证码判断非空
			var verificationCode = $('#loginValidate').val();
			if (verificationCode.length == 0) {
				alert("验证码不能为空");
				return;
			}
			var postparam = {
				"loginname": phone,
				"validatecode": verificationCode,
				"plat": '3'
			};
			postData("/user/login/validCodeLogin", postparam, function(msg) {
				//				console.log(msg.result);
				if (iskeep) {
					setCookie('userId', msg.result.userid, 7);
					setCookie('token', msg.result.token, 7);
				} else {
					setCookie('userId', msg.result.userid);
					setCookie('token', msg.result.token);
				}
				window.location.href = 'index.html';
			}, function(msg) {
				alert('登录失败');
			});
		})
		//登录标识的变化(根据是否登录来判断)
	var userid = getCookie('userId');
	if (userid) {
		$('#logSuccess').css('display', 'block');
		$('#logOrReg').css('display', 'none');
	} else {
		$('#logSuccess').css('display', 'none');
		$('#logOrReg').css('display', 'block');
	}
	//退出登录
	$('#logout').click(function() {
			delCookie('userId');
			delCookie('token');
			window.location.reload();
		})
		//个人中心-侧边导航框点击效果
	var personal_aside_nav1 = $("#personal_aside_nav1");
	var personal_aside_nav2 = $("#personal_aside_nav2");
	personal_aside_nav1.click(function() {
		$("#triangle2").css("display", "none");
		$("#triangle1").css("display", "block");
		personal_aside_nav1.css("background-color", "#b59983");
		personal_aside_nav2.css("background-color", "#606060");
		$("#personal_info").css("display", "block");
		$("#personal_info .person_info_left").css("display", "inline-block");
		$("#personal_info .personal_info_right").css("display", "inline-block");
		$("#personal_info .personal_info_right_change").css("display", "none");
		$("#personal_info_changeBtn").show();
		$("#personal_info_update").hide();
		$(".address").css('display', 'block');
		$("#my_news").css("display", "none");
	});
	$("#personal_info_changeBtn").click(function() {
		$("#pages_icons1").css("display", "none");
		$(".personal_info_right").css("display", "none");
		$(".personal_info_right_change").css("display", "inline-block");
		$(".address").css('display', 'none');
		$(this).hide();
		$('#personal_info_update').show();
	});
	personal_aside_nav2.click(function() {
		$("#triangle1").css("display", "none");
		$("#triangle2").css("display", "block");
		personal_aside_nav1.css("background-color", "#606060");
		personal_aside_nav2.css("background-color", "#b59983");
		$("#personal_info").css("display", "none");
		$("#my_news").css("display", "block");
	});

	//	个人中心逻辑
	//close
	$('#vipinfo_modal_header i').click(function() {
			$('#vipinfo_modal').hide();
		})
		//取消申请
	$('#vipinfo_modal_cancel').click(function() {
			$('#vipinfo_modal').hide();
		})
		//验证是否是认真商家
	var officeId = $('#officeid').text()
	var isVip = $('#isVip').text()
	if (isVip == 1) {
		$('#pages_icons1').css('display', 'inline-block');
		$('#personal_info_changeBtn span').text("申请变更资料");
		$('#personal_info_changeBtn').unbind('click');
		$('#personal_info_changeBtn').click(function() {
			$('#vipinfo_modal').show();
		})
	}
	//用户申请变更资料
	$('#vipinfo_modal_submit').click(function() {
			var _reason = $('#vipinfo_modal_reason').val();
			if (_reason.length == 0 || _reason == '请填写您的申请理由') {
				alert('申请理由不能为空!');
				return;
			}
			var _userid = getCookie('userId');
			var _token = getCookie('token');
			var postparam = {
				"userId": _userid,
				"token": _token,
				"content": _reason
			};
			postData("/web/user/applyChangeInfo", postparam, function(msg) {
				//				console.log(msg);
				if (msg.code == 1 || msg.code == '1') {
					alert('提交成功!');
					$('#vipinfo_modal').hide();
				}
			}, function(msg) {
				alert(msg.msg);
			});
		})
		//	非认证用户修改个人信息
	$('#personal_info_update').click(function() {
		var _name = $('#personName').val();
		var _officeName = $('#personofficeName').val();
		var _industry = $('#personindustry').val();
		if (_name.length == 0 || _officeName == 0 || _industry == 0) {
			alert("请确保修改内容不为空!");
			return;
		}
		var _userid = getCookie('userId');
		var _token = getCookie('token');
		var _officeid = $('#officeid').text();
		var postparam = {
			"userId": _userid,
			"token": _token,
			"username": _name,
			"industry": _industry,
			"officeid": _officeid,
			"officename": _officeName
		};
		postData("/web/user/infoEdit", postparam, function(msg) {
			//				console.log(msg);
			if (msg.code == 1 || msg.code == '1') {
				alert('提交成功!');
				window.location.reload();
			}
		}, function(msg) {
			alert(msg.msg);
		});
	});
	//首页点击效果
	$("#index_desinav_new").click(function() {
		$("#triangle_classic").css("display", "none");
		$("#triangle_new").css("display", "block");
		$("#index_desinav_new").css("background-color", "#f6edda");
		$("#index_desinav_classic").css("background-color", "#f5f4f4");
	});
	$("#index_desinav_classic").click(function() {
		$("#triangle_classic").css("display", "block");
		$("#triangle_new").css("display", "none");
		$("#index_desinav_new").css("background-color", "#f5f4f4");
		$("#index_desinav_classic").css("background-color", "#f6edda");
	});

	//点赞样式变化
	$(".big_top_zan").click(function() {
		$(".big_top_zan").css("background-position", "0% 70%");
	});
})