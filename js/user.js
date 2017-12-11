var pageUrl = window.location.pathname;
pageUrl = pageUrl.substring(pageUrl.lastIndexOf('/') + 1, pageUrl.length);
/**
 * 登录
 */
var login = {
	init: function() {
		var backurl;
		var type = '';
		mui.init();
		var loginBtn = document.getElementById('loginBtn');
		var registerBtn = document.getElementById("registerBtn");
		var thirdLogin = document.getElementById("thirdLog");
		if(mui.os.plus) {
			thirdLog.style.display = 'inline'
		}
		
		window.onload = function() {
			//获取url中的targetId参数
			if(mui.os.plus) {
				mui.plusReady(function() {
					var self = plus.webview.currentWebview();
					backurl = self.backurl;
					type = self.type
					var isInstalled = app.isInstalled('weixin');
					if(isInstalled) {
						document.getElementById('weixin').style.removeProperty('display')
					}
				});
			}
		}
		loginBtn.addEventListener('tap', function() {
			mui.openWindow({
				url: 'user_login.html',
				id: 'user_login',
				waiting: {
					options: {
						loading: {
							height: '35px'
						}
					}
				},
				extras: {
					backurl: "login"
				}
			})
		})
		registerBtn.addEventListener('tap', function() {
			mui.openWindow({
				url: 'register_account.html',
				id: 'register_account',
				waiting: {
					options: {
						loading: {
							height: '35px'
						}
					}
				}
			})
		})
		var old_back = mui.back;
		var first = null;

		mui.back = function() {
			if(mui.os.plus) {
				mui.plusReady(function() {
					var self = plus.webview.currentWebview();
					type = self.type;
				});
			} else {
				type = getUrlParam('type');
			}
			if(type) {
				old_back();
			} else {
				if(!first) {
					first = new Date().getTime();
					mui.toast('再按一次退出应用');
					setTimeout(function() {
						first = null;
					}, 1000);
				} else {
					if(new Date().getTime() - first < 1000) {
						plus.runtime.quit();
					}
				}
			}

		}
		mui.plusReady(function() {
			var common = document.createElement("script");
			common.setAttribute("type", "text/javascript");
			common.setAttribute("src", "../js/common.js"); // 在这里引入了common.js
			document.body.appendChild(common);
			var thirdLogin = document.createElement("script");
			thirdLogin.setAttribute("type", "text/javascript");
			thirdLogin.setAttribute("src", "../js/thirdLogin.js"); // 在这里引入了thirdLogin.js
			document.body.appendChild(thirdLogin);
			var isInstalled = app.isInstalled('weixin');
			if(isInstalled) {
				document.getElementById('weixin').style.removeProperty('display')
			}
			plus.oauth.getServices(function(services) {
				auths = services;
			}, function(e) {
				alert("获取登录服务列表失败：" + e.message + " - " + e.code);
			});
			// 手动关闭启动界面
			setTimeout(function() {
				plus.navigator.closeSplashscreen();
			}, 1000)
			
		})
		document.getElementById('weixin').addEventListener('tap', function() {
			if(window.plus) {
				var isInstalled = app.isInstalled('weixin');
				if(isInstalled == null || isInstalled == undefined) {
					mui.toast('您尚未安装微信客户端');
					return;
				}
				authLogin('weixin');
			} else {
				mui.toast("不支持微信登录")
			}
		})
		document.getElementById('qq').addEventListener('tap', function() {
			if(window.plus) {
				authLogin('qq');
			} else {
				mui.toast("不支持QQ登录")
			}
		})
	}
}
/**
 * 用户登录
 */
