var imgFiles = [];
var wxIds = [];

//拍照
function getImages() {
	bottomBar.style.marginBottom = '0px';
	document.getElementById("imgPop").style.display = '';
	if(mui.os.plus) {
		getImageforCreat();
	} else if(mui.os.wechat) {
		wxChooseImg(5, function(ids) {
			if(wxIds.length != 0) {
				for(var i = 0; i < ids.length; i++) {
					wxIds.push(ids[i])
				}
			} else {
				wxIds = ids;
			}
			for(var i = 0; i < ids.length; i++) {
				var a = new Date().getTime();
				imgFiles.push({
					name: "uploadkey" + a,
					path: ids[i]
				});
			}
			document.getElementById("imgPop").style.display = '';
			if(oldImageAttachments.length == 0) {
				document.getElementById("imgs").innerHTML = "";
			}
			document.getElementById("imgs").appendChild(creatImg(imgFiles))
		}, false, true)
	} else {
		document.getElementById("fileImage").click()
	}
}

function galleryImgsMaximum() {
	bottomBar.style.marginBottom = '0px';
	document.getElementById("imgPop").style.display = '';
	if(mui.os.plus) {
		getImagesforCreat();
	} else if(mui.os.wechat) {
		wxChooseImg(5, function(ids) {
			if(wxIds.length != 0) {
				for(var i = 0; i < ids.length; i++) {
					wxIds.push(ids[i])
				}
			} else {
				wxIds = ids;
			}
			for(var i = 0; i < ids.length; i++) {
				var a = new Date().getTime();
				imgFiles.push({
					name: "uploadkey" + a,
					path: ids[i]
				});
			}
			document.getElementById("imgPop").style.display = '';
			if(oldImageAttachments.length == 0) {
				document.getElementById("imgs").innerHTML = "";
			}
			
			document.getElementById("imgs").appendChild(creatImg(imgFiles))
		}, true, false)
	} else {
		document.getElementById("fileImage").click()
	}

}

function creatWebImg(data) {
	if(data.length == 0 && oldImageAttachments.length == 0) document.getElementById("imgPop").style.display = 'none';
	var fragment = document.createDocumentFragment();
	var a;
	for(var i = 0; i < data.length; i++) {
		div = document.createElement('div');
		div.className = "mui-control-item";
		div.style.width = '150px';
		div.style.height = '200px';
		div.style.paddingTop = '20px';
		div.innerHTML = '<img class="creat-img" data-preview-src="" data-preview-group="1" src="' + getImgUrl(data[i]) + '"/><img class="closeIcon creat-img-close" src="../img/close-circled.png"/>'
		fragment.appendChild(div);
	}
	return fragment;
}

function creatImg(data) {
	console.log(JSON.stringify(data));
	if(data.length == 0 && oldImageAttachments.length == 0) document.getElementById("imgPop").style.display = 'none';
	var fragment = document.createDocumentFragment();
	var div;
	for(var i = 0; i < data.length; i++) {
		var a = new Date().getTime();
		div = document.createElement('div');
		div.className = "mui-control-item";
		div.style.width = '150px';
		div.style.height = '200px';
		div.style.paddingTop = '20px';
		div.innerHTML = '<img class="creat-img" data-preview-src="" data-preview-group="1" src="' + getImgUrl(data[i].path) + '"/><img class="closeIcon creat-img-close" src="../img/close-circled.png" id="' + data[i].name + '"/>'
		fragment.appendChild(div);
	}
	return fragment;
}

function creatEditImg(data) {
	var fragment = document.createDocumentFragment();
	var div;
	for(var i = 0; i < data.length; i++) {
		var a = new Date().getTime();
		div = document.createElement('div');
		div.className = "mui-control-item";
		div.style.width = '150px';
		div.style.height = '200px';
		div.style.paddingTop = '20px';
		div.innerHTML = '<img class="creat-img" id="oldimg" data-preview-src="" data-preview-group="1" src="' + getImgUrl(data[i].Url) + '"/><img class="closeIcon creat-img-close" src="../img/close-circled.png" id="oldimg"/>'
		fragment.appendChild(div);
	}
	return fragment;
}

if(mui.os.wechat) {
	mui('#imgPop').on('tap', '.creat-img', function(e) {
		wx.previewImage({
			current: this.getAttribute('src'),
			urls: wxIds
		});
	})
}

mui("#imgs").on('tap', '.closeIcon', function(e) {
	var currImg = e.target.parentElement.querySelector('.creat-img').src;
	var files = jhUpload.files;
	if(!mui.os.plus && !mui.os.wechat) {
		files = zyUpload.webFiles;
	}
	if(e.target.id && e.target.id == 'oldimg') {
		//编辑
		var filepaths = [];
		var currIndex=0;
		mui.each(oldImageAttachments, function(index, item) {
			filepaths.push(item.Url);
			if(currImg.indexOf(item.Url)>-1){
				currIndex=index;
			}
		})
		//var index = filepaths && filepaths.indexOf(currImg);
		oldImageAttachments.splice(currIndex, 1);
		oldImageAttachmentIds.splice(currIndex , 1);
		document.getElementById("imgs").innerHTML = '';
		document.getElementById("imgs").appendChild(creatEditImg(oldImageAttachments))
		if(files.length > 0) {
			if(!mui.os.plus && !mui.os.wechat) {
				document.getElementById("imgs").appendChild(creatWebImg(files))
			} else {
				document.getElementById("imgs").appendChild(creatImg(files))
			}
		}
	} else {
		if(mui.os.wechat) {
			files = imgFiles;
			var imageIds = [];
			var wxcurrImg = this.getAttribute('id');
			mui.each(files, function(index, item) {
				imageIds.push(item.name);
			})
			var index = imageIds.indexOf(wxcurrImg);
		} else if(!mui.os.plus && !mui.os.wechat) {
			var index = files && files.indexOf(currImg);
			ZYFILE.uploadFile.splice(index, 1);
		} else {
			var filepaths = [];
			mui.each(files, function(index, item) {
				filepaths.push(item.path);
			})
			var index = filepaths && filepaths.indexOf(currImg);
		}
		files.splice(index, 1);
		//				if(oldImageAttachments.length==0){
		//					document.getElementById("imgs").innerHTML = "";
		//				}
		document.getElementById("imgs").innerHTML = '';
		document.getElementById("imgs").appendChild(creatEditImg(oldImageAttachments))
		if(!mui.os.plus && !mui.os.wechat) {
			document.getElementById("imgs").appendChild(creatWebImg(files))
		} else {
			document.getElementById("imgs").appendChild(creatImg(files))
		}
	}

})
//投票贴
function galleryImgsMaximumVote() {
		if(mui.os.plus) {
			getImagesforCreatByVote();
		} else if(mui.os.wechat) {
			wxChooseImg(1, function(ids) {
				syncUpload(ids, 'Vote/WeChatUploadFiles', function(e, imgSrc) {
					creatImgVoteItem(imgSrc);
					ItemImages.push(e);
				})
			})
		} else {
			$("#file").click();
		}
	}

document.getElementById("upload-textarea").onfocus = function() {
	document.getElementById("bottomBox").style.display = ''
	bottomBar.style.display = ''
	if(mui.os.plus || mui.os.wechat) {
		document.getElementById("getcamera").style.display = ''
	} else {
		document.getElementById("getcamera").style.display = 'none'
	}
}