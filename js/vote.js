function login (){
	if(mui.os.wechat){
		var currUrl = location.href.split('#')[0];
		getCode(currUrl)
	}else{
		mui.openWindow({
			url: 'user_login.html',
			id: 'user_login.html',
			waiting: {
				options: {
					loading: {
						height: '35px'
					}
				}
			},
			extras: {
				pageId: 'user_login.html'
			}
		})	
	}			
}
var createCommentAttach = function(data){
			var length = data.Attachments.length;
			var data = data.Attachments;
			var rows = "";
			for(var i = 0;i<length;i++){
				var filename=data[i].FriendlyFileName;
				var type=filename.substring(filename.lastIndexOf('.')+1);
				var typeImg='';
				var downloadUrl='';
				switch (type){
					case 'doc':
						typeImg='../img/word-icon.png';
					break;
					case 'xls':
						typeImg='../img/excel-icon.png';
					break;
					case 'ppt':
						typeImg='../img/ppt-icon.png';
					break;
					default:
						typeImg='../img/more-icon.png';
						break;
				}
				var row = '<div class="mui-row">'+
				          '<div class="mui-col-xs-1">'+
				          '<img src='+typeImg+'>'+
				          '</div>'+
				          '<div class="mui-col-xs-7">'+data[i].FriendlyFileName+'</div>'+
				          '<div class="mui-col-xs-2 text-muted mui-text-right">'+data[i].Size+'</div>'+
				          '<div class="mui-col-xs-2 mui-text-right commentupload"><a id='+data[i].Url+' title='+data[i].FriendlyFileName+'>'+"下载"+'</a></div>'+
				          '</div>';
				          rows += row;
			}				                
			var div = '<div class="tn-file-list" id="commentattachments">'+rows+'</div>';
			return div;
		};
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
document.getElementById("shares") && document.getElementById("shares").addEventListener('tap', function() {
	if(mui.os.plus){ 
		mui('#popView_share2').popover('toggle');
		console.log("00000000000")
		creatSharePop();
	} else {
		mui('#popView_share1').popover('toggle');
	}
})
mui(".pop_view_share").on('tap', '.pop_view_item', function(e) {
	if(mui.os.plus) {		
		mui('#popView_share2').popover('toggle');
		var popView_share2 = document.getElementById("popView_share2");
		popView_share2.className = "box mui-popover mui-popover-action mui-popover-bottom ";
		shareHref(this.getAttribute('id'));
	}

})
/**
 * 投票列表（主页）
 */
var pageUrl=window.location.pathname;
pageUrl=pageUrl.substring(pageUrl.lastIndexOf('/')+1,pageUrl.length);
if(pageUrl=='vote.html'){
	var page = 1;
	window.onload = function() {
		if(mui.os.plus) {
			GetVotes(false,0);
		}else{
			GetVotes(false,0);
		}
		if(mui.os.wechat){
			var currUrl = location.href.split('#')[0];
			weChatLogin(currUrl)
		}
	}		
	var selel = document.getElementsByClassName("mui-control-item mui-active");
	mui('.mui-slider').slider();
	mui('.mui-scroll-wrapper').scroll();
	var deceleration = mui.os.ios ? 0.003 : 0.0009;
	mui('.mui-scroll-wrapper.mui-slider-indicator.mui-segmented-control').scroll({
		scrollY: false,
		scrollX: true,
		indicators: false,
		deceleration: deceleration,
		snap: '.mui-control-item'
	});
	var tabIndex = 0;
	document.querySelector('.mui-slider').addEventListener('slide', function(event) {
		tabIndex = event.detail.slideNumber;
		if(event.detail.slideNumber != 0) {
			var index = event.detail.slideNumber -1;
			var item = document.getElementById("item" + index + "mobile");
			item.querySelector('.mui-pull-bottom-tips').style.display = 'none';
			if(item.querySelector('.mui-loading')) {
				if(index == 1) {
					GetVotes(false,2);
				}
				if(index == 0) {
					GetVotes(false,1);
				}
			}
		}
	});
	(function($) {
			//阻尼系数
			var deceleration = mui.os.ios ? 0.003 : 0.0009;
			$('.mui-scroll-wrapper').scroll({
				bounce: false,
				indicators: true, //是否显示滚动条
				deceleration: deceleration
			});
			$.ready(function() {
				//循环初始化所有下拉刷新，上拉加载。
				$.each(document.querySelectorAll('.mui-slider-group .mui-scroll'), function(index, pullRefreshEl) {
					$(pullRefreshEl).pullToRefresh({
						down: {
							callback: function() {
								var self = this;
								//document.getElementById(idName).querySelector('.mui-pull-bottom-tips').style.display = 'none';
								if(selel[0].id == '1') {
									GetVotes(false,1);
								}
								if(selel[0].id == '0') {
									GetVotes(false,0);
								}
								if(selel[0].id == '2') {
									GetVotes(false,2);
								}
								setTimeout(function() {
									self.endPullDownToRefresh();
								}, 1000);
							}
						},
						up: {
							show: false,
							callback: function() {
								var self = this;
								if(selel[0].id == '1') {
									GetVotes(true,1);
								}
								if(selel[0].id == '0') {
									GetVotes(true,0);
								}
								if(selel[0].id == '2') {
									GetVotes(true,2);
								}
								setTimeout(function() {
									self.endPullUpToRefresh();
								}, 1000);
							}
						}
					});
				});
			});
		})(mui);
	mui.plusReady(function() {
		mui(".mui-table-view").on('tap', '.mui-table-view-cell', function(e) {
			var voteId = this.getAttribute('id');
			var voteType = parseInt(this.getAttribute("title"));
			switch(voteType) {
				case 0:
					urlId = 'textVote.html';
					baseUrl = 'textVote.html?voteId=' + voteId;
				break;
				case 1:
					urlId = 'imageVote.html';
					baseUrl = 'imageVote.html?voteId=' + voteId;
				break;
				default:
					break;
			}
			var curl = shareUrl + baseUrl;
			setlsData('currUrl', curl);
				mui.openWindow({
					url: baseUrl,
					id: urlId,
					show: {
						autoShow: true
					},
					waiting: {
						options: {
							loading: {
								height: '35px'
							}
						}
					},
					extras: {
						voteId: voteId
					}
				})
		});				
	})
	if(!mui.os.plus) {
		mui(".mui-table-view").on('tap', '.mui-table-view-cell', function(e) {
			var voteId = this.getAttribute('id');
			var voteType = parseInt(this.getAttribute("title"));
			switch(voteType) {
				case 0:
					urlId = 'textVote.html';
					baseUrl = 'textVote.html?voteId=' + voteId;
				break;
				case 1:
					urlId = 'imageVote.html';
					baseUrl = 'imageVote.html?voteId=' + voteId;
				break;
				default:
					break;
			}
			var curl = shareUrl + baseUrl;
			setlsData('currUrl', curl);
			mui.openWindow({
				url: baseUrl,
				id: urlId
			});
		})
	}
	var creatVotesElement = function(data, id) {
			var fragment = document.getElementById(id);
			var cfragment = fragment.firstElementChild;
			var finel = cfragment.firstElementChild.querySelector('.mui-table-view');						
			for(var i = 0; i < data.length; i++) {
				var VoteImage = data[i].ImageAttachment == "" ? "../img/slider-1.jpg" :data[i].ImageAttachment;
				var end = data[i].Status == 2 ? '<img class="sign" src="../img/over-sign.png">' : '';
				var li;
				li = document.createElement('li');
				li.className = 'mui-table-view-cell jh-news-list';
				li.id = data[i].Id;
				li.title = data[i].VoteType;
				li.innerHTML = '<p><img src='+ VoteImage +'>'+ end +'</p>'+
								'<h5 class="listTitle">'+ data[i].Subject +'</h5>'+
								'<ul class="mui-list-inline text-muted">'+
								'<li>'+ "截止时间：" + data[i].VoteTime +'</li>'+
								'<li class="mui-pull-right"><span class="tn-theme-color">'+data[i].AttendCount+'</span> 已投票</li>'+
								'<li class="mui-pull-right">'+ data[i].HitTimes +"已浏览"+'</li>'+
								'</ul>'+
								'</li>';
				finel.appendChild(li);
			}
	};
	function GetVotes(more,type) {
		if(!more) {
			showLoading('', '', '#FFFFFF', '90px', '1');
		}
		idName = selel[0].href.substring(selel[0].href.lastIndexOf("#") + 1, selel[0].href.length);
		var fragment = document.getElementById(idName);
		var cfragment = fragment.firstElementChild;
		var finel = cfragment.firstElementChild.querySelector('.mui-table-view');
		if(more) {
			page++;
		} else {
			finel.innerHTML = '';
			page = 1;
		}			
		var params = {
			type: type,
			pageSize: 10,
			pageIndex: page,
		};
		getData('Vote/GetVotes', params, function(data) {
			hideLoading()
			hideErr()
			var bottomTip = document.querySelectorAll('.mui-pull-bottom-tips');
			if(data.Type == 1) {
				console.log(data);
				if(data.Data && typeof(data.Data) == 'object') {
					hideErrForList('',idName);
					if(data.Data.length <= 5) {
						document.getElementById(idName).querySelector('.mui-pull-bottom-tips').style.display = 'none';
					} else {							
						document.getElementById(idName).querySelector('.mui-pull-bottom-tips').style.display = 'block';
					}
						creatVotesElement(data.Data,idName);
				} else {
					if(!more){
						var errForList=showErrForList('暂无更多问题','','',idName);
						if(errForList){
							fragment.appendChild(showErrForList('暂无更多问题','','',idName))
						}
					}
						//mui.toast("暂无更多问题");
				}
			} else if(data.Type == 0) {
				//登录失败
				mui.toast("请登录后再进行操作");
				login();
				return;
			} else {
				//逻辑错误
				var errForList=showErrForList(data.Data,'','',idName);
				if(errForList){
					fragment.appendChild(showErrForList(data.Data,'','',idName))
				}
				return;
			}
		}, function(err) {
			hideLoading();
			mui.plusReady(function(){
				if(plus.networkinfo.getCurrentType()==1||plus.networkinfo.getCurrentType()==2){
					mui.toast('网络异常，请检查网络设置!');
					showErr('没有网络连接','','#FFFFFF')
				}else{
					showErr('错误代码：'+err,'','#FFFFFF');
					hideLoading()
				}
			})
		if(!mui.os.plus){
			showErr('错误代码：'+err,'','#FFFFFF');
			hideLoading()
		}
		})
	}
}
/**
 * 文字投票
 */
