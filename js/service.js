/**
 * 服务器端接口地址
 */
//var Http_Url = "http://192.168.0.237:8089/api/";
//var Http_Url="http://www.fanggaoming.cn/api/";
//var Http_Url = "http://192.168.0.150:8099/api/";
var Http_Url = "http://demo.jinhusns.com/api/";
//var Http_Url = "http://192.168.0.155:9998/api/";
//var Http_Url = "http://192.168.0.131:8096/api/";

//分享地址（触屏版地址）
var HttpUrl = "http://demo.jinhusns.com/WeChat";

//var HttpUrl="http://192.168.0.150:8099/WeChat";
var shareUrl = HttpUrl + '/html/';

/**
 * post请求
 * @param {Object} action 接口地址
 * @param {Object} params post参数
 * @param {Object} SuccessFun 成功返回函数
 * @param {Object} errFun 错误返回函数
 * 																    
 */
function postData(action, params, SuccessFun, errFun) {
	mui.ajax(Http_Url + action, {
		data: JSON.stringify(params),
		dataType: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		headers: {
			'Content-Type': 'application/json'
		},
		success: function(data) {
			SuccessFun(data);
		},
		error: function(xhr, type, errorThrown) {
			errFun&&errFun(type);
		}
	});
}
/**
 * 带token的post请求
 * @param {Object} action 接口地址
 * @param {Object} params post参数
 * @param {Object} SuccessFun 成功返回函数
 * @param {Object} errFun 错误返回函数
 */
function postDatawithToken(action, params, SuccessFun, errFun) {
	var strStoreDate = window.localStorage ? localStorage.getItem('token') : Cookie.read('token');
	strStoreDate = (strStoreDate == null) ? 'null' : strStoreDate;

	mui.ajax(Http_Url + action, {
		data: JSON.stringify(params),
		dataType: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		headers: {
			'Content-Type': 'application/json'
		},
		beforeSend: function(XHR) {
			XHR.setRequestHeader('Authorization', 'BasicAuth ' + strStoreDate);
		},
		success: function(data) {
			SuccessFun(data);
		},
		error: function(xhr, type, errorThrown) {
			errFun&&errFun(type);
		}
	});
}
/**
 * 渲染错误页
 * @param {Object} color 背景颜色（默认白色）
 * @param {Object} top 距离（默认50）
 * @param {Object} isShow 是否显示（默认显示）
 */
function setErr(color, top, isShow) {
	color = (color != null || color != undefined) ? color : '#FFFFFF';
	top = (top != null || top != undefined) ? top : '50px';
	isShow = (isShow != null || isShow != undefined) ? isShow : true;
	hideLoading()
	mui.plusReady(function() {
		if(plus.networkinfo.getCurrentType() == 1 || plus.networkinfo.getCurrentType() == 2) {
			mui.toast('网络异常，请检查网络设置!');
			if(isShow) {
				showErr('没有网络连接', '', color, top)
			}
		} else {
			if(isShow) {
				showErr('未知错误', '', color, top)
			}
			hideLoading()
		}
	})
	if(!mui.os.plus) {
		if(isShow) {
			showErr('未知错误', '', color, top)
		}
		hideLoading()
	}
}
/**
 * get请求
 * @param {Object} action 接口地址
 * @param {Object} params get参数
 * @param {Object} SuccessFun 成功返回函数
 * @param {Object} errFun 错误返回函数
 */
function getData(action, params, SuccessFun, errFun) {
	mui.ajax(Http_Url + action, {
		data: params,
		dataType: 'json', //服务器返回json格式数据
		type: 'get', //HTTP请求类型
		success: function(data) {
			//获得服务器响应
			SuccessFun(data);
		},
		error: function(xhr, type, errorThrown) {
			if(!mui.os.plus) {
				if((navigator.userAgent.indexOf('UCBrowser') > -1 && mui.os.ios && type == 'abort') ||
					(mui.os.wechat && type == 'abort')) {
					//window.location.reload();
				} else {
					errFun(type);
				}
			} else {
				errFun&&errFun(type);
			}
		}
	});
}
/**
 * 带token的get请求
 * @param {Object} action 接口地址
 * @param {Object} params get参数
 * @param {Object} SuccessFun 成功返回函数
 * @param {Object} errFun 错误返回函数
 */
function getDatawithToken(action, params, SuccessFun, errFun) {
	/**
	 * 获取token
	 */
	var strStoreDate = window.localStorage ? localStorage.getItem('token') : Cookie.read('token');
	strStoreDate = (strStoreDate == null) ? 'null' : strStoreDate;
	mui.ajax(Http_Url + action, {
		data: params,
		dataType: 'json', //服务器返回json格式数据
		type: 'get', //HTTP请求类型
		beforeSend: function(XHR) {
			XHR.setRequestHeader('Authorization', 'BasicAuth ' + strStoreDate);
		},
		success: function(data) {
			//获得服务器响应
			SuccessFun(data);
		},
		error: function(xhr, type, errorThrown) {
			if(!mui.os.plus) {
				if((navigator.userAgent.indexOf('UCBrowser') > -1 && mui.os.ios && type == 'abort') ||
					(mui.os.wechat && type == 'abort')) {
					//window.location.reload();
				} else {
					errFun&&errFun(type);
				}
			} else {
				errFun&&errFun(type);
			}
		}
	});
}

function getCurrentUser() {
	getDatawithToken('User/GetCurrentUser', {}, function(data) {
		if(data.Type == 1) {
			setlsData('isLogin', true);
			var user = data.Data;
			return user;
		} else if(data.Type == 0) {
			//登录失败
			setlsData('isLogin', false);
			return;
		} else {
			//逻辑错误
			mui.toast(data.Data);
			return;
		}
	}, function(data) {
		
	});
}
