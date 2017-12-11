/**
 * 评论
 */

var bigContainer = document.querySelector('body');
var commentedObjectId = 0;
var tenantTypeId = '';
var commentsNum = 0;
/**
 * 初始值
 * @param {Object} id 被评论对象Id
 * @param {Object} type 被评论对象类型
 * @param {Object} num 评论数
 */
function setIdandType(id, type, num) {
	commentedObjectId = id;
	tenantTypeId = type;
	commentsNum = num;
	//document.getElementById("supportNum").innerHTML = num
}
/**
 * 构建底部评论框
 */
function creatCommentBar() {
	var div = document.createElement('div');
	div.innerHTML = '<div class="bdsharebuttonbox" style="display:none">' +
		'<a href="#" class="bds_more" data-cmd="more"></a>' +
		'<a id="qq" class="bds_qzone" data-cmd="qzone" title="分享到QQ空间"></a>' +
		'<a id="sina" class="bds_tsina" data-cmd="tsina" title="分享到新浪微博"></a>' +
		'<a id="weixin" class="bds_weixin" data-cmd="weixin" title="分享到微信"></a>' +
		'</div>' +
		'	<a id="editComment">' +
		'				<div class="jh-comment-edit">' +
		'					<i class="fa fa-pencil mui-icon mui-icon-bars mui-pull-right" aria-hidden="true"></i>' +
		'				</div>' +
		'			</a>' ;
		if(document.querySelector('.jh-bar-comment')){
			document.querySelector('.jh-bar-comment').appendChild(div);
		}
}
/**
 * 构建评论弹出窗
 */
function creatCommentPop() {
	var div = document.createElement('div');
	div.id = 'popView_comment';
	div.className = 'box mui-popover mui-popover-action mui-popover-bottom';
	div.innerHTML = '<div class="pop_view">' +
		'	<textarea rows="5" autofocus="autofocus" name="textarea" placeholder="输入评论" id="comment-textarea" autofocus="autofocus"></textarea>' +
		'	<div class="mui-text-center" style="margin-top:-10px;">' +
		'		<button id="cancelCom" class="mui-btn" style="margin-right: 20px;">取消</button>' +
		'		<button id="sendCom" class="mui-btn mui-btn-primary" style="margin-left: 20px;">发送</button>' +
		'	</div>' +
		'</div>';
	bigContainer.appendChild(div);
}
/**
 * 构建分享弹出窗
 */
function creatSharePop() {
	var div = document.createElement('div');
	div.id = 'popView_share2';
	div.className = 'box mui-popover mui-popover-action mui-popover-bottom ';
	div.innerHTML = '<div class="pop_view_share">' +
		'				<div class="pop_view_item" id=1>' +
		'					<img src="../img/weixin-icon.png" srcset="../img/weixin-icon@2x.png 2x" />' +
		'					<div>微信好友</div>' +
		'				</div>' +
		'				<div class="pop_view_item" id=0>' +
		'					<img src="../img/pyy-icon.png" srcset="../img/pyy-icon@2x.png 2x" />' +
		'					<div>微信朋友圈</div>' +
		'				</div>' +
		'				<div class="pop_view_item" id=3>' +
		'					<img src="../img/qq-icon.png" srcset="../img/qq-icon@2x.png 2x" />' +
		'					<div>QQ空间</div>' +
		'				</div>' +
		'				<div class="pop_view_item" id=2>' +
		'					<img src="../img/weibo-icon.png" srcset="../img/weibo-icon@2x.png 2x" />' +
		'					<div>微博</div>' +
		'				</div>' +
		'			</div>';
	bigContainer.appendChild(div);
}
/**
 * 构建分享弹出窗（浏览器）
 */
