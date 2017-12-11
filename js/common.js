var siteName = "近乎";
var bigContainer = document.querySelector('body');
var phonereg = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/; //判断手机号的正则
var emailreg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/; //判断邮箱的正则
//var applicationSwitch={
//	Ask:true,
//	Doc:true,
//	Event:true,
//	Vote:true,
//	PointMall:true
//};
/**
 * 删除左右两端的空格
 * @param {Object} str
 */
function trim(str) {
	return str.replace(/(^s*)|(s*$)/g, "");　　
}
/**
 * 删除左边的空格
 * @param {Object} str
 */
function ltrim(str) {
	return str.replace(/(^s*)/g, "");　　
}
/**
 * 删除右边的空格
 * @param {Object} str
 */
function rtrim(str) {
	return str.replace(/(s*$)/g, "");　　
}
/**
 * 删除字符串中所有空格
 * @param {Object} str
 */
function TrimAll(str) {
	var result;
	result = str.replace(/(^\s+)|(\s+$)/g, "");
	result = result.replace(/\s/g, "");
	return result;
}
/**
 * 存数据到localstorage
 * @param {Object} key
 * @param {Object} value
 */
function setlsData(key, value) {
	if(window.localStorage) {
		localStorage.setItem(key, value);
	} else {
		Cookie.write(key, value);
	}
}
/**
 * 读取数据localstorage
 * @param {Object} key
 */
function getlsData(key) {
	var strStoreDate = window.localStorage ? localStorage.getItem(key) : Cookie.read(key);
	return strStoreDate;
}

/**
 * 获取url中的参数
 * @param {Object} name 参数名字
 * @param {Object} str 自定义的url
 */
function getUrlParam(name, str) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	str = (str == null || str == undefined) ? window.location.search : str;
	var r = str.substr(1).match(reg);
	if(r != null) {
		return decodeURI(r[2]);
	} else {
		return null;
	}
}
/**
 *这里需要先用Number进行数据类型转换，然后去指定截取转换后的小数点后几位(按照四舍五入)，这里是截取一位，0.1266转换后会变成12.7%
 * @param {Object} point 需要转换的数
 */
function toPercent(point) {
	var str = Number(point * 100).toFixed(1);
	str += "%";
	return str;
}
/**
 * 截取图片后缀用于重命名图片，防止%E5%85%89%E6%98%8E%E8%A1%8C编码的文件不被系统相册识别；
 * @param {Object} imageUrl 图片地址
 */
function cutImageSuffix(imageUrl) {
	var index = imageUrl.lastIndexOf('.');
	return imageUrl.substring(index);
}
/**
 * javascript判断对象、字符串、数组是否为空（兼容绝大部分浏览器）
 * @param {Object} obj 对象
 */
function isEmpty(obj) {
	// 本身为空直接返回true
	if(obj == null) return true;

	// 然后可以根据长度判断，在低版本的ie浏览器中无法这样判断。
	if(obj.length > 0) return false;
	if(obj.length === 0) return true;

	//最后通过属性长度判断。
	for(var key in obj) {
		if(hasOwnProperty.call(obj, key)) return false;
	}

	return true;
}
/**
 * 浏览器端下载文件的方法
 * @param {Object} src下载地址
 * @param {Object} title附件名称
 * @param {Object} url附件所在详情页的url
 */
function download(src,title,url) {
	if(mui.os.wechat){
		mui.openWindow({
				url: 'wxFileDownload.html?name='+title+'&curl='+url,
				id: 'wxFileDownload.html',
				waiting: {
					options: {
						loading: {
							height: '35px'
						}
					}
				}
			})
	}else{
		var $a = document.createElement('a');
		$a.setAttribute("href", src);
		$a.setAttribute("download", "");
	
		var evObj = document.createEvent('MouseEvents');
		evObj.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, true, false, 0, null);
		$a.dispatchEvent(evObj);
	}
	
};
/**
 * 原生的下载方法,此处为下载文件并打开
 * @param {Object} url 下载地址
 */
function startDownloadTask(url) {
	var dtask = null;
	var url = getImgUrl(url);
	var options = {
		method: "GET"
	};
	var waiting = showWaiting();
	dtask = plus.downloader.createDownload(url, options);
	dtask.addEventListener("statechanged", function(task, status) {
		if(parseInt(status)==404){
			mui.toast('404')
			closeWaiting(waiting);
			return;
		}
		switch(task.state) {
			case 1:
				console.log("开始下载...");
				break;
			case 2:
				console.log("链接到服务器...");
				break;
			case 3:
				//mui.toast("下载数据更新:");
				//mui.toast(task.downloadedSize + "/" + task.totalSize);
				break;
			case 4:
				console.log("下载完成！");
				//mui.toast(task.totalSize);
				plus.io.resolveLocalFileSystemURL(task.filename, function(entry) {
					closeWaiting(waiting);
					plus.runtime.openFile(entry.fullPath, {}, function(e) {
						//plus.nativeUI.alert("无法打开此文件：" + e.emssage);
						plus.runtime.openURL(url)
					});
				}, function(e) {
					mui.toast('出错了')
				});
				break;
		}
	});
	dtask.start();
}