var user_login = {
	init: function() {
		mui.init();
		var deceleration = mui.os.ios ? 0.003 : 0.0009;
		mui('.mui-scroll-wrapper').scroll({
			bounce: false,
			indicators: true, //是否显示滚动条
			deceleration: deceleration
		});
		var loginBtn = document.getElementById('loginBtn');
		var username = document.getElementById('account');
		var password = document.getElementById('password');
		var forgot_password = document.getElementById("forgot_password");
		var thirdLogin = document.getElementById("thirdLog");
		if(mui.os.plus) {
			thirdLog.style.display = 'inline'
		}
		var vInfo;
		forgot_password.addEventListener('tap', function() {
			mui.openWindow({
				url: 'forgot_password.html',
				id: 'forgot_password',
				waiting: {
					options: {
						loading: {
							height: '35px'
						}
					}
				}
			})
		})

		mui.plusReady(function() {
			plus.oauth.getServices(function(services) {
				auths = services;
			}, function(e) {
				alert("获取登录服务列表失败：" + e.message + " - " + e.code);
			});
			plus.webview.currentWebview().setStyle({
				softinputMode: "adjustResize" // 弹出软键盘时自动改变webview的高度
			});
			vInfo = plus.push.getClientInfo();
			var isInstalled = app.isInstalled('weixin');
			if(isInstalled) {
				document.getElementById('weixin').style.removeProperty('display')
			}
		})
		document.getElementById('weixin').addEventListener('tap', function() {
			if(window.plus) {
				var isInstalled = app.isInstalled('weixin');
				if(isInstalled == null || isInstalled == undefined) {
					mui.toast('您尚未安装微信客户端');
					return;
				}
				authLogin('weixin');
			} else {
				mui.toast("不支持微信登录")
			}
		})
		document.getElementById('qq').addEventListener('tap', function() {
			if(window.plus) {
				authLogin('qq');
			} else {
				mui.toast("不支持QQ登录")
			}
		})
		var Id;
		var backurl;
		if(mui.os.plus) {
			mui.plusReady(function() {
				var self = plus.webview.currentWebview();
				backurl = self.backurl;
			});
		}
		loginBtn.addEventListener('tap', function() {
			var _this = this;
			var name = TrimAll(username.value);
			var pas = TrimAll(password.value);
			if(name == "") {
				mui.toast("手机号/邮箱/昵称不能为空")
				return
			}
			if(pas == "") {
				mui.toast("密码不能为空")
				return
			}

			var params = {
				UserName: name,
				Password: pas,
				ClientId: mui.os.plus ? vInfo.clientid : null
			};
			mui(_this).button('loading'); //切换为loading状态
			postDatawithToken('Account/Login', params, function(data) {
				mui(_this).button('reset');
				if(data.Type == 1) {
					//登陆成功，存token
					var token = data.Data;
					setlsData('token', token);
					setlsData('isLogin', true);
					var url = '../index.html' + '?isMine=' + true;
					if(mui.os.plus) {
						var self = plus.webview.currentWebview();
						var pageId;
						if(mui.os.plus) {
							mui.plusReady(function() {
								var self = plus.webview.currentWebview();
								backurl = self.backurl;
							});
						}
						setlsData('Loginoperation', true);
						if(backurl == "login") {
							plus.webview.open(url);
						} else {
							var currView = plus.webview.getWebviewById('mine.html');
							currView&&currView.reload();
							mui.back();
						}
					} else {
						setTimeout(function() {
							mui.openWindow({
								url: url,
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

				} else if(data.Type == 0) {
					//登录失败
					mui.toast("请登录后再进行操作");
					setlsData('isLogin', false);
					return;
				} else {
					//逻辑错误
					mui.toast(data.Data);
					return;
				}
			}, function(data) {
				mui(_this).button('reset');
				hideLoading()
			});

		})
	}
}
/**
 * 第三方登录
 */
var third_login = {
	init: function() {
		var userAvator = document.getElementById("userAvator");
		var nickname = document.getElementById("nickname");
		var oldAccount = document.getElementById("oldAccount");
		var newAccount = document.getElementById("newAccount");
		var data = {};
		var type = "";
		mui.plusReady(function() {
			var self = plus.webview.currentWebview(); //获取当前窗体对象
			type = self.type; //接收A页面传入的id参数值
			if(type == 'qq') {
				data = JSON.parse(getlsData('qq'));
			} else {
				data = JSON.parse(getlsData('weixin'));
			}
			userAvator.src = data.UserAvatarUrl;
			nickname.innerHTML = data.NickName;

		});
		if(mui.os.wechat) {
			data = JSON.parse(getlsData('wechat')).userInfo;
		}
		if(mui.os.wechat) {
			userAvator.src = data.headimgurl;
			nickname.innerHTML = data.nickname;
		}
		oldAccount.addEventListener('tap', function() {
			mui.openWindow({
				url: 'relation_oldAccount.html',
				id: 'relation_oldAccount',
				extras: {
					type: type
				},
				waiting: {
					options: {
						loading: {
							height: '35px'
						}
					}
				}
			})
		})
		newAccount.addEventListener('tap', function() {
			mui.openWindow({
				url: 'relation_newAccount.html',
				id: 'relation_newAccount',
				extras: {
					type: type
				},
				waiting: {
					options: {
						loading: {
							height: '35px'
						}
					}
				}
			})

		})
	}
}
/**
 * 注册账号
 */
if(pageUrl == 'register_account.html') {
	mui.init();
	var deceleration = mui.os.ios ? 0.003 : 0.0009;
	mui('.mui-scroll-wrapper').scroll({
		bounce: false,
		indicators: true, //是否显示滚动条
		deceleration: deceleration
	});
	var confirmBtn = document.getElementById('confirmBtn'); //确定按钮
	var phoneNum = document.getElementById('phoneNum'); //用户名
	var password = document.getElementById('password'); //密码
	var codeBtn = document.getElementById('codeBtn'); //获取验证码按钮
	var code = document.getElementById('code'); //验证码文本框
	var agreementcheck = document.getElementById("agreementcheck"); //勾选框
	var agreement = document.getElementById("agreement"); //用户协议
	agreement.addEventListener('tap', function() {
		mui.openWindow({
			url: 'user_agreement.html',
			id: 'user_agreement',
			waiting: {
				options: {
					loading: {
						height: '35px'
					}
				}
			}
		})
	})
	var vInfo;
	mui.plusReady(function() {
		vInfo = plus.push.getClientInfo();
	})
	window.onload = function() {
		if(mui.os.wechat) {
			var currUrl = location.href.split('#')[0];
			weChatLogin(currUrl)
		}
	}

	function onClickHander(obj) {
		if(obj.checked) {
			confirmBtn.removeAttribute("disabled");
		} else {
			confirmBtn.setAttribute("disabled", "disabled")
		}

	}
	var timer;
	//获取验证码函数
	function countdown(s, sendObj) {
		if(s == 0) {
			sendObj.innerHTML = '重新获取';
			sendObj.removeAttribute("disabled");
			window.clearTimeout(timer);
		} else {
			sendObj.innerHTML = s + '秒后重新获取';
			sendObj.setAttribute("disabled", "disabled");
			s--;
			timer = window.setTimeout(function() {
				countdown(s, sendObj)
			}, 1000)
		}
	}

	codeBtn.addEventListener('tap', function() {
		var _this = this;
		var phonenum = TrimAll(phoneNum.value);
		if(phonenum == "") {
			mui.toast("手机号不能为空")
			return
		}
		if(!phonereg.test(phonenum)) {
			mui.toast("手机号格式错误")
			return
		}
		countdown(60, codeBtn);
		var params = {
			phoneNumber: phonenum
		};
		getData('Account/GetValidateCode', params, function(data) {
			if(data.Type == 1) {
				mui.toast(data.Data);
			} else if(data.Type == 0) {
				//登录失败
			} else {
				//逻辑错误
				mui.toast(data.Data);
				countdown(0, codeBtn);
			}
		}, function(data) {
			hideLoading()
		})

	})
	confirmBtn.addEventListener('tap', function() {
		var _this = this;
		var name = TrimAll(phoneNum.value);
		var pas = TrimAll(password.value);
		var phonecode = TrimAll(code.value);
		if(name == "") {
			mui.toast("手机号不能为空")
			return
		}
		if(pas == "") {
			mui.toast("密码不能为空")
			return
		}
		if(phonecode == "") {
			mui.toast("验证码不能为空")
			return
		}
		if(!phonereg.test(name)) {
			mui.toast("手机号格式错误")
			return
		}
		var params = {
			PhoneNumber: name,
			Password: pas,
			ValidateCode: phonecode,
			ClientId: mui.os.plus ? vInfo.clientid : null
		};
		mui(_this).button('loading'); //切换为loading状态
		postData('Account/Register', params, function(data) {
			mui(_this).button('reset');
			if(data.Type == 1) {
				setlsData('token', data.Data);
				setlsData('isLogin', true);
				var url = '../index.html' + '?isMine=' + true;
				if(mui.os.plus) {
					var self = plus.webview.currentWebview();
					var pageId;
					var all = plus.webview.all();
					setTimeout(function() {
						for(var i = 0, len = plus.webview.all().length; i < len; i++) {
							if(all[i].id != 'register_account') {
								all[i].close();
							}
						}
						plus.webview.open(url);
						/*mui.openWindow({
							url: url,
							id: 'main',
							waiting: {
								options: {
									loading: {
										height: '35px'
									}
								}
							},
							extras: {
								isMine: true
							}
						})*/
					},200)
				} else {
					setTimeout(function() {
						mui.openWindow({
							url: url,
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
			} else if(data.Type == 0) {
				//登录失败
				mui.toast("请登录后再进行操作");
				login();
				return;
			} else {
				//逻辑错误
				mui.toast(data.Data);
				return;
			}
		}, function(data) {
			mui(_this).button('reset');
		});
	});

}
/**
 * 忘记密码
 */
var forgot_password = {
	init: function() {
		mui.init();
		var deceleration = mui.os.ios ? 0.003 : 0.0009;
		mui('.mui-scroll-wrapper').scroll({
			bounce: false,
			indicators: true, //是否显示滚动条
			deceleration: deceleration
		});
		var confirmBtn = document.getElementById('confirmBtn'); //登录按钮
		var account = document.getElementById('account'); //用户名
		var password = document.getElementById("password"); //新密码
		var codeBtn = document.getElementById('codeBtn'); //获取验证码按钮
		var code = document.getElementById('code'); //验证码文本框
		var emailMsg = document.getElementById("emailMsg"); //邮箱验证码提示语
		var phonereg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/; //判断手机号的正则
		var emailreg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/; //判断邮箱的正则

		var timer;

		window.onload = function() {
			if(mui.os.wechat) {
				var currUrl = location.href.split('#')[0];
				weChatLogin(currUrl)
			}
		}
		//获取验证码函数
		function countdown(s, sendObj) {
			if(s == 0) {
				sendObj.innerHTML = '重新获取';
				sendObj.removeAttribute("disabled");
				window.clearTimeout(timer);
			} else {
				sendObj.innerHTML = s + '秒后重新获取';
				sendObj.setAttribute("disabled", "disabled");
				s--;
				timer = window.setTimeout(function() {
					countdown(s, sendObj)
				}, 1000)
			}
		}
		codeBtn.addEventListener('tap', function() {
			var username = TrimAll(account.value);
			if(username == "") {
				mui.toast("手机号码/邮箱/昵称不能为空")
				return
			}
			if(phonereg.test(username)) {
				emailMsg.style.display = "none";
			}
			if(emailreg.test(username)) {
				emailMsg.style.display = "block";
			}
			countdown(60, codeBtn);
			var params = {
				userName: username
			};
			getData('Account/GetFindPasswordCode', params, function(data) {
				if(data.Type == 1) {
					mui.toast(data.Data);
				} else if(data.Type == 0) {
					//登录失败
				} else {
					//逻辑错误
					countdown(0, codeBtn);
					mui.toast(data.Data);
				}
			}, function() {
				closeWaiting(waiting)
			})
		})
		confirmBtn.addEventListener('tap', function() {
			var name = TrimAll(account.value);
			var pas = TrimAll(password.value);
			var phonecode = TrimAll(code.value);
			if(name == "") {
				mui.toast("手机号码/邮箱/昵称不能为空")
				return
			}
			if(pas == "") {
				mui.toast("密码不能为空")
				return
			}
			if(phonecode == "") {
				mui.toast("验证码不能为空")
				return
			}
			var params = {
				UserName: name,
				Password: pas,
				ValidateCode: phonecode
			};
			showLoading();
			var _this = this;
			mui(_this).button('loading'); //切换为loading状态
			postData('Account/ResetPassword', params, function(data) {
				mui(_this).button('reset');
				hideLoading();
				if(data.Type == 1) {
					mui.toast(data.Data);
					setTimeout(function() {
						mui.back();
					}, 500)

				} else if(data.Type == 0) {
					//登录失败
					mui.toast("请登录后再进行操作");
					login();
					return;
				} else {
					//逻辑错误
					mui.toast(data.Data);
					return;
				}
			}, function(data) {
				mui(_this).button('reset');
				hideLoading();
			});

		});
	}
}
/**
 * 关联新账号
 */
if(pageUrl == 'relation_newAccount.html') {
	mui.init();
	var confirmBtn = document.getElementById('confirmBtn'); //确定按钮
	var phoneNum = document.getElementById('phoneNum'); //用户名
	var password = document.getElementById('password'); //密码
	var codeBtn = document.getElementById('codeBtn'); //获取验证码按钮
	var code = document.getElementById('code'); //验证码文本框
	var agreementcheck = document.getElementById("agreementcheck"); //勾选框
	var agreement = document.getElementById("agreement"); //用户协议
	agreement.addEventListener('tap', function() {
		mui.openWindow({
			url: 'user_agreement.html',
			id: 'user_agreement',
			waiting: {
				options: {
					loading: {
						height: '35px'
					}
				}
			}
		})
	})

	window.onload = function() {
		if(mui.os.wechat) {
			var currUrl = location.href.split('#')[0];
			weChatLogin(currUrl)
		}
	}

	function onClickHander(obj) {
		if(obj.checked) {
			confirmBtn.removeAttribute("disabled");
		} else {
			confirmBtn.setAttribute("disabled", "disabled")
		}

	}

	var timer;
	//获取验证码函数
	function countdown(s, sendObj) {
		if(s == 0) {
			sendObj.innerHTML = '重新获取';
			sendObj.removeAttribute("disabled");
			window.clearTimeout(timer);
		} else {
			sendObj.innerHTML = s + '秒后重新获取';
			sendObj.setAttribute("disabled", "disabled");
			s--;
			timer = window.setTimeout(function() {
				countdown(s, sendObj)
			}, 1000)
		}
	}

	codeBtn.addEventListener('tap', function() {
		var _this = this;
		var phonenum = TrimAll(phoneNum.value);
		if(phonenum == "") {
			mui.toast("手机号不能为空")
			return
		}
		if(!phonereg.test(phonenum)) {
			mui.toast("手机号格式错误")
			return
		}
		countdown(60, codeBtn);
		var params = {
			phoneNumber: phonenum
		};
		getData('Account/GetValidateCode', params, function(data) {
			if(data.Type == 1) {
				mui.toast(data.Data);
			} else if(data.Type == 0) {
				//登录失败
			} else {
				//逻辑错误
				mui.toast(data.Data);
			}
		}, function(data) {
			hideLoading()
		})

	})
	var data = {};
	var type = "";
	mui.plusReady(function() {
		var self = plus.webview.currentWebview(); //获取当前窗体对象
		type = self.type; //接收A页面传入的id参数值
		if(type == 'qq') {
			data = JSON.parse(getlsData('qq'));
		} else {
			data = JSON.parse(getlsData('weixin'));
		}
	});
	if(mui.os.wechat) {
		data = JSON.parse(getlsData('wechat'));
	}

	confirmBtn.addEventListener('tap', function() {
		var _this = this;
		var name = TrimAll(phoneNum.value);
		var pas = TrimAll(password.value);
		var phonecode = TrimAll(code.value);
		if(name == "") {
			mui.toast("手机号不能为空")
			return
		}
		if(pas == "") {
			mui.toast("密码不能为空")
			return
		}
		if(phonecode == "") {
			mui.toast("验证码不能为空")
			return
		}
		if(!phonereg.test(name)) {
			mui.toast("手机号格式错误")
			return
		}
		if(mui.os.wechat) {
			params = {
				UserName: name,
				Password: pas,
				ValidateCode: phonecode,
				AccountTypeKey: 'WeChat',
				Identification: data.result.unionid,
				AccessToken: data.result.access_token,
				NickName: data.userInfo.nickname,
				Gender: data.userInfo.sex,
				UserAvatarUrl: data.userInfo.headimgurl,
				Expires_in: data.result.expires_in
			}
		} else {
			params = {
				UserName: name,
				Password: pas,
				ValidateCode: phonecode,
				AccountTypeKey: data.AccountTypeKey,
				Identification: data.Identification,
				AccessToken: data.AccessToken,
				NickName: data.NickName,
				Gender: data.Gender,
				UserAvatarUrl: data.UserAvatarUrl,
				Expires_in: data.Expires_in
			};

		}
		mui(_this).button('loading'); //切换为loading状态
		postData('Account/AssociateNewAccount', params, function(serdata) {
			mui(_this).button('reset');
			if(serdata.Type == 1) {
				//登陆成功，存token
				setlsData('token', serdata.Data);
				setlsData('isLogin', true);
				var url = '../index.html' + '?isMine=' + true;
				if(mui.os.plus) {
					var self = plus.webview.currentWebview();
					var pageId;
					var all = plus.webview.all();
					setTimeout(function() {
						for(var i = 0, len = plus.webview.all().length; i < len; i++) {
							if(all[i].id != 'relation_newAccount') {
								all[i].close();
							}
						}
						mui.openWindow({
							url: url,
							id: 'main',
							waiting: {
								options: {
									loading: {
										height: '35px'
									}
								}
							},
							extras: {
								isMine: true
							}
						})
					},200)
				} else {
					setTimeout(function() {
						mui.openWindow({
							url: url,
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
			} else if(serdata.Type == 0) {
				//登录失败
				mui.toast("请登录后再进行操作");
				login();
				return;

			} else {
				//逻辑错误
				mui.toast(serdata.Data);
				return;
			}
		}, function(data) {
			mui(_this).button('reset');
		});
	});

}
/**
 * 关联旧账号
 */
var relation_oldAccount = {
	init: function() {
		mui.init();
		var loginBtn = document.getElementById('loginBtn');
		var username = document.getElementById('account');
		var password = document.getElementById('password');
		var data = {};
		var type = "";
		mui.plusReady(function() {
			var self = plus.webview.currentWebview(); //获取当前窗体对象
			type = self.type; //接收A页面传入的id参数值
			if(type == 'qq') {
				data = JSON.parse(getlsData('qq'));
			} else {
				data = JSON.parse(getlsData('weixin'));
			}
		});
		if(mui.os.wechat) {
			data = JSON.parse(getlsData('wechat'));
		}

		window.onload = function() {
			if(mui.os.wechat) {
				var currUrl = location.href.split('#')[0];
				weChatLogin(currUrl)
			}
		}
		loginBtn.addEventListener('tap', function() {
			var _this = this;
			var name = TrimAll(username.value);
			var pas = TrimAll(password.value);
			if(name == "") {
				mui.toast("手机号/邮箱/昵称不能为空")
				return
			}
			if(pas == "") {
				mui.toast("密码不能为空")
				return
			}
			var params = {};
			if(mui.os.wechat) {
				params = {
					UserName: name,
					Password: pas,
					AccountTypeKey: 'WeChat',
					Identification: data.result.unionid,
					AccessToken: data.result.access_token,
					NickName: data.userInfo.nickname,
					Gender: data.userInfo.sex,
					UserAvatarUrl: data.userInfo.headimgurl,
					Expires_in: data.result.expires_in
				}
			} else {
				params = {
					UserName: name,
					Password: pas,
					AccountTypeKey: data.AccountTypeKey,
					Identification: data.Identification,
					AccessToken: data.AccessToken,
					NickName: data.NickName,
					Gender: data.Gender,
					UserAvatarUrl: data.UserAvatarUrl,
					Expires_in: data.Expires_in
				};
			}
			mui(_this).button('loading'); //切换为loading状态
			postData('Account/AssociateAccount', params, function(serdata) {
				mui(_this).button('reset');
				if(serdata.Type == 1) {
					//登陆成功，存token
					setlsData('token', serdata.Data);
					setlsData('isLogin', true);
					var url = '../index.html' + '?isMine=' + true;
					if(mui.os.plus) {
						var self = plus.webview.currentWebview();
							var all = plus.webview.all();
							setTimeout(function() {
								for(var i = 0, len = plus.webview.all().length; i < len; i++) {
									if(all[i].id != 'relation_oldAccount') {
										all[i].close();
									}
								}
								mui.openWindow({
									url: url,
									id: 'main',
									waiting: {
										options: {
											loading: {
												height: '35px'
											}
										}
									},
									extras: {
										isMine: true
									}
								})
							},200)
					} else {
						setTimeout(function() {
							mui.openWindow({
								url: url,
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
				} else if(serdata.Type == 0) {
					//登录失败
					mui.toast("请登录后再进行操作");
					login();
					return;

				} else {
					//逻辑错误
					mui.toast(serdata.Data);
					return;
				}
			}, function(data) {
				mui(_this).button('reset');
			});

		})
	}
}