function creatSharePop1() {
	var div = document.createElement('div');
	div.id = 'popView_share1';
	div.style.backgroundColor = '#FFFFFF';
	div.className = 'box mui-popover mui-popover-action mui-popover-bottom ';
	div.innerHTML = '<div  class="pop_view_share">' +
		'				<div class="pop_view_item" id="weixinBtn">' +
		'					<img src="../img/weixin-icon.png" srcset="../img/weixin-icon@2x.png 2x" />' +
		'					<div>微信好友</div>' +
		'				</div>' +
		'				<div class="pop_view_item" id="weixinpBtn">' +
		'					<img src="../img/pyy-icon.png" srcset="../img/pyy-icon@2x.png 2x" />' +
		'					<div>微信朋友圈</div>' +
		'				</div>' +
		'				<div class="pop_view_item" id="qqBtn">' +
		'					<img src="../img/qq-icon.png" srcset="../img/qq-icon@2x.png 2x" />' +
		'					<div>QQ空间</div>' +
		'				</div>' +
		'				<div class="pop_view_item" id="sinaBtn">' +
		'					<img src="../img/weibo-icon.png" srcset="../img/weibo-icon@2x.png 2x" />' +
		'					<div>微博</div>' +
		'				</div>' +
		'			</div>';
	bigContainer.appendChild(div);
	document.getElementById("weixinBtn").addEventListener('tap', function() {
		document.getElementById("weixin").click()
	})
	document.getElementById("weixinpBtn").addEventListener('tap', function() {
		document.getElementById("weixin").click()
	})
	document.getElementById("qqBtn").addEventListener('tap', function() {
		document.getElementById("qq").click()
	})
	document.getElementById("sinaBtn").addEventListener('tap', function() {
		document.getElementById("sina").click()
	})
}
/**
 * 构建子评论
 * @param {Object} data 子评论对象
 */
var creatChidFragment = function(data) {
	//子评论
	var bigContainers = "";
	for(var i = 0; i < data.length; i++) {
		var itemContainer = "";
		var dis = '';
		if(i > 1) {
			dis = 'none'
		} else {
			dis = 'block';
		}
		itemContainer += ("<p id='" + data[i].CommentId + "' style='display:" + dis + "'>" + data[i].User + "回复" + data[i].Owner + "： " + data[i].Body + "</p>");
		bigContainers += itemContainer;
	}
	if(data.length > 2) {
		var itemLen = "<h5 class='mui-text-center'><a>共" + data.length + "条评论>></a></h5>";
		return bigContainers += itemLen;
	} else {
		return bigContainers;
	}
}
/**
 * 构建评论元素
 * @param {Object} data
 */
var createComFragment = function(data) {
	var fragment = document.createDocumentFragment();
	var div;
	for(var i = 0; i < data.length; i++) {
		//		div = document.createElement('div');
		//		div.className = 'comment_body';
		//		div.id = data[i].CommentId;
		//		var child;
		//		var dis = 'none';
		//		if(data[i].ChildComments != null) {
		//			dis = 'block';
		//			child = creatChidFragment(data[i].ChildComments)
		//		} else {
		//			dis = 'none';
		//		}
		//
		//		div.innerHTML = '<div class="comment_img">' +
		//			'		    		<img class="creator_img_comment " src=' + data[i].Avatar + '>' +
		//			'			    	</div>' +
		//			'			    	<div class="comment_content">' +
		//			'			    		<div class="comment_top">' +
		//			'			    			<h5 class="comment_top_left">' + data[i].User + '</h5>' +
		//			'					<h5 class="comment_top_right">' + (i + 1) + '楼</h5>' +
		//			'				</div>' +
		//			'				<p>' +
		//			'					' + data[i].Body + '' +
		//			'				</p>' +
		//			'               <div id="childCom' + i + '" class="jh-comment-reply" style="display:' + dis + '">' + child + '</div>' +
		//			'				<div class="comment_top">' +
		//			'			    			<h5 class="comment_top_left">' + data[i].DateCreated + '</h5>' +
		//			'					<h5 class="comment_top_right">回复（' + data[i].ChildCommentCount + '）</h5>' +
		//			'				</div>' +
		//			'			</div>';
		fragment.appendChild(creatsingleCom(data[i], i));
	}
	return fragment;
};
/**
 * 构建单个评论元素
 * @param {Object} data
 * @param {Object} i
 */