/**
 * 判断图片是否存在
 * @param {Object} pathImg 图片地址
 */
function isHasImg(pathImg) {
	var ImgObj = new Image();
	ImgObj.src = pathImg;
	if(ImgObj.fileSize > 0 || (ImgObj.width > 0 && ImgObj.height > 0)) {
		return true;
	} else {
		return false;
	}
}
/**
 * 生成随机数
 * @param {Object} len 长度
 */
function randomString(len) {　　
	len = len || 32;　　
	var $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';　　
	var maxPos = $chars.length;　　
	var pwd = '';　　
	for(i = 0; i < len; i++) {
		//0~32的整数  
		pwd += $chars.charAt(Math.floor(Math.random() * (maxPos + 1)));　　
	}　　
	return pwd;
}
/**
 * js的format拼接字符串的方法
 * @param {Object} args
 */
String.prototype.format = function(args) {
	var result = this;
	if(arguments.length > 0) {
		if(arguments.length == 1 && typeof(args) == "object") {
			for(var key in args) {
				if(args[key] != undefined) {
					var reg = new RegExp("({" + key + "})", "g");
					result = result.replace(reg, args[key]);
				}
			}
		} else {
			for(var i = 0; i < arguments.length; i++) {
				if(arguments[i] != undefined) {
					//var reg = new RegExp("({[" + i + "]})", "g");//这个在索引大于9时会有问题，谢谢何以笙箫的指出

					　　　　　　　　　　　　
					var reg = new RegExp("({)" + i + "(})", "g");
					result = result.replace(reg, arguments[i]);
				}
			}
		}
	}
	return result;
};
/**
 * 取当前页面名称(不带后缀名)
 */
function pageName() {
	var a = location.href;
	var b = a.split("/");
	var c = b.slice(b.length - 1, b.length).toString(String).split(".");
	return c.slice(0, 1);
}

/**
 * loading加载窗(creat)
 * @param {Object} msg 加载提示信息
 * @param {Object} el 加载框的父容器
 * @param {Object} bgcolor 加载框的背景颜色
 * @param {Object} top 加载框上边距
 */
function creatloading(msg, el, bgcolor, top) {
	msg = isEmpty(msg) ? "正在加载中" : msg
	el = isEmpty(el) ? bigContainer : el
	bgcolor = isEmpty(bgcolor) ? '#FFFFFF' : bgcolor
	top = isEmpty(top) ? 0 : top
	var div = document.createElement('div');
	div.id = 'loadingView';
	div.style.backgroundColor = bgcolor;
	div.style.top = top;
	div.className = 'loading';
	div.innerHTML = '<div class="sloading" id="sloading">' +
		'<div class="loadingIcon">' +
		'<div class="loadingItem">' +
		'<i class="fa fa-circle-o-notch fa-spin fa-1x fa-fw"></i><span id="loadmsgtext"> ' + msg + '</span>' +
		'</div>' +
		'</div>' +
		'</div>';
	var first = el.firstChild;
	el.insertBefore(div, first)
}
/**
 * loading(多端适配,(全屏))
 * @param {Object} msg 提示
 * @param {Object} el loading的父容器
 * @param {Object} bgcolor loading的背景颜色
 * @param {Object} top loading的top距离
 * @param {Object} once 是否重复创建
 */
function showLoading(msg, el, bgcolor, top, once) {
	once = isEmpty(once) ? '0' : once;
	if(once == '0' && document.getElementById("loadingView")) {
		document.getElementById("loadingView").style.display = 'block';
	} else {
		creatloading(msg, el, bgcolor, top);
	}
}
/**
 * 隐藏loading
 * @param {Object} type '1'代表子窗口控制父窗口的loading  默认是自己
 */
function hideLoading(type) {
	var loading;
	if(type && type == 1) {
		loading = window.parent.document.getElementById('loadingView');
	} else {
		loading = document.getElementById("loadingView");
	}
	if(loading) {
		loading.style.display = 'none';
	}

}
/**
 * 构建errDOM(全屏)
 * @param {Object} msg
 * @param {Object} el
 * @param {Object} bgcolor
 * @param {Object} top
 * @param {Object} color
 */
