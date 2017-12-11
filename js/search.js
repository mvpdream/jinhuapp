var searchInput = document.getElementById("searchInput");
var searchAll = document.getElementById("searchAll");
var searchInformation = document.getElementById("searchInformation");
var searchInvitation = document.getElementById("searchInvitation");
var searchQuestion = document.getElementById("searchQuestion");
var Information = document.getElementById("Information");
var Invitation = document.getElementById("Invitation");
var Question = document.getElementById("Question");
var Document = document.getElementById("Document");
var inputValue = document.getElementById("searchInput").value;
var hisTime;
var hisItem;
var firstKey;
var moreData = document.getElementById("more");
var a = document.getElementById('main');
//var a = document.getElementsByClassName("mui-active")[1];
//var id=a.querySelector('.mui-active').id;
//var id = document.getElementById('select').querySelector('.mui-active').id
document.getElementById('scroll').addEventListener('scrollbottom', function() {
	var id = document.getElementById('select').querySelector('.mui-active').id
	moreData.classList.remove('mui-hidden')
	moreData.classList.add('mui-visibility')
	if(id == "searchInformationA") {
		document.getElementsByClassName("mui-pull")[0].style.display = "block";
		setTimeout(function() {
			pageIndex1++;
			searchMaster(pageIndex1, 1, 1,1)
		}, 1500)

	}
	if(id == "searchInvitationA") {
		document.getElementsByClassName("mui-pull")[0].style.display = "block";
		setTimeout(function() {
			pageIndex2++;
			searchMaster(1, pageIndex2, 1,1)
		}, 1500)
	}
	if(id == "searchQuestionA") {
		document.getElementsByClassName("mui-pull")[0].style.display = "block";
		setTimeout(function() {
			pageIndex3++;
			searchMaster(1, 1, pageIndex3,1)
		}, 1500)
	}
	if(id == "searchDocumentA") {
		document.getElementsByClassName("mui-pull")[0].style.display = "block";
		setTimeout(function() {
			pageIndex4++;
			searchMaster(1, 1, 1,pageIndex4)
		}, 1500)
	}
	if(id == "searchAllA") {

	}
	/*setTimeout(function() { 
		pageIndex1++;
		pageIndex2++;
		pageIndex3++;
		searchMaster(pageIndex1, pageIndex2, pageIndex3)
					
	}, 1500)*/

});
document.getElementById("closePage").addEventListener('tap', function() {
	mui.back()
})
mainHidden();
init();
//判断从哪个页面跳转过来
var type = getUrlParam('type');
if(type == "post") {
	$("#searchAllA").removeClass("mui-active");
	$("#searchInvitationA").addClass("mui-active");
} else if(type == "ask") {
	$("#searchAllA").removeClass("mui-active");
	$("#searchQuestionA").addClass("mui-active");
} else if(type == "news") {
	$("#searchAllA").removeClass("mui-active");
	$("#searchInformationA").addClass("mui-active");
} else if(type == "document") {
	$("#searchAllA").removeClass("mui-active");
	$("#searchDocumentA").addClass("mui-active");
}
//localStorage取值，判断本地存储中有没有数据
function init() {
	hisTime = [];
	hisItem = [];
	$("#localMain").html("<div class='searchHistory'>搜索历史</div>");
	$(".searchHistory").after("");
	for(var i = 0; i < localStorage.length; i++) {
		if(!isNaN(localStorage.key(i))) {
			hisTime.push(localStorage.key(i));
			hisTime.sort();
			$(".clearLocal").html("清除历史记录")
		}
	}
	for(var j = 0; j < hisTime.length; j++) {
		hisItem.push(localStorage.getItem(hisTime[j]));
	}
	for(var i = 0; i < hisItem.length; i++) {
		$(".searchHistory").after("<div class='localMain'><div class='localList' id='localList'>" + hisItem[i] + "</div><i class='fa fa-close clearThis' aria-hidden='true' onclick='clearthis(this)'></i></div>")
	}
	if(hisItem.length == 0) {
		$(".clearLocal").html("暂无历史记录");
	}
}
//将搜索内容存入	 localStorage
function setHistory() {
	var inputValue = document.getElementById("searchInput").value;
	var time = (new Date()).getTime();
	//输入的内容localStorage有记录
	init()
	if(jQuery.inArray(inputValue, hisItem) >= 0) {
		for(var j = 0; j < localStorage.length; j++) {
			if(inputValue == localStorage.getItem(localStorage.key(j))) {
				localStorage.removeItem(localStorage.key(j));
			}
		}
		localStorage.setItem(time, inputValue);
	}
	//输入的内容localStorage没有记录
	else {
		//限制了8条记录，这里进行判断
		if(hisItem.length > 7) {
			firstKey = hisTime[0]
			localStorage.removeItem(firstKey);
			localStorage.setItem(time, inputValue);
		} else {
			localStorage.setItem(time, inputValue)
		}
	}
}
//清除所有记录
$(document).delegate(".clearLocal", "tap", function() {
	for(var j = 0; j < localStorage.length; j++) {
		if(!isNaN(localStorage.key(j))) {
			localStorage.removeItem(localStorage.key(j));
			j--;
		}
	}
	init();
	$(".clearLocal").html("暂无历史记录")
})
//清除单个记录
//	    $(".clearThis").live("tap",function(){
//	    	console.log(1)
//	    })
//	   	   	   
function clearthis(obj) {
	//var value=this.parentNode;
	var value = obj.parentNode.getElementsByTagName("div")[0].innerText;
	for(var j = 0; j < localStorage.length; j++) {
		if(value == localStorage.getItem(localStorage.key(j))) {
			localStorage.removeItem(localStorage.key(j));
			init();
			var a = '<div class="searchHistory">搜索历史</div>';
			var b = $("#localMain").html();
			if(a == b) {
				$(".clearLocal").html("暂无历史记录")
			}
		}
	}
};
//点击搜索记录跳转
/*$("#local").delegate(".localList","tap",function(){
	 	    var value=$(".localList").html();
	 	    document.getElementById("searchInput").value = value;
	 	    inputValue=value;
	 	    localHidden()
			var params = {
                keyword: value
           };
			searchMaster();
    })*/