if(pageUrl=='textVote.html'){
	var voteId;
	var subject = document.getElementById('subject');
	var detail = document.getElementById('detail');
	var voteDetail = document.getElementById('voteDetail');
	var imageSubject = document.getElementById('imageSubject');
	var jgb = document.getElementById('jgb');
	var comments = document.getElementById('comments');
	var commentMore = document.getElementById('commentMore');
	var text_container = document.getElementById('text_container');
	var commentsTap = document.getElementById('commentsTap');
	var supportNum = document.getElementById('supportNum');
	var Results =[];
	var CanChooseQuantity;
	creatSharePop();
	mui(".pop_view_share").on('tap', '.pop_view_item', function(e) {
		if(mui.os.plus) {		
			mui('#popView_share2').popover('toggle');
			var popView_share2 = document.getElementById("popView_share2");
			popView_share2.className = "box mui-popover mui-popover-action mui-popover-bottom ";
			shareHref(this.getAttribute('id'));
		}
	})
	window.onload = function() {
		if(mui.os.plus) {
			var self = plus.webview.currentWebview();
			voteId = self.voteId;
			GetTextVoteDetail(voteId);
		}else{
			voteId = getUrlParam('voteId');	
			GetTextVoteDetail(voteId);
		}
		if(mui.os.wechat){
			var currUrl = location.href.split('#')[0];
			weChatLogin(currUrl)
		}
	}
	var creatTextVoteElement = function(data) {
		if(CanChooseQuantity > 1){
			var inputType = "checkbox";
			var parentClass = 'mui-checkbox mui-left';
		}else{
			var inputType = "radio";
			var parentClass = 'mui-radio';
		}
		var container ='';
		if(data.Status == 2 || data.Status == 3){
			var testStatus = true;
		}else{
			var testStatus = false;
		}
		if(data.ViewResultsSetting == true){ 
				if(data.Status == 1){
					var selected = '<input  name="style" type="'+ inputType +'" value="inverted" class="voteSelected">';
				}else{
					var selected = "";
					var parentClass = '';
					voteDetail.className = 'mui-card jh-word-vote';					
				}
			}else{
				if(data.Status == 1){
					var selected = '<input  name="style" type="'+ inputType +'" value="inverted" class="voteSelected">';
				}else{
					var selected = "";
					var parentClass = '';
					voteDetail.className = 'mui-card jh-word-vote';
				}
			}
		for(var i = 0;i<data.VoteItem.length;i++){	
			var progress ='';
			if(data.ViewResultsSetting == true && testStatus == true ){
				var progress = 	'<div class="progressContainer"></div>'	
			}
			var voteItemDetail = data.VoteItem[i].HasBody == true ? '<a href="#" id='+ data.VoteItem[i].Id +' class="tn-text-color mui-pull-right vote-item-detail">详情</a>' : '';
			var item = '<div class="mui-input-row '+ parentClass +'" id="'+ data.VoteItem[i].Id +'">'+
						'<span class="mui-pull-left">'+ data.VoteItem[i].Name +'</span>'+
						selected+
						voteItemDetail+	
						progress+
						'</div>';					
			container +=item;
		} 
		var statusType = data.Status;
		switch(statusType){
			case 0:
				var status = '<button type="button" class="mui-btn jh-btn-gray" disabled="disabled">未开始</button>';
				break;
			case 1:
				var status = '<button type="button" class="mui-btn mui-btn-primary" id="voteing">投票</button>';
				break;
			case 2:
				var status = '<button type="button" class="mui-btn jh-btn-gray" disabled="disabled">已结束</button>';
				break;
			case 3:
				var status = '<button type="button" class="mui-btn jh-btn-gray" disabled="disabled">已投票</button>';
				break;
			default:
				break;				
		}
		voteDetail.innerHTML = '<ul class="mui-list-inline text-muted">'+
								'<li>'+data.HitTimes+"已浏览"+'</li>'+
								'<li class="mui-pull-right"><span class="tn-theme-color">'+data.AttendCount+'</span> 已投票</li>'+
								'</ul>'+
								'<ul class="mui-list-inline">'+
								'<li>截止时间：'+ data.VoteTime +'</li>'+
								'<li class="mui-pull-right"><span class="tn-theme-color">*</span> 最多可投'+ data.CanChooseQuantity+'项</li>'+
								'</ul>'+
								'<form class="mui-input-group">'+
								container+
								'</form>'+
								'<div class="mui-text-center">'+
								status+
								'</div>';
	};
	var creatTextVoteCommentsElement = function(data){
		var commentReply = "";				
		var commentsContainer = '';
		for(var i = 0;i<data.length;i++){
			if(data[i].ChildCommentCount > 0){
					var ChildComments = data[i].ChildComments;
					var ChildCommentes ="";
					for(var j = 0;j<ChildComments.length;j++){
						if(j > 1) {
			               dis = 'none'
		                } else {
			               dis = 'block';
		                }	                
						var ChildComment = '<p id="'+ ChildComments[j].CommentId + ' " style="display:' + dis +'">'+ ChildComments[j].User +'回复'+ ChildComments[j].Owner +'： '+ ChildComments[j].Body +'</p>';
						ChildCommentes += ChildComment;
					}
					comlength = data[i].ChildComments.length > 2  ? '<a href="#">共'+ data[i].ChildComments.length +'条评论></a>' : '<a href="#"></a>'
					commentReply = '<div class="jh-comment-reply"id="childCom' + i + '">'+
					               '<div>'+
				                   ChildCommentes+
				                   '</div>'+
				                   '<div>'+
				                   '<h5 class="mui-text-center">'+
				                   comlength+				                   
				                   '</h5>'+
				                   '</div>'+
				                   '</div>';
				}else{
					commentReply = '<div class="jh-comment-reply"id="childCom' + i + '" style="display:none">'+
									'<div>'+				                   
				                   '</div>'+
				                   '<div>'+
				                   '<h5 class="mui-text-center">'+
				                   '<a href="#"></a>'+
				                   '</h5>'+
				                   '</div>'+
					                '</div>';
				}
			var Avatar = data[i].Avatar == '' ? "../img/avatar-mini.png" : data[i].Avatar;
			var div = document.createElement('div');
			div.className = 'comment_body';
			div.innerHTML = '<div class="comment_img">'+
						'<img class="creator_img_comment" src='+ Avatar +' />'+
						'</div>'+
						'<div class="comment_content">'+
						'<div class="comment_top">'+
						'<h5 class="comment_top_left">'+ data[i].User +'</h5>'+
						'<h5 class="comment_top_right">'+ data[i].DateCreated +'</h5>'+
						'</div>'+
						'<p id=' + data[i].CommentId +  '>'+data[i].Body+'</p>'+
						commentReply+
						'</div>';
			comments.appendChild(div);
		}		
	};
	function creatVoteItemPop(body,data) {
		var CommentAttach;
		if(data.Attachments&&data.Attachments.length != 0 ){
			CommentAttach = createCommentAttach(data);					
		}else{
			CommentAttach = ''
		}
		var div = document.createElement('div');
		div.id = 'voteItem';
		div.className = 'box mui-popover mui-popover-action mui-popover-center';
		div.innerHTML = '<div class="pop_view">' +
						'<div class="itemSubject">'+ body +'</div>'+
						'<div class="itemBody">'+ data.Body +'</div>'+
						CommentAttach+
				'</div>';
		bigContainer.appendChild(div);
	}  
	mui("#comments").on('tap', '.mui-text-center', function(e) {
	       var allp = e.target.parentElement.parentElement.parentElement.querySelectorAll('p');
	    mui.each(allp, function(index, item) {
		   if(item.style.display == 'block' && index > 1) {
			  item.style.display = 'none'			 
		   } else {
			  item.style.display = 'block'
		   }
	   })
    })
	function creatCommentPop_text() {
		var div = document.createElement('div');
		div.id = 'popView_comment_text';
		div.className = 'box mui-popover mui-popover-action mui-popover-bottom';
		div.innerHTML = '<div class="pop_view">' +
				'	<textarea rows="5" autofocus="autofocus" name="textarea" placeholder="输入评论" id="comment-textarea_text" autofocus="autofocus"></textarea>' +
				'	<div class="mui-text-center" style="margin-top:-10px;">' +
				'		<button id="cancelComtext" class="mui-btn" style="margin-right: 20px;">取消</button>' +
				'		<button id="sendCom" class="mui-btn mui-btn-primary" style="margin-left: 20px;">发送</button>' +
				'	</div>' +
				'</div>';
		bigContainer.appendChild(div);
	}
    creatCommentPop_text();
    var sendCom = document.getElementById("sendCom");		
	editComment && editComment.addEventListener('tap', function() {
		tenantTypeId = 'Vote';
		var islog = getlsData('isLogin');
		if(islog == 'true') {
			mui('#popView_comment_text').popover('toggle');
		} else {
			mui.toast('请登录后再进行操作');
			login();
		}
	})
	var cancelComtext = document.getElementById("cancelComtext");
	var elmt;
	var parentId = 0;
	cancelComtext && cancelComtext.addEventListener('tap', function() {
		mui('#popView_comment_text').popover('toggle');
		if(elmt.querySelector('.jh-comment-reply').innerText == ""){
			elmt.querySelector('.jh-comment-reply').style.display='none';
		}
	})
	sendCom && sendCom.addEventListener('tap', function() {		
		mui('#popView_comment_text').popover('toggle');
		submitComment_text(parentId,voteId);				
	})
	var elm;
    mui("#comments").on('tap', '.comment_content p', function(e) {
    	tenantTypeId = 'Vote';
		var islog = getlsData('isLogin');
		if(islog == 'true') {
			if(e.target.parentElement.parentElement.className == 'jh-comment-reply') {
				type=2;
				elm=e.target.parentElement;
				parentId = e.target.id;
				mui('#popView_comment_text').popover('toggle');
			} else {
				type=1;
				elmt=e.target.parentElement.parentElement;
				elmt.querySelector('.jh-comment-reply').style.display='block';
				elm=elmt.querySelector('.jh-comment-reply').getElementsByTagName("div")[0];
				parentId = e.target.id;
				mui('#popView_comment_text').popover('toggle');
			}
		}else{
			mui.toast('请登录后再进行操作');
			login();
		}		
	})
    function submitComment_text(pid,id) {
    	var commentText = document.getElementById("comment-textarea_text");
		var comBody = TrimAll(commentText.value);
		if(comBody.length == 0) {
			mui.toast('评论内容不能为空！');
			return;
		}
		var params = {
			ParentId: pid,
			CommentedObjectId: id,
			TenantTypeId: 'Vote',
			Body: comBody
		}
		CreateComment_text(params)
	}
    function creatsingleCom_text(data){
    	var item;
    	item = ii;	
    	var commentReply = "";
    	commentReply = '<div class="jh-comment-reply"id="childCom" style="display:none">'+
					'<div>'+				                   
				    '</div>'+
				    '<div>'+
				    '<h5 class="mui-text-center">'+
				    '<a href="#"></a>'+
				    '</h5>'+
				    '</div>'+
					'</div>';
    	if(data.Avatar.length > 0){
			var Avatar = '<img class="creator_img_comment " src='+ data.Avatar +'>';
		}else{
			var Avatar = '<img class="creator_img_comment " src="../img/avatar.jpg"/>';
		}
    	var div;
    	div = document.createElement('div');
		div.className = "comment_body";
		div.innerHTML = '<div class="comment_img">'+
						Avatar+
						'</div>'+
						'<div class="comment_content">'+
						'<div class="comment_top">'+
						'<h5 class="comment_top_left">'+ data.User +'</h5>'+
						'<h5 class="comment_top_right">'+ data.DateCreated +'</h5>'+
						'</div>'+
						'<p id=' + data.CommentId + '>'+data.Body+'</p>'+
						commentReply+
						'<div class="comment_top">'+
						'</div>';
				comments.appendChild(div);
    }
    var parentId = 0;
    function creatsingleChilCom_text(data, i) {
		var p = document.createElement("p");
		p.id = data.CommentId;
		p.innerHTML = '' + data.User + ' 回复 ' + data.Owner + ' ： ' + data.Body + '';
		return p;
	}
    var first_text;
    function CreateComment_text(params) {
		showLoading()
		first_text = params.ParentId;
		postDatawithToken('Vote/CreateComment', params, function(data) {
			hideLoading();
			document.getElementById("comment-textarea_text").value='';
			if(data.Type == 1) {
				ii++;
				parentId = 0;
				if(first_text == 0){
					creatsingleCom_text(data.Data)
				}
				switch(type) {
					case 0:
						if(data.Data.ApprovalStatus == 20){
						 	mui.toast("评论成功")
						}else{
						 	//creatsingleCom_text(data.Data);
						}							
						break;
					case 1:
						if(data.Data.ApprovalStatus == 20){
						 	mui.toast("评论成功")
						}else{
						 	elm.appendChild(creatsingleChilCom_text(data.Data))
						}							
						type = 0;
						break;
					case 2:
						if(data.Data.ApprovalStatus == 20){
						 	mui.toast("评论成功")
						}else{
						 	elm.appendChild(creatsingleChilCom_text(data.Data))
						}							
						type = 0;
						break;
					default:
						break;
					}
					document.getElementById("comment-textarea_text").blur();
				} else if(data.Type == 0) {
					//登录失败
					mui.toast("请登录后再进行操作");
					document.getElementById("comment-textarea_text").blur();
					login();
					return;
				} else {
					//逻辑错误
					mui.toast(data.Data);
					document.getElementById("comment-textarea_text").blur();
					return;
				}
			}, function(err) {
				hideLoading();
			})
	}
	mui.plusReady(function() {
		mui("#text_container").on('tap', '.comment_more', function(e) {
			e.stopPropagation();
			var baseUrl = 'vote-comments.html';
			var url = mui.os.plus ? baseUrl : baseUrl + '?voteId=' + voteId;
			var curl = shareUrl+ baseUrl+ baseUrl + '?voteId=' + voteId;
			setlsData('currUrl', curl);
			mui.openWindow({
				url: url,
				id: 'vote-comments.html',
				show: {
					autoShow: true
				},
				waiting: {
					options: {
						loading: {
							height: '35px'
						}
					}
				},
				extras: {
					voteId: voteId
				}
			})
		}),
		mui("#text_container").on('tap', '#commentsTap', function(e) {
			e.stopPropagation();
			var baseUrl = 'vote-comments.html';
			var url = mui.os.plus ? baseUrl : baseUrl + '?voteId=' + voteId;
			var curl = shareUrl+ baseUrl+ baseUrl + '?voteId=' + voteId;
			setlsData('currUrl', curl);
			mui.openWindow({
				url: url,
				id: 'vote-comments.html',
				show: {
					autoShow: true
				},
				waiting: {
					options: {
						loading: {
							height: '35px'
						}
					}
				},
				extras: {
					voteId: voteId
				}
			})
		}),
		mui("#voteDetail").on('tap', '.vote-item-detail', function(e) {
			var voteItemId = this.getAttribute('id');
			var body = this.parentElement.getElementsByClassName('mui-pull-left')[0].innerText;
			GetTextVoteItemDetail(voteItemId,body);
		})
	})
	if(!mui.os.plus) {
		mui("#text_container").on('tap', '.comment_more', function(e) {
			var baseUrl = 'vote-comments.html';
			var url = baseUrl + '?voteId=' + voteId;
			var curl = shareUrl+ baseUrl + '?voteId=' + voteId;
			setlsData('currUrl', curl);
			mui.openWindow({
				url: url,
				id: 'vote-comments.html'
			});
			return false;
		}),
		mui("#text_container").on('tap', '#commentsTap', function(e) {
			e.stopPropagation();
			var baseUrl = 'vote-comments.html';
			var url = baseUrl + '?voteId=' + voteId;
			var curl = shareUrl+ baseUrl + '?voteId=' + voteId;
			setlsData('currUrl', curl);
			mui.openWindow({
				url: url,
				id: 'vote-comments.html'
			});
			return false;
		}),
		mui("#voteDetail").on('tap', '.vote-item-detail', function(e) {
			var voteItemId = this.getAttribute('id');
			var body = this.parentElement.getElementsByClassName('mui-pull-left')[0].innerText;
			GetTextVoteItemDetail(voteItemId,body);
		})
	}
	mui("#detail").on('tap', '.commentupload', function(e) {
		if(mui.os.plus){
			startDownloadTask(this.firstChild.getAttribute('id'))
		}else{
			download(this.firstChild.getAttribute('id'),this.firstChild.getAttribute('title'),location.href.split('#')[0])
		}
	})	
	function GetTextVoteItemDetail(voteItemId,body) {							
		var params = {
			voteItemId:voteItemId
		};
		showLoading()
		getData('Vote/VoteItemDetail', params, function(data) {
			hideLoading()
			hideErr()
			console.log(data)
			if(data.Type == 1) {
				var data = data.Data;
				creatVoteItemPop(body,data);				
				mui('#voteItem').popover('toggle');
				mui("#voteItem").on('tap', '.commentupload', function(e) {
					if(mui.os.plus){
						startDownloadTask(this.firstChild.getAttribute('id'))
					}else{
						download(this.firstChild.getAttribute('id'),this.firstChild.getAttribute('title'),location.href.split('#')[0])
					}
				})
			} else if(data.Type == 0) {
				//登录失败
				mui.toast("请登录后再进行操作");
				login();
				return;
			} else {
				//逻辑错误				
				return;
			}
		}, function(err) {
			hideLoading();
			mui.plusReady(function(){
				if(plus.networkinfo.getCurrentType()==1||plus.networkinfo.getCurrentType()==2){
					mui.toast('网络异常，请检查网络设置!');
					showErr('没有网络连接','','#FFFFFF')
				}else{
					showErr('错误代码：'+err,'','#FFFFFF');
					hideLoading()
				}
			})
		if(!mui.os.plus){
			showErr('错误代码：'+err,'','#FFFFFF');
			hideLoading()
		}
		})
	}
	function GetTextVoteDetail(voteId) {
		var CommentAttach;
		var params = {
			voteId:voteId
		};
		showLoading();
		getDatawithToken('Vote/VoteDetail', params, function(data) {
			hideLoading()
			hideErr()
			var bottomTip = document.querySelectorAll('.mui-pull-bottom-tips');
			if(data.Type == 1) {
				console.log(data);
				if(data.Data && typeof(data.Data) == 'object') {	
					CanChooseQuantity = data.Data.CanChooseQuantity;
					subject.innerText = data.Data.Subject;
					supportNum.innerText = data.Data.CommentCount;
					if(data.Data.CommentCount == 0){
						jgb.style.display = 'none';
						comments.style.display = 'none';
					}else{
						jgb.style.display = 'block';
						comments.style.display = 'block';
					}
					if(data.Data.Attachments&&data.Data.Attachments.length != 0 ){
						CommentAttach = createCommentAttach(data.Data);					
					}else{
						CommentAttach = ''
					}
					var VoteDescription = data.Data.VoteDescription == null ? '' : data.Data.VoteDescription;
					detail.innerHTML = VoteDescription+ CommentAttach;					
					creatTextVoteElement(data.Data);
					var progressContainer = document.getElementsByClassName('progressContainer');
					for(var i = 0;i<progressContainer.length;i++){
						var percent = parseFloat(data.Data.VoteItem[i].Percent);
						mui(progressContainer[i]).progressbar({progress:percent}).show();						
						progressContainer[i].getElementsByClassName('mui-progressbar')[0].getElementsByTagName('span')[0].innerText = data.Data.VoteItem[i].ResultsCount+'/'+data.Data.VoteItem[i].Percent;
						if(data.Data.IsManage == true){
							progressContainer[i].getElementsByClassName('mui-progressbar')[0].getElementsByTagName('span')[0].className = "lookResult";
						}else{
							progressContainer[i].getElementsByClassName('mui-progressbar')[0].getElementsByTagName('span')[0].className = "notlookResult";
						}						
						progressContainer[i].getElementsByClassName('mui-progressbar')[0].getElementsByTagName('span')[0].id = data.Data.VoteItem[i].Id;
					}
					mui("#text_container").on('tap', '.lookResult', function(e) {
						e.stopPropagation();
						var voteItemSubject = this.parentElement.parentElement.parentElement.getElementsByClassName('mui-pull-left')[0].innerText;
						var voteItemId = this.getAttribute('id');
						var baseUrl = 'voteMan.html';
						var url = mui.os.plus ? baseUrl : baseUrl + '?voteItemId=' + voteItemId + '&' +'voteItemSubject=' + voteItemSubject;
						var curl = shareUrl+ baseUrl+ baseUrl + '?voteItemId=' + voteItemId + '&' +'voteItemSubject=' + voteItemSubject;
						setlsData('currUrl', curl);
						mui.openWindow({
							url: url,
							id: 'voteMan.html',
							show: {
								autoShow: true
							},
							waiting: {
								options: {
									loading: {
										height: '35px'
									}
								}
							},
							extras: {
								voteItemId: voteItemId,
								voteItemSubject : voteItemSubject
							}
						})
					})
					setShareInfo(getlsData('currUrl'), data.Data.Subject, data.Data.Subject);
					if(data.Data.Comments.length>0){
						creatTextVoteCommentsElement(data.Data.Comments);
					}
					if(data.Data.Comments.length == 5){
						document.getElementById('morecomment_text').style.display='block';						
					}
				} else {
						//mui.toast("暂无更多问题");
				}
			} else if(data.Type == 0) {
				//登录失败
				mui.toast("请登录后再进行操作");
				login();
				return;
			} else {
				//逻辑错误				
				return;
			}
		}, function(err) {
			hideLoading();
			mui.plusReady(function(){
				if(plus.networkinfo.getCurrentType()==1||plus.networkinfo.getCurrentType()==2){
					mui.toast('网络异常，请检查网络设置!');
					showErr('没有网络连接','','#FFFFFF')
				}else{
					showErr('错误代码：'+err,'','#FFFFFF');
					hideLoading()
				}
			})
		if(!mui.os.plus){
			showErr('错误代码：'+err,'','#FFFFFF');
			hideLoading()
		}
		})
	}
	var ItemIds = [];	
	mui("#text_container").on('tap', '.voteSelected', function(e) {
		if(this.parentElement.getElementsByClassName('mui-pull-left')[0].className == 'active mui-pull-left'){
			this.parentElement.getElementsByClassName('mui-pull-left')[0].className ='mui-pull-left'
		}else{
			this.parentElement.getElementsByClassName('mui-pull-left')[0].className = 'active mui-pull-left';
		}			
	})
	mui("#text_container").on('tap', '#voteing', function(e) {
		var voteSelected = document.getElementsByClassName('voteSelected');
		ItemIds = [];
		for(var i = 0;i<voteSelected.length;i++){
			if(voteSelected[i].checked == true){
				ItemIds.push(voteSelected[i].parentElement.id);
			}
		}
		if(ItemIds.length > CanChooseQuantity ){
			mui.toast("当前投票最多可以选择"+ CanChooseQuantity +"项");
		}else{
			var islog = getlsData('isLogin');
			if(islog == 'true') {
				CreateVoteResult(voteId,ItemIds)
			} else {
				mui.toast('请登录后再进行操作');
				login();
			}
		}			
	})
	function CreateVoteResult(VoteId,ItemIds) {							
		var params = {
			VoteId:VoteId,
			ItemIds:ItemIds
		};
		showLoading()
		postDatawithToken('Vote/CreateVoteResult', params, function(data) {
			hideLoading()
			hideErr()
			if(data.Type == 1) {
				if(mui.os.plus) {
					var wobj = plus.webview.currentWebview();
					wobj.reload(true);
					setTimeout(function() { mui.back(); }, 1000)
				} else {
					mui.back();
					mui.toast(data.Data);
				}			
			} else if(data.Type == 0) {
				//登录失败
				mui.toast("请登录后再进行操作");
				login();
				return;
			} else {
				//逻辑错误				
				return;
			}
		}, function(err) {
			hideLoading();
			mui.plusReady(function(){
				if(plus.networkinfo.getCurrentType()==1||plus.networkinfo.getCurrentType()==2){
					mui.toast('网络异常，请检查网络设置!');
					showErr('没有网络连接','','#FFFFFF')
				}else{
					showErr('错误代码：'+err,'','#FFFFFF');
					hideLoading()
				}
			})
		if(!mui.os.plus){
			showErr('错误代码：'+err,'','#FFFFFF');
			hideLoading()
		}
		})
	}
}
/**
 * 图片投票
 */
