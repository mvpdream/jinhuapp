// 登录操作
function authLogin(type) {
	var waiting = showWaiting();
	var s;
	for(var i = 0; i < auths.length; i++) {
		if(auths[i].id == type) {
			s = auths[i];
			break;
		}
	}
	if(!s.authResult) {
		s.login(function(e) {
			closeWaiting(waiting);
			mui.toast("登录认证成功！");
			authUserInfo(type);
		}, function(e) {
			closeWaiting(waiting);
			mui.toast("登录认证失败！");
		});
	} else {
		closeWaiting(waiting);
		mui.toast("已经登录认证！");
	}
}
//注销 
function authLogout() {
	for(var i in auths) {
		var s = auths[i];
		if(s.authResult) {
			s.logout(function(e) {
				closeWaiting(waiting);
				console.log("注销登录认证成功！");
			}, function(e) {
				closeWaiting(waiting);
				console.log("注销登录认证失败！");
			});
		}
	}
}
// 微信登录认证信息 
function authUserInfo(type) {
	var s;
	for(var i = 0; i < auths.length; i++) {
		if(auths[i].id == type) {
			s = auths[i];
			break;
		}
	}
	if(!s.authResult) {
		mui.toast("未授权登录！");
	} else {
		s.getUserInfo(function(e) {
			if(e.target.id == 'qq') {
				var data = {
					AccountTypeKey: 'QQ',
					Identification: e.target.authResult.openid,
					AccessToken: e.target.authResult.access_token,
					Expires_in: e.target.authResult.expires_in,
					NickName: e.target.userInfo.nickname,
					Gender: e.target.userInfo.gender == '' ? 0 : e.target.userInfo.gender == '男' ? 1 : 2,
					UserAvatarUrl: e.target.userInfo.figureurl_qq_2
				};
				setlsData('qq', JSON.stringify(data));

			}
			if(e.target.id == 'weixin') {
				var data = {
					AccountTypeKey: 'WeChat',
					Identification: e.target.authResult.unionid,
					AccessToken: e.target.authResult.access_token,
					Expires_in: e.target.authResult.expires_in,
					NickName: e.target.userInfo.nickname,
					Gender: e.target.userInfo.sex,
					UserAvatarUrl: e.target.userInfo.headimgurl
				}
				setlsData('weixin', JSON.stringify(data));
			}
			var params = {
				accountTypeKey: e.target.id == 'qq' ? 'QQ' : 'WeChat',
				identification: e.target.id == 'qq' ? e.target.authResult.openid : e.target.authResult.unionid,
			};
			if(window.plus) {
				var waiting = plus.nativeUI.showWaiting();
			}
			authLogout();
			getData('Account/ThirdLogin', params, function(data) {
				if(window.plus) {
					waiting.close();
				}
				if(data.Type == 1) {
					if(data.Data.state == 2) {
						mui.openWindow({
							url: 'third_login.html',
							id: 'third_login',
							show: {
								aniShow: 'none'
							},
							extras: {
								type: e.target.id == 'qq' ? 'qq' : 'weixin'
							}
						})
					} else {
						//login
						setlsData('token', data.Data.token);
						setlsData('isLogin', true);
						if(mui.os.plus) {
							var self = plus.webview.currentWebview();
							var pageId;
							var currView = plus.webview.getWebviewById('mine.html');
							currView && currView.reload()
							setTimeout(function() {
								mui.openWindow({
									url: '../index.html',
									id: 'main',
									waiting: {
										options: {
											loading: {
												height: '35px'
											}
										}
									}
								})
							}, 1000)
						} else {
							setTimeout(function() {
								mui.openWindow({
									url: '../index.html',
									id: 'main',
									waiting: {
										options: {
											loading: {
												height: '35px'
											}
										}
									}
								})
							}, 500)
						}
					}
				} else if(data.Type == 0) {
					//登录失败

				} else {
					//逻辑错误
					mui.toast(data.Data);
				}
			}, function() {
				if(window.plus) {
					waiting.close();
				}
			})

		}, function(e) {
			alert("获取用户信息失败：" + e.message + " - " + e.code);
		});
	}
}