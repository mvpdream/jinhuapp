var pageUrl = window.location.pathname;
pageUrl = pageUrl.substring(pageUrl.lastIndexOf('/') + 1, pageUrl.length);
/**
 *文库主页 
 */
if(pageUrl == 'document.html') {
	var control = document.getElementById("control");
	var contentArea = document.getElementById("contentArea");
	window.onload = function(){
		mui('.mui-scroll-wrapper').scroll({
		deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
		});
	}
	getsectionTypewithdoc();	
	var creatTypeswithdoc = function(data) {
		var newArr=[];			
		var fragment = document.getElementById('alltypes');
		var div;
		fragment.innerHTML='';
		for(var i = 0; i < data.length; i++) {
			if(i>5){
				control.style.display = "block";
				dis = 'none';
			}else{
				dis = 'block';
			}
			div = document.createElement('div');
			div.className = 'mui-col-xs-4';
			div.style.display = dis;
			div.style.padding = '10px';
			div.innerHTML = '<div class="typeitem"  id=' + data[i].CategoryId + '>' + data[i].CategoryName + '</div>';
			fragment.appendChild(div);
		}
	}
	mui(".jh-block-list").on('tap', '.control', function(e) {
		if(this.getElementsByTagName('span')[0].className == "mui-icon mui-icon-arrowdown"){
			this.getElementsByTagName('span')[0].className = "mui-icon mui-icon-arrowup"
		}else{
			this.getElementsByTagName('span')[0].className = "mui-icon mui-icon-arrowdown"
		}
	    var alldiv= e.target.parentElement.parentElement.getElementsByClassName("mui-row")[0].getElementsByClassName("mui-col-xs-4");
	    mui.each(alldiv, function(index, item) {
		  	if(item.style.display == 'block' && index > 5) {
			  	item.style.display = 'none'			 
		   } else {
			  	item.style.display = 'block'
		   	}
	   	})
    })
	function transfer(i,data) {
    	if(i==data.length) return;
    	categoryId = data[i].CategoryId;
		CategoryName = data[i].CategoryName;
		getDocument(categoryId,CategoryName,function(){
			transfer(i + 1,data);
		}); 	   
	}
	var creatContentwithdoc = function(data,CategoryId,CategoryName) {
		var ul;
		var list = '';
		console.log(data)
		if(data == "暂无文档"){
			var li = '<li class="jh-news-list-no"><p style="text-align:center;">'+"暂无文档"+'</p></li>';			
			ul = document.createElement('ul');
			ul.className = "mui-table-view";
			ul.innerHTML =  '<p class="category">'+ CategoryName +'</p>'+
							li;
			contentArea.appendChild(ul);
		}else{
			for(var i = 0;i<data.length;i++){
			var li;
			var star = "";
			var stars = "";
			var starskong = "";var starHalf ="";
			function isInteger(obj) {
				return Math.floor(obj) === obj;
			}
			if(isInteger(data[i].StarReview) == false){
				var newNum=data[i].StarReview.toString().replace(/\d+\.(\d*)/,"$1");
				var newLength = newNum <= 5 ? (data[i].StarReview - 1) : data[i].StarReview ;
				var newLengths = data[i].StarReview + 1;
				starHalf = newNum <= 5 ? '<span class="fa fa-star-half-o tn-orange-color"></span>' : '';
			}else{
				var newLength = data[i].StarReview;
				var newLengths = data[i].StarReview;
			}
			for(var n = 0;n<newLength;n++){
				var starlist = '<span class="fa fa-star tn-orange-color"></span>';
				stars += starlist;
			}
			for(var m = 0;m<5 - newLengths;m++){
				var starkonglist = '<span class="fa fa-star-o"></span>';
				starskong += starkonglist;
			}
			star = stars + starHalf + starskong;
			var starCon = '<li class="starCon" style="float:right;">' + star + '<li>';
			var type = data[i].Extension;
			switch (type){
                case "wps":
                case "doc":
                case "docx":                   
                    var icon = '<span id="icon" class="fa fa-file-word-o tn-blue-color"></span>';
                    break;
                case "pps":
                case "pptx":
                case "ppt":                    
                    var icon = '<span id="icon" class="fa fa-file-powerpoint-o tn-yellow-color"></span>';
                    break;
                case "xls":
                case "xlsx":                   
                    var icon = '<span id="icon" class="fa fa-file-excel-o tn-green-color"></span>';
                    break;
                case "pdf":                   
                    var icon = '<span id="icon" class="fa fa-file-pdf-o tn-red-color"></span>';
                    break;
                case "txt":
                    var icon = '<span id="icon" class="fa fa-file-text-o"></span>';
                    break;
                case "jpg":
                case "png":
                case "bmp":
                case "gif":                    
                    var icon = '<span id="icon" class="fa fa-file-image-o tn-red-color"></span>';
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
                    var icon = '<span id="icon" class="fa fa-file-video-o tn-blue-color"></span>';
                    break;
                case "zip":
                case "rar":                   
                    var icon = '<span id="icon" class="fa fa-file-zip-o tn-red-color"></span>';
                    break;
                case "mp3":
                case "wav":
                case "rm":                    
                    var icon = '<span id="icon" class="fa fa-file-audio-o tn-red-color"></span>';
                    break;
                default:
                    var icon = '<span id="icon" class="fa fa-file-o"></span>';
                    break;
            }
			if(data[i].IsEssential) {
				Essential = '<span class="jh-red-border">' + "精华" + '</span>'
			} else {
				Essential = ''
			}
			if(data[i].IsSticky) {
				Sticky = '<span class="jh-red-border">' + "置顶" + '</span>'
			} else {
				Sticky = ''
			}
			if(Essential== '' && Sticky == ''){
				var disstatus = "none";
			}else{
				var disstatus = "inline-block"; 
			}
			var dis = i > 5 ? 'none' : 'block';
			var more = i > 5 ? '<div class="document_more" id="'+ CategoryId +'"><a href="#" class="document_more_text" id="'+ CategoryId +'">'+ "查看更多"+'</a></div>' : '';
			li = '<li class="mui-table-view-cell jh-news-list" id="'+ data[i].Id+'" title="'+data[i].MediaType+'" style="display:'+ dis +'">'+
				 '<h5 class="listTitle">'+
				 icon+
				 '<p class="iconp">'+
				 data[i].Subject+
				 '</p>'+
				 '<span class="status" style="display:'+ disstatus +'">'+
				 Essential+
				 Sticky+
				 '</span>'+
				 '</h5>'+
				 '<ul class="mui-list-inline text-muted">'+
				 '<li class="padrig">'+ data[i].FriendlyFileLength +'</li>'+
				 '<li class="padrig">'+ data[i].DownloadCount + '次下载' +'</li>'+
				 starCon+
				 '</ul>'+
				 '</li>';
			list += li;								
		}			
		ul = document.createElement('ul');
		ul.className = "mui-table-view";
		ul.innerHTML =  '<p class="category">'+ CategoryName +'</p>'+
						list+
						more;
		contentArea.appendChild(ul);
		}								
	}
	function getsectionTypewithdoc() {
			//showLoading('', '', '#FFFFFF', '50px', '1');						
			getData('Document/GetCategories',{}, function(data) {
				//hideLoading();
				hideErr();
				if(data.Type == 1) {
					if(data.Data && typeof(data.Data) == 'object') {
						if(data.Data.length > 0) {
							creatTypeswithdoc(data.Data);
							transfer(0,data.Data); 																													
						}
						mui('#SectionType .mui-control-item').each(function(index, element) {
							ids.push(element.id)
						})
					} else {
						showErr(data.Data,'','#FFFFFF','50px')
						mui.toast(data.Data);
					}
				}else {
					//逻辑错误
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
	function getDocument(CategoryId,CategoryName,successFun) {
			//showLoading('', '', '#FFFFFF', '50px', '1');			
			var params = {
				categoryId : CategoryId,
				pageSize : 10,
				pageIndex : 1
			};
			getData('Document/GetByCategoryId', params, function(data) {
				//hideLoading();
				hideErr();
				if(data.Type == 1) {
					successFun();					
					creatContentwithdoc(data.Data,CategoryId,CategoryName)
					if(data.Data && typeof(data.Data) == 'object') {
						
					} else {
						//showErr(data.Data,'','#FFFFFF','50px')
						//mui.toast(data.Data);
					}

				}else {
					//逻辑错误
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
//	mui.plusReady(function() {
		mui("#contentArea").on('tap','.document_more_text',function(e){
			var categoryId = this.getAttribute('id');
			var baseUrl = 'document-list.html';
			var url = mui.os.plus ? baseUrl : baseUrl + '?categoryId=' + categoryId;
			var curl = shareUrl+baseUrl+ '?categoryId=' + categoryId;
			setlsData('currUrl', curl);
				mui.openWindow({
					url: url,
					id: 'document-list.html',
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
						categoryId: categoryId,
						currId: 'document-list.html'
					}
				})
		}),
		mui("#contentArea").on('tap','.typeitem',function(e){
			var categoryId = this.getAttribute('id');
			var baseUrl = 'document-list.html';
			var url = mui.os.plus ? baseUrl : baseUrl + '?categoryId=' + categoryId;
			var curl = shareUrl+baseUrl+ '?categoryId=' + categoryId;
			setlsData('currUrl', curl);
				mui.openWindow({
					url: url,
					id: 'document-list.html',
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
						categoryId: categoryId,
						currId: 'document-list.html'
					}
				})
		}),
		mui("#contentArea").on('tap','.jh-news-list',function(e){
			var documentId = this.getAttribute('id');
			var mediaType = Number(this.getAttribute('title'));
			var baseUrl = 'documentDetail.html';
			switch (mediaType){
				case 1:
					baseUrl = 'docImgsDetail.html';
					break;
				case 2:
					baseUrl = 'docVideoDetail.html';
					break;
				default:
					baseUrl = 'documentDetail.html'
					break;
			}
			var url = mui.os.plus ? baseUrl : baseUrl + '?documentId=' + documentId;
			var curl = shareUrl+baseUrl+ '?documentId=' + documentId;
			setlsData('currUrl', curl);
				mui.openWindow({
					url: url,
					id: baseUrl,
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
						documentId: documentId,
						currId: 'document.html'
					}
				})
		})
//	})
//	if(!mui.os.plus) {
//		mui('#contentArea').on('tap','.document_more_text',function(e){
//			var categoryId = this.getAttribute('id');
//			var baseUrl = 'document-list.html';
//	        var url = mui.os.plus ? baseUrl : baseUrl + '?categoryId=' + categoryId;
//	        var curl = shareUrl+baseUrl+ '?categoryId=' + categoryId;
//			setlsData('currUrl', curl);
//				mui.openWindow({
//					url: url,
//					id: 'document-list.html'
//				})
//		}),
//		mui('#contentArea').on('tap','.typeitem',function(e){
//			var categoryId = this.getAttribute('id');
//			var baseUrl = 'document-list.html';
//	        var url = mui.os.plus ? baseUrl : baseUrl + '?categoryId=' + categoryId;
//	        var curl = shareUrl+baseUrl+ '?categoryId=' + categoryId;
//			setlsData('currUrl', curl);
//				mui.openWindow({
//					url: url,
//					id: 'document-list.html'
//				})
//		}),
//		mui('#contentArea').on('tap','.jh-news-list',function(e){
//			var categoryId = this.getAttribute('id');
//			var baseUrl = 'documentDetail.html';
//	        var url = mui.os.plus ? baseUrl : baseUrl + '?categoryId=' + categoryId;
//	        var curl = shareUrl+baseUrl+ '?categoryId=' + categoryId;
//			setlsData('currUrl', curl);
//				mui.openWindow({
//					url: url,
//					id: 'documentDetail.html'
//				})
//		})
//	}
}
/**
 *文库列表页
 */
if(pageUrl == 'document-list.html'){
	var CategoryNameTitle = document.getElementById("CategoryNameTitle");
		var header = document.getElementById("header");
		var body = document.getElementById("body");
		var categoryId;
		var categoryNameTitle;
		if(mui.os.plus) {
			mui.plusReady(function() {					
				var self = plus.webview.currentWebview();
				categoryId = self.categoryId;
				getAllwithList(categoryId);
				//getcategorywithlist(categoryId);
				//getsectionType(categoryId);
				//getDocument(false,categoryId);
			});
		} else { 
			categoryId = getUrlParam('categoryId');	
			getAllwithList(categoryId);
			//getcategorywithlist(categoryId);		
			//getsectionType(categoryId);
			//getDocument(false,categoryId);
		}
		/*(function($) {
			$(document).imageLazyload({ 
				placeholder: '../img/lazy.png'
			});
		})(mui);*/
		window.addEventListener('touchstart',function(e){e.preventDefault();});
		window.addEventListener('touchmove',function(e){e.preventDefault();});
		var ids = [];			
		var selel = document.getElementsByClassName("mui-control-item mui-active");
		var creatTypes = function(data) {			
			var fragment = document.getElementById('alltypes');
			var div;
			fragment.innerHTML='';
			for(var i = 0; i < data.length; i++) {
				div = document.createElement('div');
				div.className = 'mui-col-xs-4';
				div.style.padding = '10px';
				div.innerHTML = '<div class="typeitem" id=' + data[i].CategoryId + '>' + data[i].CategoryName + '</div>';
				fragment.appendChild(div);
			}
		}
		
		function changeSwith(categoryId) {		
			var moreType = document.getElementById("moreType");
			var types = document.getElementById("contentArea");
			if(types.style.display == "block") {
				types.style.display = "none";
				moreType.style.display = "block";
				header.innerHTML = "";
				header.innerHTML = '<h1 class="document-title" id="CategoryNameTitle">'+ "切换类别" +'</h1>';
				header.style.textAlign = "center";
			} else {
				types.style.display = "block";
				moreType.style.display = "none";
				header.innerHTML = "";
				header.style.textAlign = "inherit";
				header.innerHTML = 	'<a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left" style="color:#333;"></a>'+
									'<h1 class="document-title" id="CategoryNameTitle">'+ categoryNameTitle +'</h1>';
			}
		} 		
		document.getElementById("switchColumns").addEventListener('tap',function(){
			changeSwith(categoryId);
		})
		function skip(categoryId){
			var baseUrl = 'document-list.html';
			var url = baseUrl + '?categoryId=' + categoryId;
			mui.openWindow({
				url: url,
				id: 'document-list1.html',
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
					categoryId: categoryId
				}
			})
		}
		mui("#alltypes").on('tap', '.typeitem', function(e) {	
			/*console.log("5555555555555555") 
					var categoryId = this.getAttribute('id');
					CategoryNameTitle.innerText ="";
					var box = document.getElementById("contentArea");
					box.innerHTML = "";
					var container = document.getElementById("alltypes");
					container.innerHTML = '';
					getcategory(categoryId);
					getsectionType(categoryId);
					changeSwith(categoryId);*/
			var length = this.parentElement.parentElement.getElementsByClassName('mui-col-xs-4').length;
			for(var i = 0;i<length;i++){
				var classname = this.parentElement.parentElement.getElementsByClassName('mui-col-xs-4')[i].getElementsByTagName('div')[0].className
				if(classname == "typeitem typeitemActive"){
					this.parentElement.parentElement.getElementsByClassName('mui-col-xs-4')[i].getElementsByTagName('div')[0].className = "typeitem";
				}
			}
			this.className = "typeitem typeitemActive";			
			var categoryId = this.getAttribute('id');
			var baseUrl = 'document-list.html';
			var url = baseUrl + '?categoryId=' + categoryId;
			mui.openWindow({
				url: url,
				id: 'document-list.html',
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
					categoryId: categoryId
				}
			})
		})
		mui("#contentArea").on('tap', '.jh-news-list', function(e) {
			var documentId = this.getAttribute('id');
			var mediaType = Number(this.getAttribute('title'));
			var baseUrl = 'documentDetail.html';
			switch (mediaType){
				case 1:
					baseUrl = 'docImgsDetail.html';
					break;
				case 2:
					baseUrl = 'docVideoDetail.html';
					break;
				default:
					baseUrl = 'documentDetail.html'
					break;
			}
			var url = mui.os.plus ? baseUrl : baseUrl + '?documentId=' + documentId;
			var curl = shareUrl+baseUrl+ '?documentId=' + documentId;
			setlsData('currUrl', curl);
				mui.openWindow({
					url: url,
					id: baseUrl,
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
						documentId: documentId,
						currId: 'document-list.html'
					}
				})
		})
		function creatTabItem (data) {
			var bigContainers = "";
			for(var i = 0; i < data.length; i++) {
				var itemContainer = "";
				var hrefs = "#item" + (i + 0) + "mobile";//href=' + hrefs + '
				itemContainer = '<a class="mui-control-item" title="'+ i +'" href=' + hrefs + ' id=' + data[i].CategoryId + '>' + data[i].CategoryName.substring(0, 10) + '</a>'
				bigContainers += itemContainer;
			}
			return bigContainers;
		}
		function creatContentwithlist(data) {
			var box = document.getElementById("contentArea");
			if(data == null){
				var tabitems = '';
				var groupitem = '';
				var dis = 'none';
				var disType = 'none';
				var top = "0px";
			}else{
				var tabitems = creatTabItem(data);
				var groupitem = creatGroupItem(data);
				var dis = data.length == 0 ? "none" : "block";
				var disType = 'block';
				var top = "40px";
			}			
			box.innerHTML = '<div id="slider" class="mui-slider mui-fullscreen">' +
				'				<div id="sliderSegmentedControl" class="mui-scroll-wrapper mui-slider-indicator mui-segmented-control mui-segmented-control-inverted jh-scroll-wrapper" style="margin-right: 50px;display:'+ disType +'">' +
				'					<div class="mui-scroll" id="SectionType" style="padding-right: 50px;padding-left:1.0rem">' +
				'						<a class="mui-control-item mui-active" href="#itemmobile" id="all" title="itemmobile" style="padding-left:9px;">' +
				'							全部' +
				'						</a>' +				
				'                        ' + tabitems + '' +
				'					</div>' +//onclick="changeSwith('+ categoryId +')"
				'					<div id="switchColumn"  style="display:'+ dis +'">' +
				'						<span class="mui-icon mui-icon-arrowdown"></span>' +
				'					</div>' +
				'				</div>' +
				'				<div class="mui-slider-group" id="sliderGroup" style="top:'+ top +'">' +
				'					<div id="itemmobile" class="mui-slider-item mui-control-content mui-active">' +
				'						<div class="mui-scroll-wrapper" id="refreshcontainer">' +
				'							<div class="mui-scroll">' +
				'								<ul class="mui-table-view">' +
				'									<div class="mui-loading">' +
				'										<div class="mui-spinner">' +
				'										</div>' +
				'									</div>' +
				'								</ul>' +
				'							</div>' +
				'						</div>' +
				'					</div>' +				
				'                        ' + groupitem + '' +
				'				</div>';
			mui('.mui-slider').slider();
			var deceleration = mui.os.ios ? 0.003 : 0.0009;
			mui('.mui-scroll-wrapper.mui-slider-indicator.mui-segmented-control').scroll({
				scrollY: false,
				scrollX: true,
				indicators: false,
				deceleration: deceleration,
				snap: '.mui-control-item'
			});
			document.getElementById("switchColumn").addEventListener('tap',function(){
			changeSwith(categoryId);
		})
			mui('.mui-slider').slider().setStopped(true);												
			/*mui.plusReady(function() {
				mui("#alltypes").on('tap', '.typeitem', function(e) {
					console.log("5555555555555555") 
					var categoryId = this.getAttribute('id');
					CategoryNameTitle.innerText ="";
					var box = document.getElementById("contentArea");
					box.innerHTML = "";
					var container = document.getElementById("alltypes");
					container.innerHTML = '';
					getcategory(categoryId);
					getsectionType(categoryId);
					changeSwith(categoryId);
					//changeSwith(categoryId);
					/*var categoryId = this.getAttribute('id');
					var baseUrl = 'document-list.html';	
					var url = mui.os.plus ? baseUrl : baseUrl + '?categoryId=' + categoryId;
					var curl = shareUrl+baseUrl+ '?categoryId=' + categoryId;
					console.log(url)
					setlsData('currUrl', curl);
						mui.openWindow({
							url: url,
							id: 'document-list.html',
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
							createNew:true,
							extras: {
								categoryId: categoryId,
								currId: 'document-list.html'
							}
						})*/																				
				/*});
				document.getElementById("switchColumn").addEventListener('tap',function(){
					changeSwith(categoryId)
				})
				document.getElementById("switchColumns").addEventListener('tap',function(){
					changeSwith(categoryId)
				})
			})
			if(!mui.os.plus) {
				mui("#alltypes").on('tap', '.typeitem', function(e) {
					debugger
					console.log("55555555555")
					var categoryId = this.getAttribute('id');
					CategoryNameTitle.innerText ="";
					var box = document.getElementById("contentArea");
					box.innerHTML = "";
					var container = document.getElementById("alltypes");
					container.innerHTML = '';
					getcategory(categoryId);
					getsectionType(categoryId);	
					changeSwith(categoryId);
					console.log(CategoryNameTitle.innerText)
					/*var baseUrl = 'document-list.html';					
					var url = mui.os.plus ? baseUrl : baseUrl + '?categoryId=' + categoryId;
	        		var curl = shareUrl+baseUrl+ '?categoryId=' + categoryId;
					setlsData('currUrl', curl);					
					mui.openWindow({
						url: url,
						id: 'document-list.html'
					});*/
				/*})
			}*/

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
									if(selel[0].id == 'all') {
										getDocumentwithlist(false,categoryId);
									} else {																				
										//skip(selel[0].id);									
										//getDocument(false,selel[0].id);
									}
									setTimeout(function() {
										self.endPullDownToRefresh();
									}, 1000);
								}
							},
							up: {
								callback: function() {
									var self = this;
									if(selel[0].id == 'all') {
										getDocumentwithlist(true,categoryId);
									} else {
										//skip(selel[0].id,index);
										//getDocument(true,selel[0].id);
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
			

		}
		

		var creatGroupItem = function(data) {
			var bigContainers = "";
			for(var i = 0; i < data.length; i++) {
				var itemContainer = "";
				var ids = "item" + (i + 0) + "mobile";
				itemContainer = '<div id=' + ids + ' class="mui-slider-item mui-control-content">' +
					'						<div class="mui-scroll-wrapper">' +
					'							<div class="mui-scroll">' +
					'								<ul class="mui-table-view">' +
					'									<div class="mui-loading">' +
					'										<div class="mui-spinner">' +
					'										</div>' +
					'									</div>' +
					'								</ul>' +
					'							</div>' +
					'						</div>' +
					'					</div>'
				bigContainers += itemContainer;
			}
			return bigContainers;
		}

		
		
		
		/*mui("#alltypes").on('tap', '.mui-col-xs-4', function(e) {
			changeColumn(e.target.id);
			changeSwith();
		})*/

		/*function changeColumn(index) {
			var index=ids.indexOf(index);
			var scrollColumn = document.getElementById("SectionType");
			var addcolumn = document.getElementById("alltypes");
			var a = scrollColumn.getElementsByTagName('a');
			var div = addcolumn.querySelectorAll('.mui-col-xs-4');
			for(var i = 0; i < a.length; i++) {
				a[i].className = "mui-control-item";
				div[i].className = "mui-col-xs-4";
			}
			var gallery = mui('#sliderSegmentedControl');
			var gallerys = mui('#slider');
			gallery.scroll().gotoPage(index); //跳转到第index张图片，index从0开始；
			gallerys.slider().gotoItem(index);
			a[index].className = "mui-control-item mui-active";
			div[index].className = "mui-col-xs-4 typeItemActive";
		}*/				
	var createDocumentList = function(data,id) {
		var fragment = document.getElementById(id);
		var cfragment = fragment.firstElementChild;
		var finel = cfragment.firstElementChild.querySelector('.mui-table-view');
		var ul;
		var list = '';
		if(data == "暂无文档"){
			var li = '<li class="mui-table-view-cell jh-news-list-no"><p style="text-align:center;">'+"暂无文档"+'</p></li>';			
			ul = document.createElement('ul');
			ul.className = "mui-table-view";
			ul.innerHTML =  li;
			finel.appendChild(ul);
		}else{
			for(var i = 0;i<data.length;i++){
			var li;
			var star = "";
			var stars = "";
			var starskong = "";
			var starHalf ="";
			function isInteger(obj) {
				return Math.floor(obj) === obj;
			}
			if(isInteger(data[i].StarReview) == false){
				var newNum=data[i].StarReview.toString().replace(/\d+\.(\d*)/,"$1");
				var newLength = newNum <= 5 ? (data[i].StarReview - 1) : data[i].StarReview ;
				var newLengths = data[i].StarReview + 1;
				starHalf = newNum <= 5 ? '<span class="fa fa-star-half-o tn-orange-color"></span>' : '';
			}else{
				var newLength = data[i].StarReview;
				var newLengths = data[i].StarReview;
			}
			for(var n = 0;n<newLength;n++){
				var starlist = '<span class="fa fa-star tn-orange-color"></span>';
				stars += starlist;
			}
			for(var m = 0;m<5 - newLengths;m++){
				var starkonglist = '<span class="fa fa-star-o"></span>';
				starskong += starkonglist;
			}
			star = stars + starHalf + starskong;
			var starCon = '<li class="starCon" style="float:right;">' + star + '<li>';
			var type = data[i].Extension;
			switch (type){
                case "wps":
                case "doc":
                case "docx":                   
                    var icon = '<span id="icon" class="fa fa-file-word-o tn-blue-color"></span>';
                    break;
                case "pps":
                case "pptx":
                case "ppt":                    
                    var icon = '<span id="icon" class="fa fa-file-powerpoint-o tn-yellow-color"></span>';
                    break;
                case "xls":
                case "xlsx":                   
                    var icon = '<span id="icon" class="fa fa-file-excel-o tn-green-color"></span>';
                    break;
                case "pdf":                   
                    var icon = '<span id="icon" class="fa fa-file-pdf-o tn-red-color"></span>';
                    break;
                case "txt":
                    var icon = '<span id="icon" class="fa fa-file-text-o"></span>';
                    break;
                case "jpg":
                case "png":
                case "bmp":
                case "gif":                    
                    var icon = '<span id="icon" class="fa fa-file-image-o tn-red-color"></span>';
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
                    var icon = '<span id="icon" class="fa fa-file-video-o tn-blue-color"></span>';
                    break;
                case "zip":
                case "rar":                   
                    var icon = '<span id="icon" class="fa fa-file-zip-o tn-red-color"></span>';
                    break;
                case "mp3":
                case "wav":
                case "rm":                    
                    var icon = '<span id="icon" class="fa fa-file-audio-o tn-red-color"></span>';
                    break;
                default:
                    var icon = '<span id="icon" class="fa fa-file-o"></span>';
                    break;
            }
			if(data[i].IsEssential) {
				Essential = '<span class="jh-red-border">' + "精华" + '</span>'
			} else {
				Essential = ''
			}
			if(data[i].IsSticky) {
				Sticky = '<span class="jh-red-border">' + "置顶" + '</span>'
			} else {
				Sticky = ''
			}
			if(Essential== '' && Sticky == ''){
				var disstatus = "none";
			}else{
				var disstatus = "inline-block"; 
			}
			//var dis = i > 5 ? 'none' : 'block';
			//var more = i > 5 ? '<div class="document_more" id="'+ CategoryId +'"><a href="#" class="document_more_text" id="'+ CategoryId +'">'+ "查看更多"+'</a></div>' : '';
			li = '<li class="mui-table-view-cell jh-news-list" id="'+ data[i].Id+'" title="'+data[i].MediaType+'">'+
				 '<h5 class="listTitle">'+
				 icon+
				 '<p class="iconp">'+
				 data[i].Subject+
				 '</p>'+
				 '<span class="status" style="display:'+ disstatus +'">'+
				 Essential+
				 Sticky+
				 '</span>'+
				 '</h5>'+
				 '<ul class="mui-list-inline text-muted">'+
				 '<li class="padrig">'+ data[i].FriendlyFileLength +'</li>'+
				 '<li class="padrig">'+ data[i].DownloadCount + '次下载' +'</li>'+
				 starCon+
				 '</ul>'+
				 '</li>';
			list += li;								
		}			
		ul = document.createElement('ul');
		ul.className = "mui-table-view";
		ul.innerHTML =  list;
		finel.appendChild(ul);
		}
								
	}
		
		var page = 1;
		var idName = "";
		
		function getDocumentwithlist(more,CategoryId,idname) {
			//showLoading('', '', '#FFFFFF', '50px', '1');	
			/*if(idname != null){
				idName = idname;
			}else{
				var selel = document.getElementsByClassName("mui-control-item mui-active");
				idName = selel[0].href.substring(selel[0].href.lastIndexOf("#") + 1, selel[0].href.length);
			}*/ 
			var selel = document.getElementsByClassName("mui-control-item mui-active");
			//console.log(selel[0])
			//idName = selel[0].href.substring(selel[0].href.lastIndexOf("#") + 1, selel[0].href.length);
			idName='itemmobile'
			var fragment = document.getElementById(idName);
			var cfragment = fragment.firstElementChild;
			var finel = cfragment.firstElementChild.querySelector('.mui-table-view');
			//var fragment = document.getElementById(idName);
			//var cfragment = fragment.firstElementChild;
			//var finel = cfragment.firstElementChild.querySelector('.mui-table-view');
			if(more){
				page++;
			} else {
				finel.innerHTML = '';
				page = 1;
			}
			var params = {
				categoryId : CategoryId,
				pageSize : 10,
				pageIndex : page
			};
			console.log("我是获取具体信息")
			getData('Document/GetByCategoryId', params, function(data) {
				//hideLoading();
				hideErr();
				console.log("我是获取具体信息"+data.Data)
				if(data.Type == 1) {				
					if(more == false&&data.Data =="暂无文档"){
						document.getElementById(idName).querySelector('.mui-pull-bottom-tips').style.display = 'none';
						//mui.toast(data.Data);
					}
					if(data.Data && typeof(data.Data) == 'object') {
						hideErrForList('',idName);
						if(data.Data.length <= 5) {
							document.getElementById(idName).querySelector('.mui-pull-bottom-tips').style.display = 'none';
						} else {
							document.getElementById(idName).querySelector('.mui-pull-bottom-tips').style.display = 'block';
						}
						createDocumentList(data.Data,idName);
					} else {
						//document.getElementById(idName).querySelector('.mui-pull-bottom-tips').style.display = 'none';
						if(!more){
							var errForList=showErrForList(data.Data,'','',idName);
							if(errForList){
								fragment.appendChild(showErrForList(data.Data,'','',idName))
							}
						}
						//mui.toast(data.Data);
						//showErr(data.Data,'','#FFFFFF','50px')
						//mui.toast(data.Data);
					}

				}else {
					//逻辑错误
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
		var allListLength;
		function getAllwithList(categoryId){
			var params = {
				categoryId : categoryId
			};
			getData('Document/GetByCategoryId', params, function(data) {
				console.log(data)
				allListLength = data.Data.length;
				getcategorywithlist(categoryId);
			})
		}
		
		function getsectionTypewithlist(categoryId) {
			//showLoading('', '', '#FFFFFF', '50px', '1');
			var params = {
				categoryId : categoryId
			};
			console.log("我是获取分类信息")
			getData('Document/GetCategories', params, function(data) {
				//hideLoading();
				hideErr();
				console.log(data)
				console.log("我是获取分类信息"+data.Data);
				if(data.Type == 1) {	
					if(allListLength > 0 && data.Data.length == 0){
						creatContentwithlist();
						getDocumentwithlist(false,categoryId);
					}else{
						if(data.Data.length == 0){
							showErr("暂无文档",'','#FFFFFF','50px')
						}else{
							creatContentwithlist(data.Data);
							getDocumentwithlist(false,categoryId);
						}
					}														
					creatTypes(data.Data);
				}else {
					//逻辑错误
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
		function getcategorywithlist(categoryId) {
			//showLoading('', '', '#FFFFFF', '50px', '1');
			var params = {
				categoryId : categoryId
			};
			console.log(categoryId)
			getData('Document/GetCategoryPath', params, function(data) {
				//hideLoading();
				console.log("我是获取头部地址"+data.Data);
				hideErr();
				if(data.Type == 1) {
					var a = [];
					var b;
					var length = data.Data.length > 2 ? "2" : data.Data.length;
					for(var i = 0;i<length;i++){						
						a.push(data.Data[i].CategoryName);
					}
					b = a.join("/");
					CategoryNameTitle.innerText = b;
					categoryNameTitle = b;
					document.getElementById("CategoryNameTitle").innerText = b;
					
					getsectionTypewithlist(categoryId);					
					mui("#contentArea").on('tap', '.mui-control-item', function(e) {
						//skip(this.getAttribute('id'));
						var ids = "item" + this.title + "mobile";
						var pulltips = document.getElementById(ids).getElementsByClassName('mui-pull-bottom-tips')[0];
						pulltips.style.display = "none";
						var loading = document.getElementById(ids).getElementsByClassName('mui-loading')[0];
						loading.style.display = "none";
						skip(this.getAttribute('id'));
						setTimeout(function(){
							var gallery = mui('#sliderSegmentedControl');
							var gallerys = mui('#slider');
							gallery.scroll().gotoPage(0); //跳转到第index张图片，index从0开始；
							gallerys.slider().gotoItem(0);
							mui('#refreshcontainer').scroll().scrollTo(0,0);
						},500)
						
					})
					//categoryNameTitle = data.Data[0].CategoryName;
					//CategoryNameTitle.innerText = data.Data[0].CategoryName;					
				}else {
					//逻辑错误
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
		mui.init({
			gestureConfig: {
				swipeBack: true //启用右滑关闭功能
			},
		});						

}
/*标签列表页*/
if(pageUrl == 'document-label-list.html') {
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
			mui("#contentArea").on('tap','.jh-news-list',function(e){				
				var documentId = this.getAttribute('id');
				var mediaType = Number(this.getAttribute('title'));
				var baseUrl = 'documentDetail.html';
				switch (mediaType){
					case 1:
						baseUrl = 'docImgsDetail.html';
						break;
					case 2:
						baseUrl = 'docVideoDetail.html';
						break;
					default:
						baseUrl = 'documentDetail.html'
						break;
				}
				var url = mui.os.plus ? baseUrl : baseUrl + '?documentId=' + documentId;
				var curl = shareUrl+baseUrl+ '?documentId=' + documentId;
				setlsData('currUrl', curl);				
				mui.openWindow({
					url: url,
					id: baseUrl,
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
						documentId: documentId,						
						currId: 'document.html'
					}
				})
			})
		})
			if(!mui.os.plus) {
				mui("#contentArea").on('tap', '.jh-news-list', function(e) {
				var documentId = this.getAttribute('id');
				var mediaType = Number(this.getAttribute('title'));
				var baseUrl = 'documentDetail.html';
				switch (mediaType){
					case 1:
						baseUrl = 'docImgsDetail.html';
						break;
					case 2:
						baseUrl = 'docVideoDetail.html';
						break;
					default:
						baseUrl = 'documentDetail.html'
						break;
				}
				var url = baseUrl + '?documentId=' + documentId;
				var curl = shareUrl+baseUrl+ '?documentId=' + documentId;
				setlsData('currUrl', curl);
				mui.openWindow({
					url: url,
					id: baseUrl
				});
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
					                		tagId = self.tagId;
				                  		});
			            			} else {	
				            			tagId = getUrlParam('tagId');
			            			}
									GetDocument(false,tagId);
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
					                	tagId = self.tagId;
				                  	});
			            		} else {	
				            		tagId = getUrlParam('tagId');
			            		}
			            		document.getElementById(idName).querySelector('.mui-pull-bottom-tips').style.display = 'block';
									GetDocument(true,tagId);
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
					tagId = self.tagId;	
					GetDocument(false,tagId);
				});
			} else {	
				tagName = getUrlParam('tagName');
				tagId = getUrlParam('tagId');
				GetDocument(false,tagId);
			}	
			if(mui.os.wechat){
				var currUrl = location.href.split('#')[0];
				weChatLogin(currUrl)
			}
		}	
	var creatNewElement = function(data, id) {			
		var fragment = document.getElementById(id);
		var cfragment = fragment.firstElementChild;
		var finel = document.getElementById("sliderGroup").querySelector('.mui-table-view');
		var ul;
		var list = '';
		if(data == "暂无文档"){
			var li = '<li class="mui-table-view-cell jh-news-list-no"><p style="text-align:center;">'+"暂无文档"+'</p></li>';			
			ul = document.createElement('ul');
			ul.className = "mui-table-view";
			ul.innerHTML =  li;
			finel.appendChild(ul);
		}else{
			for(var i = 0;i<data.length;i++){
			var li;
			var star = "";
			var stars = "";
			var starskong = "";
			var starHalf ="";
			function isInteger(obj) {
				return Math.floor(obj) === obj;
			}
			if(isInteger(data[i].StarReview) == false){
				var newNum=data[i].StarReview.toString().replace(/\d+\.(\d*)/,"$1");
				var newLength = newNum <= 5 ? (data[i].StarReview - 1) : data[i].StarReview ;
				var newLengths = data[i].StarReview + 1;
				starHalf = newNum <= 5 ? '<span class="fa fa-star-half-o tn-orange-color"></span>' : '';
			}else{
				var newLength = data[i].StarReview;
				var newLengths = data[i].StarReview;
			}
			for(var n = 0;n<newLength;n++){
				var starlist = '<span class="fa fa-star tn-orange-color"></span>';
				stars += starlist;
			}
			for(var m = 0;m<5 - newLengths;m++){
				var starkonglist = '<span class="fa fa-star-o"></span>';
				starskong += starkonglist;
			}
			star = stars + starHalf + starskong;
			var starCon = '<li class="starCon" style="float:right;margin-right:0px;">' + star + '<li>';
			var type = data[i].Extension;
			switch (type){
                case "wps":
                case "doc":
                case "docx":                   
                    var icon = '<span id="icon" class="fa fa-file-word-o tn-blue-color"></span>';
                    break;
                case "pps":
                case "pptx":
                case "ppt":                    
                    var icon = '<span id="icon" class="fa fa-file-powerpoint-o tn-yellow-color"></span>';
                    break;
                case "xls":
                case "xlsx":                   
                    var icon = '<span id="icon" class="fa fa-file-excel-o tn-green-color"></span>';
                    break;
                case "pdf":                   
                    var icon = '<span id="icon" class="fa fa-file-pdf-o tn-red-color"></span>';
                    break;
                case "txt":
                    var icon = '<span id="icon" class="fa fa-file-text-o"></span>';
                    break;
                case "jpg":
                case "png":
                case "bmp":
                case "gif":                    
                    var icon = '<span id="icon" class="fa fa-file-image-o tn-red-color"></span>';
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
                    var icon = '<span id="icon" class="fa fa-file-video-o tn-blue-color"></span>';
                    break;
                case "zip":
                case "rar":                   
                    var icon = '<span id="icon" class="fa fa-file-zip-o tn-red-color"></span>';
                    break;
                case "mp3":
                case "wav":
                case "rm":                    
                    var icon = '<span id="icon" class="fa fa-file-audio-o tn-red-color"></span>';
                    break;
                default:
                    var icon = '<span id="icon" class="fa fa-file-o"></span>';
                    break;
            }
			if(data[i].IsEssential) {
				Essential = '<span class="jh-red-border">' + "精华" + '</span>'
			} else {
				Essential = ''
			}
			if(data[i].IsSticky) {
				Sticky = '<span class="jh-red-border">' + "置顶" + '</span>'
			} else {
				Sticky = ''
			}
			if(Essential== '' && Sticky == ''){
				var disstatus = "none";
			}else{
				var disstatus = "inline-block"; 
			}
			//var dis = i > 5 ? 'none' : 'block';
			//var more = i > 5 ? '<div class="document_more" id="'+ CategoryId +'"><a href="#" class="document_more_text" id="'+ CategoryId +'">'+ "查看更多"+'</a></div>' : '';
			li = '<li class="mui-table-view-cell jh-news-list" id="'+ data[i].Id+'" title="'+data[i].MediaType+'">'+
				 '<h5 class="listTitle">'+
				 icon+
				 '<p class="iconp">'+
				 data[i].Subject+
				 '</p>'+
				 '<span class="status" style="display:'+ disstatus +'">'+
				 Essential+
				 Sticky+
				 '</span>'+
				 '</h5>'+
				 '<ul class="mui-list-inline text-muted documentlist">'+
				 '<li class="padrig">'+ data[i].FriendlyFileLength +'</li>'+
				 '<li class="padrig">'+ data[i].DownloadCount + '次下载' +'</li>'+
				 starCon+
				 '</ul>'+
				 '</li>';
			list += li;								
		}			
		ul = document.createElement('ul');
		ul.className = "mui-table-view";
		ul.innerHTML =  list;
		finel.appendChild(ul);
		}
		};
		var page = 1;
		var idName = "";
		function GetDocument(more,tagId) {
			if(!more) {
				showLoading('', '', '#FFFFFF', '90px', '1');
			}			
			var finel = document.getElementById("sliderGroup").querySelector('.mui-table-view');
			idName = "itemmobile";
			if(more) {
				page++;
			} else {
				finel.innerHTML = '';
				page = 1;
			}
			var params = {								
				TagId : tagId,
				pageSize: 10,
				pageIndex: page,							
			};
			getData('Document/GetByTagId', params, function(data) {	
				hideLoading();
				hideErr();
				var bottomTip = document.querySelectorAll('.mui-pull-bottom-tips');
				if(more == false&&data.Data =="暂无文档"){
					document.getElementById(idName).querySelector('.mui-pull-bottom-tips').style.display = 'none';
						//mui.toast(data.Data);
				}
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
							var errForList=showErrForList(data.Data,'','90px',idName);
							if(errForList){
								fragment.appendChild(showErrForList(data.Data,'','90px',idName))
							}
						}
						//document.getElementById(idName).querySelector('.mui-pull-bottom-tips').style.display = 'none';
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
		mui.init({			
			gestureConfig: {
				swipeBack: true //启用右滑关闭功能
			},
		});
}


if(pageUrl=='creatDoc.html'){
		var height = document.documentElement.clientHeight || document.body.clientHeight;
		document.getElementById('detail').style.minHeight = height + 'px';
		mui.previewImage();
		creatloadingEL();
		var commenttextarea = document.getElementById("comment-textarea");
		var selectMenu = document.getElementById("selectMenu");
		var facePop = document.getElementById("facePop");
		var bottomBarContainer = document.getElementById("bottomBarContainer");
		var bottomBar = document.getElementById("bottomBar");
		var creatBtn = document.getElementById("creat_Btn");
		var canComment = document.getElementById("canComment");
		var canDownload = document.getElementById("canDownload");
		var files = [];
		var Tags = "";
		var docAttachmentId = 0;
		var canCommentDoc = false;
		var canDownloadDoc = false;
		var classNames;
		var tagsList = [];
		var fragment = document.getElementById('alltypes');

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

		var deceleration = mui.os.ios ? 0.003 : 0.0009;
		mui('.mui-scroll-wrapper').scroll({
			bounce: false,
			indicators: true, //是否显示滚动条
			deceleration: deceleration
		});

		var pickdata = [];
		var picker = new mui.PopPicker();

		function getInputInfo() {
			var waiting = showWaiting();
			getData('Document/GetInputInfo', {}, function(data) {
				closeWaiting(waiting);
				if(data.Type == 1) {
					if(data.Data && typeof(data.Data) == 'object') {
						if(data.Data && data.Data.length != 0) {
							CategoryId = data.Data.Category[0].CategoryId;
							Categorytext.innerHTML = data.Data.Category[0].CategoryName;
							for(var i = 0; i < data.Data.Category.length; i++) {
								pickdata.push({
									value: data.Data.Category[i].CategoryId,
									text: data.Data.Category[i].CategoryName
								})
							}
							picker.setData(pickdata);
							creatTypes(data.Data.Tag);
						} else {

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
		Category.addEventListener('tap', function() {
			picker.show(function(selectItems) {
				CategoryId = selectItems[0].value;
				Categorytext.innerHTML = selectItems[0].text;
			})
		})

		mui("#alltypes").on('tap', '.typeitemContainer', function(e) {
			if(e.target.parentElement.className == "typeitem  typeItemActive") {
				e.target.parentElement.className = "typeitem"
				e.target.style.color = "#333";
				var icon = e.target.parentElement.getElementsByTagName("img")[0];
				icon.style.display = "none";
			} else {
				e.target.parentElement.className = "typeitem  typeItemActive"
				e.target.style.color = "#bf0a10";
				var icon = e.target.parentElement.getElementsByTagName("img")[0];
				icon.style.display = "inline-block";
			}
			classNames = document.getElementsByClassName("typeitem  typeItemActive");
			if(classNames.length >= 5) {
				if(classNames.length > 5) {
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
				if(classNames != null){
					for(var i = 0; i < classNames.length; i++) {
						tagsContainer = '<span id=' + classNames[i].innerText + ' class="newtag">' +
							classNames[i].innerText +
							'<span id=' + i + ' style="font-size: 15px;" class="mui-icon mui-icon-closeempty"></span>' +
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
				if(tagsAct.length > 0) {
					detail.style.display = "none";
					moreType.style.display = "block";
					creatBtn.style.display = "none";
				} else {
					detail.style.display = "none";
					moreType.style.display = "block";
					creatBtn.style.display = "none";

				}
			}
			if(document.getElementById("tags1").innerHTML != '') {
				document.getElementById("Tag").style.display = 'none'
			} else {
				document.getElementById("Tag").style.display = 'block'
			}
		}
		mui("#tags").on('tap', '.mui-icon-closeempty', function(e) {
			for(var i = 0; i < fragment.getElementsByTagName('p').length; i++) {
				if(fragment.getElementsByTagName('p')[i].id == e.target.parentElement.id) {
					fragment.getElementsByTagName('p')[i].style.color = "#333";
					fragment.getElementsByTagName('p')[i].parentNode.getElementsByTagName('img')[0].style.display = "none";
					fragment.getElementsByTagName('p')[i].parentNode.className = "typeitem"
				}
			}
			e.target.parentElement.parentElement.removeChild(e.target.parentElement);
			classNames = [];
			classNames = document.getElementsByClassName("typeitem  typeItemActive");
			if(document.getElementById("tags1").innerHTML != '') {
				document.getElementById("Tag").style.display = 'none'
			} else {
				document.getElementById("Tag").style.display = 'block'
			}
		})
		mui("#fileBox").on('tap', '.mui-icon-closeempty', function(e){
			changeUpload(false);
			jhUpload.files=[];
		})
		var creatTypes = function(data) {
			var a = [];
			var b = [];
			var fragment = document.getElementById('alltypes');
			fragment.innerHTML = "";
			for(var j = 0; j < data.length; j++) {
				a.push({
					TagName: data[j].TagName,
					length: data[j].TagName.length
				});

				function compare(property) {
					return function(a, b) {
						var value1 = a[property];
						var value2 = b[property];
						return value1 - value2;
					}
				}
			}
			b = a.sort(compare('length'))
			var lengthL = b.length;
			var c = b.slice(0, lengthL);

			var div;
			var ii = 1;
			var dataArray = [];
			for(var i = 0; i < c.length; i++) {
				ii++;
				div = document.createElement('div');
				div.className = "adaption";
				div.style.display = "inline-block";
				div.innerHTML = '<div  class="typeitem " ><p id=' + c[i].TagName + ' class="typeitemContainer">' + c[i].TagName + '</p><img class="checked" style="display:none;" src="../img/checked.png"/></div>';
				fragment.appendChild(div);
			}
		}

		function creatTags() {
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
		function plusReady() {

		}
		if(window.plus) {
			plusReady();
		} else {
			document.addEventListener('plusready', plusReady, false);
		}

		var sectionId;
		var currid = "";
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
			if(mui.os.wechat) {
				var currUrl = location.href.split('#')[0];
				weChatLogin(currUrl)
			}
			getInputInfo()
		}


		function CreateDoc(subject, summary, attachmentId, categoryId, disableComment, disableDownload, price, tagvalue) {
			var params = {
				Subject: subject,
				Summary: summary,
				AttachmentId: attachmentId,
				CategoryId: categoryId,
				DisableComment: disableComment,
				DisableDownload: disableDownload,
				Price: price,
				tagvalue: tagvalue
			};
			showLoading();
			postDatawithToken('Document/CreateDocument', params, function(data) {
				hideLoading();
				mui('#creat_Btn').button('reset');
				if(data.Type == 1) {
					mui.toast(data.Data);
					if(mui.os.plus) {
						var wobj = plus.webview.getWebviewById("userdocument.html");
						wobj.reload(true);
						setTimeout(function() {
							mui.back();
						}, 1000)
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
		var reward = "";
		var title = "";
		var body = "";

		canComment.addEventListener("toggle", function(event) {
			if(event.detail.isActive) {
				canCommentDoc = true
			} else {
				canCommentDoc = false
			}
		})
		canDownload.addEventListener("toggle", function(event) {
			if(event.detail.isActive) {
				canDownloadDoc = true
			} else {
				canDownloadDoc = false
			}
		})
		creatBtn.addEventListener('tap', function() {
			uploadDoc()
		})

		var tagstrs = "";

		function uploadDoc() {
			if(CategoryId == "") {
				mui.toast("请选择文库类别")
				return
			}
			if(docAttachmentId == 0) {
				mui.toast("请选择文档上传")
				return
			}
			title = TrimAll(document.getElementById("title").value);
			var tags1 = document.getElementById("tags1");
			var newtag = document.getElementsByClassName("newtag");
			for(var i = 0; i < newtag.length; i++) {
				var tag = newtag[i].innerText;
				tagsList.push(tag);
			}
			tagstrs = tagsList.join(';')
			body = TrimAll(commenttextarea.value);
			var price = TrimAll(document.getElementById("price").value);
			if(price == "") {
				price = 0
			}
			if(price>50){
				mui.toast("价格值必须在0到50之间")
				return
			}
			if(tagsList == "") {
				mui.toast("请至少选择一个标签")
				return
			}
			if(title == "") {
				mui.toast("标题不能为空")
				return
			}
			CreateDoc(title, body, docAttachmentId, CategoryId, !canCommentDoc, !canDownloadDoc, price, tagstrs)
		}
		document.getElementById("headerImg").addEventListener('tap', function() {
			if(mui.os.plus && mui.os.android) {
				mui.openWindow({
					url: 'selectFile_main.html',
					id: 'selectFile_main',
					waiting: {
						options: {
							loading: {
								height: '35px'
							}
						}
					}
				})
			} else if(mui.os.plus && mui.os.ios) {
				changeHpic()
			} else if(mui.os.wechat) {
				wxChooseImg(1, function(ids) {
					syncUpload(ids, 'Document/WeChatUploadFiles', function(data, fileurl) {
						changeUpload(true);
						var filename = fileurl.substring(fileurl.lastIndexOf('/') + 1, fileurl.length);
						var filetype = filename.substring(filename.lastIndexOf('.') + 1, filename.length);
						document.getElementById("fileType").innerHTML = getDocumentType(filetype);
						document.getElementById("fileName").innerHTML = filename;
						docAttachmentId = data.AttachmentId;
					})
				})
			} else {
				$("#file").click();
			}

		})
		var webfileurl = '';
		$("#file").on('change', function(e) {
			var URL = window.URL || window.webkitURL;
			var File = document.getElementById('file').files[0];
			var imgURL = URL.createObjectURL(File);
			webfileurl = e.target.value;
			showLoading();
			fileUploadforWeb('Document/UploadFile', function(data) {
				hideLoading();
				changeUpload(true);
				webfileurl = webfileurl.replace(/\\/g, "/");
				var filename = webfileurl.substring(webfileurl.lastIndexOf('/') + 1, webfileurl.length);
				var filetype = filename.substring(filename.lastIndexOf('/') + 1, filename.length);
				document.getElementById("fileType").innerHTML = getDocumentType(filetype);
				document.getElementById("fileName").innerHTML = filename;
				docAttachmentId = data.AttachmentId;
			})
		})

		function changeHpic() {
			if(mui.os.plus) {
				var a = [{
					title: "拍照"
				}, {
					title: "从手机相册选择"
				}];
				plus.nativeUI.actionSheet({
					title: "上传文件",
					cancel: "取消",
					buttons: a
				}, function(b) {
					switch(b.index) {
						case 0:
							break;
						case 1:
							getImage('/Document/UploadFile', function(fileurl, data) {
								changeUpload(true);
								var filename = fileurl.substring(fileurl.lastIndexOf('/') + 1, fileurl.length);
								var filetype = filename.substring(filename.lastIndexOf('.') + 1, filename.length);
								document.getElementById("fileType").innerHTML = getDocumentType(filetype);
								document.getElementById("fileName").innerHTML = filename;
								docAttachmentId = data.AttachmentId;
							});
							break;
						case 2:
							galleryImg('/Document/UploadFile', function(fileurl, data) {
								changeUpload(true);
								var filename = fileurl.substring(fileurl.lastIndexOf('/') + 1, fileurl.length);
								var filetype = filename.substring(filename.lastIndexOf('.') + 1, filename.length);
								document.getElementById("fileType").innerHTML = getDocumentType(filetype);
								document.getElementById("fileName").innerHTML = filename;
								docAttachmentId = data.AttachmentId;
							},'none');
							break;
						default:
							break
					}
				})
			}
		}
		var typeIcon = '<i class="fa  fa-file-word-o tn-blue-color"></i>';
		function getDocumentType(type) {
			type=type.toLowerCase();
			switch(type) {
				case "wps":
				case "doc":
				case "docx":
					typeIcon = '<i class="fa  fa-file-word-o tn-blue-color"></i>';
					break;
				case "pps":
				case "pptx":
				case "ppt":
					typeIcon = '<i class="fa  fa-file-powerpoint-o tn-yellow-color"></i>';
					break;
				case "xls":
				case "xlsx":
					typeIcon = '<i class="fa  fa-file-excel-o tn-green-color"></i>';
					break;
				case "pdf":
					typeIcon = '<i class="fa  fa-file-pdf-o tn-green-color"></i>';
					break;
				case "txt":
					typeIcon = '<i class="fa  fa-file-text-o tn-green-color"></i>';
					break;
				case "jpg":
				case "png":
				case "bmp":
				case "gif":
					typeIcon = '<i class="fa  fa-file-image-o tn-green-color"></i>';
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
					typeIcon = '<i class="fa  fa-file-video-o tn-blue-color"></i>';
					break;
				case "zip":
				case "rar":
					typeIcon = '<i class="fa  fa-file-zip-o tn-red-color"></i>';
					break;
				case "mp3":
				case "wav":
				case "rm":
					typeIcon = '<i class="fa  fa-file-audio-o tn-red-color"></i>';
					break;
				default:
					typeIcon = '<i class="fa  fa-file-o tn-black-color"></i>'
					break;
			}
			return typeIcon;
		}

		function changeUpload(hasFile) {
			if(hasFile) {
				document.getElementById("fileBox").style.display = 'inherit';
				document.getElementById("addFile").style.display = 'none';
			} else {
				document.getElementById("fileBox").style.display = 'none';
				document.getElementById("addFile").style.display = 'inherit';
			}
		}
		window.addEventListener('getFile', function(event) {
			//获得事件参数
			var fileUrl = event.detail.fileUrl;
			jhUpload.files = [];
			var a = new Date().getTime();
			jhUpload.files.push({
				name: "uploadkey" + a,
				path: fileUrl
			});
			fileUploadforApp('/Document/UploadFile', function(fileurl, data) {
				changeUpload(true);
				var filename = fileurl.substring(fileurl.lastIndexOf('/') + 1, fileurl.length);
				var filetype = filename.substring(filename.lastIndexOf('.') + 1, filename.length);
				document.getElementById("fileType").innerHTML = getDocumentType(filetype);
				document.getElementById("fileName").innerHTML = filename;
				docAttachmentId = data.AttachmentId;
			})
		})
	
}