/**
 * 问答列表（主页）
 */
var pageUrl=window.location.pathname;
pageUrl=pageUrl.substring(pageUrl.lastIndexOf('/')+1,pageUrl.length);
if(pageUrl=='ask.html'){
	var ids = [];
		function login (){
			if(mui.os.wechat){
				getCode('',true)
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
				}
			})	
			}			
		}
		window.onload = function() {
			if(mui.os.plus) {
				console.log("主页显示")
				GetQuestionsByAsk(false, 0, null)
			}else{
				GetQuestionsByAsk(false, 0, null)
			}
			if(mui.os.wechat){
				var currUrl = location.href.split('#')[0];
				weChatLogin(currUrl)
			}
		}		
		var selel = document.getElementsByClassName("mui-control-item mui-active");
		mui('.mui-slider').slider();
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
						GetQuestionsByAsk(false, 3, null)
					}
					if(index == 2) {
						GetEssentialQuestionByAsk(false)
					}
					if(index == 0) {
						GetQuestionsByAsk(false, 0, 0)
					}
				}
			}
		});
		document.getElementById("setting_btn").addEventListener('tap', function() {
			var islog = getlsData('isLogin');
			if(islog == 'true') {
				var baseUrl = 'creatQuestion.html';
				var url = mui.os.plus ? baseUrl : baseUrl;
				mui.openWindow({
					url: url,
					id: 'creatQuestion.html',
					show: {
						autoShow: true
					},
					waiting: {
						options: {
							loading: {
								height: '35px'
							}
						}
					}
				})
			} else {
				mui.toast('请登录后再进行操作');
				login();
			}
		});
		mui.plusReady(function() {
			mui(".mui-table-view").on('tap', '.mui-content', function(e) {
				console.log("主页到详情页")
				e.stopPropagation();
					var questionId = this.getAttribute('id');
					var baseUrl = 'question-solved.html';
					var url = mui.os.plus ? baseUrl : baseUrl + '?questionId=' + questionId;
					var curl = shareUrl+ baseUrl+ baseUrl + '?questionId=' + questionId;
					setlsData('currUrl', curl);
					mui.openWindow({
						url: url,
						id: 'question-solved.html',
						show: {
							autoShow: true
						},
						createNew:true,
						waiting: {
							options: {
								loading: {
									height: '35px'
								}
							}
						},
						extras: {
							questionId: questionId,
							tabIndex: tabIndex,
							type: 'ask',
							currId: 'ask.html'
						}
					})
				}),
				mui(".mui-table-view").on('tap', '.tagname', function(e) {
					e.stopPropagation();
					console.log("主页到列表页")
					var tagName = this.getAttribute('id');
					var baseUrl = 'question-label-list.html';
					var url = mui.os.plus ? baseUrl : baseUrl + '?tagName=' + tagName;
					var curl = shareUrl+ baseUrl + '?tagName=' + tagName;
					setlsData('currUrl', curl);
					mui.openWindow({
						url: url,
						id: 'question-label-list.html',
						show: {
							autoShow: true
						},
						createNew:true,
						waiting: {
							options: {
								loading: {
									height: '35px'
								}
							}
						},
						extras: {
							tagName: tagName,
							currId: 'ask.html'
						}
					})
				})
		})
		if(!mui.os.plus) {
			mui(".mui-table-view").on('tap', '.mui-content', function(e) {
				e.stopPropagation();
					var questionId = this.getAttribute('id');
					var baseUrl = 'question-solved.html';
					var url = baseUrl + '?questionId=' + questionId;
					var curl = shareUrl+ baseUrl + '?questionId=' + questionId;
					setlsData('currUrl', curl);
					mui.openWindow({
						url: url,
						id: 'question-solved.html'
					});
					return false;
				}),
				mui('.mui-table-view').on('tap', '.tagname', function(e) {
					e.stopPropagation();
					var tagName = this.getAttribute('id');
					var baseUrl = 'question-label-list.html';
					var url = baseUrl + '?tagName=' + tagName;
					var curl = shareUrl+ baseUrl + '?tagName=' + tagName;
					setlsData('currUrl', curl);
					mui.openWindow({ url: url, id: 'question-label-list.html' });
				})
		}
		var pageindex = 1;
		function GetEssentialQuestionByAsk(more) {
			showLoading()
			var idName = selel[0].href.substring(selel[0].href.lastIndexOf("#") + 1, selel[0].href.length);
			var fragment = document.getElementById(idName);
			var cfragment = fragment.firstElementChild;
			var finel = cfragment.firstElementChild.querySelector('.mui-table-view');			
			if(more) {
				pageindex++;
			} else {
				finel.innerHTML = '';
				pageindex = 1;
			}
			var params = {
				pageSize: 10,
				pageIndex: pageindex
			};
			getData('Ask/GetEssentialQuestions', params, function(data) {
				var bottomTip = document.querySelectorAll('.mui-pull-bottom-tips');
				hideLoading();
				hideErr();
				if(data.Type == 1) {					
					if(data.Data.length > 0 && typeof(data.Data) == 'object') {
						hideErrForList('',idName);
						if(data.Data.length <= 5) {
							document.getElementById("item2mobile").querySelector('.mui-pull-bottom-tips').style.display = 'none';
						} else {
							document.getElementById("item2mobile").querySelector('.mui-pull-bottom-tips').style.display = 'block';														
						}
						creatNewElement(data.Data, idName);
					} else {	
						if(!more){
							var errForList=showErrForList('暂无更多精华问题','','',idName);
							if(errForList){
								fragment.appendChild(showErrForList('暂无更多精华问题','','',idName))
							}
						}
						//mui.toast(data.Data);
						//mui.toast("暂无更多精华问题");
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
					mui.toast(data.Data);
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
									GetQuestionsByAsk(false, 0, 0)
								}
								if(selel[0].id == '0') {
									GetQuestionsByAsk(false, 0, null)
								}
								if(selel[0].id == '2') {
									GetQuestionsByAsk(false, 3, null)
								}
								if(selel[0].id == '3') {
									GetEssentialQuestionByAsk(false)
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
								if(selel[0].id == '0') {
									GetQuestionsByAsk(true, 0, null)
								}
								if(selel[0].id == '1') {
									GetQuestionsByAsk(true, 0, 0)
								}
								if(selel[0].id == '2') {
									GetQuestionsByAsk(true, 3, null)
								}
								if(selel[0].id == '3') {
									GetEssentialQuestionByAsk(true)
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
		var creatNewElement = function(data, id) {
			var fragment = document.getElementById(id);
			var cfragment = fragment.firstElementChild;
			var bardiv = document.createElement('div');
			bardiv.className='jh-gray-bar'
			var finel = cfragment.firstElementChild.querySelector('.mui-table-view');			
			if(finel.lastChild == null){
				finel.appendChild(bardiv);
			}			
			var Essential;
			var Reward;
			var a1 = [];
			var b =[];
			var li;
			var bigContainer;
			for(var i = 0; i < data.length; i++) {
				span = document.createElement('span');
				var resolved = "";
				classn = data[i].IsResolved ? 'jh-green-border' : 'jh-red-border';
				text1 = data[i].IsResolved ? "已解决" : "未解决";
				resolved = '<span class=' + classn + '>' + text1 + '</span>'
				var dis = 'none';
				bigContainer = "";
				a1 = [];
				Reward = data[i].Reward == 0 ? '' : '<li class="jh-orange"><i class="fa fa-database"></i><span>' + data[i].Reward + '</span></li>';
				Essential = data[i].IsEssential == true ? '<span class="jh-red-border">' + "精华" + '</span>' : '';
				var Author;
				Author = data[i].IsAnonymous ? '<li>' + "匿名用户 " + '</li>' : '<li>' + data[i].Author + '</li>';
				if(data[i].Tags.length != 0){
					for(var j = 0; j < data[i].Tags.length; j++) {
					a1.push({TagName:data[i].Tags[j].TagName,length:data[i].Tags[j].TagName.length});
					function compare(property){
						    return function(a,b){
						        var value1 = a[property];
						        var value2 = b[property];
						        return value1 - value2;
						    }
					}
					//a1.push(data[i].Tags[j].TagName);
				}
				b = a1.sort(compare('length'))
				var lengthL = b.length ;
				var c = b.slice(0,lengthL);
				for(var r = 0; r < c.length; r++) {
					bigContainers = "";
					itemContainer = '<a  class="tagname" id=' + c[r].TagName + '><span class="label label-default" id="tagH">' + c[r].TagName+ '</span></a>'
					bigContainer += itemContainer;
				}
				}
				
				div = document.createElement('div');
				div.className = 'mui-content question-list';
				div.id = data[i].Id;
				div.innerHTML = 
					'<div class="mui-content-padded" id=' + data[i].Id + '>' +
					'<div class="subject">'+
					'                                              <p class="content" id=' + data[i].Id + '>' + 
					data[i].Subject+
					'<span class="status">'+
					resolved +
					Essential +
					'</span>'+
					'</p>'+
					'                                              </div>' +
					'                                              <div class="mui-row"> ' +
					'                                              <div class="jh-hot-label">' +
					'                                              <i class="fa fa-tags text-muted fa-padding" aria-hidden="true"></i>' +
					'<div class="jh-title">' + bigContainer + '</div>' +
					'                                              </div>  ' +
					'                                              <ul class="mui-list-inline text-muted" >' +
					Reward +
					Author +
					'                                              <li>' + data[i].DateCreated + '</li>' +
					'                                              <li>' + data[i].HitTimes + '浏览' + '</li>' +
					'                                              <li>' + data[i].AnswerCount + '回答' + '</li>' +					
					'                                              </ul>' +
					'                                              </div>' +
					'                                              </div>' +
					'                            <div class="jh-gray-bar"></div></div>'; 
			
				finel.appendChild(div);
			}
		};
		var page = 1;
		var idName = "";
		var bool;
		function GetQuestionsByAsk(more, sortBy, status) {
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
				status: status,
				sortBy: sortBy,
				pageSize: 10,
				pageIndex: page,
			};
			getData('Ask/GetQuestions', params, function(data) {
				hideLoading()
				hideErr()
				var bottomTip = document.querySelectorAll('.mui-pull-bottom-tips');
				if(data.Type == 1) {
					if(data.Data && typeof(data.Data) == 'object') {
						hideErrForList('',idName);
						if(data.Data.length <= 5) {
							document.getElementById(idName).querySelector('.mui-pull-bottom-tips').style.display = 'none';
						} else {							
							document.getElementById(idName).querySelector('.mui-pull-bottom-tips').style.display = 'block';
						}
						creatNewElement(data.Data, idName);
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
		mui.init({
			keyEventBind: {
				backbutton: false //关闭back按键监听
			},
			gestureConfig: {
				swipeBack: true //启用右滑关闭功能
			},
		});				
		function changeTabByAsk(index) {
			var gallery = mui('#sliderSegmentedControl');
			var gallerys = mui('#slider');
			gallery.scroll().gotoPage(index);
			gallerys.slider().gotoItem(index);
			if(index == 1) {
				GetQuestionsByAsk(false, 0, 0)
				mui('#refreshContainer1').scroll().scrollTo(0,0);
			}
			if(index == 2) {
				GetQuestionsByAsk(false, 3, null)
				mui('#refreshContainer2').scroll().scrollTo(0,0);
			}
			if(index == 0) {
				GetQuestionsByAsk(false, 0, null)
				mui('#refreshContainer').scroll().scrollTo(0,0);
			}
			if(index == 3) {
				GetEssentialQuestionByAsk(false)
				mui('#refreshContainer3').scroll().scrollTo(0,0);
			}
		}		
		document.getElementById("search").addEventListener('tap', function() {
			mui.openWindow({
				url: 'search.html?type=ask',
				id: 'search.html',
				waiting: {
					options: {
						loading: {
							height: '35px'
						}
					}
				},

			})
		})
}

/**
 * 创建问题
 */
if(pageUrl=='creatQuestion.html'){
		var height = document.documentElement.clientHeight || document.body.clientHeight;
		document.getElementById('detail').style.minHeight=height+'px';
		if(!mui.os.wechat) {
			mui.previewImage();
		}
		creatloadingEL();
		if(mui.os.wechat) {
			initWx();
			wx.ready(function() {
				wx.checkJsApi({
					jsApiList: ['chooseImage', 'uploadImage', 'previewImage'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
					success: function(res) {
						// 以键值对的形式返回，可用的api值true，不可用为false
						// 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
					}
				});
			});
			wx.error(function(res) {
	
			});
		}
		var commenttextarea=document.getElementById("comment-textarea");
		var selectMenu=document.getElementById("selectMenu");
		var facePop=document.getElementById("facePop");
		var bottomBarContainer = document.getElementById("bottomBarContainer");
		var bottomBar=document.getElementById("bottomBar");
		var creatBtn=document.getElementById("creat_Btn");
		var plusimgArea=document.getElementById("imgPop");
		var imgArea=document.getElementById("demo");
		var Reward = document.getElementById("Reward");
		var Rewardtext = document.getElementById("Rewardtext");
		var IsAnonymous = document.getElementById("IsAnonymous");
		var RewardId = "";
		var hasReward;
		var files=[];
		var Tags="";
		var pickdata = [];
		var picker = new mui.PopPicker();
		var classNames;
		var tagsList = []; 
		ZYFILE.url=Http_Url+'/Ask/UploadFiles';
		var imgFiles = [];
		var wxIds = [];
		var fragment = document.getElementById('alltypes');
		var icon = document.getElementById("icon");
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
				}
			})	
			}			
		}
		var deceleration = mui.os.ios ? 0.003 : 0.0009;
		mui('.mui-scroll-wrapper').scroll({
			bounce: false,
			indicators: true, //是否显示滚动条
			deceleration: deceleration
		});
		function getReward() {
			var waiting = showWaiting();			
			getDatawithToken('Ask/GetReward', {}, function(data) {
				closeWaiting(waiting);
				if(data.Type == 1) {
					if(data.Data && typeof(data.Data) == 'object') {
						if(data.Data && data.Data.length != 0) {
							hasReward = true;
							pickdata = [];
							for(var i = 0; i < data.Data.rewards.length; i++) {																
								pickdata.push({ value: i+1, text: data.Data.rewards[i].toString() })								
							}
							picker.setData(pickdata);							
						} else {
							hasReward = false
						}
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
				closeWaiting(waiting);
			})
		}
		Reward.addEventListener('tap', function() {
			getReward();
			picker.show(function(selectItems) {
				RewardId = selectItems[0].value;
				Rewardtext.innerHTML = selectItems[0].text;
			})
		})
		mui("#alltypes").on('tap', '.typeitemContainer', function(e) {			
			if(e.target.parentElement.className == "typeitem  typeItemActive"){
				e.target.parentElement.className = "typeitem"
				e.target.style.color = "#333";
				var icon = e.target.parentElement.getElementsByTagName("img")[0];
				icon.style.display = "none";
			}else{
				e.target.parentElement.className = "typeitem  typeItemActive"
				e.target.style.color = "#bf0a10";
				var icon = e.target.parentElement.getElementsByTagName("img")[0];
				icon.style.display = "inline-block";								
			}
			classNames = document.getElementsByClassName("typeitem  typeItemActive");
			if(classNames.length >= 5){	
				if(classNames.length >5){				
					e.target.parentElement.className = "typeitem"
					e.target.style.color = "#333";
					var icon = e.target.parentElement.getElementsByTagName("img")[0];
					icon.style.display = "none";
					mui.toast("您只能选择1-5个标签")
				}
				
			}
     })
		
		function changeSwith() {
			var moreType = document.getElementById("moreType");
			var detail = document.getElementById("detail");
			if(moreType.style.display == "block") {	
				detail.style.display = "block";
				creatBtn.style.display = "block";
				var tagsContainer = "";
				var tagsContainers = "";
				if(classNames == null){
				}else{
					for(var i =0;i<classNames.length;i++){
						tagsContainer = '<span id='+ classNames[i].innerText +' class="newtag">'+
							 classNames[i].innerText +	
						'<span id=' + i + ' style="font-size: 16px;" class="mui-icon mui-icon-closeempty"></span>'+
											'</span>';
						tagsContainers += tagsContainer;						
					}
				}								
				moreType.style.display = "none";
				//fragment.innerHTML = "";
				//已选择完标签
				var tags = document.getElementById("tags");
				var tags1 = document.getElementById("tags1");								
				tags1.innerHTML = tagsContainers;
			} else {
				var tagsAct = document.getElementsByClassName("newtag");
				if(tagsAct.length>0){
					detail.style.display = "none";
					moreType.style.display = "block";
					creatBtn.style.display = "none";
				}else{
					detail.style.display = "none";
				    moreType.style.display = "block";
				    creatBtn.style.display = "none";
				    creatTags();
				}				
			}
		}
		mui(".mui-content").on('tap', '.mui-icon-closeempty', function(e) {
			for(var i = 0;i<fragment.getElementsByTagName('p').length;i++){
				if(fragment.getElementsByTagName('p')[i].id == e.target.parentElement.id){
					fragment.getElementsByTagName('p')[i].style.color = "#333";
					fragment.getElementsByTagName('p')[i].parentNode.getElementsByTagName('img')[0].style.display = "none";
					fragment.getElementsByTagName('p')[i].parentNode.className = "typeitem"					
				}
			}			
			e.target.parentElement.parentElement.removeChild(e.target.parentElement);
			classNames = [];
			classNames = document.getElementsByClassName("typeitem  typeItemActive");
		})
		var creatTypes = function(data) {
			var a = [];
			var b =[];	
			var fragment = document.getElementById('alltypes');
			fragment.innerHTML ="";
			for(var j = 0; j < data.length; j++) {
				a.push({TagName:data[j].TagName,length:data[j].TagName.length});
				function compare(property){
				    return function(a,b){
				        var value1 = a[property];
				        var value2 = b[property];
				        return value1 - value2;
				    }
			}
			}
			b = a.sort(compare('length'))
			var lengthL = b.length ;
			var c = b.slice(0,lengthL);
			
			var div;
			var ii = 1;
			var dataArray = [];	
			for(var i = 0; i < c.length; i++) {
				ii++;				
				div = document.createElement('div');
				div.className = "adaption";
				div.style.display = "inline-block";
				//+ data[i].TagName.substring(0, 5)+
				//div.className = 'mui-col-xs-4';//'<div class="typeitem " id=' + ii + '>' //class='+isActive+'
				//div.style.padding = '10px';//div.innerHTML = '<div class="typeitem " id=' + ii + '>' + data[i].TagName.substring(0, 6)+ '<span class="mui-icon mui-icon-checkmarkempty"></span></div>';
				div.innerHTML = '<div  class="typeitem " ><p id='+c[i].TagName+' class="typeitemContainer">'+ c[i].TagName+ '</p><img class="checked" style="display:none;" src="../img/checked.png"/></div>';
				fragment.appendChild(div);
			}
		}
		function creatTags(){
			showLoading();
			getData('Ask/GetTags', {}, function(data) {
				hideLoading()
				if(data.Type == 1) {
					if(data.Data && typeof(data.Data) == 'object') {
							creatTypes(data.Data);
					} else {
						mui.toast(data.Data);
					}
				} else if(data.Type == 0) {
					//登录失败
					mui.toast("请登录后再进行操作");
					return;
				} else {
					//逻辑错误
					mui.toast(data.Data);
					return;
				}
			}, function(err) {
				hideLoading()
			})
		}
		
		// H5 plus事件处理
		function plusReady(){
			
		}
		if(window.plus){
			plusReady();
		}else{
			document.addEventListener('plusready', plusReady, false);
		}
		//拍照 
        function getImage() {
        	facePopover.style.display = 'none';
        	bottomBar.style.marginBottom = '0px'
        	if(mui.os.plus) {
        		getImageforCreat();
        	}else if(mui.os.wechat) {
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
						name: "uploadkey"+a,
						path: ids[i]
					});
				}
				document.getElementById("imgs").innerHTML = "";
				document.getElementById("imgs").appendChild(creatImg(imgFiles))
			}, false, true)
		} else{
        		document.getElementById("fileImage").click()
        	}
        }
		
        function galleryImgsMaximum() {
        	facePopover.style.display = 'none';
			bottomBar.style.marginBottom = '0px'
			if(mui.os.plus) {
				getImagesforCreat();
			} else if(mui.os.wechat) {
				wxChooseImg(5,function(ids){
					if(wxIds.length!=0){
						for(var i=0;i<ids.length;i++){
							wxIds.push(ids[i])
						}
					}else{
						wxIds=ids;
					}
					for(var i=0;i<ids.length;i++){
						var a = new Date().getTime();
						imgFiles.push({
							name: "uploadkey"+a,
							path: ids[i]
						});
					}
					document.getElementById("imgs").innerHTML = "";
					document.getElementById("imgs").appendChild(creatImg(imgFiles))
				},true,false)
			}else {
				document.getElementById("fileImage").click()
			}
			
		}
		/*facePop.addEventListener('tap',function(){
			document.activeElement.blur(); 
			facePopover.style.display='block';
			bottomBar.style.marginBottom='180px'
		})*/
		var left=95;
		function creatWebImg(data) {
			var fragment = document.createDocumentFragment();
			var a;
			for(var i = 0; i < data.length; i++) {
				div = document.createElement('div');
				div.className = "mui-control-item";
				div.style.width = '150px';
				div.style.height = '200px';
				div.style.paddingTop = '10px';
				div.innerHTML = '<img class="creat-img" data-preview-src="" data-preview-group="1" src="' + data[i] + '"/><img class="closeIcon creat-img-close" src="../img/close.png"/>'
				fragment.appendChild(div);
			}
			return fragment;
		}
		function creatImg(data) {
			var fragment = document.createDocumentFragment();
			var div;
			for(var i = 0; i < data.length; i++) {				
				div = document.createElement('div');
				div.id = "imgs";
				div.className = "mui-control-item";
				div.style.width='150px';
				div.style.height='200px';
				div.style.paddingTop='10px';
				div.innerHTML = '<img class="creat-img" data-preview-src="" data-preview-group="1" src="' + data[i].path + '"/><img class="closeIcon creat-img-close" src="../img/close.png" id="'+data[i].name+'"/>'
				fragment.appendChild(div);
			}
			return fragment;
		}
		if(mui.os.wechat){
			mui('#imgPop').on('tap', '.creat-img', function(e){
				wx.previewImage({
			      current:this.getAttribute('src'),
			      urls: wxIds
			    });
			})
		}		
//		mui("#imgs").on('tap','.closeIcon',function(e){
//			var currImg=e.target.parentElement.querySelector('.creat-img').src;
//			var filepaths=[];
//			mui.each(jhUpload.files,function(index,item){
//				filepaths.push(item.path);
//			}) 
//			var index=filepaths&&filepaths.indexOf(currImg);
//			files.splice(index,1);
//			document.getElementById("imgs").innerHTML=""; 
//			document.getElementById("imgs").appendChild(creatImg(files))
//		})
	mui("#imgs").on('tap', '.closeIcon', function(e) {
		var currImg = e.target.parentElement.querySelector('.creat-img').src;
		var files = jhUpload.files;
		if(!mui.os.plus&&!mui.os.wechat){
			files= zyUpload.webFiles;
		}
		if(mui.os.wechat) {
			files = imgFiles;
			var imageIds = [];
			var wxcurrImg = this.getAttribute('id');
			mui.each(files, function(index, item) {
				imageIds.push(item.name);
			})
			var index = imageIds.indexOf(wxcurrImg);
		} else if(!mui.os.plus&&!mui.os.wechat){
			var index = files && files.indexOf(currImg);
			ZYFILE.uploadFile.splice(index, 1);
		}
		else {
			var filepaths = [];
			mui.each(files, function(index, item) {
				filepaths.push(item.path);
			})
			var index = filepaths && filepaths.indexOf(currImg);
		}
		files.splice(index, 1);
		wxIds.splice(index, 1);
		document.getElementById("imgs").innerHTML = "";
		if(!mui.os.plus&&!mui.os.wechat){
			document.getElementById("imgs").appendChild(creatWebImg(files))
		}else{
			document.getElementById("imgs").appendChild(creatImg(files))
		}
		
	})
		var sectionId;
		var currid="";
		//files=[];
		window.onload = function() {
			files = [];
			//获取url中的targetId参数
			if(mui.os.plus) {
				mui.plusReady(function() {
					var self = plus.webview.currentWebview();
					//关闭等待框
					plus.nativeUI.closeWaiting();
					//显示当前页面
					mui.currentWebview.show();
				});
			} else {

			}
			if(mui.os.wechat){
				var currUrl = location.href.split('#')[0];
				weChatLogin(currUrl)
			}
		}
		commenttextarea.addEventListener('focus',function(){
			facePopover.style.display='none';
			bottomBarContainer.style.display = "block"
			bottomBar.style.marginBottom='0px'
		})
		creatBtn.addEventListener('tap',function(){
			upload()
		})
		mui.getJSON('../js/faces.json', function(data) {
		 	var facetest1 = document.getElementById("facetest1");
		 	var facetest2 = document.getElementById("facetest2");
		 	var facetest3 = document.getElementById("facetest3");
		 	var img;
		 	var data = data.Category.Emotion;
		 	for(var i = 1; i < data.length; i++) {
		 		img = document.createElement('img');
		 		img.src = '../img/Emotions/default/' + i + '.gif';
		 		img.id = data[i - 1]['-code'];
		 		img.className = 'face';
		 		if(i < 37) {
		 			facetest1.appendChild(img)
		 		}
		 		if(i > 37 && i < 74) {
		 			facetest2.appendChild(img)
		 		}
		 		if(i > 74 && i < data.length) {
		 			facetest3.appendChild(img)
		 		}
		 	}		
		 })
		 mui("#facetest1").on('tap', 'img', function(e) {
		 	var oldValue = commenttextarea.value;
		 	commenttextarea.value = oldValue + '[' + e.target.id + ']';
		 })
		 mui("#facetest2").on('tap', 'img', function(e) {
		 	var oldValue = commenttextarea.value;
		 	commenttextarea.value = oldValue + '[' + e.target.id + ']';
		 })
		 mui("#facetest3").on('tap', 'img', function(e) {
		 	var oldValue = commenttextarea.value;
		 	commenttextarea.value = oldValue + '[' + e.target.id + ']';
		 })				
		function CreateQuestion(title,body,attachmentIds,reward,tagsList,isAnonymous){
			var params = {
				Subject: title,
				Body:body,
				Tags:tagsList,
				AttachmentIds:attachmentIds,
				Reward:reward,
				IsAnonymous:isAnonymous
			};
			showLoading();
			postDatawithToken('Ask/CreateQuestion', params, function(data) {
				hideLoading();
				mui('#creat_Btn').button('reset');
				if(data.Type == 1) {
					mui.toast(data.Data);
					if(mui.os.plus) {
						var wobj = plus.webview.getWebviewById("ask.html");
						wobj.reload(true);
						setTimeout(function() { mui.back(); }, 1000)
					} else {
						mui.back();
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
				mui('#creat_Btn').button('reset');
				hideLoading();
			});
		}
		var reward="";
		var title="";
		var body="";
		var isAnonymous=false;
		document.getElementById("mySwitch").addEventListener("toggle",function(event){
             if(event.detail.isActive){
                  isAnonymous = true;
                  IsAnonymous.style.color = "#333";
             }else{
                 isAnonymous = false;
                 IsAnonymous.style.color = "#999";
             }
        })
		// 上传文件
		var tagstrs = "";
		var newListTouch = [];
		function upload(){			
			title = TrimAll(document.getElementById("title").value);
			reward = TrimAll(document.getElementById("Rewardtext").innerText);
			var tags1 = document.getElementById("tags1");
			var newtag = document.getElementsByClassName("newtag");
			for(var i = 0;i<newtag.length;i++){
				var tag = newtag[i].innerText;
				tagsList.push(tag);				
			}			
			tagstrs = tagsList.join(';')
			body=TrimAll(commenttextarea.value);
			if(tagsList==""){
				mui.toast("请选择标签分类")
				return
			}
			if(title == "") {
				mui.toast("问题标题不能为空")
				return 
			}
			/*if(body == "") {
				mui.toast("问题内容不能为空")
				return
			}*/
			if(mui.os.plus){
				//uploadU();
				filesUploadforApp('/Ask/UploadFiles',function(e){
					if(e==''){
						CreateQuestion(title,body,"",reward,tagstrs,isAnonymous);
					}else{
						CreateQuestion(title,body,e,reward,tagstrs,isAnonymous);
					}
				})
			}else{	
				var lengthList = zyUpload.webFiles.length;
				var touchArray = [];
				for(var i=0;i<lengthList;i++){
					touchArray.push(document.getElementsByClassName('creat-img')[i]);
				}
				if(touchArray.length > 0){
					appendFileTouch('/Ask/UploadFiles',0,touchArray,function(e){
						CreateQuestion(title,body,e,reward,tagstrs,isAnonymous);
					})
				}else{
					CreateQuestion(title,body,"",reward,tagstrs,isAnonymous);
				}							
			}			
		}
		function onCompletes(response){
			setTimeout(function() {hideLoading()}, 500)
			CreateQuestion(title,body,attachmentIds.join(';'),reward,tagstrs,isAnonymous);
		}
		function onFailures(){
			mui.toast('文件上传失败，请重试！');
			return
		}
	
}
/**
 * 标签的问题列表
 */
if(pageUrl=='question-label-list.html'){
		var tagName;		
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
		mui('.mui-slider').slider();
			var deceleration = mui.os.ios ? 0.003 : 0.0009;
			mui('.mui-scroll-wrapper.mui-slider-indicator.mui-segmented-control').scroll({
				scrollY: false,
				scrollX: true,
				indicators: false,
				deceleration: deceleration,
				snap: '.mui-control-item'
			});
			var tabIndex=0;
			document.querySelector('.mui-slider').addEventListener('slide', function(event) {
				tabIndex = event.detail.slideNumber;
				if(event.detail.slideNumber != 0) {
					var index = event.detail.slideNumber -1;//(index - 1)
					var item = document.getElementById("item" + index + "mobile");
					item.querySelector('.mui-pull-bottom-tips').style.display = 'none';
					if(item.querySelector('.mui-loading')) {
						if(mui.os.plus) {
				            mui.plusReady(function() {					
					            var self = plus.webview.currentWebview();
					                tagName = self.tagName;
				            });
			            } else {	
				            tagName = getUrlParam('tagName');
			            }
						if(index == 1) {
							GetQuestionByList(false,3,null,tagName)							
						}
						if(index == 2) {
							GetEssentialQuestionsByList(tagName,false)
						}
						if(index == 0){
							GetQuestionByList(false,0,0,tagName)
						}
					}
				}
			});
			document.getElementById("setting_btn").addEventListener('tap', function() {
			var islog = getlsData('isLogin');
			if(islog == 'true') {
				var baseUrl = 'creatQuestion.html';
				var url = mui.os.plus ? baseUrl : baseUrl ;
				mui.openWindow({
					url: url,
					id: 'creatQuestion.html',
					show: {
						autoShow: true
					},
					waiting: {
						options: {
							loading: {
								height: '35px'
							}
						}
					}
				})
			} else {
				mui.toast('请登录后再进行操作');
				login();
			}
		});
		var pageindex = 1;
		var slider = document.getElementById("slider");
		var split = document.getElementById("split");
		if(mui.os.plus) {
			mui.plusReady(function() {					
			var self = plus.webview.currentWebview();
			tagName = self.tagName;	
			var tagname = document.getElementById("tagname");
		    tagname.innerHTML = '<i class="fa fa-tags text-muted head-label" aria-hidden="true"style="padding-top: 1px;margin-left:-10px;display: block;float: left;"></i><p>'+tagName+'</p>';
			split.style.height = "1px";
			if(tagname.offsetHeight > 40){
				slider.style.top = (document.getElementById("split").offsetTop + 1) + 'px';
			}
			});
		} else { 
			tagName = getUrlParam('tagName');
			var tagname = document.getElementById("tagname");
			tagname.innerHTML = '<i class="fa fa-tags text-muted head-label" aria-hidden="true"style="padding-top: 1px;margin-left:-10px;display: block;float: left;"></i><p>'+tagName+'</p>';
			split.style.height = "1px";
			if(tagname.offsetHeight > 40){
				slider.style.top = (document.getElementById("split").offsetTop + 1) + 'px';
			}
		}
		
		mui.plusReady(function() {
			mui(".mui-table-view").on('tap','.mui-content',function(e){	
				console.log("列表页到详情页")
				var questionId = this.getAttribute('id');
				var baseUrl = 'question-solved.html';
				var url = mui.os.plus ? baseUrl : baseUrl + '?questionId=' + questionId;
				var curl = shareUrl+baseUrl+ '?questionId=' + questionId;
				setlsData('currUrl', curl);				
				mui.openWindow({
					url: url,
					id: 'question-solved.html',
					show: {
						autoShow: true
					},
					createNew:true,
					waiting: { 
						options: {
							loading: {
								height: '35px'
							}
						} 
					},
					extras: {
						questionId: questionId,
						tabIndex:tabIndex,
						type:'questionlist',
						currId: 'question-label-list.html'
					}
				})
			})
		})
			if(!mui.os.plus) {
				mui(".mui-table-view").on('tap', '.content', function(e) {
				var questionId = this.getAttribute('id');
				var baseUrl = 'question-solved.html';
				var url = baseUrl + '?questionId=' + questionId;
				var curl = shareUrl+baseUrl+ '?questionId=' + questionId;
				setlsData('currUrl', curl);
				mui.openWindow({
					url: url,
					id: 'question-solved.html'
				});
			    })
			}
		var creatNewElementByList = function(data, id) {
			var fragment = document.getElementById(id);
			var cfragment = fragment.firstElementChild;
			var finel = cfragment.firstElementChild.querySelector('.mui-table-view');
			var Essential;
			var Reward;			
			var a1 = [];
			var b =[];
			var li;
			var bigContainer;			
			for(var i = 0; i < data.length; i++) {
				span = document.createElement('span');
				var resolved ="";
				classn = data[i].IsResolved ? 'jh-green-border' : 'jh-red-border';
				text1 = data[i].IsResolved ? "已解决" : "未解决";
				resolved = '<span class='+classn+'>' + text1 +	'</span>'
				var dis = 'none';
				bigContainer = "";				
				a1 = [];
				Reward = data[i].Reward == 0 ? '' : '<li class="jh-orange"><i class="fa fa-database"></i><span>' + data[i].Reward + '</span></li>';
				Essential = data[i].IsEssential == true ? '<span class="jh-red-border">' + "精华" + '</span>' : '';
				var Author;
				Author = data[i].IsAnonymous ? '<li>' + "匿名用户 "+ '</li>' : '<li>' + data[i].Author  + '</li>';
				if(data[i].Tags.length != 0){
					for(var j = 0;j<data[i].Tags.length;j++){
					a1.push({TagName:data[i].Tags[j].TagName,length:data[i].Tags[j].TagName.length});
					function compare(property){
						    return function(a,b){
						        var value1 = a[property];
						        var value2 = b[property];
						        return value1 - value2;
						    }
					}
					//a1.push(data[i].Tags[j].TagName);
				}
				b = a1.sort(compare('length'))
				var lengthL = b.length ;
				var c = b.slice(0,lengthL);
				for(var r = 0; r < c.length; r++) {
					bigContainers = "";
					itemContainer = '<a  class="tagname" id=' + c[r].TagName + '><span class="label label-default" id="tagH">' + c[r].TagName+ '</span></a>'
					bigContainer += itemContainer;
				}
				}								
				div = document.createElement('div');
				div.className = 'mui-content question-list';
				div.id = data[i].Id;
				div.innerHTML = 
				'                                              <div class="mui-content-padded">' +
				'<div class="subject">'+
				'                                              <p class="content" id='+data[i].Id+'>' + data[i].Subject + 
				
				'<span class="status">'+
				                                                resolved +
				                                                Essential+
				                                                '</span>'+
				'                                              </p>' +
				'</div>'+
				'                                              <div class="mui-row"> '+
				'                                              <div class="jh-hot-label">'+
				'                                              <i class="fa fa-tags text-muted fa-padding" aria-hidden="true"></i>'+
				                                               '<div class="jh-title">'+bigContainer+'</div>'+
				                                               
				'                                              </div>  '+
				'                                              <ul class="mui-list-inline text-muted" >'+
				                                               Reward+
															   Author+
				'                                              <li>' + data[i].DateCreated + '</li>' +
				'                                              <li>' + data[i].HitTimes +'浏览' +'</li>' +
				'                                              <li>' + data[i].AnswerCount +'回答' +'</li>' +
				
				'                                              </ul>'+
				'                                              </div>'+
				'                                              </div>'+
				'                                              </div>'+
				'<div class="jh-gray-bar"></div>' 
				finel.appendChild(div); 
			}
		};
		function GetEssentialQuestionsByList(tagName,more) {
			if(mui.os.plus) {
				mui.plusReady(function() {					
					var self = plus.webview.currentWebview();
					tagName = self.tagName;
				});
			} else {	
				tagName = getUrlParam('tagName');
			}
			showLoading()
			var idName = selel[0].href.substring(selel[0].href.lastIndexOf("#") + 1, selel[0].href.length);
			var fragment = document.getElementById(idName);
			var cfragment = fragment.firstElementChild;
			var finel = cfragment.firstElementChild.querySelector('.mui-table-view');
			if(more) {
				pageindex++;
			} else {
				finel.innerHTML = '';
				pageindex = 1;
			}
			var params = {
				tagName : tagName,
				pageSize: 10,
				pageIndex: pageindex
			};
			getData('Ask/GetEssentialQuestions', params, function(data) {
				var bottomTip = document.querySelectorAll('.mui-pull-bottom-tips');
				hideLoading();
				if(data.Type == 1) {
					if(data.Data.length > 0 && typeof(data.Data) == 'object') {
						if(data.Data.length <= 5) {
							document.getElementById("item2mobile").querySelector('.mui-pull-bottom-tips').style.display = 'none';
						} else {
							document.getElementById("item2mobile").querySelector('.mui-pull-bottom-tips').style.display = 'block';														
						}
						creatNewElementByList(data.Data, idName);
					} else {
						document.getElementById("item2mobile").querySelector('.mui-pull-loading').innerHTML = data.Data;
						//mui.toast(data.Data);
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
				hideLoading();
			})
		}
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
									document.getElementById(idName).querySelector('.mui-pull-bottom-tips').style.display = 'none';
									if(mui.os.plus) {
				                		mui.plusReady(function() {					
					                		var self = plus.webview.currentWebview();
					                		tagName = self.tagName;
				                  		});
			            			} else {	
				            			tagName = getUrlParam('tagName');
			            			}
									if(selel[0].id == '1') {
										GetQuestionByList(false,0,0,tagName)
									}
									if(selel[0].id == '0'){
										GetQuestionByList(false,0,null,tagName)
									}
									if(selel[0].id == '2') {
										GetQuestionByList(false,3,null,tagName)
									}
									if(selel[0].id == '3'){
										GetEssentialQuestionsByList(tagName,false)
									}
									setTimeout(function() {
										self.endPullDownToRefresh();
									}, 1000);
								}
							},
							up: {
								callback: function() {
									var self = this;
								if(mui.os.plus) {
				                	mui.plusReady(function() {					
					                	var self = plus.webview.currentWebview();
					                	tagName = self.tagName;
				                  	});
			            		} else {	
				            		tagName = getUrlParam('tagName');
			            		}
									if(selel[0].id == '0'){
										GetQuestionByList(true,0,null,tagName)
									}
									if(selel[0].id == '1') {
										GetQuestionByList(true,0,0,tagName)
									}						
									if(selel[0].id == '2') {
										GetQuestionByList(true,3,null,tagName)
									}
									if(selel[0].id == '3'){
										GetEssentialQuestionsByList(tagName,true)
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
		//B页面onload从服务器获取列表数据； 
		window.onload = function() {
			//获取url中的targetId参数
			if(mui.os.plus) {
				mui.plusReady(function() {					
					var self = plus.webview.currentWebview();
					tagName = self.tagName;	
					console.log("列表页显示")
					GetQuestionByList(false,0,null,tagName)
					//关闭等待框                                                                                                               
					plus.nativeUI.closeWaiting();
					//显示当前页面                                                                                                              
					mui.currentWebview.show();
				});
			} else {	
				tagName = getUrlParam('tagName');
				GetQuestionByList(false,0,null,tagName)
			}	
			if(mui.os.wechat){
				var currUrl = location.href.split('#')[0];
				weChatLogin(currUrl)
			}
		}
		var ids = [];	
		var selel = document.getElementsByClassName("mui-control-item mui-active");				
		var page = 1;
		var idName = "";
		function GetQuestionByList( more,sortBy,status,tagName) {
			if(!more) {
				showLoading('', '', '#FFFFFF', '90px', '1');
			}
			var selel = document.getElementsByClassName("mui-control-item mui-active");
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
				status :status,
				sortBy : sortBy,
				tagName : tagName,
				pageSize: 10,
				pageIndex: page,							
			};
			getData('Ask/GetQuestions', params, function(data) {
				console.log(data);
				hideLoading();
				hideErr();
				var bottomTip = document.querySelectorAll('.mui-pull-bottom-tips');
				if(data.Type == 1) {
					if(data.Data && typeof(data.Data) == 'object') {
						hideErrForList('',idName);
						if(data.Data.length <= 5) {
							document.getElementById(idName).querySelector('.mui-pull-bottom-tips').style.display = 'none';
						} else {
							document.getElementById(idName).querySelector('.mui-pull-bottom-tips').style.display = 'block';
						}
						creatNewElementByList(data.Data, idName);
					} else {
						if(!more){
							var errForList=showErrForList(data.Data,'','90px',idName);
							if(errForList){
								fragment.appendChild(showErrForList(data.Data,'','90px',idName))
							}
						}
						//mui.toast(data.Data);
					}
				} else if(data.Type == 0) {
					//登录失败
					mui.toast("请登录后再进行操作");
					login();
					return;
				} else {
					//逻辑错误	
					var errForList=showErrForList(data.Data,'','90px',idName);
					if(errForList){
						fragment.appendChild(showErrForList(data.Data,'','90px',idName))
					}
					mui.toast(data.Data);					
					return;
				}
			}, function(err) {
				hideLoading()
				mui.plusReady(function(){
					if(plus.networkinfo.getCurrentType()==1||plus.networkinfo.getCurrentType()==2){
							mui.toast('网络异常，请检查网络设置!');
							showErr('没有网络连接','','#FFFFFF','90px')
						}else{
							showErr('错误代码：'+err,'','#FFFFFF','90px');
							hideLoading()
						}
				})
				if(!mui.os.plus){
					showErr('错误代码：'+err,'','#FFFFFF','90px');
					hideLoading()
				}
			})
		}
		function changeTabByList(index){			
			var gallery = mui('#sliderSegmentedControl');
			var gallerys = mui('#slider');
			gallery.scroll().gotoPage(index);
			gallerys.slider().gotoItem(index);
				if(index == 1) {
					GetQuestionByList(false,0,0,tagName)
					mui('#refreshContainer1').scroll().scrollTo(0,0);
				}
				if(index == 2) {
					GetQuestionByList(false,3,null,tagName)
					mui('#refreshContainer2').scroll().scrollTo(0,0);
				}
				if(index == 0){		
					GetQuestionByList(false,0,null,tagName)					
					mui('#refreshContainer').scroll().scrollTo(0,0);
				}
				if(index == 3){
					GetEssentialQuestionsByList(tagName,false)
					mui('#refreshContainer3').scroll().scrollTo(0,0);
				}		
		}		
		mui.init({			
			gestureConfig: {
				swipeBack: true //启用右滑关闭功能
			},
		});
	
}
/**
 * 问题详情
 */
var questionSolved={
	init:function(){
			if(!mui.os.plus){
			creatBanner();
		}
 		window._bd_share_config={"common":{"bdSnsKey":{},"bdText":"","bdMini":"2","bdMiniList":false,"bdPic":"","bdStyle":"0","bdSize":"32"},"share":{},"image":{"viewList":["qzone","tsina","weixin"],"viewText":"分享到：","viewSize":"32"},"selectShare":{"bdContainerClass":null,"bdSelectMiniList":["qzone","tsina","weixin"]}};with(document)0[(getElementsByTagName('head')[0]||body).appendChild(createElement('script')).src='http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion='+~(-new Date()/36e5)];
    	var question_detail=document.getElementById("question_detail");
    	var newsTitle = document.getElementById("newsTitle");
		var attachments=document.getElementById("attachments");
		var list = document.getElementById("list");
		var bestAnswer = document.getElementById("bestAnswer");
		var sirting = document.getElementById("sirting");
		var contents = document.getElementById("contents");
		var slider = document.getElementById("slider");
		var sliderSegmentedControl = document.getElementById("sliderSegmentedControl");
		var SectionType = document.getElementById("SectionType");
		var selel = document.getElementsByClassName("mui-control-item mui-active");
		var commentAttach = document.getElementById("commentAttach");
		var favorQuestions = document.getElementById("favorQuestions")
		var isFavorited=false;
		var questionOpt=document.getElementById("questionOpt");
		var EssentialOperation = document.getElementById("EssentialOperation");
		var DeleteQuestion=document.getElementById("DeleteQuestion");
		var solved = document.getElementById("solved");
		var answered = document.getElementById("answered");
		var disapprovedcount = document.getElementById("disapprovedcount");
		var noAnswer = document.getElementById("noAnswer");
		var noAnswerAgree = document.getElementById("noAnswerAgree");
		var solvedImg = document.getElementById("solvedImg");
		var shares = document.getElementById('shares');
		var can = document.getElementById("can");
		var editAnswer = document.getElementById("editAnswer");
		var approvedCount;
		var commonCount;
		var IsEssential;
		var IsSupport;
		var IsSupportBest;
		var creatSupport;
		var userid;
		var islog = getlsData('isLogin');
    	questionOpt.style.display=(islog == 'true')?'block':'none';
    	if(!mui.os.plus){
    		shares.style.display = 'none';
    		can.style.width = "50%";
    		editAnswer.style.width = "50%";
    	}
		if(!mui.os.wechat){
			mui.previewImage();
		}
		if(mui.os.wechat){
			initWx();
			wx.ready(function(){
			 	wx.checkJsApi({
				    jsApiList: ['previewImage'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
				    success: function(res) {
				        // 以键值对的形式返回，可用的api值true，不可用为false
				        // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
				    }
				});
			});
			wx.error(function(res){
			    
			});
		}
		favorQuestionsText && favorQuestionsText.addEventListener('tap', function() {
			console.log(isFavorited)
			var islog = getlsData('isLogin');
			if(islog == 'true') {
				QuestionFavoriteOperation(questionId)
			} else {
				mui.toast('请登录后再进行操作');
				login();
			}	
		})
		function QuestionFavoriteOperation(id) {
			var path = 'Ask/FavoriteQuestion?questionId=';
			//var waiting = showWaiting();
			postDatawithToken(path + id, {}, function(data) {
				//closeWaiting(waiting);
				if(data.Type == 1) {
					favorQuestion(!isFavorited);
					isFavorited = !isFavorited;
					mui.toast(data.Data);
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
				//closeWaiting(waiting);
			})
		}
		
		function favorQuestion(status) {
			if(!status) {
				favorQuestionsText.innerHTML ='<i id="favorQuestions" class="mui-icon mui-icon-extra mui-icon-extra-heart" aria-hidden="true"></i>&nbsp;&nbsp收藏';
				//favorQuestionsText.style.marginRight = "-85px";
				//favorQuestions.className = 'mui-icon mui-icon-extra mui-icon-extra-heart-filled';//mui-icon mui-icon-extra mui-icon-extra-heart-filled comment_menu
			} else {
				favorQuestionsText.innerHTML ='<i id="favorQuestions" class="mui-icon mui-icon-extra mui-icon-extra-heart-filled" aria-hidden="true"></i>&nbsp;&nbsp已收藏';
				//favorQuestionsText.style.marginRight = "-71px";
				//favorQuestions.className = 'mui-icon mui-icon-extra mui-icon-extra-heart';//mui-icon mui-icon-extra mui-icon-extra-heart comment_menu
			}
		}
		var wximgEl = document.createElement("div");
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
				}
			})	
			}			
		}
		mui('.mui-slider').slider();
		var deceleration = mui.os.ios ? 0.003 : 0.0009;
		if(mui.os.wechat){
			mui("#question_detail").on('tap', 'img', function(e) {
				var imgUrl=e.detail.target.currentSrc;
				var imgs=[];
				var imgels=wximgEl.querySelectorAll('img');
				for (var i=0;i<imgels.length;i++) {
					imgs.push(imgels[i].src)
				}
				wx.previewImage({
			      current:imgUrl,
			      urls: imgs
			    });
			}),
			mui("#slider").on('tap', '#comment_content', function(e) {
				var imgUrl=this.getElementsByTagName('img')[0].src;
				var imgs=[];
				var imgels=wximgEl.querySelectorAll('img');
				for (var i=0;i<imgels.length;i++) {
					imgs.push(imgels[i].src)
				}
				wx.previewImage({
			      current:imgUrl,
			      urls: imgs
			    });
			})
		}
       mui.init({
			beforeback: function() {
				if(mui.os.plus) {
					console.log("开始回退")
					if(beforetype != null){
						switch(beforetype){
							case "user":
								var list = plus.webview.getWebviewById('userQuestions.html');
								var self = plus.webview.currentWebview();
					    		item = self.questionId;
								list.evalJS("changeTab("+tabIndex+ ","+ item + ")")
							break;
							case "ask":
								var list = plus.webview.getWebviewById('ask.html');
								var self = plus.webview.currentWebview();
					    		item = self.questionId;
								list.evalJS("changeTabByAsk("+tabIndex+ ","+ item + ")")
							break;
							case "questionlist":
								var list =plus.webview.getWebviewById('question-label-list.html');
								var self = plus.webview.currentWebview();
					    		item = self.questionId;
								list.evalJS("changeTabByList("+tabIndex+ ","+ item + ")")
							break;
							default :
							break;
						}
							
					}else{
						return true;
					}					
				} else {					
					return true;
				}
			}
		});		
		var beforetype ;
		var tabIndex=0;
		//B页面onload从服务器获取列表数据；
		window.onload = function() {  
			//获取url中的targetId参数
			if(mui.os.plus) {
				mui.plusReady(function() {
					var self = plus.webview.currentWebview();
					questionId = self.questionId;
					console.log("显示详情页")
					beforetype = self.type;
					tabIndex=self.tabIndex;
					var muibottom = document.getElementsByClassName("mui-pull-bottom-tips");
					if(muibottom){
						muibottom[0].style.display = "none";
					}
					getDetail(questionId)
					approved(questionId)
					//关闭等待框
					plus.nativeUI.closeWaiting();
					//显示当前页面
					mui.currentWebview.show();
				});
			} else {
				questionId = getUrlParam('questionId');	
				var muibottom = document.getElementsByClassName("mui-pull-bottom-tips");
				if(muibottom){
					muibottom[0].style.display = "none";
				}
				getDetail(questionId);
				approved(questionId)				
			}	
			if(!mui.os.plus){
				initOpenApp('question-solved',questionId)
			}
			if(mui.os.wechat){
				var currUrl = location.href.split('#')[0];
				weChatLogin(currUrl)
			}
		}		
		document.querySelector('.mui-slider').addEventListener('slide', function(event) {
			if(event.detail.slideNumber != 0){	
				approved(questionId)
				GetQuestion(questionId,false,1);
			}else{				
				var table = document.getElementsByClassName("mui-table-view");
				table[0].innerHTML = "";
				approved(questionId)
				getComment(questionId,false);
			}
		})
		mui('#refreshContainer').scroll();
		function upFresh(){
			setTimeout(function() {
				mui('#refreshContainer').pullRefresh().endPullupToRefresh(); //refresh completed
			}, 1500);
		}	
		mui('.mui-slider').slider();
		var deceleration = mui.os.ios ? 0.003 : 0.0009;
		mui('.mui-scroll-wrapper.mui-slider-indicator.mui-segmented-control').scroll({
			scrollY: false,
			scrollX: true,
			indicators: false,
			deceleration: deceleration,
			snap: '.mui-control-item'
		});
		function Manager(){
			postDatawithToken('Ask/ApiIsAskManager', {},function(data) {
				if(data.Type == 1) {
					if(data.Data == false){
						questionOpt.style.display = "none";
					}else{
						questionOpt.style.display = "block";
					}
				} else if(data.Type == 0) {		
					questionOpt.style.display = "none";
					return;
				} else {
					//逻辑错误
					mui.toast(data.Data);
					questionOpt.style.display = "none";
					document.getElementById("comment-textarea").blur();
					return;
				}
			}, function(err) {

			})
		}
		questionOpt.addEventListener('tap',function(){
			var islog = getlsData('isLogin');
			if(islog == 'true') {
				mui('#popoverQuestion').popover('toggle');
			} else {
				mui.toast('请登录后再进行操作');
				login();				
			}			
		})				
		/**
		 * 构建回答弹出窗
		 */
		function creatQuestionPop() {
			var div = document.createElement('div');
			div.id = 'popView_Question';
			div.className = 'box mui-popover mui-popover-action mui-popover-bottom';
			div.innerHTML = '<div class="pop_view">' +
				'	<textarea rows="5" autofocus="autofocus" name="textarea" placeholder="输入回答" id="question-textarea" autofocus="autofocus"></textarea>' +
				'	<div class="mui-text-center" style="margin-top:-10px;">' +
				'		<button id="cancelQues" class="mui-btn" style="margin-right: 20px;">取消</button>' +
				'		<button id="sendQues" class="mui-btn mui-btn-primary" style="margin-left: 20px;">发送</button>' +
				'	</div>' +
				'</div>';
			bigContainer.appendChild(div);
		}
        creatQuestionPop();
        function submitQuestion(id) {
        	var commentText = document.getElementById("question-textarea");
			var comBody = TrimAll(commentText.value);
			if(comBody.length == 0) {
				mui.toast('回答内容不能为空！');
				return;
			}
			var params = {
				QuestionId: id,
				Body: comBody
			}
			CreateQuestion(params)
		}
        function CreateQuestion(params) {
			//showLoading()
			postDatawithToken('Ask/CreateAnswer', params, function(data) {
				//hideLoading();
				document.getElementById("comment-textarea").value='';
				if(data.Type == 1) {
					ii++;											
					switch(type) {
						case 0:
						var idName = selel[0].href.substring(selel[0].href.lastIndexOf("#") + 1, selel[0].href.length);
						var fragment = document.getElementById(idName);
						var cfragment = fragment.firstElementChild;
						if(cfragment.parentElement.id == "item1mobile"){
							cfragment.innerHTML ="";
							approved(questionId)
							GetQuestion(data.Data.QuestionId,false,1);
						}else{
							cfragment.innerHTML ="";
							approved(questionId)
							getComment(data.Data.QuestionId,false);
						}						
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
				//hideLoading();
			})
		}
        var editQuestion = document.getElementById("editQuestion");		
		editQuestion && editQuestion.addEventListener('tap', function() {
			var islog = getlsData('isLogin');
			var canAnswer = TrimAll(editQuestion.innerText);
			if(canAnswer =="已有最佳回答"){
				mui.toast("已有最佳回答");
			}else{
				if(islog == 'true'&& canAnswer =="回答" ) {
				mui('#popView_Question').popover('toggle');
			} else {
				var info = islog == 'true' ? "您已经回答过该问题" : "请登录后再进行操作";
				mui.toast(info);
				if(info == "请登录后再进行操作" ){
					login();
				}
			}
			}			
		})
        var cancelQues = document.getElementById("cancelQues");
		cancelQues && cancelQues.addEventListener('tap', function() {
			mui('#popView_Question').popover('toggle');
		})
		var sendQues = document.getElementById("sendQues");
		sendQues && sendQues.addEventListener('tap', function() {	
			if(mui.os.plus) {
				mui.plusReady(function() {
					var self = plus.webview.currentWebview();
					questionId = self.questionId;
				});
			} else {	
				questionId = getUrlParam('questionId');
			}
			var islog = getlsData('isLogin');
			if(islog == 'true'){
				slider.style.display = "block";
				var answercount = document.getElementById("answercount");
				var count = allCount + 1;
				answercount.innerText = count+"条回答";
				allCount = allCount+1;	
				submitQuestion(questionId);			
				mui('#popView_Question').popover('toggle');
				editQuestion.innerHTML = '<i class="fa fa-edit" aria-hidden="true"></i>&nbsp;&nbsp已回答';
				//editQuestion.style.marginLeft = "-43px";
				mui.toast("回答成功")						
				var answered = document.getElementById("answered");
				answered.className = "mui-list-unstyled jh-dropdown-list jh-label jh-label-solved ";
			}else{
				mui.toast("请登录后再进行操作");
			    login();
			}			
		})
		function essentialOperation(id,IsEssential) {
			//showLoading();
			if(IsEssential == false){
				var isEssential = true;
			}else{
				var isEssential = false;
			}			
			var path = 'Ask/SetEssential?questionId=' + id + '&' +'isEssential='+isEssential;			
			postDatawithToken(path, {}, function(data) {
				//hideLoading();
				if(data.Type == 1) {
					mui.toast(data.Data);
					if(mui.os.plus) {
						mui('#popoverQuestion').popover('hide');
					if(beforetype == 'ask'){
						var list = plus.webview.getWebviewById('ask.html');
						console.log("回主页")
						list.evalJS("changeTabByAsk("+tabIndex+")")
					}else{
						var list =plus.webview.getWebviewById('question-label-list.html');
						console.log("回列表页")
						list.evalJS("changeTabByList("+tabIndex+")")
					}
					
					setTimeout(function() { mui.back(); }, 500)
					} else {
						mui.back();
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
				//hideLoading();
			})
		}
		function deleteQuestion(id) {
			//showLoading();						
			var path = 'Ask/DeleteQuestion?questionId=' + id;			
			postDatawithToken('Ask/DeleteQuestion?questionId=' + id, {}, function(data) {
				//hideLoading();				
				if(data.Type == 1) {
					mui.toast(data.Data);
					if(mui.os.plus) {
						mui('#popoverQuestion').popover('hide');
					if(beforetype == 'ask'){
						var list = plus.webview.getWebviewById('ask.html');
						console.log("回主页")
						list.evalJS("changeTabByAsk("+tabIndex+")")
					}else{
						var list =plus.webview.getWebviewById('question-label-list.html');
						console.log("回列表页")
						list.evalJS("changeTabByList("+tabIndex+")")
					}
					
						setTimeout(function() { mui.back(); }, 500)
					} else {
						mui.back();
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
				//hideLoading();
			})
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
		var creatSupport = function (SupportCount,data,IsSupport,id){
			if(typeof data =='string'){				
				VoteUsers = data + "等";
			}else{
				var VoteUsers = creatVoteUsers(data);
				VoteUsersAgree = creatVoteUsers(data);
			}
			VoteUsers = VoteUsers.length > 0 ? VoteUsers : "0人";
			if(IsSupport == true){
				var support = '<div id='+IsSupport+' class="jh-agree-color"style="border: 1px solid #BF0A10;"><i id="agree" class="fa fa-thumbs-up jh-agree-color"></i></div>';
			}else{
				var support ='<div id='+IsSupport+'><i id="agree" class="fa fa-thumbs-up"></i></div>';
			}
			SupportCount = SupportCount >3 ? SupportCount : "";
			var ren = SupportCount >3 ? "人" : "";
			var id = id.toString();
			var ids = id+'s';
			var addagree = document.getElementById(ids);
			var div ;
			div = document.createElement('div');
			div.className = "jh-agree";
			div.id = id;
			div.innerHTML = support+
				            '<div>'+ VoteUsers + SupportCount +ren+ "赞同该回答 " +'</div>';
				            addagree.appendChild(div);				            						
		};
		var creatSupport1 = function (SupportCount,data,IsSupport,id){
			if(typeof data =='string'){				
				VoteUsers = data + "等";
			}else{
				var VoteUsers = creatVoteUsers(data);
				VoteUsersAgree = creatVoteUsers(data);
			}
			VoteUsers = VoteUsers.length > 0 ? VoteUsers : "0人";
			if(IsSupport == true){
				var support = '<div id='+IsSupport+' class="jh-agree-color"style="border: 1px solid #BF0A10;"><i id="agree" class="fa fa-thumbs-up jh-agree-color"></i></div>';
			}else{
				var support ='<div id='+IsSupport+'><i id="agree" class="fa fa-thumbs-up"></i></div>';
			}	
			SupportCount = SupportCount >3 ? SupportCount : "";
			var ren = SupportCount >3 ? "人" : "";
			var id = id.toString();
			var ids = id+'s';
			var idName = selel[0].href.substring(selel[0].href.lastIndexOf("#") + 1, selel[0].href.length);
			var allEls=document.getElementById(idName).getElementsByTagName('div');
			var newArr=[];
			var div ;
			div = document.createElement('div');
			div.className = "jh-agree";
			div.id = id;
			div.innerHTML = support+
				            '<div>'+ VoteUsers + SupportCount +ren+ "赞同该回答 " +'</div>';
			for (var i=0;i<allEls.length;i++) {
				if(allEls[i].getAttribute('id')!=null){
					if(ids==allEls[i].getAttribute('id')){
						newArr.push(allEls[i])
					}
				}
			}
			newArr[0].innerHTML = "";
			newArr[0].appendChild(div);				            						
		};
		var creatSupportBest = function (SupportCount,data,IsSupportBest,id){
			if(typeof data =='string'){
				VoteUsersBest = data + "等";
			}else{
				var VoteUsersBest = creatVoteUsers(data);
			}
			VoteUsersBest = VoteUsersBest.length > 0 ? VoteUsersBest : "0人";
			if(IsSupportBest == true){
				var support = '<div class="jh-agree-color"style="border: 1px solid #BF0A10;"><i id="agreeBest" class="fa fa-thumbs-up jh-agree-color"></i></div>';
			}else{
				var support ='<div><i id="agreeBest" class="fa fa-thumbs-up"></i></div>';
			}	
			SupportCount = SupportCount >3 ? SupportCount : "";
			var ren = SupportCount >3 ? "人" : "";
			var addagreeBest = document.getElementById("addagreeBest");
			var div ;
			div = document.createElement('div');
			div.className = "jh-agree";
			div.id = id;
			div.innerHTML = support+
							'<div>'+ VoteUsersBest + SupportCount +ren+ "赞同该回答 " +'</div>';
				            addagreeBest.appendChild(div);				            						
		};
		var SupportCountAgree;
		var VoteUsersAgree;
		var createCommentItem = function(data, id) {//回答列表			
			var fragment = document.getElementById(id);
			var cfragment = fragment.firstElementChild;						
			var li;	
			var CommentAttach;
			var CanSetBest;
			var CanDelete;
			var islog = getlsData('isLogin');
			console.log(data)
			for(var i = 0; i < data.length; i++) {
				SupportCountAgree = data[i].SupportCount;
				var VoteUsers = data[i].VoteUsers;
				IsSupport = data[i].IsSupport;				
				if(data[i].Attachments&&data[i].Attachments.length != 0 ){
					CommentAttach = createCommentAttach(data[i]);					
				}else{
					CommentAttach = ''
				}
				if(data[i].IsSupport == true){
					var support = '<div class="jh-agree-color"style="border: 1px solid #BF0A10;"id='+ data[i].Id +'><i id="agree" class="fa fa-thumbs-up jh-agree-color"></i></div>';
				}else{
					var support ='<div><i id="agree" class="fa fa-thumbs-up"></i></div>';
				}
				if(data[i].Avatar.length > 0){
					var Avatar = '<img class="creator_img_comment " style="height: 32px;" id='+data[i].UserId+' src='+ getImgUrl(data[i].Avatar) +'>';//src="../img/avatar-mini.png"
				}else{
					var Avatar = '<img class="creator_img_comment " style="height: 32px;" id='+data[i].UserId+' src="../img/avatar.jpg" />';
				}
				if(islog == 'true' && data[i].CanSetBest == true){
					CanSetBest = '<h5 class="comment_top_right fav"  id='+ data[i].Id +'>'+"设为最佳回答"+'</h5>';
				}else{
					CanSetBest = "";
				}
				if(islog == 'true' && data[i].CanDeleteOrEdit == true){
					CanDelete = '<h5 class="comment_top_right deleteAnswer"  id='+ data[i].Id +'>'+"删除"+'</h5>';
				}else{
					CanDelete = "";
				}
				var VoteUsers = creatVoteUsers(data[i].VoteUsers);
				VoteUsers = VoteUsers.length>0 ? VoteUsers + "等" : '';
				li = document.createElement('li');
				li.id = "queCommentList";
				var id = data[i].Id;
				var ids = id.toString();
				var finalid = ids+'s';
				li.className = 'jh-news-list ';	
				li.innerHTML = '<div class="comment_body">'+
				                '<div class="comment_img">'+
				                Avatar+
				                '<h5 class="comment_top_left">'+data[i].Author+'</h5>'+
				                CanDelete+
				                CanSetBest+
				                '</div>'+
				                '<div class="comment_content" id="comment_content">'+
				                '<p class="imageTap">'+getBodyImgUrl(data[i].Body)+'</p>'+'</div>'+
				                '</div>'+
				                CommentAttach +
				                '<div id='+ finalid +'></div>'+		
				                '<ul class="mui-list-inline text-muted" >'+
				                '<li>'+data[i].DateCreated+'</li>'+
				                '<li></li>'+
				                '<li></li>'+
				                '<li class="commentslist" style="margin-right:-8px;" id='+ data[i].Id +'>'+data[i].CommentCount+"条评论"+'</li>'+
				                '</ul>'			
				cfragment.appendChild(li);
			}
		};
		mui(".mui-table-view").on('tap', '.fav', function(e) {
    		var answerId = e.target.id;
			var islog = getlsData('isLogin');
			if(islog == 'true') {
				postDatawithToken('Ask/SetBestAnswer?answerId=' + answerId, {}, function(data) {
				//hideLoading();				
				var list = document.getElementsByClassName("mui-table-view");
				if(data.Type == 1) {
					if(mui.os.plus) {
						mui('#popover').popover('hide');
						var list =plus.webview.getWebviewById('question-solved.html');
						console.log("重新刷新详情页")
						list.reload(true);
						mui.toast(data.Data);
					} else {
						mui.back();
						mui.toast(data.Data);
					}
					mui.toast("设为最佳回答成功");
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
				//hideLoading();
			})
			}else{
				mui.toast('请登录后再进行操作');
				login();
			}		
		})
		mui("#slider").on('tap', '.deleteAnswer', function(e) {
    		var answerId = e.target.id;
			var islog = getlsData('isLogin');
			if(islog == 'true') {
				mui('#popover').popover('toggle');
				var btnArray = ['取消', '确定'];
				mui.confirm('确认删除？', '回答', btnArray, function(e) {
					if(e.index == 1) {
						postDatawithToken('Ask/DeleteAnswer?answerId=' + answerId, {}, function(data) {
						//hideLoading();						
						if(data.Type == 1) {
							if(mui.os.plus) {
							mui('#popover').popover('hide');
							var list =plus.webview.getWebviewById('question-solved.html');
							console.log("重新刷新详情页")
						    list.reload(true);
						    mui.toast(data.Data);
						} else {
							mui.back();
							mui.toast(data.Data);
						}
							mui.toast(data.Data);
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
							//hideLoading();
						})											
					}else{
						mui('#popover').popover('hide');
					}
				});
				
			}else{
				mui.toast('请登录后再进行操作');
				login();
			}		
		})
		mui(".mui-table-view").on('tap', '#agree', function(e) {//点赞
    		var answerId = e.target.parentElement.parentElement.id;  		
    		var isSupport=e.target.parentElement.getAttribute('id');
				postDatawithToken('Ask/AttitudeAnswer?answerId=' + answerId, {}, function(data) {
				//hideLoading();				
				if(data.Type == 1) {										
					if(e.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.id == "item1mobile"){						
						creatSupport1(data.Data.SupportCount,data.Data.VoteUsers,data.Data.IsSupport,answerId);
						GetQuestion(questionId,false,1)
					}else{
						document.getElementById(e.target.parentElement.parentElement.parentElement.id).innerHTML = "";
						creatSupport(data.Data.SupportCount,data.Data.VoteUsers,data.Data.IsSupport,answerId);
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
				//hideLoading();
			})		
		})
		mui(".jh-best-answer ").on('tap', '#agreeBest', function(e) {
    		var answerId = e.target.parentElement.parentElement.id;//IsSupport
			var islog = getlsData('isLogin');
			if(islog == 'true') {
				postDatawithToken('Ask/AttitudeAnswer?answerId=' + answerId, {}, function(data) {
				//hideLoading();				
				var VoteUsersBest;
				if(data.Type == 1) {
					document.getElementById(e.target.parentElement.parentElement.parentElement.id).innerHTML = "";
					creatSupportBest(data.Data.SupportCount,data.Data.VoteUsers,data.Data.IsSupport,answerId);
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
				//hideLoading();
			})
			}else{
				mui.toast('请登录后再进行操作');
				login();
			}		
		})
		var creatAttachment = function(data) {
			var fragment = document.createDocumentFragment();
			var div;
			var Attachmentlength = data != null  ?  data.length  :  0;			
			for(var i = 0; i < data.length; i++) {
				var filename=data[i].FriendlyFileName;
				var type=filename.substring(filename.lastIndexOf('.')+1);
				var typeIcon='';
				var downloadUrl='';
				switch(type) {
					case "wps":
					case "doc":
					case "docx":
						typeIcon = '<span class=" fa fa-file-word-o tn-blue-color"></span>';
						break;
					case "pps":
					case "pptx":
					case "ppt":
						typeIcon = '<span class="fa  fa-file-powerpoint-o tn-yellow-color"></span>';
						break;
					case "xls":
					case "xlsx":
						typeIcon = '<span class="fa  fa-file-excel-o tn-green-color"></span>';
						break;
					case "pdf":
						typeIcon = '<span class="fa  fa-file-pdf-o tn-green-color"></span>';
						break;
					case "txt":
						typeIcon = '<span class="fa  fa-file-text-o tn-green-color"></span>';
						break;
					case "jpg":
					case "png":
					case "bmp":
					case "gif":
						typeIcon = '<span class="fa  fa-file-image-o tn-green-color"></span>';
						break;
					case "flv":
					case "rmvb":
					case "mp4":
					case "3gp":
					case "mpeg":
					case "wmv":
					case "mov":
					case "avi":
					case "asf":
						typeIcon = '<span class="fa  fa-file-video-o tn-blue-color"></span>';
						break;
					case "zip":
					case "rar":
						typeIcon = '<span class="fa  fa-file-zip-o tn-red-color"></span>';
						break;
					case "mp3":
					case "wav":
					case "rm":
						typeIcon = '<span class="fa  fa-file-audio-o tn-red-color"></span>';
						break;
					default:
						typeIcon = '<span class="fa  fa-file-o tn-black-color"></span>'
						break;
				}
				div = document.createElement('div');
				div.className='mui-row';
				div.innerHTML = '<div class="mui-col-xs-1">'+
					''+typeIcon+''+
					'</div>'+
					'<div class="mui-col-xs-7 mui-ellipsis">'+data[i].FriendlyFileName.substring(0,15)+'</div>'+
					'<div class="mui-col-xs-2 text-muted mui-text-right">'+data[i].Size+'</div>'+
					'<div class="mui-col-xs-2 mui-text-right">'+
						'<a id='+data[i].Url+' title='+data[i].FriendlyFileName+'>下载</a>'+
					'</div>';
				fragment.appendChild(div);
			}
			return fragment;
		};
		mui("#attachments").on('tap', 'a', function(e) {
			if(mui.os.plus){
				startDownloadTask(this.getAttribute('id'))
			}else{
				download(this.getAttribute('id'),this.getAttribute('title'),location.href.split('#')[0])
			}
		})
		mui("#bestAnswer").on('tap', '.commentupload', function(e) {
			if(mui.os.plus){
				startDownloadTask(this.firstChild.getAttribute('id'))
			}else{
				download(this.firstChild.getAttribute('id'),this.firstChild.getAttribute('title'),location.href.split('#')[0])
			}
		})
		mui("#sliderGroup").on('tap', '.commentupload', function(e) {
			if(mui.os.plus){
				startDownloadTask(this.firstChild.getAttribute('id'))
			}else{
				download(this.firstChild.getAttribute('id'),this.firstChild.getAttribute('title'),location.href.split('#')[0])
			}
		})
		var creatVoteUsers = function(data){
        	var username=[];       	
        	var VoteUserslength = data != null  ?  data.length  :  0;
        	var length = VoteUserslength>3 ? 3 : VoteUserslength;
        	for(var i = 0;i<length;i++){
        		username.push(data[i].UserName);
        	}       	
        	username.join('、');
        	if(VoteUserslength>3){
        		username.push("等");
        	}else{        		
        	}
        	return username
        };
		var creatBest = function(data,commentcount){						
			var VoteUsers = creatVoteUsers(data.VoteUsers);	
			VoteUsers = VoteUsers.length>0 ? VoteUsers + "等" : '';
			var CommentCount = data.CommentCount > 0  ? commentcount : '';
			if(data.Attachments.length != 0 ){
				CommentAttach = createCommentAttach(data);					
			}else{
				CommentAttach = ''
			}
			if(data.Avatar.length > 0){
				var Avatar = '<img class="creator_img_comment " style="height: 32px;" id='+data.UserId+' src='+ getImgUrl(data.Avatar) +'>';
			}else{
				var Avatar = '<img class="creator_img_comment " style="height: 32px;" id='+data.UserId+' src="../img/avatar-mini.png"/>';
			}
			var bestAnswer = document.getElementById("bestAnswer");//src="../img/avatar-mini.png"  "李凯凯、李凯凯、李凯凯、李凯凯等68人赞同该回答" 
			bestAnswer.style.display = 'block';	
			bestAnswer.innerHTML = '<div class="jh-gray-bar"></div>'+
									'<div class="comment_body">'+
			                       '<div class="comment_img">'+
			                       Avatar+
			                       '<h5 class="comment_top_left" >'+ data.Author+'</h5>'+
			                       '<h5 class="comment_top_right-solved comment_top_right"style="margin-right:7px;">最佳回答</h5>'+	
			                       '</div>'+
			                       '<div class="comment_content">'+			    		           			    		           
					               '<p>'+data.Body+'</p>'+'</div>'+				                   
			    	               '</div>'+CommentAttach+	
			    	               '<div id="addagreeBest"></div>'+	                               
	                               '<ul class="mui-list-inline text-muted" >'+
					               '<li>'+data.DateCreated+'</li>'+
					               '<li></li>'+
					               '<li></li>'+
					               commentcount+				
		                           '</ul>'			                           
                                   return bestAnswer;
			
		};	
		var allCount;			
		mui(".jh-detail-content").on('tap', '.creator_img_comment', function(e) {
			var userid = this.getAttribute('id');
			var baseUrl = 'userHomepage.html';
			var url = baseUrl + '?userId=' + userid;
			mui.openWindow({
				url: url,
				id: 'userHomepage.html',
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
					userId: userid
				}
			})
		})
		mui(".jh-detail-content").on('tap', '.authorIdTap', function(e) {
			var userid = this.getAttribute('id');
			var baseUrl = 'userHomepage.html';
			var url = baseUrl + '?userId=' + userid;
			mui.openWindow({
				url: url,
				id: 'userHomepage.html',
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
					userId: userid
				}
			})
		})		
		function getDetail(id) {
			showLoading('','','#FFFFFF','50px');
			var islog = getlsData('isLogin');
			if(islog == 'true'){
				Manager();
			}else{
				questionOpt.style.display = "none";
			}
			getDatawithToken('Ask/GetQuestionDetail', { questionId: id }, function(data) {				
				hideLoading();
				hideErr()			
				var creatHotLabel = function(data){
				  	var fragment = document.createDocumentFragment();
				  	var Array = [];
					var b =[];						
					for(var j = 0; j < data.length; j++) {
						Array.push({TagName:data[j].TagName,length:data[j].TagName.length});
						function compare(property){
						    return function(a,b){
						        var value1 = a[property];
						        var value2 = b[property];
						        return value1 - value2;
						    }
					}
					}
					b = Array.sort(compare('length'))
					var lengthL = b.length ;
					var c = b.slice(0,lengthL);				  					  	
					var a;
				    for(var i =0;i<c.length;i++){
					    a = document.createElement('a');
				        a.innerHTML ='<span class="label label-default special" id=' + c[i].TagName +  '>'+c[i].TagName+'</span>';
				    	fragment.appendChild(a);
					}
					return fragment;
			    };								
				if(data.Type == 1) {
					if(data.Data && typeof(data.Data) == 'object') {
						var data = data.Data;
						var bestCount = data.BestAnswer != null ? 1 : 0;
						commonCount = data.AnswerCount;//所有回答包括最佳回答数目
						allCount = commonCount- bestCount;//未添加之前获取的普通回答数目
						//allCount = commonCount;
						if(allCount == 0){
							slider.style.display = 'none';
						}else{
							slider.style.display = 'block';							
						}						
						var answercount = document.getElementById("answercount");
						newsTitle.innerHTML = data.Subject;
						question_detail.innerHTML='';
						question_detail.innerHTML=getBodyImgUrl(data.Body);
						wximgEl.innerHTML=data.Body;
						if(data.Attachments&&data.Attachments.length>0){
							attachments.style.display='block';
							attachments.appendChild(creatAttachment(data.Attachments));
						}else{
							attachments.style.display='none';
						}
						if(data.Tags&&data.Tags.length>0){
							var title = document.getElementsByClassName("jh-title")[0];
							title.style.display='block';
							title.appendChild(creatHotLabel(data.Tags));
						}else{
						}							     
						var createList = function(data){
					    	var list = document.getElementById("list");
					    	var Author = data.IsAnonymous != true ?　data.Author　:　"匿名用户";
					    	var authorIdTap = data.IsAnonymous != true ?　"authorIdTap"　:　"";
					    	var authorId =data.IsAnonymous != true ?　data.UserId　:　"";
					    	var Reward = data.Reward == 0 ? '' : '<li class="jh-orange"><i class="fa fa-database"></i><span style="margin-left:5px">'+ data.Reward +'</span></li>';
					    	var Count = '<li class="questionComment" id=' + data.Id +  '>'+ data.CommentCount +"条评论"+'</li>'
					    	var HitTimes = data.HitTimes != 0 ?  '<li style="padding-right:0px;">'+ data.HitTimes +"次浏览"+'</li>'  : '';
					    	list.innerHTML = Reward+
					    	               '<li class=' + authorIdTap + ' id=' + authorId + '>'+ Author +'</li>'+
					    	               '<li>'+ data.DateCreated+"发布"+'</li>'+
					    	               HitTimes+
					    	               Count	    	
					    	return list;
				    	};
						createList(data);
						var islog = getlsData('isLogin');
						solvedImg.src = data.IsResolved ==true ? "../img/solved.png" : "../img/notsolved.png";
						solvedImg.srcset =data.IsResolved ==true ? "../img/solved@2x.png 2x" : "../img/no-solved@2x.png 2x";
						//solved.className = data.IsResolved ==true ? "jh-question-solved" :"jh-question-not-solved";					
						answered.className = data.IsAnswered == true ? "mui-list-unstyled jh-dropdown-list jh-label jh-label-solved " : "mui-list-unstyled jh-dropdown-list jh-label ";						
						if(data.BestAnswer != null){
							//editQuestion.style.marginLeft = "-4px"; 
							editQuestion.innerHTML ='<i class="fa fa-edit" aria-hidden="true"></i>&nbsp;&nbsp已有最佳回答'
						}else{
							if(data.IsAnswered == true){								
								editQuestion.innerHTML ='<i class="fa fa-edit" aria-hidden="true"></i>&nbsp;&nbsp已回答'
								//editQuestion.style.marginLeft = "-43px";
							}else{
								editQuestion.innerHTML ='<i class="fa fa-edit" aria-hidden="true"></i>&nbsp;&nbsp回答'
								//editQuestion.style.marginLeft = "-10px";
							}
						}												
						var shares = document.getElementById("shares");
						var favorQuestionsText = document.getElementById("favorQuestionsText");						
						shares.innerHTML = '<a href="#"><i class="mui-icon mui-icon-extra mui-icon-extra-share" aria-hidden="true"></i>&nbsp;&nbsp'+"分享"+'</a>'
						if(data.BestAnswer != null){
							editQuestion.style.color = "#D4CCCC";
							bestAnswer.style.display = 'block';	
							var commentcount = '<li class="comments" id='+ data.BestAnswer.AnswerId +'>'+ data.BestAnswer.CommentCount +"条评论"+'</li>	';
							creatBest(data.BestAnswer,commentcount);
							var id = data.BestAnswer.AnswerId;							
							creatSupportBest(data.BestAnswer.SupportCount,data.BestAnswer.VoteUsers,data.BestAnswer.IsSupport,id);						
						}else{
							bestAnswer.style.display = 'none';
						}
						if(data.IsEssential) {
							EssentialOperation.innerHTML = '<a><i class="fa fa-star-o" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp取消加精</a>'
							DeleteQuestion.innerHTML = '<a><i class="fa fa-trash-o" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;删除</a>'
						} else {
							EssentialOperation.innerHTML = '<a><i class="fa fa-star" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp加精</a>'
							DeleteQuestion.innerHTML = '<a><i class="fa fa-trash-o" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp删除</a>'
						}
						isFavorited=data.IsFavorite;
						favorQuestionsText.innerHTML = isFavorited == false ? '<i id="favorQuestions" class="mui-icon mui-icon-extra mui-icon-extra-heart" aria-hidden="true"></i>&nbsp;&nbsp收藏' : '<i id="favorQuestions" class="mui-icon mui-icon-extra mui-icon-extra-heart-filled" aria-hidden="true"></i>&nbsp;&nbsp已收藏';
						if(favorQuestionsText.innerText == "  已收藏"){
							//favorQuestionsText.style.marginRight = "-71px";
						}
						setShareInfo(getlsData('currUrl'),data.Subject,data.Subject);
						IsEssential = data.IsEssential;						
					} else {
						questionOpt.style.display='none';
						showErr(data.Data,'','#FFFFFF','50px')
						mui.toast(data.Data);
					}					
					getComment(questionId,false);
				} else if(data.Type == 0) {
					//登录失败
					mui.toast("请登录后再进行操作");
					login();
					return;
				} else {
					//逻辑错误
					questionOpt.style.display='none';
					showErr(data.Data,'','#FFFFFF','50px')
					mui.toast(data.Data);
					return;
				}
			}, function(err) {
				hideLoading();
				mui.plusReady(function(){
						if(plus.networkinfo.getCurrentType()==1||plus.networkinfo.getCurrentType()==2){
							mui.toast('网络异常，请检查网络设置!');
							showErr('没有网络连接','','#FFFFFF','50px')
						}else{
							showErr('错误代码：'+err,'','#FFFFFF','50px')
							hideLoading()
						}
					})
				if(!mui.os.plus){
					showErr('错误代码：'+err,'','#FFFFFF','50px')
					hideLoading()
				}
			})			
		}
		function approved(id){
			getDatawithToken('Ask/GetAnswersByQuestionId', {questionId: id}, function(data) {
				approvedCount = data.Data.length;//问题下获取到的回答数目
			}, function(err) {
			})
		}
		function getComment(id,more) {	//回答列表			
			var fragment = document.getElementById('itemmobile');
			var cfragment = fragment.firstElementChild;	
			if(more){
				page++;
			} else {
				cfragment.innerHTML = '';
				page = 1;
			}
			var params = {
				questionId: id,
				pageSize: 10,
				pageIndex: page,
			};			
			getDatawithToken('Ask/GetAnswersByQuestionId', params, function(data) {				
				if(data.Type == 1) {
					var data = data.Data;
					if(allCount >approvedCount ){
						var count = allCount - approvedCount;
					}else{
						var count = approvedCount - allCount ;
					}
					//disapprovedcount.innerText = count == 0 ? "" : "审核中" + "(" + count  +  ")";
					if(data.length != 0 && typeof(data) == 'object'){
						var idName = selel[0].href.substring(selel[0].href.lastIndexOf("#") + 1, selel[0].href.length);						
						answercount.innerText = allCount+"条回答";
						noAnswer.style.display = "none";
						createCommentItem(data, idName);
						for(var i = 0;i<data.length;i++){
							SupportCountAgree = data[i].SupportCount;
							var VoteUsers = data[i].VoteUsers;
							var id = data[i].Id;							
							creatSupport(data[i].SupportCount,VoteUsers,data[i].IsSupport,id);
						}						
					}else{
						if(data == "暂无更多问题"){
							
						}else{
							answercount.innerText = allCount+"条回答";
							noAnswerAgree.style.display = "none";
							noAnswer.style.display = "block";
						}
						
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
				//hideLoading();
			})			
		}
		var page = 1;
		var idName = "";
		function GetQuestion(id, more, sortBy) {
			getDatawithToken('Ask/GetAnswersByQuestionId', {questionId: id}, function(data) {
				approvedCount = data.Data.length;
			}, function(err) {
			})
			var fragment = document.getElementById('item1mobile');
			var cfragment = fragment.firstElementChild;			
			if(more){
				page++;
			} else {
				cfragment.innerHTML = '';
				page = 1;
			}
			var params = {
				questionId: id,
				sortBy : sortBy,
				pageSize: 10,
				pageIndex: page,
			};			
			getDatawithToken('Ask/GetAnswersByQuestionId', params, function(data) {
				if(data.Type == 1) {	
					var data = data.Data;
					//approvedCount = data.length;
					if(allCount >approvedCount ){
						var count = allCount - approvedCount;
					}else{
						var count = approvedCount - allCount ;
					}	
					//disapprovedcount.innerText = count == 0 ? "" : "审核中" + "(" + count  +  ")";
					if(data.length != 0 && typeof(data) == 'object'){
						var idName = selel[0].href.substring(selel[0].href.lastIndexOf("#") + 1, selel[0].href.length);
						answercount.innerText = allCount+"条回答";
						createCommentItem(data, idName);
						for(var i = 0;i<data.length;i++){
							SupportCountAgree = data[i].SupportCount;
							var VoteUsers = data[i].VoteUsers;
							IsSupport = data[i].IsSupport;
							var id = data[i].Id;							
							creatSupport1(data[i].SupportCount,VoteUsers,data[i].IsSupport,id);
						}					
					}else{
						if(data == "暂无更多问题"){
							
						}else{
							answercount.innerText = allCount+"条回答";
							noAnswer.style.display = "none";
							noAnswerAgree.style.display = "block";
						}
						
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
				//hideLoading()
			})
		}		
		mui.plusReady(function() {
				mui(".jh-best-answer").on('tap','.comments',function(e){
				var AnswerId = this.getAttribute('id');
				var baseUrl = 'question-comments.html';//commentsDetail_main.html    question-comments.html
				var url = mui.os.plus ? baseUrl : baseUrl + '?AnswerId=' + AnswerId;
				var curl = shareUrl+baseUrl+ '?AnswerId=' + AnswerId;
				setlsData('currUrl', curl);
				mui.openWindow({
					url: url,
					id: 'question-comments.html',
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
						AnswerId: AnswerId,
						currId: 'question-comments.html'
					}
				})
				})
				mui(".mui-table-view").on('tap','.commentslist',function(e){
				var AnswerId = this.getAttribute('id');				
				var baseUrl = 'question-comments.html';
				var url = mui.os.plus ? baseUrl : baseUrl + '?AnswerId=' + AnswerId;
				var curl = shareUrl+baseUrl+ '?AnswerId=' + AnswerId;
				setlsData('currUrl', curl);
				mui.openWindow({
					url: url,
					id: 'question-comments.html',
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
						AnswerId: AnswerId,
						currId: 'question-comments.html'
					}
				})
				})
				mui(".text-muted").on('tap','.questionComment',function(e){
				var QuestionId = this.getAttribute('id');				
				var baseUrl = 'answer-comments.html';
				var url = mui.os.plus ? baseUrl : baseUrl + '?QuestionId=' + QuestionId;
				var curl = shareUrl+baseUrl+ '?QuestionId=' + QuestionId;
				setlsData('currUrl', curl);
				mui.openWindow({
					url: url,
					id: 'answer-comments.html',
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
						QuestionId: QuestionId,
						currId: 'answer-comments.html'
					}
				})
				})
				mui("#hot-label").on('tap','.label-default',function(e){
					console.log("详情页进入列表页")
				var tagName = this.getAttribute('id');
					var baseUrl = 'question-label-list.html';
					var url = mui.os.plus ? baseUrl : baseUrl + '?tagName=' + tagName;
					var curl = shareUrl+baseUrl+ '?tagName=' + tagName;
					setlsData('currUrl', curl);
					mui.openWindow({
						url: url,
						id: 'question-label-list.html',
						show: {
							autoShow: true
						},
						createNew:true,
						waiting: {
							options: {
								loading: {
									height: '35px'
								}
							}
						},
						extras: {
							tagName: tagName,
							currId: 'question-solved.html'
						}
					})
				})
			})
			if(!mui.os.plus) {
			mui('.jh-best-answer ').on('tap','.comments',function(e){
				var AnswerId = this.getAttribute('id');
				var baseUrl = 'question-comments.html';
	            var url = mui.os.plus ? baseUrl : baseUrl + '?AnswerId=' + AnswerId;
	            var curl = shareUrl+baseUrl+ '?AnswerId=' + AnswerId;
				setlsData('currUrl', curl);
				mui.openWindow({
					url: url,
					id: 'question-comments.html'
				})
			})
			mui('.mui-table-view ').on('tap','.commentslist',function(e){
				var AnswerId = this.getAttribute('id');
				var baseUrl = 'question-comments.html';
	            var url = mui.os.plus ? baseUrl : baseUrl + '?AnswerId=' + AnswerId;
	             var curl = shareUrl+baseUrl+ '?AnswerId=' + AnswerId;
				setlsData('currUrl', curl);
				mui.openWindow({
					url: url,
					id: 'question-comments.html'
				})
			})
			mui('.text-muted').on('tap','.questionComment',function(e){
				var QuestionId = this.getAttribute('id');
				var baseUrl = 'answer-comments.html';
	            var url = mui.os.plus ? baseUrl : baseUrl + '?QuestionId=' + QuestionId;
	            var curl = shareUrl+baseUrl+ '?QuestionId=' + QuestionId;
				setlsData('currUrl', curl);
				mui.openWindow({
					url: url,
					id: 'answer-comments.html'
				})
			})
			mui('#hot-label').on('tap','.label-default',function(e){
				var tagName = this.getAttribute('id');
					var baseUrl = 'question-label-list.html';
					var url = baseUrl + '?tagName=' + tagName;
					var curl = shareUrl+baseUrl+ '?tagName=' + tagName;
					setlsData('currUrl', curl);
					mui.openWindow({ url: url, id: 'question-label-list.html' });
			})
			}
		var selel = document.getElementsByClassName("mui-control-item mui-active");
		/**
		 * tab切换
		 */
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
				var refresh = document.querySelectorAll('.mui-scroll-wrapper .mui-scroll');
				
				$.each(document.querySelectorAll('.mui-scroll-wrapper #scroll'), function(index, pullRefreshEl) {
					$(pullRefreshEl).pullToRefresh({
						down: {
							callback: function() {												
							}
						},
						up: {
							callback: function() {									
								var self = this;
								if(selel[0].id == '0') {
									getComment(questionId,true);
								}
								if(selel[0].id == '1') {									
									GetQuestion(questionId,true,1);
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
		mui(".mui-list-unstyled").on('tap', 'li', function(e) {
			if(mui.os.plus) {
				mui('#popoverQuestion').popover('toggle');
			}			
			switch(this.getAttribute('id')) {
				case "EssentialOperation":
					//加精or取消加精
					var islog = getlsData('isLogin');			
					if(islog == 'true') {
						essentialOperation(questionId,IsEssential)
					} else {
						mui.toast('请登录后再进行操作');
						login();				
					}					
					break;
				case "DeleteQuestion":
					//删除
					var islog = getlsData('isLogin');			
					if(islog == 'true') {
						mui('#popoverQuestion').popover('toggle');
						var btnArray = ['取消', '确定'];
						mui.confirm('确认删除？', '问题', btnArray, function(e) {
							if(e.index == 1) {
								deleteQuestion(questionId)
							}
						});
					} else {
						mui.toast('请登录后再进行操作');
						login();				
					}					
					break;
				default:
					break;
			}
		})		
	}		
}
var answer_comments={
	init:function(){
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
				}
			})	
			}			
		}
		
    	var editComment = document.getElementById("editComment");
    	var tenantTypeId = '';
    	var commentedObjectId;
    	var ii = 0;
    	var type = 0;   	
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
				TenantTypeId: tenantTypeId,
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
				var Avatar = '<img class="creator_img_comment " id='+data.UserId+' src='+ getImgUrl(data.Avatar) +'>';
			}else{
				var Avatar = '<img class="creator_img_comment " id='+data.UserId+' src="../img/avatar.jpg"/>';
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
			postDatawithToken('Comment/CreateComment', params, function(data) {
				hideLoading();
				hideErr()
				document.getElementById("comment-textarea").value='';
				if(data.Type == 1) {
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
					login();
					document.getElementById("comment-textarea").blur();
					return;
				} else {
					//逻辑错误
					showErr(data.Data,'','#FFFFFF','50px');
					mui.toast(data.Data);
					document.getElementById("comment-textarea").blur();
					return;
				}
			}, function(err) {
				hideLoading();
				mui.plusReady(function(){
						if(plus.networkinfo.getCurrentType()==1||plus.networkinfo.getCurrentType()==2){
							mui.toast('网络异常，请检查网络设置!');
							showErr('没有网络连接','','#FFFFFF','50px');
						}else{
							showErr('错误代码：'+err,'','#FFFFFF','50px');
							hideLoading()
						}
					})
				if(!mui.os.plus){
					showErr('错误代码：'+err,'','#FFFFFF','50px');
					hideLoading()
				}
			})
		}
		var sendCom = document.getElementById("sendCom");		
		editComment && editComment.addEventListener('tap', function() {
			tenantTypeId = 'Question';
			parentId = 0;
			var islog = getlsData('isLogin');
			if(islog == 'true') {
				mui('#popView_comment').popover('toggle');
				parentId = 0;				
			} else {
				mui.toast('请登录后再进行操作');
				login();
			}
		})
		var elmt;
		var cancelCom = document.getElementById("cancelCom");
		cancelCom && cancelCom.addEventListener('tap', function() {
			mui('#popView_comment').popover('toggle');
			if(elmt.querySelector('.jh-comment-reply').innerText == ""){
				elmt.querySelector('.jh-comment-reply').style.display='none';
			}
		})
		sendCom && sendCom.addEventListener('tap', function() {		
			mui('#popView_comment').popover('toggle');
			if(mui.os.plus) {
				mui.plusReady(function() {
					var self = plus.webview.currentWebview();
					QuestionId = self.QuestionId;					
				});
			} else {	
				QuestionId = getUrlParam('QuestionId');
			}			
			submitComment(parentId,QuestionId);				
		})
    	mui("#commentAreas").on('tap', '.mui-text-center', function(e) {
    		var i = 1;
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
    		tenantTypeId = 'Question';
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
       var item = 0;
    	var ii ;
    	var createItem = function(data,item){  		
    		var commentAreas = document.getElementById("commentAreas");
    		for(var i = 0;i<data.length;i++){
				item++;	
				ii++;
				var commentReply = "";
				if(data[i].Avatar.length > 0){
					var Avatar = '<img class="creator_img_comment " id='+data[i].UserId+' src='+ getImgUrl(data[i].Avatar) +'>';
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
								'<p id=' + data[i].CommentId +  '>'+data[i].Body+'</p>'+
								commentReply+
								'<div class="comment_top">'+
								'</div>';
				commentAreas.appendChild(div);
    		}
    		ii = item;
    		return commentAreas;
    }; 
    	var questionId;
		questionId = getUrlParam('questionId');
		//B页面onload从服务器获取列表数据；
		window.onload = function() {
			//获取url中的targetId参数
			if(mui.os.plus) {
				mui.plusReady(function() {
					var self = plus.webview.currentWebview();
					QuestionId = self.QuestionId;
					getDetail(QuestionId,false)
					//关闭等待框
					plus.nativeUI.closeWaiting();
					//显示当前页面
					mui.currentWebview.show();
				});
			} else {	
				QuestionId = getUrlParam('QuestionId');
				getDetail(QuestionId,false)
			}		
			if(mui.os.wechat){
				var currUrl = location.href.split('#')[0];
				weChatLogin(currUrl)
			}
		}
		mui("#commentAreas").on('tap', '.creator_img_comment', function(e) {
			var userid = this.getAttribute('id');
			var baseUrl = 'userHomepage.html';
			var url = baseUrl + '?userId=' + userid;
			mui.openWindow({
				url: url,
				id: 'userHomepage.html',
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
					userId: userid
				}
			})
		})
					/**                                                                                                                               
			 * 下拉刷新具体业务实现                                                                                                                     
			 */                                                                                                                               
			function pulldownRefresh() {                                                                                                      
				setTimeout(function() { 
					var commentAreas = document.getElementById("commentAreas");
					//commentAreas.innerHTML = "";
					getDetail(QuestionId,false);
					mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed                                             
				}, 1500);                                                                                                                     
			}                                                                                                                                 
			var count = 0;                                                                                                                    
			/**                                                                                                                               
			 * 上拉加载具体业务实现                                                                                                                     
			 */                                                                                                                               
			function pullupRefresh() {                                                                                                        
				setTimeout(function() { 
					getDetail(QuestionId,true);
					mui('#pullrefresh').pullRefresh().endPullupToRefresh((++count > 2)); //参数为true代表没有更多数据了。                                                                                                                              
				}, 1500);                                                                                                                     
			}
		var page = 1;
		function getDetail(id,more) {
			//showLoading('','','#FFFFFF','50px');
			if(more){
				page++;
			}else{
				page=1;
			}
			var params = {
				CommentedObjectId: id,
				TenantTypeId: 'Question',
				pageIndex: page
			}
			getData('Comment/GetCommentsDetail', params, function(data) {							
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
						commentedObjectId = data.QuestionId;
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
				hideLoading();
			})
		}				
	}
}