if(pageUrl=='imageVote.html'){
	var voteId;
	var subject = document.getElementById('subject');
	var detail = document.getElementById('detail');
	var imageVoteDetail = document.getElementById('imageVoteDetail');
	var jgb = document.getElementById('jgb');
	var comments = document.getElementById('comments');
	var image_container = document.getElementById('image_container');
	var commentsTap = document.getElementById('commentsTap');
	var supportNum = document.getElementById('supportNum');
	creatSharePop();
	mui(".pop_view_share").on('tap', '.pop_view_item', function(e) {
		if(mui.os.plus) {		
			mui('#popView_share2').popover('toggle');
			var popView_share2 = document.getElementById("popView_share2");
			popView_share2.className = "box mui-popover mui-popover-action mui-popover-bottom ";
			shareHref(this.getAttribute('id'));
		}
	})
	window.onload = function() {
		if(mui.os.plus) {
			var self = plus.webview.currentWebview();
			voteId = self.voteId;
			GetImageVoteDetail(voteId);
		}else{
			voteId = getUrlParam('voteId');	
			GetImageVoteDetail(voteId);
		}
		if(mui.os.wechat){
			var currUrl = location.href.split('#')[0];
			weChatLogin(currUrl)
		}
	}
	function creatVoteItemPop(body,data) {
		var CommentAttach;
		if(data.Attachments&&data.Attachments.length != 0 ){
			CommentAttach = createCommentAttach(data);					
		}else{
			CommentAttach = ''
		}
		var div = document.createElement('div');
		div.id = 'voteItem';
		div.className = 'box mui-popover mui-popover-action mui-popover-center';
		div.innerHTML = '<div class="pop_view">' +
						'<div class="itemSubject">'+ body +'</div>'+
						'<div class="itemBody">'+ data.Body +'</div>'+
						CommentAttach+
						'</div>';
		bigContainer.appendChild(div);
	}
	var creatImageVoteElement = function(data) {
        var container ='';
        if(CanChooseQuantity > 1){
			var inputType = "checkbox";
			var parentClass = 'mui-checkbox mui-left';
		}else{
			var inputType = "radio";
			var parentClass = 'mui-radio';
		}
        if(data.Status == 2 || data.Status == 3){
			var testStatus = true;
		}else{
			var testStatus = false;
		}
        if(data.ViewResultsSetting == true){
				if(data.Status == 1){
					var selected = '<input  name="style" type="'+ inputType +'" value="inverted" class="voteSelected">';
				}else{
					var selected = "";
					var parentClass = '';
					imageVoteDetail.className = 'jh-img-vote';
				}
			}else{
				if(data.Status == 1){
					var selected = '<input  name="style" type="radio" value="inverted" class="voteSelected">';
				}else{
					var selected = "";
					var parentClass = '';
					imageVoteDetail.className = 'jh-img-vote';
				}
			}
		for(var i = 0;i<data.VoteItem.length;i++){
			var progress ='';
			if(data.ViewResultsSetting == true && testStatus == true ){
				var progress = 	'<div class="progressContainer"></div>'	
			}
			var voteItemDetail = data.VoteItem[i].HasBody == true ? '<a href="#" id='+ data.VoteItem[i].Id +' class="tn-text-color mui-pull-right vote-item-detail">详情</a>' : '';
			var item = '<div class="mui-col-xs-6">'+
						'<div class="jh-img-position">'+
						'<img class="mui-media-object" src='+ data.VoteItem[i].ImageAttachment +'>'+
						'<div class="mui-input-row '+ parentClass +'" id="'+ data.VoteItem[i].Id +'">'+
						'<span class="mui-pull-left">'+ data.VoteItem[i].Name +'</span>'+						
						selected+
						voteItemDetail+	
						progress+
						'</div>'+
						'</div>'+
						'</div>';					
			container +=item;
		} 
		var statusType = data.Status;
		switch(statusType){
			case 0:
				var status = '<button type="button" class="mui-btn jh-btn-gray" disabled="disabled">未开始</button>';
				break;
			case 1:
				var status = '<button type="button" class="mui-btn mui-btn-primary" id="voteing">投票</button>';
				break;
			case 2:
				var status = '<button type="button" class="mui-btn jh-btn-gray" disabled="disabled">已结束</button>';
				break;
			case 3:
				var status = '<button type="button" class="mui-btn jh-btn-gray" disabled="disabled">已投票</button>';
				break;
			default:
				break;				
		}
		imageVoteDetail.innerHTML = '<ul class="mui-list-inline text-muted">'+
								'<li>'+data.HitTimes+"已浏览"+'</li>'+
								'<li class="mui-pull-right"><span class="tn-theme-color">'+data.AttendCount+'</span> 已投票</li>'+
								'</ul>'+
								'<ul class="mui-list-inline">'+
								'<li>截止时间：'+ data.VoteTime +'</li>'+
								'<li class="mui-pull-right"><span class="tn-theme-color">*</span> 最多可投'+ data.CanChooseQuantity+'项</li>'+
								'</ul>'+
								'<div class="mui-row">'+
								container+
								'</div>'+
								'<div class="mui-text-center">'+
								status+
								'</div>';
	};
	var creatImageVoteCommentsElement = function(data){
		console.log(data)
		var commentReply = "";				
		var commentsContainer = '';
		for(var i = 0;i<data.length;i++){
			console.log(i)
			if(data[i].ChildCommentCount > 0){
					var ChildComments = data[i].ChildComments;
					var ChildCommentes ="";
					for(var j = 0;j<ChildComments.length;j++){
						if(j > 1) {
			               dis = 'none'
		                } else {
			               dis = 'block';
		                }	                
						var ChildComment = '<p id="'+ ChildComments[j].CommentId + ' " style="display:' + dis +'">'+ ChildComments[j].User +'回复'+ ChildComments[j].Owner +'： '+ ChildComments[j].Body +'</p>';
						ChildCommentes += ChildComment;
					}
					comlength = data[i].ChildComments.length > 2  ? '<a href="#">共'+ data[i].ChildComments.length +'条评论></a>' : '<a href="#"></a>'
					commentReply = '<div class="jh-comment-reply"id="childCom' + i + '">'+
					               '<div>'+
				                   ChildCommentes+
				                   '</div>'+
				                   '<div>'+
				                   '<h5 class="mui-text-center">'+
				                   comlength+				                   
				                   '</h5>'+
				                   '</div>'+
				                   '</div>';
				}else{
					commentReply = '<div class="jh-comment-reply"id="childCom' + i + '" style="display:none">'+
									'<div>'+				                   
				                   '</div>'+
				                   '<div>'+
				                   '<h5 class="mui-text-center">'+
				                   '<a href="#"></a>'+
				                   '</h5>'+
				                   '</div>'+
					                '</div>';
				}
			var Avatar = data[i].Avatar == '' ? "../img/avatar-mini.png" : data[i].Avatar;
			var div = document.createElement('div');
			div.className = 'comment_body';
			div.innerHTML = '<div class="comment_img">'+
						'<img class="creator_img_comment" src='+ Avatar +' />'+
						'</div>'+
						'<div class="comment_content">'+
						'<div class="comment_top">'+
						'<h5 class="comment_top_left">'+ data[i].User +'</h5>'+
						'<h5 class="comment_top_right">'+ data[i].DateCreated +'</h5>'+
						'</div>'+
						'<p id=' + data[i].CommentId +  '>'+data[i].Body+'</p>'+
						commentReply+
						'</div>';
			comments.appendChild(div);
		}		
	};
	mui("#comments").on('tap', '.mui-text-center', function(e) {
	       var allp = e.target.parentElement.parentElement.parentElement.querySelectorAll('p');
	    mui.each(allp, function(index, item) {
		   if(item.style.display == 'block' && index > 1) {
			  item.style.display = 'none'			 
		   } else {
			  item.style.display = 'block'
		   }
	   })
    })	
    mui("#detail").on('tap', '.commentupload', function(e) {
		if(mui.os.plus){
			startDownloadTask(this.firstChild.getAttribute('id'))
		}else{
			download(this.firstChild.getAttribute('id'),this.firstChild.getAttribute('title'),location.href.split('#')[0])
		}
	})
    function creatCommentPop_image() {
		var div = document.createElement('div');
		div.id = 'popView_comment_image';
		div.className = 'box mui-popover mui-popover-action mui-popover-bottom';
		div.innerHTML = '<div class="pop_view">' +
				'	<textarea rows="5" autofocus="autofocus" name="textarea" placeholder="输入评论" id="comment-textarea_image" autofocus="autofocus"></textarea>' +
				'	<div class="mui-text-center" style="margin-top:-10px;">' +
				'		<button id="cancelComImage" class="mui-btn" style="margin-right: 20px;">取消</button>' +
				'		<button id="sendCom" class="mui-btn mui-btn-primary" style="margin-left: 20px;">发送</button>' +
				'	</div>' +
				'</div>';
		bigContainer.appendChild(div);
	}
    creatCommentPop_image();
    var sendCom = document.getElementById("sendCom");		
	editComment && editComment.addEventListener('tap', function() {
		tenantTypeId = 'Vote';
		var islog = getlsData('isLogin');
		if(islog == 'true') {
			mui('#popView_comment_image').popover('toggle');
		} else {
			mui.toast('请登录后再进行操作');
			login();
		}
	})
	var cancelComImage = document.getElementById("cancelComImage");
	var elmt;
	cancelComImage && cancelComImage.addEventListener('tap', function() {
		mui('#popView_comment_image').popover('toggle');
		if(elmt.querySelector('.jh-comment-reply').innerText == ""){
			elmt.querySelector('.jh-comment-reply').style.display='none';
		}
	})
	sendCom && sendCom.addEventListener('tap', function() {		
		mui('#popView_comment_image').popover('toggle');
		submitComment_image(parentId,voteId);				
	})
	var elm;
	var parentId = 0;
    mui("#comments").on('tap', '.comment_content p', function(e) {
    	tenantTypeId = 'Vote';
		var islog = getlsData('isLogin');
		if(islog == 'true') {
			if(e.target.parentElement.parentElement.className == 'jh-comment-reply') {
				type=2;
				elm=e.target.parentElement;
				parentId = e.target.id;
				mui('#popView_comment_image').popover('toggle');
			} else {
				type=1;
				elmt=e.target.parentElement.parentElement;
				elmt.querySelector('.jh-comment-reply').style.display='block';
				elm=elmt.querySelector('.jh-comment-reply').getElementsByTagName("div")[0];
				parentId = e.target.id;
				mui('#popView_comment_image').popover('toggle');
			}
		}else{
			mui.toast('请登录后再进行操作');
			login();
		}		
	})
    function submitComment_image(pid,id) {
    	var commentText = document.getElementById("comment-textarea_image");
		var comBody = TrimAll(commentText.value);
		if(comBody.length == 0) {
			mui.toast('评论内容不能为空！');
			return;
		}
		var params = {
			ParentId: pid,
			CommentedObjectId: id,
			TenantTypeId: 'Vote',
			Body: comBody
		}
		CreateComment_image(params)
	}
    function creatsingleCom_image(data){
    	var item;
    	item = ii;	
    	var commentReply = "";
    	commentReply = '<div class="jh-comment-reply"id="childCom" style="display:none">'+
					'<div>'+				                   
				    '</div>'+
				    '<div>'+
				    '<h5 class="mui-text-center">'+
				    '<a href="#"></a>'+
				    '</h5>'+
				    '</div>'+
					'</div>';
    	if(data.Avatar.length > 0){
			var Avatar = '<img class="creator_img_comment " src='+ data.Avatar +'>';
		}else{
			var Avatar = '<img class="creator_img_comment " src="../img/avatar.jpg"/>';
		}
    	var div;
    	div = document.createElement('div');
		div.className = "comment_body";
		div.innerHTML = '<div class="comment_img">'+
						Avatar+
						'</div>'+
						'<div class="comment_content">'+
						'<div class="comment_top">'+
						'<h5 class="comment_top_left">'+ data.User +'</h5>'+
						'<h5 class="comment_top_right">'+ data.DateCreated +'</h5>'+
						'</div>'+
						'<p id=' + data.CommentId + '>'+data.Body+'</p>'+
						commentReply+
						'<div class="comment_top">'+
						'</div>';
				comments.appendChild(div);
    }
    var parentId = 0;
    function creatsingleChilCom_text(data, i) {
		var p = document.createElement("p");
		p.id = data.CommentId;
		p.innerHTML = '' + data.User + ' 回复 ' + data.Owner + ' ： ' + data.Body + '';
		return p;
	}
    var first_text;
    function CreateComment_image(params) {
		showLoading()
		first_text = params.ParentId;
		postDatawithToken('Vote/CreateComment', params, function(data) {
			parentId = 0;
			hideLoading();
			document.getElementById("comment-textarea_image").value='';
			if(data.Type == 1) {
				ii++;	
				if(first_text == 0){
					creatsingleCom_image(data.Data)
				}
				switch(type) {
					case 0:
						if(data.Data.ApprovalStatus == 20){
						 	mui.toast("评论成功")
						}else{
						 	//creatsingleCom_text(data.Data);
						}							
						break;
					case 1:
						if(data.Data.ApprovalStatus == 20){
						 	mui.toast("评论成功")
						}else{
						 	elm.appendChild(creatsingleChilCom_text(data.Data))
						}							
						type = 0;
						break;
					case 2:
						if(data.Data.ApprovalStatus == 20){
						 	mui.toast("评论成功")
						}else{
						 	elm.appendChild(creatsingleChilCom_text(data.Data))
						}							
						type = 0;
						break;
					default:
						break;
					}
					document.getElementById("comment-textarea_image").blur();
				} else if(data.Type == 0) {
					//登录失败
					mui.toast("请登录后再进行操作");
					document.getElementById("comment-textarea_image").blur();
					login();
					return;
				} else {
					//逻辑错误
					mui.toast(data.Data);
					document.getElementById("comment-textarea_image").blur();
					return;
				}
			}, function(err) {
				hideLoading();
			})
	}
	mui.plusReady(function() {
		mui("#image_container").on('tap', '.comment_more', function(e) {
			e.stopPropagation();
			var baseUrl = 'vote-comments.html';
			var url = mui.os.plus ? baseUrl : baseUrl + '?voteId=' + voteId;
			var curl = shareUrl+ baseUrl+ baseUrl + '?voteId=' + voteId;
			setlsData('currUrl', curl);
			mui.openWindow({
				url: url,
				id: 'vote-comments.html',
				show: {
					autoShow: true
				},
				waiting: {
					options: {
						loading: {
							height: '35px'
						}
					}
				},
				extras: {
					voteId: voteId
				}
			})
		}),
		mui("#image_container").on('tap', '#commentsTap', function(e) {
			e.stopPropagation();
			var baseUrl = 'vote-comments.html';
			var url = mui.os.plus ? baseUrl : baseUrl + '?voteId=' + voteId;
			var curl = shareUrl+ baseUrl+ baseUrl + '?voteId=' + voteId;
			setlsData('currUrl', curl);
			mui.openWindow({
				url: url,
				id: 'vote-comments.html',
				show: {
					autoShow: true
				},
				waiting: {
					options: {
						loading: {
							height: '35px'
						}
					}
				},
				extras: {
					voteId: voteId
				}
			})
		}),
		mui("#imageVoteDetail").on('tap', '.vote-item-detail', function(e) {
			var voteItemId = this.getAttribute('id');
			var body = this.parentElement.getElementsByClassName('mui-pull-left')[0].innerText;
			GetImageVoteItemDetail(voteItemId,body);
		})
	})
	if(!mui.os.plus) {
		mui("#image_container").on('tap', '.comment_more', function(e) {
			var baseUrl = 'vote-comments.html';
			var url = baseUrl + '?voteId=' + voteId;
			var curl = shareUrl+ baseUrl + '?voteId=' + voteId;
			setlsData('currUrl', curl);
			mui.openWindow({
				url: url,
				id: 'vote-comments.html'
			});
			return false;
		}),
		mui("#image_container").on('tap', '#commentsTap', function(e) {
			e.stopPropagation();
			var baseUrl = 'vote-comments.html';
			var url = baseUrl + '?voteId=' + voteId;
			var curl = shareUrl+ baseUrl + '?voteId=' + voteId;
			setlsData('currUrl', curl);
			mui.openWindow({
				url: url,
				id: 'vote-comments.html'
			});
			return false;
		}),
		mui("#imageVoteDetail").on('tap', '.vote-item-detail', function(e) {
			var voteItemId = this.getAttribute('id');
			var body = this.parentElement.getElementsByClassName('mui-pull-left')[0].innerText;
			GetImageVoteItemDetail(voteItemId,body);
		})
	}
	function GetImageVoteItemDetail(voteItemId,body) {							
		var params = {
			voteItemId:voteItemId
		};
		showLoading()
		getData('Vote/VoteItemDetail', params, function(data) {
			hideLoading()
			hideErr()
			console.log(data)
			if(data.Type == 1) {
				var data = data.Data;
				creatVoteItemPop(body,data);
				mui("#voteItem").on('tap', '.commentupload', function(e) {
					if(mui.os.plus){
						startDownloadTask(this.firstChild.getAttribute('id'))
					}else{
						download(this.firstChild.getAttribute('id'),this.firstChild.getAttribute('title'),location.href.split('#')[0])
					}
				})
				mui('#voteItem').popover('toggle');				
			} else if(data.Type == 0) {
				//登录失败
				mui.toast("请登录后再进行操作");
				login();
				return;
			} else {
				//逻辑错误				
				return;
			}
		}, function(err) {
			hideLoading();
			mui.plusReady(function(){
				if(plus.networkinfo.getCurrentType()==1||plus.networkinfo.getCurrentType()==2){
					mui.toast('网络异常，请检查网络设置!');
					showErr('没有网络连接','','#FFFFFF')
				}else{
					showErr('错误代码：'+err,'','#FFFFFF');
					hideLoading()
				}
			})
		if(!mui.os.plus){
			showErr('错误代码：'+err,'','#FFFFFF');
			hideLoading()
		}
		})
	}
	var CanChooseQuantity;
	function GetImageVoteDetail(voteId) {	
		var CommentAttach;
		var params = {
			voteId:voteId
		};
		showLoading()
		getDatawithToken('Vote/VoteDetail', params, function(data) {
			hideLoading()
			hideErr()
			var bottomTip = document.querySelectorAll('.mui-pull-bottom-tips');
			if(data.Type == 1) {
				console.log(data);
				if(data.Data && typeof(data.Data) == 'object') {
					CanChooseQuantity=data.Data.CanChooseQuantity
					subject.innerText = data.Data.Subject;
					supportNum.innerText = data.Data.CommentCount;
					if(data.Data.CommentCount == 0){
						jgb.style.display = 'none';
						comments.style.display = 'none';
					}else{
						jgb.style.display = 'block';
						comments.style.display = 'block';
					}
					if(data.Data.Attachments&&data.Data.Attachments.length != 0 ){
						CommentAttach = createCommentAttach(data.Data);					
					}else{
						CommentAttach = ''
					}
					var VoteDescription = data.Data.VoteDescription == null ? '' : data.Data.VoteDescription;
					detail.innerHTML = VoteDescription+ CommentAttach;
					creatImageVoteElement(data.Data);
					var progressContainer = document.getElementsByClassName('progressContainer');
					for(var i = 0;i<progressContainer.length;i++){
						var percent = parseFloat(data.Data.VoteItem[i].Percent);
						mui(progressContainer[i]).progressbar({progress:percent}).show();
						progressContainer[i].getElementsByClassName('mui-progressbar')[0].getElementsByTagName('span')[0].innerText = data.Data.VoteItem[i].ResultsCount+'/'+data.Data.VoteItem[i].Percent;
						if(data.Data.IsManage == true){
							progressContainer[i].getElementsByClassName('mui-progressbar')[0].getElementsByTagName('span')[0].className = "lookResult";	
						}else{
							progressContainer[i].getElementsByClassName('mui-progressbar')[0].getElementsByTagName('span')[0].className = "notlookResult";	
						}
						progressContainer[i].getElementsByClassName('mui-progressbar')[0].getElementsByTagName('span')[0].id = data.Data.VoteItem[i].Id;
					}
					mui("#image_container").on('tap', '.lookResult', function(e) {
						e.stopPropagation();
						var voteItemSubject = this.parentElement.parentElement.parentElement.getElementsByClassName('mui-pull-left')[0].innerText;
						var voteItemId = this.getAttribute('id');
						var baseUrl = 'voteMan.html';
						var url = mui.os.plus ? baseUrl : baseUrl + '?voteItemId=' + voteItemId + '&' +'voteItemSubject=' + voteItemSubject;
						var curl = shareUrl+ baseUrl+ baseUrl + '?voteItemId=' + voteItemId + '&' +'voteItemSubject=' + voteItemSubject;
						setlsData('currUrl', curl);
						mui.openWindow({
							url: url,
							id: 'voteMan.html',
							show: {
								autoShow: true
							},
							waiting: {
								options: {
									loading: {
										height: '35px'
									}
								}
							},
							extras: {
								voteItemId: voteItemId,
								voteItemSubject : voteItemSubject
							}
						})
					})
					setShareInfo(getlsData('currUrl'), data.Data.Subject, data.Data.Subject);
					if(data.Data.Comments.length>0){
						creatImageVoteCommentsElement(data.Data.Comments);
					}
					if(data.Data.Comments.length == 5){
						document.getElementById('morecomment_image').style.display="block";						
					}
				} else {
						//mui.toast("暂无更多");
				}
			} else if(data.Type == 0) {
				//登录失败
				mui.toast("请登录后再进行操作");
				login();
				return;
			} else {
				//逻辑错误
				var errForList=showErrForList(data.Data,'','',idName);
				if(errForList){
					fragment.appendChild(showErrForList(data.Data,'','',idName))
				}
				return;
			}
		}, function(err) {
			hideLoading();
			mui.plusReady(function(){
				if(plus.networkinfo.getCurrentType()==1||plus.networkinfo.getCurrentType()==2){
					mui.toast('网络异常，请检查网络设置!');
					showErr('没有网络连接','','#FFFFFF')
				}else{
					showErr('错误代码：'+err,'','#FFFFFF');
					hideLoading()
				}
			})
		if(!mui.os.plus){
			showErr('错误代码：'+err,'','#FFFFFF');
			hideLoading()
		}
		})
	}
	var ItemIds = [];	
	mui("#image_container").on('tap', '.voteSelected', function(e) {
		if(this.parentElement.getElementsByClassName('mui-pull-left')[0].className == 'active mui-pull-left'){
			this.parentElement.getElementsByClassName('mui-pull-left')[0].className ='mui-pull-left'
		}else{
			this.parentElement.getElementsByClassName('mui-pull-left')[0].className = 'active mui-pull-left';
		}			
	})
	mui("#image_container").on('tap', '#voteing', function(e) {
		var voteSelected = document.getElementsByClassName('voteSelected');
		ItemIds = [];
		for(var i = 0;i<voteSelected.length;i++){
			if(voteSelected[i].checked == true){
				ItemIds.push(voteSelected[i].parentElement.id);
			}
		}
		if(ItemIds.length > CanChooseQuantity ){
			mui.toast("当前投票最多可以选择"+ CanChooseQuantity +"项");
		}else{
			var islog = getlsData('isLogin');
			if(islog == 'true') {
				CreateVoteResult(voteId,ItemIds)
			} else {
				mui.toast('请登录后再进行操作');
				login();
			}
		}			
	})
	function CreateVoteResult(VoteId,ItemIds) {							
		var params = {
			VoteId:VoteId,
			ItemIds:ItemIds
		};
		showLoading()
		postDatawithToken('Vote/CreateVoteResult', params, function(data) {
			hideLoading()
			hideErr()
			console.log(data)
			if(data.Type == 1) {
				if(mui.os.plus) {
					var wobj = plus.webview.currentWebview();
					wobj.reload(true);
					setTimeout(function() { mui.back(); }, 1000)
				} else {
					mui.back();
					mui.toast(data.Data);
				}			
			} else if(data.Type == 0) {
				//登录失败
				mui.toast("请登录后再进行操作");
				login();
				return;
			} else {
				//逻辑错误				
				return;
			}
		}, function(err) {
			hideLoading();
			mui.plusReady(function(){
				if(plus.networkinfo.getCurrentType()==1||plus.networkinfo.getCurrentType()==2){
					mui.toast('网络异常，请检查网络设置!');
					showErr('没有网络连接','','#FFFFFF')
				}else{
					showErr('错误代码：'+err,'','#FFFFFF');
					hideLoading()
				}
			})
		if(!mui.os.plus){
			showErr('错误代码：'+err,'','#FFFFFF');
			hideLoading()
		}
		})
	}
}
/**
 * 评论列表
 */