function creatsingleCom(data, i) {
	var fragment = document.createDocumentFragment();
	var div;
	div = document.createElement('div');
	div.className = 'comment_body';
	div.id = data.CommentId;
	var child;
	var dis = 'none';
	if(data.ChildComments != null) {
		dis = 'block';
		child = creatChidFragment(data.ChildComments)
	} else {
		dis = 'none';
	}
	if(tenantTypeId == 'Thread') {
		div.innerHTML = '<div class="comment_img">' +
			'		    		<img class="creator_img_comment " id='+data.UserId+' src=' + getImgUrl(data.Avatar) + '>' +
			'			    	</div>' +
			'			    	<div class="comment_content">' +
			'			    		<div class="comment_top">' +
			'			    			<h5 class="comment_top_left">' + data.User + '</h5>' +
			'					<h5 class="comment_top_right">' + (i) + '楼</h5>' +
			'				</div>' +
			'				<p>' +
			'					' + data.Body + '' +
			'				</p>' +
			'               <div id="childCom' + i + '" class="jh-comment-reply" style="display:' + dis + '">' + child + '</div>' +
			'				<div class="comment_top">' +
			'			    			<h5 class="comment_top_left">' + data.DateCreated + '</h5>' +
			'					<h5 class="comment_top_right">回复（' + data.ChildCommentCount + '）</h5>' +
			'				</div>' +
			'			</div>';
	} else {
		div.innerHTML = '<div class="comment_img">' +
			'		    		<img class="creator_img_comment " id='+data.UserId+' src=' + getImgUrl(data.Avatar) + '>' +
			'			    	</div>' +
			'			    	<div class="comment_content">' +
			'			    		<div class="comment_top">' +
			'			    			<h5 class="comment_top_left">' + data.User + '</h5>' +
			'					<h5 class="comment_top_right">' + data.DateCreated + '</h5>' +
			'				</div>' +
			'				<p>' +
			'					' + data.Body + '' +
			'				</p>' +
			'               <div id="childCom' + i + '" class="jh-comment-reply" style="display:' + dis + '">' + child + '</div>' +
			'			</div>';
	}

	fragment.appendChild(div);
	return fragment;
}
creatCommentBar();
creatCommentPop();
creatSharePop();
creatSharePop1();
//if(mui.os.wechat) {
//	document.querySelector('.jh-comment-right').style.width = '100%';
//	document.querySelector('.jh-comment-edit').style.display = 'none';
//	document.getElementById("shares").style.display = 'none';
//	document.getElementById("favorNew").querySelector('.mui-icon').style.float = 'right'
//}
//if(!mui.os.wechat && !mui.os.plus) {
//	document.querySelector('.jh-comment-edit').style.display = 'none';
//	document.querySelector('.jh-comment-right').style.width = '100%';
//}

var morecomment = document.getElementById("morecomment");
var morecom = document.getElementById("morecom");
var cancelCom = document.getElementById("cancelCom");
var sendCom = document.getElementById("sendCom");
var commentText = document.getElementById("comment-textarea");
var favorQuestions = document.getElementById("favorQuestions");
var favorQuestionsText = document.getElementById("favorQuestionsText");
var editComment = document.getElementById("editComment");


mui(".pop_view_share").on('tap', '.pop_view_item', function(e) {
	if(mui.os.plus) {		
		mui('#popView_share2').popover('toggle');
		var popView_share2 = document.getElementById("popView_share2");
		popView_share2.className = "box mui-popover mui-popover-action mui-popover-bottom ";
		shareHref(this.getAttribute('id'),function(){});
	}

})

//mui("#commentArea").on('tap', '.mui-text-center', function(e) {
//	var allp = e.target.parentElement.parentElement.querySelectorAll('p');
//	mui.each(allp, function(index, item) {
//		if(item.style.display == 'block' && index > 1) {
//			item.style.display = 'none'
//		} else {
//			item.style.display = 'block'
//		}
//
//	})
//})
//mui("#commentAreas").on('tap', '.mui-text-center', function(e) {
//	var allp = e.target.parentElement.parentElement.querySelectorAll('p');
//	mui.each(allp, function(index, item) {
//		if(item.style.display == 'block' && index > 1) {
//			item.style.display = 'none'
//		} else {
//			item.style.display = 'block'
//		}
//	})
//})
var parentId = 0;