function creatErr(msg, el, bgcolor, top) {
	msg = isEmpty(msg) ? "出错了" : msg
	el = isEmpty(el) ? bigContainer : el
	bgcolor = isEmpty(bgcolor) ? '#FFFFFF' : bgcolor
	top = isEmpty(top) ? 0 : top
	var div = document.createElement('div');
	div.id = 'errView';
	div.style.backgroundColor = bgcolor;
	div.style.top = top;
	div.className = 'loading';
	div.innerHTML = '<div class="sloading" id="sloading">' +
		'<div class="loadingIcon">' +
		'<div class="loadingItem">' +
		'<i class="fa fa-info-circle fa-2x" style="vertical-align:middle;"></i><span id="loadmsgtext" style="vertical-align:middle;"> ' + msg + '</span>' +
		'</div>' +
		'</div>' +
		'</div>';
	var first = el.firstChild;
	el.insertBefore(div, first)
}

function showErr(msg, el, bgcolor, top, once) {
	once = isEmpty(once) ? '0' : once;
	if(once == '0' && document.getElementById("errView")) {
		document.getElementById("errView").style.display = 'block';
	} else {
		creatErr(msg, el, bgcolor, top);
	}
}

function hideErr(type) {
	var err;
	if(type && type == 1) {
		err = window.parent.document.getElementById('errView');
	} else {
		err = document.getElementById("errView");
	}
	if(!isEmpty(err)) {
		err.style.display = 'none';
	}

}

/**
 * 列表中错误框的DOM(非全屏,尤其是可以左右滑动的list,目的是不影响slider事件)
 * @param {Object} msg
 * @param {Object} bgcolor
 * @param {Object} top
 */
function creatErrForList(msg, bgcolor, top) {
	msg = isEmpty(msg) ? "出错了" : msg
	bgcolor = isEmpty(bgcolor) ? '#FFFFFF' : bgcolor
	top = isEmpty(top) ? '55%' : top
	var div = document.createElement('div');
	div.id = 'errForList';
	div.style.marginTop = top;
	div.innerHTML = '<div class="loadingItem">' +
		'<i class="fa fa-info-circle fa-2x" style="vertical-align:middle;"></i><span id="loadmsgtext" style="vertical-align:middle;"> ' + msg + '</span>' +
		'</div>';
	return div;
}

function showErrForList(msg, bgcolor, top, id) {
	var fragment = document.getElementById(id);
	var errlistEl = fragment.querySelector('#errForList');
	if(errlistEl) {
		errlistEl.style.display = 'block';
		return false;
	} else {
		return creatErrForList(msg, bgcolor, top);
	}
}

function hideErrForList(type, id) {
	var fragment = document.getElementById(id);
	var errlistEl = fragment.querySelector('#errForList');
	if(errlistEl) {
		errlistEl.style.display = 'none';
	} else {
	
	}
}
/**
 * 原生的loading
 * @param {Object} msg
 */
function showWaiting(msg) {
	if(window.plus) {
		return plus.nativeUI.showWaiting(msg ? msg : "", {
			loading: {
				height: '35px'
			}
		});
	} else {
		creatloadingEL()
		showLoading()
	}

}
/**
 * 关闭原生loading
 * @param {Object} w
 */
function closeWaiting(w) {
	if(window.plus) {
		w && w.close();
	}

}

/**
 * DOM元素转换成string
 * @param {Object} node DOM
 */
function nodeToString ( node ) {  
   var tmpNode = document.createElement( "div" );  
   tmpNode.appendChild( node.cloneNode( true ) );  
   var str = tmpNode.innerHTML;  
   tmpNode = node = null; // prevent memory leaks in IE  
   return str;  
} 
//var serverAddress='http://192.168.0.131:8096';
var serverAddress='http://demo.jinhusns.com/';
//var serverAddress='http://www.fanggaoming.cn/';
//var serverAddress='http://192.168.0.150:8099/';
function getImgUrl(oldSrc){
	var newSrc='';
	if(oldSrc){
		newSrc=(oldSrc.indexOf('http')>=0||oldSrc.indexOf('webdav')>=0||oldSrc.indexOf('file')>=0||oldSrc.indexOf('data:image')>=0)?oldSrc:(serverAddress+oldSrc)
	}
	return newSrc;
}
function getBodyImgUrl(str){
	var div = document.createElement('div');
	div.innerHTML=str;
	var imgs=div.querySelectorAll('img');
	if(imgs&&imgs.length>0){
		for(var i=0;i<imgs.length;i++){
			if(imgs[i].src.indexOf('file')>=0){
				var oldurl=imgs[i].src.substring(7,imgs[i].src.length)
			}else{
				var oldurl=imgs[i].src
			}
			imgs[i].src=getImgUrl(oldurl);
		}
	}
	
	return div.innerHTML;
}
//登录失败后重新登陆操作
function login() {
	if(mui.os.wechat) {
		var currUrl = location.href.split('#')[0];
		getCode(currUrl)
	} else {
		mui.openWindow({
			url: 'user_login.html',
			id: 'user_login.html',
			waiting: {
				options: {
					loading: {
						height: '35px'
					}
				}
			}
		})
	}

}