if(pageUrl=='vote-comments.html'){
	var voteId;	
	var commentAreas = document.getElementById("commentAreas");
	var editComment = document.getElementById("editComment");
    var tenantTypeId = '';
    var commentedObjectId;
    var ii = 0;
    var type = 0;
	window.onload = function() {
		if(mui.os.plus) {
			mui.plusReady(function() {
				var self = plus.webview.currentWebview();
				voteId = self.voteId;
				getVoteComments(false,voteId);
				//关闭等待框
				plus.nativeUI.closeWaiting();
				//显示当前页面
				mui.currentWebview.show();
			});
		} else {	
			voteId = getUrlParam('voteId');
			getVoteComments(false,voteId);
		}
		if(mui.os.wechat){
			var currUrl = location.href.split('#')[0];
			weChatLogin(currUrl)
		}			
	}
	mui.init({
		pullRefresh: {
			container: '#pullrefresh',
			down: {
				callback: pulldownRefresh
			},
			up: {
				contentrefresh: '正在加载...',
				callback: pullupRefresh
			}
		}
	});                                                                                                                            
	function pulldownRefresh() {                                                                                                      
		setTimeout(function() { 
			getVoteComments(false,voteId);                                                                                         
			mui('#pullrefresh').pullRefresh().endPulldownToRefresh();                                            
		}, 1500);                                                                                                                     
	}                                                                                                                                 
	var count = 0;                                                                                                                                                                                                                                                  
	function pullupRefresh() {                                                                                                        
		setTimeout(function() { 
			getVoteComments(true,voteId);
			mui('#pullrefresh').pullRefresh().endPullupToRefresh((++count > 2));                                                                                                                             
		}, 1500);                                                                                                                     
	}
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
    creatCommentPop();
    var sendCom = document.getElementById("sendCom");		
	editComment && editComment.addEventListener('tap', function() {
		tenantTypeId = 'Vote';
		var islog = getlsData('isLogin');
		if(islog == 'true') {
			mui('#popView_comment').popover('toggle');
		} else {
			mui.toast('请登录后再进行操作');
			login();
		}
	})
	var cancelCom = document.getElementById("cancelCom");
	var elmt;
	var parentId = 0;
	cancelCom && cancelCom.addEventListener('tap', function() {
		mui('#popView_comment').popover('toggle');
		if(elmt.querySelector('.jh-comment-reply').innerText == ""){
			elmt.querySelector('.jh-comment-reply').style.display='none';
		}
	})
	sendCom && sendCom.addEventListener('tap', function() {		
		mui('#popView_comment').popover('toggle');
		submitComment(parentId,voteId);				
	})
    mui("#commentAreas").on('tap', '.mui-text-center', function(e) {
	    var allp = e.target.parentElement.parentElement.parentElement.querySelectorAll('p');
	    mui.each(allp, function(index, item) {
		   if(item.style.display == 'block' && index > 1) {
			  item.style.display = 'none'			 
		   } else {
			  item.style.display = 'block'
		   }
	   })
    })
    var elm;
    mui("#commentAreas").on('tap', '.comment_content p', function(e) {
    	tenantTypeId = 'Vote';
		var islog = getlsData('isLogin');
		if(islog == 'true') {
			if(e.target.parentElement.parentElement.className == 'jh-comment-reply') {
				type=2;
				elm=e.target.parentElement;
				parentId = e.target.id;
				mui('#popView_comment').popover('toggle');
			} else {
				type=1;
				elmt=e.target.parentElement.parentElement;
				elmt.querySelector('.jh-comment-reply').style.display='block';
				elm=elmt.querySelector('.jh-comment-reply').getElementsByTagName("div")[0];
				parentId = e.target.id;
				mui('#popView_comment').popover('toggle');
			}
		}else{
			mui.toast('请登录后再进行操作');
			login();
		}		
	})
    function submitComment(pid,id) {
    	var commentText = document.getElementById("comment-textarea");
		var comBody = TrimAll(commentText.value);
		if(comBody.length == 0) {
			mui.toast('评论内容不能为空！');
			return;
		}
		var params = {
			ParentId: pid,
			CommentedObjectId: id,
			TenantTypeId: 'Vote',
			Body: comBody
		}
		CreateComment(params)
	}
    function creatsingleCom(data){
    	var item;
    	item = ii;	
    	var commentReply = "";
    	commentReply = '<div class="jh-comment-reply"id="childCom" style="display:none">'+
					'<div>'+				                   
				    '</div>'+
				    '<div>'+
				    '<h5 class="mui-text-center">'+
				    '<a href="#"></a>'+
				    '</h5>'+
				    '</div>'+
					'</div>';
    	if(data.Avatar.length > 0){
			var Avatar = '<img class="creator_img_comment " src='+ data.Avatar +'>';
		}else{
			var Avatar = '<img class="creator_img_comment " src="../img/avatar.jpg"/>';
		}
    	var div;
    	div = document.createElement('div');
		div.className = "comment_body";
		div.innerHTML = '<div class="comment_img">'+
						Avatar+
						'</div>'+
						'<div class="comment_content">'+
						'<div class="comment_top">'+
						'<h5 class="comment_top_left">'+ data.User +'</h5>'+
						'<h5 class="comment_top_right">'+ data.DateCreated +'</h5>'+
						'</div>'+
						'<p id=' + data.CommentId + '>'+data.Body+'</p>'+
						commentReply+
						'<div class="comment_top">'+
						'</div>';
				commentAreas.appendChild(div);
    }
    var parentId = 0;
    function creatsingleChilCom(data, i) {
		var p = document.createElement("p");
		p.id = data.CommentId;
		p.innerHTML = '' + data.User + ' 回复 ' + data.Owner + ' ： ' + data.Body + '';
		return p;
	}
    function CreateComment(params) {
		showLoading()
		postDatawithToken('Vote/CreateComment', params, function(data) {
			hideLoading();
			document.getElementById("comment-textarea").value='';
			if(data.Type == 1) {
				parentId = 0;
				ii++;											
				switch(type) {
					case 0:
						if(data.Data.ApprovalStatus == 20){
						 	mui.toast("评论成功")
						}else{
						 	creatsingleCom(data.Data);
						}							
						break;
					case 1:
						if(data.Data.ApprovalStatus == 20){
						 	mui.toast("评论成功")
						}else{
						 	elm.appendChild(creatsingleChilCom(data.Data))
						}							
						type = 0;
						break;
					case 2:
						if(data.Data.ApprovalStatus == 20){
						 	mui.toast("评论成功")
						}else{
						 	elm.appendChild(creatsingleChilCom(data.Data))
						}							
						type = 0;
						break;
					default:
						break;
					}
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
	var item = 0;
    var ii ;
    var createItem = function(data,item){ 		    	
    	for(var i = 0;i<data.length;i++){
    		item++;	
			ii++;
			var commentReply = "";
			if(data[i].Avatar.length > 0){
				var Avatar = '<img class="creator_img_comment " id='+data[i].UserId+' src='+ data[i].Avatar +'>';
			}else{
				var Avatar = '<img class="creator_img_comment " id='+data[i].UserId+' src="../img/avatar.jpg"/>';
			}
			if(data[i].ChildCommentCount > 0){
				var ChildComments = data[i].ChildComments;
				var ChildCommentes ="";
				for(var j = 0;j<ChildComments.length;j++){
					if(j > 1) {
			            dis = 'none'
		            } else {
			            dis = 'block';
		            }	                
					var ChildComment = '<p id="'+ ChildComments[j].CommentId + ' " style="display:' + dis +'">'+ ChildComments[j].User +'回复'+ ChildComments[j].Owner +'： '+ ChildComments[j].Body +'</p>';
					ChildCommentes += ChildComment;
				}
				comlength = data[i].ChildComments.length > 2  ? '<a href="#">共'+ data[i].ChildComments.length +'条评论></a>' : '<a href="#"></a>'
				commentReply = '<div class="jh-comment-reply"id="childCom' + i + '">'+
					            '<div>'+
				                ChildCommentes+
				                '</div>'+
				                '<div>'+
				                '<h5 class="mui-text-center">'+
				                comlength+				                   
				                '</h5>'+
				                '</div>'+
				                '</div>';
			}else{
				commentReply = '<div class="jh-comment-reply"id="childCom' + i + '" style="display:none">'+
								'<div>'+				                   
				                '</div>'+
				                '<div>'+
				                '<h5 class="mui-text-center">'+
				                '<a href="#"></a>'+
				                '</h5>'+
				                '</div>'+
					            '</div>';
			}
			var div;
			div = document.createElement('div');
			div.className = "comment_body";
			div.innerHTML = '<div class="comment_img">'+
							Avatar+
							'</div>'+
							'<div class="comment_content">'+
							'<div class="comment_top">'+
							'<h5 class="comment_top_left">'+ data[i].User +'</h5>'+
							'<h5 class="comment_top_right">'+ data[i].DateCreated +'</h5>'+
							'</div>'+
							'<p class="fristCom" id=' + data[i].CommentId +  '>'+data[i].Body+'</p>'+
							commentReply+
							'<div class="comment_top">'+
							'</div>';
			commentAreas.appendChild(div);
    	}
    	ii = item;
    	return commentAreas;
    }; 
	var page = 1;
	function getVoteComments(more,id) {
		if(more){
			page++;
		}else{
			page=1;
		}
		var params = {
			commentedObjectId: id,
			pageIndex: page
		}
		getData('Vote/GetCommentsDetail', params, function(data) {	
			console.log(data);
			if(data.Type == 1) {
				if(data.Data && typeof(data.Data) == 'object') {
					var data = data.Data;
					if(data.length>0){
						if(more){
							createItem(data,ii);
						}else{
							var commentAreas = document.getElementById("commentAreas");
							commentAreas.innerHTML='';
							createItem(data,0);
						}								
						}else{								
						}
						commentedObjectId = id;
						var morecomment = document.getElementById('morecomment');
					} else {
						mui.toast(data.Data);
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
			}, function(err) {
				mui.plusReady(function(){
						if(plus.networkinfo.getCurrentType()==1||plus.networkinfo.getCurrentType()==2){
							mui.toast('网络异常，请检查网络设置!');
							document.getElementById("loadmsgtext").innerHTML='没有网络连接'
						}else{
							mui.toast("错误代码：" + err);
							hideLoading()
						}
					})
				if(!mui.os.plus){
					mui.toast("错误代码：" + err);
					hideLoading()
				}
			})
		}
}
/**
 * 投票人员
 */
if(pageUrl=='voteMan.html'){
	var voteName = document.getElementById('voteName');
	var voteItemId;
	var voteItemSubject;
	var page = 1;
	var container = document.getElementById('container');
	window.onload = function() {
		if(mui.os.plus) {
			var self = plus.webview.currentWebview();
			voteItemId = self.voteItemId;
			voteItemSubject = self.voteItemSubject;
			voteName.innerText = voteItemSubject;
			GetVoteMan(voteItemId,false);
		}else{
			voteItemId = getUrlParam('voteItemId');	
			voteItemSubject = getUrlParam('voteItemSubject');
			voteName.innerText = voteItemSubject;
			GetVoteMan(voteItemId,false);
		}
		if(mui.os.wechat){
			var currUrl = location.href.split('#')[0];
			weChatLogin(currUrl)
		}
	}
	mui.init({
		pullRefresh: {
			container: '#refreshContainer',
			down: {				
				callback: pulldownRefresh
			},
			up: {
				contentrefresh: '正在加载...',
				callback: pullupRefresh
			}
		}
	});                                                                                                                            
	function pulldownRefresh() {                                                                                                      
		setTimeout(function() { 
			GetVoteMan(voteItemId,false);                                                                                         
			mui('#refreshContainer').pullRefresh().endPulldownToRefresh();                                            
		}, 1500);                                                                                                                     
	}                                                                                                                                 
	var count = 0;                                                                                                                                                                                                                                                  
	function pullupRefresh() {                                                                                                        
		setTimeout(function() { 
			GetVoteMan(voteItemId,true);
			mui('#refreshContainer').pullRefresh().endPullupToRefresh((++count > 2));                                                                                                                             
		}, 1500);                                                                                                                     
	}
	var creatVoteManElement = function(data){
		console.log(data);
		for(var i = 0;i<data.length;i++){
			var Avatar = data[i].Avatar == '' ? '../img/avatar.jpg' : data[i].Avatar;
			var li = document.createElement('li');
			li.className = 'mui-table-view-cell mui-media';
			li.innerHTML = '<img class="mui-media-object mui-pull-left" src="'+ Avatar +'">'+
							'<div class="mui-media-body">'+data[i].UserName+
							'<span class="mui-pull-right">'+ data[i].DateCreated +'</span>'+
							'</div>';
			container.appendChild(li);							
		}
	};	
	function GetVoteMan(voteItemId,more) {
		if(more) {
			page++;
		} else {
			container.innerHTML = '';
			page = 1;
		}
		var params = {
			voteItemId:voteItemId,
			pageSize : 10,
			pageIndex : page
		};
		showLoading();
		getDatawithToken('Vote/VoteItemUsers', params, function(data) {
			hideLoading()
			hideErr()
			console.log(data);
			var bottomTip = document.querySelectorAll('.mui-pull-bottom-tips');
			if(data.Type == 1) {
				
				if(data.Data && typeof(data.Data) == 'object') {	
					var data = data.Data;
					creatVoteManElement(data);
				} else {
						//mui.toast("暂无更多问题");
				}
			} else if(data.Type == 0) {
				//登录失败
				mui.toast("请登录后再进行操作");
				//login();
				return;
			} else {
				//逻辑错误				
				return;
			}
		}, function(err) {
			hideLoading();
			mui.plusReady(function(){
				if(plus.networkinfo.getCurrentType()==1||plus.networkinfo.getCurrentType()==2){
					mui.toast('网络异常，请检查网络设置!');
					showErr('没有网络连接','','#FFFFFF')
				}else{
					showErr('错误代码：'+err,'','#FFFFFF');
					hideLoading()
				}
			})
		if(!mui.os.plus){
			showErr('错误代码：'+err,'','#FFFFFF');
			hideLoading()
		}
		})
	}
}