mui.plusReady(function() {
	mui("#localMain").on('tap', '.localList', function(e) {
		var value = this.innerText;
		document.getElementById("searchInput").value = value;
		inputValue = value;
		localHidden()
		var params = {
			keyword: value
		};
		searchMaster(1, 1, 1);
		document.activeElement.blur();
	})
})
if(!mui.os.plus) {
	mui("#local").on('tap', '.localList', function(e) {
		var value = this.innerText;
		document.getElementById("searchInput").value = value;
		inputValue = value;
		localHidden()
		var params = {
			keyword: value
		};
		searchMaster(1, 1, 1);
	})
}
//搜索记录出现，其他隐藏
function mainHidden() {
	$(".mui-scroll-wrapper").css("display", "none");
	$("#searchAll").css("display", "none");
	$("#refreshContainer").css("display", "none")
	$("#searchInformation").css("display", "none");
	$("#searchInvitation").css("display", "none");
	$("#searchQuestion").css("display", "none");
	$("#searchDocument").css("display", "none");
	$("#local").css("display", "block");
	$(".clearLocal").css("display", "block");
	$(".searchHistory").css("display", "block");

}
//搜索记录隐藏，其他出现
function localHidden() {
	$("#local").css("display", "none");
	$(".clearLocal").css("display", "none");
	$(".searchHistory").css("display", "none");
	$(".mui-scroll-wrapper").css("display", "block");
	$("#searchAll").css("display", "block");
	$("#searchInformation").css("display", "block");
	$("#searchInvitation").css("display", "block");
	$("#searchQuestion").css("display", "block");
	$("#searchDocument").css("display", "block");
}
var pageIndex1 = 1;
var pageIndex2 = 1;
var pageIndex3 = 1;
var pageIndex4 = 1;
//搜索全部
function MobileSearchAll() {
	$("#refreshContainer").css("display", "none")
	$("#searchAll").css("display", "block")
	var inputValue = document.getElementById("searchInput").value;
	var params = {
		keyword: inputValue
	};
	getData("Search/MobileSearchAll", params, function(data) {
		console.log(data)
		var contentItems=JSON.parse(data.ContentItem);
		var threads=JSON.parse(data.Thread);
		var questions=data.Question.length != 0 ? JSON.parse(data.Question): '';
		var docs=data.DocResults.length != 0 ? JSON.parse(data.DocResults): '';
		//不进行判断当某一个为空的时候会报错
		if(contentItems == null && threads == null && questions == null&&docs==null) {
			Information.innerHTML = '<div class="mui-content-padded jh-search-list novalue " id="searchInformationHearder" >' +
				'<p class="normal-color"style="padding-left:0.5rem;padding-right:0.5rem;">暂无关键字为“<span class="theme-color">' + inputValue + '</span>”的相关内容</p>' +
				//'<div class="divide"></div>' +
				'</div>';
		} else {
			if(contentItems == null || contentItems.ContentItemList == null) {
				lengthInformation = 0;
			} else {
				lengthInformation = contentItems.ContentItemList.length;
			};
			if(threads == null || threads.ThreadList == null) {
				lengthInvitation = 0;
			} else {
				lengthInvitation = threads.ThreadList.length;
			};
			if(questions == null || questions.QuestionList == null) {
				lengthQuestion = 0;
			} else {
				lengthQuestion = questions.QuestionList.length;
			};
			if(docs == null || docs.DocList == null) {
				lengthDocument = 0;
			} else {
				lengthDocument = docs.DocList.length;
			};
			//搜索出的咨询内容
			if(contentItems == null || contentItems.ContentItemList == null) {
				Information.innerHTML = '<div class="mui-content-padded jh-search-list " id="searchInformationHearder" >' +
					'<p class="normal-color">暂无关键字为“<span class="theme-color">' + inputValue + '</span>”的相关资讯</p>' +
					//'<div class="divide"></div>' +
					'</div>' +
					'<div class="jh-gray-bar"></div>';
			} else {
				Information.innerHTML = '<div class="mui-content-padded jh-search-list" id="searchInformationHearder" >' +
					'<p id="informationmore">搜“<span class="theme-color">' + inputValue + '</span>”相关资讯(' + contentItems.TotalRecords + ')</p>' +
					'<div class="divide"></div>' +
					'</div>' +
					'<div class="jh-gray-bar"></div>'
				for(var i = 0; i < lengthInformation; i++) {
					document.getElementById("searchInformationHearder").innerHTML += '<a href="#"class="jh-overflow-h jh-search-colorHeader"  id="' + contentItems.ContentItemList[i].Id + '" module="' + contentItems.ContentItemList[i].ModelName + '">' + contentItems.ContentItemList[i].Subject + '</a>' +
						'<a href="#"class="jh-overflow-h jh-search-colorMain jh-search-body" id="'+ contentItems.ContentItemList[i].Id +'"module="' + contentItems.ContentItemList[i].ModelName + '">' + contentItems.ContentItemList[i].Body + '</a>' +
						'<a href="#"class="jh-overflow-h jh-search-time">' + contentItems.ContentItemList[i].DateCreated + '</a>' +
						'<a href="#"class="jh-overflow-h jh-search-type"   id="' + contentItems.ContentItemList[i].Category.Id + '" >' + contentItems.ContentItemList[i].Category.Name + '</a>' +
						'<div class="divide"></div>';
				};
				var informationmore = document.getElementById("informationmore");
				informationmore.addEventListener('tap', function() {
					$("#searchAllA").removeClass("mui-active");
					$("#searchInformationA").addClass("mui-active");
					$("#searchAll").css("display", "none")
					$("#refreshContainer").css("display", "block")
					mui('#refreshContainer').scroll().scrollTo(0, 0);
					information();
					//$("#searchInformation").style.display = "block";
				})
			}
			//搜索出的贴子内容
			if(threads == null || threads.ThreadList == null) {
				Invitation.innerHTML = '<div class="mui-content-padded jh-search-list " id="searchInvitationHearder" >' +
					'<p class="normal-color" >暂无关键字为“<span class="theme-color">' + inputValue + '</span>”的相关贴子</p>' +
					//'<div class="divide"></div>' +
					'</div>' +
					'<div class="jh-gray-bar"></div>';
			} else {

				Invitation.innerHTML = '<div class="mui-content-padded jh-search-list" id="searchInvitationHearder" >' +
					'<p id="invitationmore">搜“<span class="theme-color">' + inputValue + '</span>”相关贴子(' + threads.TotalRecords + ')</p>' +
					'<div class="divide"></div>' +
					'</div>' +
					'<div class="jh-gray-bar"></div>';
				for(var i = 0; i < lengthInvitation; i++) {
					document.getElementById("searchInvitationHearder").innerHTML += '<a href="#"class="jh-overflow-h jh-search-colorHeader" id="' + threads.ThreadList[i].Id + '">' + threads.ThreadList[i].Subject + '</a>' +
						'<a href="#"class="jh-overflow-h jh-search-colorMain jh-search-body" id="'+ threads.ThreadList[i].Id +'">' + threads.ThreadList[i].Body + '</a>' +
						'<a href="#"class="jh-overflow-h jh-search-time">' + threads.ThreadList[i].DateCreated + '</a>' +
						'<a href="#"class="jh-overflow-h jh-search-type jh-search-tieba"  id="' + threads.ThreadList[i].BarSection.Id + '">' + threads.ThreadList[i].BarSection.Name + '</a>' +
						'<div class="divide"></div>';
				};
				var invitationmore = document.getElementById("invitationmore");
				invitationmore.addEventListener('tap', function() {
					$("#searchAllA").removeClass("mui-active");
					$("#searchInvitationA").addClass("mui-active");
					$("#searchAll").css("display", "none")
					$("#refreshContainer").css("display", "block")
					mui('#refreshContainer').scroll().scrollTo(0, 0);
					invitation();
				})
			}
			//搜索出的问答内容
			if(questions != ''){
				if(questions == null || questions.QuestionList == null) {
					Question.innerHTML = '<div class="mui-content-padded jh-search-list " id="searchQuestionHearder" >' +
						'<p class="normal-color" >暂无关键字为“<span class="theme-color">' + inputValue + '</span>”的相关问答</p>' +
						//'<div class="divide"></div>' +
						'</div>'
					+'<div class="jh-gray-bar"></div>';
				} else {				
					Question.innerHTML = '<div class="mui-content-padded jh-search-list" id="searchQuestionHearder" >' +
						'<p id="questionmore">搜“<span class="theme-color">' + inputValue + '</span>”相关问答(' + questions.TotalRecords + ')</p>' +
						'<div class="divide"></div>' +
						'</div>'
					+'<div class="jh-gray-bar"></div>';
					for(var i = 0; i < lengthQuestion; i++) {
						var Essential;
						var resolved = ""; //QuestionStatus
						classn = questions.QuestionList[i].QuestionStatus == "未解决" ? 'jh-red-border' : 'jh-green-border';
						text1 = questions.QuestionList[i].QuestionStatus;
						resolved = '<span class=' + classn + '>' + text1 + '</span>'
						Essential = questions.QuestionList[i].IsEssential == true ? '<span class="jh-red-border">' + "精华" + '</span>' : '';
	
						document.getElementById("searchQuestionHearder").innerHTML += '<p class="noCenter"><a href="#"class="jh-overflow-h jh-search-colorHeader"  id="' + questions.QuestionList[i].Id + '">' + questions.QuestionList[i].Subject + '</a>' +
							'<span class="status">' +
							resolved +
							Essential +
							'</span></p>' +
							'<a href="#"class="jh-overflow-h jh-search-colorMain jh-search-body" id="'+ questions.QuestionList[i].Id +'">' + questions.QuestionList[i].Body + '</a>' +
							'<div class="jh-lable">' +
							'<a href="#"class="jh-overflow-h jh-search-questiontime jh-search-questiontime' + i + '">' + questions.QuestionList[i].DateCreated + '</a>' +
	
							'<div class="tags" id="tags' + i + '"></div>' +
	
							'</div>' +
							'<div class="divide"></div>';
						lengthQuestionTags = questions.QuestionList[i].Tags.length;
						var a1 = [];
						var b = [];
						if(lengthQuestionTags != 0) {
							for(var j = 0; j < questions.QuestionList[i].Tags.length; j++) {
								a1.push({
									TagName: questions.QuestionList[i].Tags[j].Name,
									length: questions.QuestionList[i].Tags[j].Name.length
								});
	
								function compare(property) {
									return function(a, b) {
										var value1 = a[property];
										var value2 = b[property];
										return value1 - value2;
									}
								}
								//a1.push(data[i].Tags[j].TagName);
							}
							b = a1.sort(compare('length'))
							var lengthL = b.length;
							var c = b.slice(0, lengthL);
							for(var r = 0; r < c.length; r++) {
								var tags = document.getElementById('tags' + i + '');
								var a;
								a = document.createElement("a");
								a.className = "jh-overflow-h1 jh-search-typeQuestion";
								a.id = c[r].TagName;
								a.innerHTML = '<span class="tag">' + c[r].TagName + '</span>'
								tags.appendChild(a);
							}
						};
						var questionmore = document.getElementById("questionmore");
						questionmore.addEventListener('tap', function() {
							$("#searchAllA").removeClass("mui-active");
							$("#searchQuestionA").addClass("mui-active");
							$("#searchAll").css("display", "none")
							$("#refreshContainer").css("display", "block")
							mui('#refreshContainer').scroll().scrollTo(0, 0);
							question();
						})
					}
				}
			}			
			//搜索出的文库内容
			if(docs != ''){
				if(docs == null || docs.DocList == null || docs.DocList.length == 0) {
					Document.innerHTML = '<div class="mui-content-padded jh-search-list " id="searchDocumentHearder" >' +
						'<p class="normal-color" >暂无关键字为“<span class="theme-color">' + inputValue + '</span>”的相关文档</p>' +
						//'<div class="divide"></div>' +
						'</div>'
					//+'<div class="jh-gray-bar"></div>';
				} else {
					Document.innerHTML = '<div class="mui-content-padded jh-search-list" id="searchDocumentHearder" >' +
						'<p id="documentmore">搜“<span class="theme-color">' + inputValue + '</span>”相关文档(' + docs.TotalRecords + ')</p>' +
						'<div class="divide"></div>' +
						'</div>'
					//+'<div class="jh-gray-bar"></div>';
					for(var i = 0; i < lengthDocument; i++) {
						var Essential;
						var resolved = ""; //QuestionStatus
						//classn = docs.DocList[i].QuestionStatus == "未解决" ? 'jh-red-border' : 'jh-green-border';
						text1 = docs.DocList[i].QuestionStatus;
						//resolved = '<span class=' + classn + '>' + text1 + '</span>'
						Essential = docs.DocList[i].IsEssential == true ? '<span class="jh-red-border">' + "精华" + '</span>' : '';
						var icon = getDocumentType(docs.DocList[i].Extension);
						document.getElementById("searchDocumentHearder").innerHTML += 
							'<div id="'+ docs.DocList[i].Id +'" class="DocList" title="'+docs.DocList[i].MediaType+'">'+
							icon+'<p class="noCenter"><a href="#"class="jh-overflow-h jh-search-colorHeader"  id="' + docs.DocList[i].Id + '">' + docs.DocList[i].Subject + '</a>' +
							'<span class="status">' +
							//resolved +
							Essential +
							'</span></p>' +
							'<a href="#"class="jh-overflow-h jh-search-colorMain jh-search-body">' + docs.DocList[i].Body + '</a>' +
							'</div>'+
							'<div class="jh-lable">' +
							'<a href="#"class="jh-overflow-h jh-search-questiontime jh-search-questiontime' + i + '">' + docs.DocList[i].DateString + '</a>' +
	
							'<div class="tags" id="Doctags' + i + '"></div>' +
	
							'</div>' +
							'<div class="divide"></div>';
						lengthDocumentTags = docs.DocList[i].TagNames.length;
						var a1 = [];
						var b = [];
						if(lengthDocumentTags != 0) {
							for(var j = 0; j < lengthDocumentTags; j++) {
								a1.push({
									TagName: docs.DocList[i].TagNames[j].TagName,
									TagId:docs.DocList[i].TagNames[j].TagId,
									length: docs.DocList[i].TagNames[j].TagName.length
								});
	
								function compare(property) {
									return function(a, b) {
										var value1 = a[property];
										var value2 = b[property];
										return value1 - value2;
									}
								}
								//a1.push(data[i].Tags[j].TagName);
							}
							b = a1.sort(compare('length'))
							var lengthL = b.length;
							var c = b.slice(0, lengthL);
							for(var r = 0; r < c.length; r++) {
								var tags = document.getElementById('Doctags' + i + '');
								var a;
								a = document.createElement("a");
								a.className = "jh-overflow-h1 jh-search-typeDocument";
								a.id = c[r].TagName;
								a.title = c[r].TagId;
								a.innerHTML = '<span class="tag">' + c[r].TagName + '</span>'
								tags.appendChild(a);
							}
						};
						var documentmore = document.getElementById("documentmore");
						documentmore.addEventListener('tap', function() {
							$("#searchAllA").removeClass("mui-active");
							$("#searchDocumentA").addClass("mui-active");
							$("#searchAll").css("display", "none")
							$("#refreshContainer").css("display", "block")
							mui('#refreshContainer').scroll().scrollTo(0, 0);
							DocumentSearch();
						})
					}
				}
			}			
		}

		//当三个内容全部都没有时不存入localStorage 
		if(contentItems == null && threads == null && questions == null) {
			console.log("无搜索结果，不存入localStorage")
		} else {
			setHistory()
		}

	}, function(err) {
		setErr()
	})
}
//搜索主函数
function searchMaster(PageIndex1, PageIndex2, PageIndex3, PageIndex4) {
	var inputValue = document.getElementById("searchInput").value;
	if($("#searchAllA").hasClass('mui-active')) {
		MobileSearchAll()
	} else if($("#searchInformationA").hasClass('mui-active')) {
		//资讯tab
		$("#searchAll").css("display", "none")
		$("#refreshContainer").css("display", "block")
		//mui.trigger(document.getElementById("searchInformationA"), 'tap');
		//mui('#refreshContainer').scroll().scrollTo(0, 0);
		//var newValue = document.getElementById("searchInput").value;										
		var params = {
			keyword: inputValue,
			pageSize: 10,
			PageIndex: PageIndex1
		};
		if(PageIndex1 == 1) {
			mui('#refreshContainer').scroll().scrollTo(0, 0);
			searchInformation.innerHTML = '<div id="dv1"></div>';
		}
		getData("Search/MobileCmsSearch", params, function(data) {
			console.log(data)
			//不进行判断当某一个为空的时候会报错
			if(data.Data == null || data.Data.length == 0) {
				document.getElementsByClassName("mui-pull")[0].style.display = "none";
				lengthInformation = 0;
			} else {
				lengthInformation = data.Data.length;
			}
			//搜索出的咨询内容
			if(PageIndex1 == 1 && lengthInformation == 0) {
				searchInformation.innerHTML = '<div class="mui-content-padded jh-search-list " id="searchInformationHearder" >' +
					'<p class="normal-color" style="padding-top:12px;">暂无关键字为“<span class="theme-color">' + inputValue + '</span>”的相关资讯</p>' +
					//'<div class="divide"></div>' +
					'</div>';
			} else {
				setHistory()
				searchInvitation.innerHTML = '<div id="dv2"></div>';
				searchQuestion.innerHTML = '<div id="dv3"></div>';
				for(var i = 0; i < lengthInformation; i++) {
					$("#dv1").before('<a href="#"class="jh-overflow-h jh-search-colorHeader" id="' + data.Data[i].Id + '" module="' + data.Data[i].ModelName + '">' + data.Data[i].Subject + '</a>' +
						'<a href="#"class="jh-overflow-h jh-search-colorMain jh-search-body" id="'+ data.Data[i].Id +'"module="' + data.Data[i].ModelName + '">' + data.Data[i].Body + '</a>' +
						'<a href="#"class="jh-overflow-h jh-search-time">' + data.Data[i].DateCreated + '</a>' +
						'<a href="#"class="jh-overflow-h jh-search-type"   id="' + data.Data[i].Category.Id + '" >' + data.Data[i].Category.Name + '</a>' +
						'<div class="divide"></div>');
				};
			}
			//搜索出的贴子内容
			searchInvitation.innerHTML = '<div id="dv2"></div>';
			//搜索出的问答内容
			searchQuestion.innerHTML = '<div id="dv3"></div>';
			//mui.trigger(document.getElementById("searchInformationA"), 'tap');
		}, function(err) {
			setErr('','90px')
		});
	} else if($("#searchInvitationA").hasClass('mui-active')) {
		//mui.trigger(document.getElementById("searchInvitationA"), 'tap');
		var inputValue = document.getElementById("searchInput").value;
		var params = {
			keyword: inputValue,
			pageSize: 10,
			PageIndex: PageIndex2
		};
		if(PageIndex2 == 1) {
			mui('#refreshContainer').scroll().scrollTo(0, 0);
			searchInvitation.innerHTML = '<div id="dv2"></div>';
		}

		getData("Search/MobileThreadSearch", params, function(data) {
			//不进行判断当某一个为空的时候会报错

			if(data.Data == null || data.Data.length == 0) {
				document.getElementsByClassName("mui-pull")[0].style.display = "none";
				lengthInvitation = 0;
			} else {
				lengthInvitation = data.Data.length;
			}

			//搜索出的资讯内容
			searchInformation.innerHTML = '<div id="dv1"></div>';
			//搜索出的贴子内容

			if(PageIndex2 == 1 && lengthInvitation == 0) {
				searchInvitation.innerHTML = '<div class="mui-content-padded jh-search-list " id="searchInvitationHearder" >' +
					'<p class="normal-color" style="padding-top:12px;">暂无关键字为“<span class="theme-color">' + inputValue + '</span>”的相关贴子</p>' +
					//'<div class="divide"></div>' +
					'</div>';
			} else {
				setHistory()
				searchInformation.innerHTML = '<div id="dv1"></div>'
				searchQuestion.innerHTML = '<div id="dv3"></div>';
				for(var i = 0; i < lengthInvitation; i++) {
					$("#dv2").before('<a href="#"class="jh-overflow-h jh-search-colorHeader"  id="' + data.Data[i].Id + '">' + data.Data[i].Subject + '</a>' +
						'<a href="#"class="jh-overflow-h jh-search-colorMain jh-search-body" id="'+ data.Data[i].Id +'">' + data.Data[i].Body + '</a>' +
						'<a href="#"class="jh-overflow-h jh-search-time">' + data.Data[i].DateCreated + '</a>' +
						'<a href="#"class="jh-overflow-h jh-search-type jh-search-tieba"  id="' + data.Data[i].BarSection.Id + '">' + data.Data[i].BarSection.Name + '</a>' +
						'<div class="divide"></div>');
				};
			}

			//搜索出的问答内容
			searchQuestion.innerHTML = '<div id="dv3"></div>';
			//mui.trigger(document.getElementById("searchInvitationA"), 'tap');
		}, function(err) {
			setErr('','90px')
		})
	} else if($("#searchQuestionA").hasClass('mui-active')) {
		var inputValue = document.getElementById("searchInput").value;
		//mui.trigger(document.getElementById("searchQuestionA"), 'tap');
		var params = {
			keyword: inputValue,
			pageSize: 10,
			PageIndex: PageIndex3
		};
		if(PageIndex3 == 1) {
			mui('#refreshContainer').scroll().scrollTo(0, 0);
			searchQuestion.innerHTML = '<div id="dv3"></div>';
		}
		getData("Search/MobileAskSearch", params, function(data) {
			console.log(data)
			//不进行判断当某一个为空的时候会报错
			if(data.Data == null || data.Data.length == 0) {
				document.getElementsByClassName("mui-pull")[0].style.display = "none";
				lengthQuestion = 0;
			} else {
				lengthQuestion = data.Data.length;
			}
			//搜索出的资讯内容
			searchInformation.innerHTML = '<div id="dv1"></div>';
			//搜索出的贴子内容
			searchInvitation.innerHTML = '<div id="dv2"></div>';
			//搜索出的问答内容
			if(PageIndex3 == 1 && lengthQuestion == 0) {
				searchQuestion.innerHTML = '<div class="mui-content-padded jh-search-list " id="searchQuestionHearder" >' +
					'<p class="normal-color" style="padding-top:12px;">暂无关键字为“<span class="theme-color">' + inputValue + '</span>”的相关问答</p>' +
					//'<div class="divide"></div>' +
					'</div>';
			} else {
				setHistory()
				searchInformation.innerHTML = '<div id="dv1"></div>';
				searchInvitation.innerHTML = '<div id="dv2"></div>';
				for(var i = 0; i < lengthQuestion; i++) {
					var Essential;
					var resolved = ""; //QuestionStatus

					classn = data.Data[i].QuestionStatus == "未解决" ? 'jh-red-border' : 'jh-green-border';
					text1 = data.Data[i].QuestionStatus;
					resolved = '<span class=' + classn + '>' + text1 + '</span>'
					Essential = data.Data[i].IsEssential == true ? '<span class="jh-red-border">' + "精华" + '</span>' : '';
					$("#dv3").before('<p class="noCenter"><a href="#"class="jh-overflow-h jh-search-colorHeader"  id="' + data.Data[i].Id + '">' + data.Data[i].Subject + '</a>' +
						'<span class="status">' +
						resolved +
						Essential +
						'</span></p>' +
						'<a href="#"class="jh-overflow-h jh-search-colorMain jh-search-body" id="'+ data.Data[i].Id +'">' + data.Data[i].Body + '</a>' +
						'<div class="jh-lable">' +
						'<a href="#"class="jh-overflow-h jh-search-questiontime jh-search-questiontime' + i + '">' + data.Data[i].DateCreated + '</a>' +

						'<div class="tags" id="tags' + i + '"></div>' +
						'</div>' +
						'<div class="divide"></div>');
					lengthQuestionTags = data.Data[i].Tags.length;
					var a1 = [];
					var b = [];
					if(data.Data[i].Tags.length != 0) {
						for(var j = 0; j < data.Data[i].Tags.length; j++) {
							a1.push({
								TagName: data.Data[i].Tags[j].Name,
								length: data.Data[i].Tags[j].Name.length
							});

							function compare(property) {
								return function(a, b) {
									var value1 = a[property];
									var value2 = b[property];
									return value1 - value2;
								}
							}
							//a1.push(data[i].Tags[j].TagName);
						}
						b = a1.sort(compare('length'))
						var lengthL = b.length;
						var c = b.slice(0, lengthL);
						for(var r = 0; r < c.length; r++) {
							var tags = document.getElementById('tags' + i + '');
							var a;
							a = document.createElement("a");
							a.className = "jh-overflow-h1 jh-search-type";
							a.id = c[r].TagName;
							a.innerHTML = '<span class="tag">' + c[r].TagName + '</span>'
							tags.appendChild(a);
						}
					}
				};
			}
			//mui.trigger(document.getElementById("searchQuestionA"), 'tap');

		}, function(err) {
			setErr('','90px')
		})
	}else if($("#searchDocumentA").hasClass('mui-active')) {
		var inputValue = document.getElementById("searchInput").value;
		//mui.trigger(document.getElementById("searchQuestionA"), 'tap');
		var params = {
			keyword: inputValue,
			pageSize: 10,
			PageIndex: PageIndex4
		};
		if(PageIndex4 == 1) {
			mui('#refreshContainer').scroll().scrollTo(0, 0);
			searchDocument.innerHTML = '<div id="dv4"></div>';
		}
		getData("Search/MobileDocSearch", params, function(data) {
			console.log(data)
			//不进行判断当某一个为空的时候会报错
			if(data.Data == null || data.Data.length == 0) {
				document.getElementsByClassName("mui-pull")[0].style.display = "none";
				lengthDocument = 0;
			} else {
				lengthDocument = data.Data.length;
			}
			//搜索出的资讯内容
			searchInformation.innerHTML = '<div id="dv1"></div>';
			//搜索出的贴子内容
			searchInvitation.innerHTML = '<div id="dv2"></div>';
			searchQuestion.innerHTML = '<div id="dv3"></div>';
			//搜索出的文库内容
			if(PageIndex4 == 1 && lengthDocument == 0) {
				searchDocument.innerHTML = '<div class="mui-content-padded jh-search-list " id="searchDocumentHearder" >' +
					'<p class="normal-color" style="padding-top:12px;">暂无关键字为“<span class="theme-color">' + inputValue + '</span>”的相关文档</p>' +
					//'<div class="divide"></div>' +
					'</div>';
			} else {
				setHistory()
				searchInformation.innerHTML = '<div id="dv1"></div>';
				searchInvitation.innerHTML = '<div id="dv2"></div>';
				searchQuestion.innerHTML = '<div id="dv3"></div>';
				for(var i = 0; i < lengthDocument; i++) {
					var Essential;
					var resolved = ""; //QuestionStatus
					//classn = docs.DocList[i].QuestionStatus == "未解决" ? 'jh-red-border' : 'jh-green-border';
					//text1 = docs.DocList[i].QuestionStatus;
					//resolved = '<span class=' + classn + '>' + text1 + '</span>'
					Essential = data.Data[i].IsEssential == true ? '<span class="jh-red-border">' + "精华" + '</span>' : '';
					var icon = getDocumentType(data.Data[i].Extension);
					$("#dv4").before(
						'<div id="'+ data.Data[i].Id +'" class="DocList" title="'+data.Data[i].MediaType+'">'+
						icon+'<p class="noCenter"><a href="#"class="jh-overflow-h jh-search-colorHeader"  id="' + data.Data[i].Id + '">' + data.Data[i].Subject + '</a>' +
						'<span class="status">' +
						//resolved +
						Essential +
						'</span></p>' +
						'<a href="#"class="jh-overflow-h jh-search-colorMain jh-search-body">' + data.Data[i].Body + '</a>' +
						'</div>'+
						'<div class="jh-lable">' +
						'<a href="#"class="jh-overflow-h jh-search-questiontime jh-search-questiontime' + i + '">' + data.Data[i].DateCreated + '</a>' +

						'<div class="tags" id="Doctags' + i + '"></div>' +

						'</div>' +
						'<div class="divide"></div>');
					lengthDocumentTags = data.Data[i].TagNames.length;
					var a1 = [];
					var b = [];
					if(lengthDocumentTags != 0) {
						for(var j = 0; j < lengthDocumentTags; j++) {
							a1.push({								
								TagName: data.Data[i].TagNames[j].TagName,
								TagId: data.Data[i].TagNames[j].TagId,
								length: data.Data[i].TagNames[j].TagName.length
							});

							function compare(property) {
								return function(a, b) {
									var value1 = a[property];
									var value2 = b[property];
									return value1 - value2;
								}
							}
							//a1.push(data[i].Tags[j].TagName);
						}
						b = a1.sort(compare('length'))
						var lengthL = b.length;
						var c = b.slice(0, lengthL);
						for(var r = 0; r < c.length; r++) {
							var tags = document.getElementById('Doctags' + i + '');
							var a;
							a = document.createElement("a");
							a.className = "jh-overflow-h1 jh-search-typeDocument";
							a.id = c[r].TagName;
							a.title = c[r].TagId;
							a.innerHTML = '<span class="tag">' + c[r].TagName + '</span>'
							tags.appendChild(a);
						}
					};
				};
			}
			//mui.trigger(document.getElementById("searchQuestionA"), 'tap');

		}, function(err) {
			setErr('','90px')
		})
	}
}
//搜索框获得焦点时候出现搜索历史，其他清空
$("#searchInput").focus(function() {

	init();
	mainHidden()
})
//搜索框的search事件，判断非空以后再判断当前的活动标签
$("#searchInput").bind('search', function() {
	localHidden()
	$("#searchInput").blur()
	var inputValue = document.getElementById("searchInput").value;
	if(inputValue == '') {

	} else {
		var stype = document.getElementsByClassName("mui-control-item mui-active")[0].id;
		switch(stype) {
			case 'searchInformationA':
				information()
				break;
			case 'searchInvitationA':
				invitation()
				break;
			case 'searchQuestionA':
				question()
				break;
			case 'searchDocumentA':
				DocumentSearch()
				break;
			default:
				MobileSearchAll()
				break;
		}

		//init();
		//setHistory()
		//searchMaster(1, 1, 1);
	}
});
mui('#refreshContainer').scroll();
//全部搜索内容
var searchAllA = document.getElementById("searchAllA");
//监听点击事件
searchAllA.addEventListener("tap", function() {
	var inputValue = document.getElementById("searchInput").value;
	if(inputValue == "") {
		console.log("当前搜索框没有内容")
	} else {
		MobileSearchAll()
	}
});
//资讯搜索内容
function information() {
	var inputValue = document.getElementById("searchInput").value;

	if(inputValue == "") {
		console.log("当前搜索框没有内容")
	} else {
		var inputValue = document.getElementById("searchInput").value;
		var params = {
			keyword: inputValue,
			pageSize: 10,
			PageIndex: 1
		};

		getData("Search/MobileCmsSearch", params, function(data) {
			console.log(data)
			//不进行判断当某一个为空的时候会报错
			if(data.Data == null || data.Data.length == 0) {
				lengthInformation = 0;
			} else {
				lengthInformation = data.Data.length;
			}
			searchInvitation.innerHTML = '<div id="dv2"></div>';
			//搜索出的问答内容
			searchQuestion.innerHTML = '<div id="dv3"></div>';
			searchInformation.innerHTML = '<div id="dv1"></div>';
			searchDocument.innerHTML = '<div id="dv4"></div>';
			//搜索出的咨询内容
			if(params.PageIndex == 1 && lengthInformation == 0) {
				searchInformation.innerHTML = '<div class="mui-content-padded jh-search-list novalue" id="searchInformationHearder" >' +
					'<p class="normal-color">暂无关键字为“<span class="theme-color">' + inputValue + '</span>”的相关资讯</p>' +
					//'<div class="divide"></div>' +
					'</div>';
			} else {
				setHistory()
				searchInvitation.innerHTML = '<div id="dv2"></div>';
				searchQuestion.innerHTML = '<div id="dv3"></div>';
				for(var i = 0; i < lengthInformation; i++) {

					$("#dv1").before('<a href="#"class="jh-overflow-h jh-search-colorHeader" id="' + data.Data[i].Id + '" module="' + data.Data[i].ModelName + '">' + data.Data[i].Subject + '</a>' +
						'<a href="#"class="jh-overflow-h jh-search-colorMain jh-search-body" id="'+ data.Data[i].Id +'"module="' + data.Data[i].ModelName + '">' + data.Data[i].Body + '</a>' +
						'<a href="#"class="jh-overflow-h jh-search-time">' + data.Data[i].DateCreated + '</a>' +
						'<a href="#"class="jh-overflow-h jh-search-type"   id="' + data.Data[i].Category.Id + '" >' + data.Data[i].Category.Name + '</a>' +
						'<div class="divide"></div>');
				};
			}
			//var remove = document.getElementById("dv1").previousSibling;
			//var fatherNode = document.getElementById("dv1").parentNode;
			//fatherNode.removeChild(remove);
			//搜索出的贴子内容
			searchInvitation.innerHTML = '<div id="dv2"></div>';
			//搜索出的问答内容
			searchQuestion.innerHTML = '<div id="dv3"></div>';
			document.getElementById("searchAll").style.display = 'none'
		}, function(err) {
			setErr('','90px')
		});
	}
}
var searchInformationA = document.getElementById("searchInformationA");
//监听点击事件
searchInformationA.addEventListener("tap", function() {
	$("#searchAll").css("display", "none");
	$("#refreshContainer").css("display", "block")
	//mui('#refreshContainer').scroll().scrollTo(0, 0);
	information();
});
//贴子搜索内容
function invitation() {
	var inputValue = document.getElementById("searchInput").value;
	if(inputValue == "") {
		console.log("当前搜索框没有内容")
	} else {
		var inputValue = document.getElementById("searchInput").value;
		var params = {
			keyword: inputValue,
			pageSize: 10,
			PageIndex: 1
		};
		getData("Search/MobileThreadSearch", params, function(data) {
			//不进行判断当某一个为空的时候会报错
			if(data.Data == null || data.Data.length == 0) {
				lengthInvitation = 0;
			} else {
				lengthInvitation = data.Data.length;
			}

			//搜索出的资讯内容
			searchInformation.innerHTML = '<div id="dv1"></div>';
			//搜索出的贴子内容
			searchInformation.innerHTML = '<div id="dv1"></div>'
			searchQuestion.innerHTML = '<div id="dv3"></div>';
			searchInvitation.innerHTML = '<div id="dv2"></div>';
			searchDocument.innerHTML = '<div id="dv4"></div>';
			if(params.PageIndex == 1 && lengthInvitation == 0) {
				searchInvitation.innerHTML = '<div class="mui-content-padded jh-search-list novalue" id="searchInvitationHearder" >' +
					'<p class="normal-color">暂无关键字为“<span class="theme-color">' + inputValue + '</span>”的相关贴子</p>' +
					//'<div class="divide"></div>' +
					'</div>';
			} else {

				setHistory()
				searchInformation.innerHTML = '<div id="dv1"></div>'
				searchQuestion.innerHTML = '<div id="dv3"></div>';
				for(var i = 0; i < lengthInvitation; i++) {
					$("#dv2").before('<a href="#"class="jh-overflow-h jh-search-colorHeader"  id="' + data.Data[i].Id + '">' + data.Data[i].Subject + '</a>' +
						'<a href="#"class="jh-overflow-h jh-search-colorMain jh-search-body" id="'+ data.Data[i].Id +'">' + data.Data[i].Body + '</a>' +
						'<a href="#"class="jh-overflow-h jh-search-time">' + data.Data[i].DateCreated + '</a>' +
						'<a href="#"class="jh-overflow-h jh-search-type jh-search-tieba"  id="' + data.Data[i].BarSection.Id + '">' + data.Data[i].BarSection.Name + '</a>' +
						'<div class="divide"></div>');
				};
			}

			//搜索出的问答内容
			searchQuestion.innerHTML = '<div id="dv3"></div>';
			document.getElementById("searchAll").style.display = 'none'
		}, function(err) {
			setErr('','90px')
		})
	}
}
var searchInvitationA = document.getElementById("searchInvitationA");
//监听点击事件
searchInvitationA.addEventListener("tap", function() {
	$("#searchAll").css("display", "none");
	$("#refreshContainer").css("display", "block")
	mui('#refreshContainer').scroll().scrollTo(0, 0);
	invitation();
});
//问答搜索内容
function question() {
	//var searchQuestion = document.getElementById("searchQuestion");
	//searchQuestion.innerHTML = "";

	var inputValue = document.getElementById("searchInput").value;
	if(inputValue == "") {
		console.log("当前搜索框没有内容")
	} else {

		var inputValue = document.getElementById("searchInput").value;
		var params = {
			keyword: inputValue,
			pageSize: 10,
			PageIndex: 1
		};
		getData("Search/MobileAskSearch", params, function(data) {
			console.log(data)
			//不进行判断当某一个为空的时候会报错
			if(data.Data == null || data.Data.length == 0) {
				lengthQuestion = 0;
			} else {
				lengthQuestion = data.Data.length;
			}
			searchInformation.innerHTML = '<div id="dv1"></div>';
			searchInvitation.innerHTML = '<div id="dv2"></div>';
			//搜索出的问答内容
			searchQuestion.innerHTML = '<div id="dv3"></div>';
			searchDocument.innerHTML = '<div id="dv4"></div>';
			if(params.PageIndex == 1 && lengthQuestion == 0) {
				searchQuestion.innerHTML = '<div class="mui-content-padded jh-search-list novalue" id="searchQuestionHearder" >' +
					'<p class="normal-color">暂无关键字为“<span class="theme-color">' + inputValue + '</span>”的相关问答</p>' +
					//'<div class="divide"></div>' +
					'</div>';
			} else {
				setHistory()
				searchInformation.innerHTML = '<div id="dv1"></div>';
				searchInvitation.innerHTML = '<div id="dv2"></div>';
				for(var i = 0; i < lengthQuestion; i++) {
					var Essential;
					var resolved = ""; //QuestionStatus

					classn = data.Data[i].QuestionStatus == "未解决" ? 'jh-red-border' : 'jh-green-border';
					text1 = data.Data[i].QuestionStatus;
					resolved = '<span class=' + classn + '>' + text1 + '</span>'
					Essential = data.Data[i].IsEssential == true ? '<span class="jh-red-border">' + "精华" + '</span>' : '';

					$("#dv3").before('<p class="noCenter"><a href="#"class="jh-overflow-h jh-search-colorHeader"  id="' + data.Data[i].Id + '">' + data.Data[i].Subject + '</a>' +
						'<span class="status">' +
						resolved +
						Essential +
						'</span></p>' +
						'<a href="#"class="jh-overflow-h jh-search-colorMain jh-search-body" id="'+ data.Data[i].Id +'">' + data.Data[i].Body + '</a>' +
						'<div class="jh-lable">' +
						'<a href="#"class="jh-overflow-h jh-search-questiontime jh-search-questiontime' + i + '">' + data.Data[i].DateCreated + '</a>' +

						'<div class="tagsClick" id="tagsClick' + i + '"></div>' +
						'</div>' +
						'<div class="divide"></div>');
					lengthQuestionTags = data.Data[i].Tags.length;
					var a1 = [];
					var b = [];
					if(data.Data[i].Tags.length != 0) {
						for(var j = 0; j < data.Data[i].Tags.length; j++) {
							a1.push({
								TagName: data.Data[i].Tags[j].Name,
								length: data.Data[i].Tags[j].Name.length
							});

							function compare(property) {
								return function(a, b) {
									var value1 = a[property];
									var value2 = b[property];
									return value1 - value2;
								}
							}
						}
						b = a1.sort(compare('length'))
						var lengthL = b.length;
						var c = b.slice(0, lengthL);
						for(var r = 0; r < c.length; r++) {
							var tagsClick = document.getElementById('tagsClick' + i + '');
							var a;
							a = document.createElement("a");
							a.className = "jh-overflow-h1 jh-search-type";
							a.id = c[r].TagName;
							a.innerHTML = '<span class="tag">' + c[r].TagName + '</span>'
							tagsClick.appendChild(a);
						}
					}
				};

			}
			document.getElementById("searchAll").style.display = 'none'

		}, function(err) {
			setErr('','90px')
		})
	}
}
//文库搜索内容
function DocumentSearch() {
	var inputValue = document.getElementById("searchInput").value;
	if(inputValue == "") {
		console.log("当前搜索框没有内容")
	} else {
		var inputValue = document.getElementById("searchInput").value;
		var params = {
			keyword: inputValue,
			pageSize: 10,
			PageIndex: 1
		};
		getData("Search/MobileDocSearch", params, function(data) {
			console.log(data)
			//不进行判断当某一个为空的时候会报错
			if(data.Data == null || data.Data.length == 0) {
				lengthDocument = 0;
			} else {
				lengthDocument = data.Data.length;
			}
			searchInformation.innerHTML = '<div id="dv1"></div>';
			searchInvitation.innerHTML = '<div id="dv2"></div>';
			searchQuestion.innerHTML = '<div id="dv3"></div>';
			//搜索出的问答内容
			searchDocument.innerHTML = '<div id="dv4"></div>';
			if(params.PageIndex == 1 && lengthDocument == 0) {
				searchDocument.innerHTML = '<div class="mui-content-padded jh-search-list novalue" id="searchDocumentHearder" >' +
					'<p class="normal-color">暂无关键字为“<span class="theme-color">' + inputValue + '</span>”的相关文档</p>' +
					//'<div class="divide"></div>' +
					'</div>';
			} else {
				setHistory()
				searchInformation.innerHTML = '<div id="dv1"></div>';
				searchInvitation.innerHTML = '<div id="dv2"></div>';
				searchQuestion.innerHTML = '<div id="dv3"></div>';
				for(var i = 0; i < lengthDocument; i++) {
					var Essential;
					var resolved = ""; //QuestionStatus
					//classn = docs.DocList[i].QuestionStatus == "未解决" ? 'jh-red-border' : 'jh-green-border';
					//text1 = docs.DocList[i].QuestionStatus;
					//resolved = '<span class=' + classn + '>' + text1 + '</span>'
					Essential = data.Data[i].IsEssential == true ? '<span class="jh-red-border">' + "精华" + '</span>' : '';
					var icon = getDocumentType(data.Data[i].Extension);
					$("#dv4").before(
						'<div id="'+ data.Data[i].Id +'" class="DocList" title="'+data.Data[i].MediaType+'">'+
						icon+'<p class="noCenter"><a href="#"class="jh-overflow-h jh-search-colorHeader"  id="' + data.Data[i].Id + '">' + data.Data[i].Subject + '</a>' +
						'<span class="status">' +
						//resolved +
						Essential +
						'</span></p>' +
						'<a href="#"class="jh-overflow-h jh-search-colorMain jh-search-body">' + data.Data[i].Body + '</a>' +
						'</div>'+
						'<div class="jh-lable">' +
						'<a href="#"class="jh-overflow-h jh-search-questiontime jh-search-questiontime' + i + '">' + data.Data[i].DateCreated + '</a>' +

						'<div class="tags" id="Doctags' + i + '"></div>' +

						'</div>' +
						'<div class="divide"></div>');
					lengthDocumentTags = data.Data[i].TagNames.length;
					var a1 = [];
					var b = [];
					if(lengthDocumentTags != 0) {
						for(var j = 0; j < lengthDocumentTags; j++) {
							a1.push({								
								TagName: data.Data[i].TagNames[j].TagName,
								TagId: data.Data[i].TagNames[j].TagId,
								length: data.Data[i].TagNames[j].TagName.length
							});

							function compare(property) {
								return function(a, b) {
									var value1 = a[property];
									var value2 = b[property];
									return value1 - value2;
								}
							}
							//a1.push(data[i].Tags[j].TagName);
						}
						b = a1.sort(compare('length'))
						var lengthL = b.length;
						var c = b.slice(0, lengthL);
						for(var r = 0; r < c.length; r++) {
							var tags = document.getElementById('Doctags' + i + '');
							var a;
							a = document.createElement("a");
							a.className = "jh-overflow-h1 jh-search-typeDocument";
							a.id = c[r].TagName;
							a.title = c[r].TagId;
							a.innerHTML = '<span class="tag">' + c[r].TagName + '</span>'
							tags.appendChild(a);
						}
					};
				};

			}
			document.getElementById("searchAll").style.display = 'none'

		}, function(err) {
			setErr('','90px')
		})
	}
}
var searchQuestionA = document.getElementById("searchQuestionA");
//监听点击事件
searchQuestionA.addEventListener("tap", function() {
	$("#searchAll").css("display", "none");
	$("#refreshContainer").css("display", "block")
	mui('#refreshContainer').scroll().scrollTo(0, 0);
	question();
});
var searchDocumentA = document.getElementById("searchDocumentA");
//监听点击事件
searchDocumentA.addEventListener("tap", function() {
	$("#searchAll").css("display", "none");
	$("#refreshContainer").css("display", "block")
	mui('#refreshContainer').scroll().scrollTo(0, 0);
	DocumentSearch();
});
//点击资讯跳转  searchInformationHearder
mui("#searchInformation").on('tap', '.jh-search-colorHeader', function(e) {
	var contentItemId = this.getAttribute('id');
	var contentItemType = this.getAttribute("module");
	switch(contentItemType) {
		case '组图':
			urlId = 'imgsDetail.html';
			baseUrl = 'imgsDetail.html?ContentItemId=' + contentItemId;
			break;
		case '文章':
			urlId = 'newsDetail.html';
			baseUrl = 'newsDetail.html?ContentItemId=' + contentItemId;
			break;
		case '用户投稿':
			urlId = 'newsDetail.html';
			baseUrl = 'newsDetail.html?ContentItemId=' + contentItemId;
			break;
		case '视频':
			urlId = 'videoDetail.html';
			baseUrl = 'videoDetail.html?ContentItemId=' + contentItemId;
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
			ContentItemId: contentItemId
		}
	})
});
mui("#Information").on('tap', '.jh-search-colorHeader', function(e) {
	var contentItemId = this.getAttribute('id');
	var contentItemType = this.getAttribute("module");
	switch(contentItemType) {
		case '组图':
			urlId = 'imgsDetail.html';
			baseUrl = 'imgsDetail.html?ContentItemId=' + contentItemId;
			break;
		case '文章':
		case '用户投稿':
			urlId = 'newsDetail.html';
			baseUrl = 'newsDetail.html?ContentItemId=' + contentItemId;
			break;
		case '视频':
			urlId = 'videoDetail.html';
			baseUrl = 'videoDetail.html?ContentItemId=' + contentItemId;
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
			ContentItemId: contentItemId
		}
	})
});
mui("#searchInformation").on('tap', '.jh-search-body', function(e) {
	var contentItemId = this.getAttribute('id');
	var contentItemType = this.getAttribute("module");
	switch(contentItemType) {
		case '组图':
			urlId = 'imgsDetail.html';
			baseUrl = 'imgsDetail.html?ContentItemId=' + contentItemId;
			break;
		case '文章':
			urlId = 'newsDetail.html';
			baseUrl = 'newsDetail.html?ContentItemId=' + contentItemId;
			break;
		case '用户投稿':
			urlId = 'newsDetail.html';
			baseUrl = 'newsDetail.html?ContentItemId=' + contentItemId;
			break;
		case '视频':
			urlId = 'videoDetail.html';
			baseUrl = 'videoDetail.html?ContentItemId=' + contentItemId;
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
			ContentItemId: contentItemId
		}
	})
});
mui("#Information").on('tap', '.jh-search-body', function(e) {
	var contentItemId = this.getAttribute('id');
	var contentItemType = this.getAttribute("module");
	switch(contentItemType) {
		case '组图':
			urlId = 'imgsDetail.html';
			baseUrl = 'imgsDetail.html?ContentItemId=' + contentItemId;
			break;
		case '文章':
		case '用户投稿':
			urlId = 'newsDetail.html';
			baseUrl = 'newsDetail.html?ContentItemId=' + contentItemId;
			break;
		case '视频':
			urlId = 'videoDetail.html';
			baseUrl = 'videoDetail.html?ContentItemId=' + contentItemId;
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
			ContentItemId: contentItemId
		}
	})
});
//点击咨询类跳转
mui("#Information").on('tap', '.jh-search-type', function(e) {
	var id = this.getAttribute('id');
	if(mui.os.plus) {
		document.activeElement.blur();
		var homePage = plus.webview.getWebviewById('home.html');
		var enterPage = plus.webview.getLaunchWebview(); //入口文件
		var mainPage = plus.webview.getWebviewById('main');
		var currPage = plus.webview.getWebviewById('search.html');
		if(enterPage || mainPage) {
			enterPage && enterPage.evalJS("changeTab('news.html')")
			mainPage && mainPage.evalJS("changeTab('news.html')")
		}
		var detailPage = plus.webview.getWebviewById('news.html');
		plus.webview.show(detailPage, "", 300);
		console.log(console.log(getlsData('tab-news')));
		var tabNews = getlsData('tab-news');
		if(tabNews == 'false') {
			mui.fire(detailPage, 'show', {
				show: true
			})
			setlsData('tab-news', 'true');
		}
		setTimeout(function() {
			detailPage.evalJS("changeTab(" + id + ")")
			mui.back()
		}, 500)

	} else {
		mui.back()
	}
})
//点击贴子跳转  searchInvitationHearder
mui("#searchInvitation").on('tap', '.jh-search-colorHeader', function(e) {
	var threadId = this.getAttribute("id");
	var baseUrl = 'threadDetail.html';
	var url = mui.os.plus ? baseUrl : baseUrl + '?threadId=' + threadId;
	var curl = shareUrl + baseUrl + '?threadId=' + threadId;
	setlsData('currUrl', curl);
	mui.openWindow({
		url: url,
		id: 'threadDetail.html',
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
			threadId: threadId,
			currId: 'home.html'
		}
	})
})
mui("#Invitation").on('tap', '.jh-search-colorHeader', function(e) {
	var threadId = this.getAttribute("id");
	var baseUrl = 'threadDetail.html';
	var url = mui.os.plus ? baseUrl : baseUrl + '?threadId=' + threadId;
	var curl = shareUrl + baseUrl + '?threadId=' + threadId;
	setlsData('currUrl', curl);
	mui.openWindow({
		url: url,
		id: 'threadDetail.html',
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
			threadId: threadId,
			currId: 'home.html'
		}
	})
})
mui("#searchInvitation").on('tap', '.jh-search-body', function(e) {
	var threadId = this.getAttribute("id");
	var baseUrl = 'threadDetail.html';
	var url = mui.os.plus ? baseUrl : baseUrl + '?threadId=' + threadId;
	var curl = shareUrl + baseUrl + '?threadId=' + threadId;
	setlsData('currUrl', curl);
	mui.openWindow({
		url: url,
		id: 'threadDetail.html',
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
			threadId: threadId,
			currId: 'home.html'
		}
	})
})
mui("#Invitation").on('tap', '.jh-search-body', function(e) {
	var threadId = this.getAttribute("id");
	var baseUrl = 'threadDetail.html';
	var url = mui.os.plus ? baseUrl : baseUrl + '?threadId=' + threadId;
	var curl = shareUrl + baseUrl + '?threadId=' + threadId;
	setlsData('currUrl', curl);
	mui.openWindow({
		url: url,
		id: 'threadDetail.html',
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
			threadId: threadId,
			currId: 'home.html'
		}
	})
})
//点击贴吧跳转
mui("#searchInvitation").on('tap', '.jh-search-tieba', function(e) {
	var sectionId = this.getAttribute("id");
	var baseUrl = 'postDetail.html';
	var url = mui.os.plus ? baseUrl : baseUrl + '?sectionId=' + sectionId;
	mui.openWindow({
		url: url,
		id: 'postDetail.html',
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
			sectionId: sectionId
		}
	})
})
mui("#Invitation").on('tap', '.jh-search-tieba', function(e) {
	var sectionId = this.getAttribute("id");
	var baseUrl = 'postDetail.html';
	var url = mui.os.plus ? baseUrl : baseUrl + '?sectionId=' + sectionId;
	mui.openWindow({
		url: url,
		id: 'postDetail.html',
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
			sectionId: sectionId
		}
	})
})
//点击问答跳转
mui("#searchQuestion").on('tap', '.jh-search-colorHeader', function(e) {
	var TagId = this.getAttribute('id');
	var baseUrl = 'question-solved.html';
	var url = mui.os.plus ? baseUrl : baseUrl + '?questionId=' + TagId;
	var curl = shareUrl + baseUrl + '?questionId=' + TagId;
	setlsData('currUrl', curl);
	mui.openWindow({
		url: url,
		id: 'question-solved.html',
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
			questionId: TagId,
			currId: 'home.html'
		}
	})
})
mui("#Question").on('tap', '.jh-search-colorHeader', function(e) {
	var TagId = this.getAttribute('id');
	var baseUrl = 'question-solved.html';
	var url = mui.os.plus ? baseUrl : baseUrl + '?questionId=' + TagId;
	var curl = shareUrl + baseUrl + '?questionId=' + TagId;
	setlsData('currUrl', curl);
	mui.openWindow({
		url: url,
		id: 'question-solved.html',
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
			questionId: TagId,
			currId: 'home.html'
		}
	})
})
mui("#searchQuestion").on('tap', '.jh-search-body', function(e) {
	var TagId = this.getAttribute('id');
	var baseUrl = 'question-solved.html';
	var url = mui.os.plus ? baseUrl : baseUrl + '?questionId=' + TagId;
	var curl = shareUrl + baseUrl + '?questionId=' + TagId;
	setlsData('currUrl', curl);
	mui.openWindow({
		url: url,
		id: 'question-solved.html',
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
			questionId: TagId,
			currId: 'home.html'
		}
	})
})
mui("#Question").on('tap', '.jh-search-body', function(e) {
	var TagId = this.getAttribute('id');
	var baseUrl = 'question-solved.html';
	var url = mui.os.plus ? baseUrl : baseUrl + '?questionId=' + TagId;
	var curl = shareUrl + baseUrl + '?questionId=' + TagId;
	setlsData('currUrl', curl);
	mui.openWindow({
		url: url,
		id: 'question-solved.html',
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
			questionId: TagId,
			currId: 'home.html'
		}
	})
})
//点击问答标签跳转
mui("#searchQuestion").on('tap', '.jh-search-type', function(e) {
	var tagName = this.innerText;
	var baseUrl = 'question-label-list.html';
	var url = mui.os.plus ? baseUrl : baseUrl + '?tagName=' + tagName;
	var curl = HttpUrl + 'spb_App/html/' + baseUrl + '?tagName=' + tagName;
	mui.openWindow({
		url: url,
		id: 'question-label-list.html',
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
			tagName: tagName
		}
	})
})
mui("#Question").on('tap', '.jh-search-typeQuestion', function(e) {
	var tagName = this.innerText;
	var baseUrl = 'question-label-list.html';
	var url = mui.os.plus ? baseUrl : baseUrl + '?tagName=' + tagName;
	var curl = HttpUrl + 'spb_App/html/' + baseUrl + '?tagName=' + tagName;
	mui.openWindow({
		url: url,
		id: 'question-label-list.html',
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
			tagName: tagName
		}
	})
})
//点击文档跳转
mui("#searchDocument").on('tap', '.DocList', function(e) {
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
mui("#Document").on('tap', '.DocList', function(e) {
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
//点击文档标签跳转
mui("#searchDocument").on('tap', '.jh-search-typeDocument', function(e) {
	var tagName = this.innerText;
	var tagId = this.getAttribute('title');
	var baseUrl = 'document-label-list.html';
	var url = mui.os.plus ? baseUrl : baseUrl + '?tagName=' + tagName+ '&' +'tagId=' + tagId;
	var curl = HttpUrl + 'spb_App/html/' + baseUrl + '?tagName=' + tagName+ '&' +'tagId=' + tagId;
	mui.openWindow({
		url: url,
		id: 'document-label-list.html',
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
			tagName: tagName,
			tagId:tagId
		}
	})
})
mui("#Document").on('tap', '.jh-search-typeDocument', function(e) {
	var tagName = this.innerText;
	var tagId = this.getAttribute('title');
	var baseUrl = 'document-label-list.html';
	var url = mui.os.plus ? baseUrl : baseUrl + '?tagName=' + tagName+ '&' +'tagId=' + tagId;
	var curl = HttpUrl + 'spb_App/html/' + baseUrl + '?tagName=' + tagName+ '&' +'tagId=' + tagId;
	mui.openWindow({
		url: url,
		id: 'document-label-list.html',
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
			tagName: tagName,
			tagId:tagId
		}
	})
})
/*mui("#Question").on('tap', '.jh-search-type', function(e) {
	var tagName = this.innerHTML;
	var baseUrl = 'question-label-list.html';
	var url = mui.os.plus ? baseUrl : baseUrl + '?tagName=' + tagName;
	var curl = HttpUrl + 'spb_App/html/' + baseUrl + '?tagName=' + tagName;
	mui.openWindow({
		url: url,
		id: 'question-label-list.html',
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
			tagName: tagName
		}
	})
})*/
//点击多数跳转到对应tab
/*var informationmore = document.getElementById("informationmore");
    	var questionmore = document.getElementById("questionmore");
    	questionmore.addEventListener('tap', function() {
			$("#searchAllA").removeClass("mui-active");
    		$("#searchQuestionA").addClass("mui-active");
		})
    	var invitationmore = document.getElementById("invitationmore");
    	invitationmore.addEventListener('tap', function() {
			$("#searchAllA").removeClass("mui-active");
    		$("#searchInvitationA").addClass("mui-active");
		})
    	informationmore.addEventListener('tap', function() {
			$("#searchAllA").removeClass("mui-active");
    		$("#searchInformationA").addClass("mui-active");
		})
    	questionmore.addEventListener('tap', function() {
			$("#searchAllA").removeClass("mui-active");
    		$("#searchQuestionA").addClass("mui-active");
		})
    	invitationmore.addEventListener('tap', function() {
			$("#searchAllA").removeClass("mui-active");
    		$("#searchInvitationA").addClass("mui-active");
		})*/
