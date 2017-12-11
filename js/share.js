// H5 plus事件处理
function plusReady(){
	updateSerivces();
}
if(window.plus){
	plusReady();
}else{
	document.addEventListener("plusready",plusReady,false);
}
var sharehrefUrl="";//地址
var sharehrefTitle="";//标题
var sharehrefDes="";//描述
var sharehrefThumbs=""//标题图
function setShareInfo(url,title,des,img){
	sharehrefUrl=url;
	sharehrefTitle=title;
	sharehrefDes=des;
	sharehrefThumbs=img;
}
/**
 * 更新分享服务
 */
function updateSerivces(){
	plus.share.getServices( function(s){
		shares={};
		for(var i in s){
			var t=s[i];
			shares[t.id]=t;
		}
	}, function(e){
		mui.toast("获取分享服务列表失败："+e.message)
	} );
}
/**
   * 分享操作
   * @param {JSON} sb 分享操作对象s.s为分享通道对象(plus.share.ShareService)
   * @param {Boolean} bh 是否分享链接
   */
function shareAction(sb,bh,cb) {
	//var waiting = showWaiting();
	if(!sb||!sb.s){
		mui.toast( "无效的分享服务！" );
		//closeWaiting(waiting);
		return;
	}
	var msg={extra:{scene:sb.x}};
	if(bh){
		msg.href=sharehrefUrl;
		if(sharehrefTitle){
			msg.title=sharehrefTitle;
		}
		if(sharehrefDes){
			msg.content=sharehrefDes;
		}
		msg.thumbs=["_www/img/60.png"];
		msg.pictures=["_www/img/60.png"];
		//closeWaiting(waiting);
	}else{
//		if(pic&&pic.realUrl){
//			msg.pictures=[pic.realUrl];
//		}
	}
	// 发送分享
	if ( sb.s.authenticated ) {
		console.log( "---已授权---" );
		shareMessage(msg,sb.s,cb);
	} else {
		console.log( "---未授权---" );
		sb.s.authorize( function(){
				shareMessage(msg,sb.s,cb);
		},function(e){
			mui.toast( "认证授权失败："+e.code+" - "+e.message );
		});
	}
}
/**
   * 发送分享消息
   * @param {JSON} msg
   * @param {plus.share.ShareService} s
   */
function shareMessage(msg,s,cb){
	//var waiting = showWaiting();
	s.send( msg, function(){
		cb(1)
		//closeWaiting(waiting);
		mui.toast( "分享到\""+s.description+"\"成功！ " );
	}, function(e){
		cb(0)
		//closeWaiting(waiting);
		mui.toast( "分享到\""+s.description+"\"失败: "+JSON.stringify(e) );
	} );
}
/**
 * 解除所有分享服务的授权
 */
function cancelAuth(){try{
	console.log( "解除授权：" );
	for ( var i in shares ) {
		var s = shares[i];
		if ( s.authenticated ) {
			console.log( "取消\""+s.description+"\"");
		}
		s.forbid();
	}
	// 取消授权后需要更新服务列表
	updateSerivces();
	//mui.toast( "操作成功！" );
	}catch(e){mui.toast(e);}
}
/**
 * 分享链接 
 * @param {Object} id 0微信朋友圈 1微信好友 2新浪微博 3QQ
 */
function shareHref(id,cb){
	var shareBts=[];
	// 更新分享列表
	var ss=shares['weixin'];
	shareBts.push({title:'微信朋友圈',s:ss,x:'WXSceneTimeline'}),
	shareBts.push({title:'微信好友',s:ss,x:'WXSceneSession'});
	ss=shares['sinaweibo'];
	ss&&shareBts.push({title:'新浪微博',s:ss});
	ss=shares['qq'];
	ss&&shareBts.push({title:'QQ',s:ss});
	cancelAuth();
	shareAction(shareBts[id],true,cb)

}