function creatsingleChilCom(data, i) {
	var p = document.createElement("p");
	p.id = data.CommentId;
	p.innerHTML = '' + data.User + ' 回复 ' + data.Owner + ' ： ' + data.Body + '';
	return p;
}

morecomment && morecomment.addEventListener('tap', function() {
	moreComment();
})
morecom && morecom.addEventListener('tap', function() {
	moreComment();
})

function moreComment() {
	var baseUrl = 'commentsDetail_main.html';
	var url = mui.os.plus ? baseUrl : baseUrl + '?commentedObjectId=' + commentedObjectId + '&tenantTypeId=' + tenantTypeId;
	mui.openWindow({
		url: url,
		id: 'commentsDetail_main.html',
		show: {
			autoShow: false
		},
		waiting: {
			options: {
				loading: {
					height: '35px'
				}
			}
		},
		extras: {
			commentedObjectId: commentedObjectId,
			tenantTypeId: tenantTypeId
		}
	})
}
editComment && editComment.addEventListener('tap', function() {
	var islog = getlsData('isLogin');
	if(islog == 'true') {
		mui('#popView_comment').popover('toggle');
	} else {
		mui.toast('请登录后再进行操作');
		login();
	}
})

cancelCom && cancelCom.addEventListener('tap', function() {
	mui('#popView_comment').popover('toggle');
})

sendCom && sendCom.addEventListener('tap', function() {
	mui('#popView_comment').popover('toggle');
	submitComment(parentId);
})
document.getElementById("shares") && document.getElementById("shares").addEventListener('tap', function() {
	if(mui.os.plus){	
		mui('#popView_share2').popover('toggle');
		creatSharePop();
	} else {
		mui('#popView_share1').popover('toggle');
	}
})



function submitComment(pid) {
	var comBody = TrimAll(commentText.value);
	if(comBody.length == 0) {
		mui.toast('评论内容不能为空！');
		return;
	}
	var params = {
		ParentId: pid,
		CommentedObjectId: commentedObjectId,
		TenantTypeId: tenantTypeId,
		Body: comBody
	}
	CreateComment(params)
}
var parentId = 0;
/**
 * 0直接点击下方tab评论（1级）
 * 1点击一级评论
 * 2点击二级评论
 */
var type = 0;
var ii = 0;
var elm;
mui("#commentArea").on('tap', '.comment_content p', function(e) {
	var islog = getlsData('isLogin');
	if(islog == 'true') {
		if(e.target.parentElement.className == 'jh-comment-reply') {
			type = 2;
			elm = e.target.parentElement;
			parentId = e.target.id;
			mui('#popView_comment').popover('toggle');
		} else {
			type = 1;
			mui('#popView_comment').popover('toggle');
			var elmt = e.target.parentElement.parentElement;
			elmt.querySelector('.jh-comment-reply').style.display = 'block';
			elm = elmt.querySelector('.jh-comment-reply');
			elm.innerHTML = '';
			parentId = elmt.id;
		}
	} else {
		mui.toast('请登录后再进行操作');
		login();
	}

})

function CreateComment(params) {
	showLoading()
	postDatawithToken('Comment/CreateComment', params, function(data) {
		hideLoading();
		document.getElementById("comment-textarea").value='';
		if(data.Type == 1) {
			ii++;
			switch(type) {
				case 0:
					document.getElementById("commentArea")&&commentArea.appendChild(creatsingleCom(data.Data, ii))
					break;
				case 1:
					elm.appendChild(creatsingleChilCom(data.Data))
					type = 0;
					break;
				case 2:
					elm.appendChild(creatsingleChilCom(data.Data))
					type = 0;
					break;
				default:
					break;
			}
			document.getElementById("supportNum").innerHTML++;
			document.getElementById("comment-textarea").blur();
		} else if(data.Type == 0) {
			//登录失败
			mui.toast("请登录后再进行操作");
			document.getElementById("comment-textarea").blur();
			login();
			return;
		} else {
			//逻辑错误
			mui.toast(data.Data);
			document.getElementById("comment-textarea").blur();
			return;
		}
	}, function(err) {
		hideLoading();
	})
}