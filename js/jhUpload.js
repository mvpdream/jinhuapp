/**
 * 上传文件操作
 * web端 采用普通的ajax提交上传
 * app 采用H5+进行上传
 */
var jhUpload = {
	files: []
}
var jhUploadvoteitem = {
	files: []
}
var jhUploadFeatured = {
	files: []
}
/**
 * 单个文件上传（web）
 * @param {Object} uploadUrl
 * @param {Object} successFun
 */
function fileUploadforWeb(uploadUrl, successFun) {
	var strStoreDate = window.localStorage ? localStorage.getItem('token') : Cookie.read('token');
	strStoreDate = (strStoreDate == null) ? 'null' : strStoreDate;
	var form = new FormData(document.getElementById("uploadForm"));
	$.ajax({
		url: Http_Url + uploadUrl,
		type: "post",
		data: form,
		processData: false,
		contentType: false,
		beforeSend: function(XHR) {
			XHR.setRequestHeader('Authorization', 'BasicAuth ' + strStoreDate);
		},
		success: function(data) {
			setTimeout(function() {
				hideLoading()
			}, 500)
			if(data.Type == 1) {
				mui.toast('上传成功');
				console.log(data)
				successFun(data.Data);
				files = []
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

		},
		error: function(e) {
			setTimeout(function() {
				hideLoading()
			}, 500)
			alert("错误！！");
		}
	});
};

//拍照 
function getImage(uploadUrl, successFun) {
	var c = plus.camera.getCamera();
	c.captureImage(function(e) {
		plus.io.resolveLocalFileSystemURL(e, function(entry) {
			var s = entry.toLocalURL();
			jhUploadFeatured.files = [];
			var a = new Date().getTime();
			jhUploadFeatured.files.push({
				name: "uploadkey" + a,
				path: s
			});
			fileUploadforApp(uploadUrl, successFun)
		}, function(e) {
			console.log("读取拍照文件错误：" + e.message);
		});
	}, function(s) {
		console.log("error" + s);
	}, {

	})
};
//相册 
function galleryImg(uploadUrl, successFun) {
	plus.gallery.pick(function(e) {
		plus.io.resolveLocalFileSystemURL(e, function(entry) {　
			var s = entry.toLocalURL();
			jhUploadFeatured.files = [];
			var a = new Date().getTime();
			jhUploadFeatured.files.push({
				name: "uploadkey" + a,
				path: s
			});
			fileUploadforApp(uploadUrl, successFun)
		}, function(e) {
			console.log("读取图片错误：" + e.message);
		});
	}, function(a) {}, {
		filter: "image"
	})
};

var task = null;

function fileUploadforApp(uploadUrl, successFun) {
if(uploadUrl == '/Document/UploadFile'){
	var strStoreDate = window.localStorage ? localStorage.getItem('token') : Cookie.read('token');
	files=jhUploadFeatured.files;
	if(files.length == 0) {
		return;
	}
	var waiting = showWaiting();
	task = plus.uploader.createUpload(Http_Url + uploadUrl, { method: "POST" },
		function(t, status) { //上传完成
			closeWaiting(waiting);
			if(status == 200) {
				console.log("上传成功：" + t.responseText);
				var data = JSON.parse(t.responseText);
				successFun(files[0].path,data.Data);
				files = []
			} else {
				console.log("上传失败：" + status);
				mui.toast('上传失败,暂不支持此格式!')
			}
		}
	);
	task.addData("uid", getUid());
	for(var i = 0; i < files.length; i++) {
		var f = files[i];
		task.addFile(f.path, { key: f.name });
	}
	task.addEventListener("statechanged", onStateChanged, false);
	task.setRequestHeader('Authorization', 'BasicAuth ' + strStoreDate);
	task.start();
}else {
	var strStoreDate = window.localStorage ? localStorage.getItem('token') : Cookie.read('token');
	strStoreDate = (strStoreDate == null) ? 'null' : strStoreDate;
	if(jhUploadFeatured.files.length == 0) {
		return;
	}
	//var waiting = showWaiting();
	appendFileFeatured(0, jhUploadFeatured.files, uploadUrl, successFun)
}
};
var filesList = [];

function filesUploadforApp(uploadUrl, successFun) {
	var strStoreDate = window.localStorage ? localStorage.getItem('token') : Cookie.read('token');
	strStoreDate = (strStoreDate == null) ? 'null' : strStoreDate;
	if(jhUpload.files.length == 0) {
		//没有附件，直接提交
		successFun('')
		return;
	}
	//var waiting = showWaiting();
	mui('#creat_Btn').button('loading'); //切换为loading状态
	appendFile(0, jhUpload.files, uploadUrl, successFun)
};
var baseList = [];
var f1 = null;
var imgArray = [];
var imgNames = [];
var imgVoteArray = [];
var imgVoteNames = [];
var f2 = null;
var imgArrayFeatured = [];
var imgNamesFeatured = [];

function appendFileFeaturedTouch(uploadUrl, i, data, successFun, name) {
	if(i == 1) {
		showLoading()
		postDatawithToken(uploadUrl, {
			ImgArrays: imgArrayFeatured,
			ImgNames: imgNamesFeatured
		}, function(e) {
			hideLoading();
			successFun(e.Data);
		},function(){
			
		})
		return
	}
	var f2 = null;
	var src = data;
	var img = new Image();
	img.src = '';
	img.onload = function() {
		var that = this;
		var w = that.width,
			h = that.height,
			scale = w / h;
		w = 480 || w;
		h = w / scale;
		var canvas = document.createElement('canvas');
		var ctx = canvas.getContext('2d');
		$(canvas).attr({
			width: w,
			height: h
		});
		ctx.drawImage(that, 0, 0, w, h);
		var base64 = canvas.toDataURL('image/jpeg', 1 || 0.8); //, 1 || 1             
		f2 = base64;
		imgArrayFeatured.push(f2);
		imgNamesFeatured.push(name);
		appendFileFeaturedTouch(uploadUrl, i + 1, data, successFun, name)
	}
	img.src = data;
}

function appendFileVoteTouch(uploadUrl, i, data, successFun, name) {	
	if(i == 1) {
		showLoading('', '', '#FFFFFF', '50px');
		postDatawithToken(uploadUrl, {
			IsVoteItem:'true',
			ImgArrays: imgArrayFeatured,
			ImgNames: imgNamesFeatured
		}, function(data) {
			successFun(data.Data);
		},function(){
			
		})
		return
	}
	var f2 = null;
	var src = data;
	var img = new Image();
	img.src = '';
	img.onload = function() {
		var that = this;
		var w = that.width,
			h = that.height,
			scale = w / h;
		w = 480 || w;
		h = w / scale;
		var canvas = document.createElement('canvas');
		var ctx = canvas.getContext('2d');
		$(canvas).attr({
			width: w,
			height: h
		});
		ctx.drawImage(that, 0, 0, w, h);
		var base64 = canvas.toDataURL('image/jpeg', 1 || 0.8); //, 1 || 1             
		f2 = base64;
		imgArrayFeatured = [];
		imgArrayFeatured.push(f2);
		imgNamesFeatured.push(name);
		appendFileVoteTouch(uploadUrl, i + 1, data, successFun, name)
	}
	img.src = data;
}

function appendFileFeatured(i, data, uploadUrl, successFun) {
	if(i == 1) {
		showLoading()
		postDatawithToken(uploadUrl, {
			ImgArrays: imgArrayFeatured,
			ImgNames: imgNamesFeatured
		}, function(data) {
			hideLoading()
			successFun(jhUploadFeatured.files[0].path, data.Data);
			jhUploadFeatured.files = [];
		},function(){
			
		})
		return
	}
	var f2 = null;
	var src = data[i].path;
	var lastStr = src.lastIndexOf('/');
	var lastStrs = src.lastIndexOf('.');
	var jiequ = src.substring(lastStr + 1, lastStrs);
	var houzhui = src.split(".")[1];
	var finalName = jiequ + "." + houzhui;
	var img = new Image();
	img.src = '';
	img.onload = function() {
		var that = this;
		var w = that.width,
			h = that.height,
			scale = w / h;
		w = 480 || w;
		h = w / scale;
		var canvas = document.createElement('canvas');
		var ctx = canvas.getContext('2d');
		$(canvas).attr({
			width: w,
			height: h
		});
		ctx.drawImage(that, 0, 0, w, h);
		var base64 = canvas.toDataURL('image/jpeg', 1 || 0.8); //, 1 || 1             
		f2 = base64;
		imgArrayFeatured = [];
		imgArrayFeatured.push(f2);
		imgNamesFeatured.push(finalName);
		appendFileFeatured(i + 1, jhUpload.files, uploadUrl, successFun)
	}
	img.src = data[i].path;
}

function appendFile(i, data, uploadUrl, successFun) {
	if(i == data.length) {
		showLoading()
		postDatawithToken(uploadUrl, {
			ImgArrays: imgArray,
			ImgNames: imgNames
		}, function(data) {
			hideLoading()
			successFun(data.Data.AttachmentIds);
		})
		return
	}
	var f1 = null;
	var src = data[i].path;
	var lastStr = src.lastIndexOf('/');
	var lastStrs = src.lastIndexOf('.');
	var jiequ = src.substring(lastStr + 1, lastStrs);
	var houzhui = src.split(".")[1];
	var finalName = jiequ + "." + houzhui;
	var img = new Image();
	img.src = '';
	img.onload = function() {
		var that = this;
		var w = that.width,
			h = that.height,
			scale = w / h;
		w = 480 || w;
		h = w / scale;
		var canvas = document.createElement('canvas');
		var ctx = canvas.getContext('2d');
		$(canvas).attr({
			width: w,
			height: h
		});
		ctx.drawImage(that, 0, 0, w, h);
		var base64 = canvas.toDataURL('image/jpeg', 1 || 0.8); //, 1 || 1             
		f1 = base64;
		imgArray.push(f1);
		imgNames.push(finalName);
		appendFile(i + 1, jhUpload.files, uploadUrl, successFun)
	}
	img.src = data[i].path;
}

function appendFileTouch(uploadUrl, i, data, successFun) {
	if(i == data.length) {
		showLoading()
		postDatawithToken(uploadUrl, {
			ImgArrays: imgArray,
			ImgNames: touchNames
		}, function(e) {
			hideLoading()
			successFun(e.Data.AttachmentIds);
		})
		return
	}
	var f1 = null;
	var src = data[i].src;
	var img = new Image();
	img.src = '';
	img.onload = function() {
		var that = this;
		var w = that.width,
			h = that.height,
			scale = w / h;
		w = 480 || w;
		h = w / scale;
		var canvas = document.createElement('canvas');
		var ctx = canvas.getContext('2d');
		$(canvas).attr({
			width: w,
			height: h
		});
		ctx.drawImage(that, 0, 0, w, h);
		var base64 = canvas.toDataURL('image/jpeg', 1 || 0.8); //, 1 || 1             
		f1 = base64;
		imgArray.push(f1);
		//imgNames.push('ssss.jpg');
		appendFileTouch(uploadUrl, i + 1, data, successFun)
	}
	img.src = data[i].src;
}

function getImageforCreat() {
	var c = plus.camera.getCamera();
	c.captureImage(function(e) {
		plus.io.resolveLocalFileSystemURL(e, function(entry) {
			var s = entry.toLocalURL();
			var a = new Date().getTime();
			jhUpload.files.push({
				name: "uploadkey" + a,
				path: s
			});
			if(oldImageAttachments.length==0){document.getElementById("imgs").innerHTML = "";}
			document.getElementById("imgs").appendChild(creatImg(jhUpload.files))
		}, function(e) {
			console.log("读取拍照文件错误：" + e.message);
		});
	}, function(s) {
		console.log("error" + s);
	}, {})
}

function getImagesforCreat() {
	// 从相册中选择图片
	plus.gallery.pick(function(e) {
		for(var i in e.files) {
			var a = new Date().getTime();
			jhUpload.files.push({
				name: "uploadkey" + a + i,
				path: e.files[i]
			});
		}
		if(oldImageAttachments.length==0){document.getElementById("imgs").innerHTML = "";}
		document.getElementById("imgs").appendChild(creatImg(jhUpload.files))
	}, function(e) {
		console.log("取消选择图片");
	}, {
		filter: "image",
		multiple: true,
		maximum: 5,
		system: false,
		onmaxed: function() {
			plus.nativeUI.alert('最多只能选择5张图片');
		}
	}); // 最多选择3张图片
}
function appendFilevote(i, data, uploadUrl, successFun) {
	if(i == data.length) {
		postDatawithToken(uploadUrl, {
			IsVoteItem: 'true',
			ImgArrays: imgVoteArray,
			ImgNames: imgVoteNames
		}, function(data) {
			successFun(data.Data.AttachmentIds);
		})
		return
	}
	var f1 = null;
	var src = data[i].path;
	var lastStr = src.lastIndexOf('/');
	var lastStrs = src.lastIndexOf('.');
	var jiequ = src.substring(lastStr + 1, lastStrs);
	var houzhui = src.split(".")[1];
	var finalName = jiequ + "." + houzhui;
	var img = new Image();
	img.src = '';
	img.onload = function() {
		var that = this;
		var w = that.width,
			h = that.height,
			scale = w / h;
		w = 480 || w;
		h = w / scale;
		var canvas = document.createElement('canvas');
		var ctx = canvas.getContext('2d');
		$(canvas).attr({
			width: w,
			height: h
		});
		ctx.drawImage(that, 0, 0, w, h);
		var base64 = canvas.toDataURL('image/jpeg', 1 || 0.8);            
		f1 = base64;
		imgVoteArray = [];
		imgVoteArray.push(f1);
		imgVoteNames.push(finalName);
		appendFilevote(i + 1, jhUploadvoteitem.files, uploadUrl, successFun)
	}
	img.src = data[i].path;
}
function getImagesforCreatByVote() {
	// 从相册中选择图片
	jhUploadvoteitem.files = [];
	plus.gallery.pick(function(e) {
		for(var i in e.files) {
			var a = new Date().getTime();
			jhUploadvoteitem.files.push({
				name: "uploadkey" + a + i,
				path: e.files[i]
			});
		}
		creatImgVoteItem(jhUploadvoteitem.files[i].path);
		appendFilevote(0, jhUploadvoteitem.files, 'Vote/UploadVoteItemFiles', function(e){
			ItemImages.push(e);
		});
		//document.getElementById("imgs").innerHTML = "";
		//document.getElementById("imgs").appendChild(creatImg(jhUpload.files))

	}, function(e) {
		console.log("取消选择图片");
	}, {
		filter: "image",
		multiple: true,
		maximum: 1,
		system: false,
		onmaxed: function() {
			plus.nativeUI.alert('最多只能选择1张图片');
		}
	});
}
function onStateChanged(upload, status) {
	//console.log('已完成：' + upload.uploadedSize);
	//console.log('总大小：' + upload.totalSize);
	var uploadPro = upload.uploadedSize / upload.totalSize;
	var uploadProgress = toPercent(uploadPro); //百分比下载进度
	//document.getElementById("Progress").innerHTML=upload.uploadedSize+'/'+upload.totalSize;
};

function getUid() {
	return Math.floor(Math.random() * 100000000 + 10000000).toString();
}; 