var wx_Http_Url = "http://demo.jinhusns.com/api/";
//var wx_Http_Url = "http://192.168.0.150:8088/api/";
var main_Url = "http://demo.jinhusns.com/WeChat/index.html";

function initWx() {
	var currUrl = location.href.split('#')[0]; //当前页面地址
	mui.ajax(wx_Http_Url + 'Account/GetWeChatConfig', {
		data: {
			url: currUrl
		},
		dataType: "json", //服务器返回json格式数据
		type: 'get', //HTTP请求类型
		success: function(data) {
			wx.config({
				debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
				appId: data.Data.appId, // 必填，公众号的唯一标识
				timestamp: data.Data.timestamp, // 必填，生成签名的时间戳
				nonceStr: data.Data.nonceStr, // 必填，生成签名的随机串
				signature: data.Data.signature, // 必填，签名，见附录1
				jsApiList: [
					'chooseImage',
					'previewImage',
					'uploadImage',
					'downloadImage',
					'openLocation',
					'onMenuShareTimeline',
					'onMenuShareAppMessage',
					'onMenuShareQQ',
					'onMenuShareWeibo',
					'onMenuShareQZone'
				] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
			});
		},
		error: function(xhr, type, errorThrown) {
			//mui.toast('获取微信配置失败')
		}
	});
}

function weChatLogin(url) {
	var code = getUrlParam('code');
	if(code != null) {
		var currUrl = url;
		var a = currUrl.substring(0, currUrl.lastIndexOf('&')).lastIndexOf('=');
		code = currUrl.substring(a + 1, currUrl.lastIndexOf('&'));
		mui.ajax(wx_Http_Url + 'Account/WeChatLogin', {
			data: {
				code: code
			},
			dataType: "json", //服务器返回json格式数据
			type: 'get', //HTTP请求类型
			success: function(data) {
				if(data.Data.state == 1) {
					//已绑定账号
					setlsData('token', data.Data.token);
					setlsData('isLogin', true);
					setlsData('wxLogin', true);
					mui.toast('登录成功')
					//location.reload()
				} else if(data.Data.state == 2) {
					//未绑定账号，需要跳转到第三方登录
					setlsData('isLogin', false);
					setlsData('wechat', JSON.stringify(data.Data));
					mui.openWindow({
						url: 'third_login.html',
						id: 'third_login',
						show: {
							aniShow: 'none'
						},
						extras: {
							type: 'weixin'
						}
					})

				} else {

				}

			},
			error: function(xhr, type, errorThrown) {
				console.log('error');
			}
		});
	}
}

function getCode(url, tabChild) {
	if(tabChild) {
		url = 'http://demo.jinhusns.com/WeChat/index.html';
	}
	var newUrl = encodeURIComponent(url);
	if(mui.os.wechat) {
		if(tabChild) {
			parent.window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx1de0b6e23a9b868e&redirect_uri=" + newUrl + "&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
		} else {
			window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx1de0b6e23a9b868e&redirect_uri=" + newUrl + "&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
		}

	}
}
/**
 * 微信上传图片
 * @param {Object} count 可选数量
 * @param {Object} successFun 成功回调
 * @param {Object} album 相册
 * @param {Object} camera 相机
 */
function wxChooseImg(count, successFun, album, camera) {
	var wxsourceType = ['album', 'camera']; // 可以指定来源是相册还是相机，默认二者都有
	if(album) {
		wxsourceType = ['album']
	}
	if(camera) {
		wxsourceType = ['camera']
	}
	wx.chooseImage({
		count: count, // 默认9
		sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
		sourceType: wxsourceType,
		success: function(res) {
			var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
			successFun(localIds)
		}
	});
}

function syncUpload(localIds, url, successfun) {
	var localId = localIds.shift();
	wx.uploadImage({
		localId: localId, // 需要上传的图片的本地ID，由chooseImage接口获得
		isShowProgressTips: 1, // 默认为1，显示进度提示
		success: function(res) {
			var serverId = res.serverId; // 返回图片的服务器端ID
			postDatawithToken(url + '?localId=' + serverId, {}, function(data) {
				if(data.Data.state == 1) {
					successfun(data.Data.attachmentId, localId)
				}
				if(localIds.length > 0) {
					syncUpload(localIds, url, successfun);
				}
			}, function(data) {
				//alert(JSON.stringify(data))
			});
		}
	});
}