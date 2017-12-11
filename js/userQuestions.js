//var currPageIndex = 0;
var clientWidth = document.body.clientWidth;
// 添加子页面
function addSubPages() {

	var self = plus.webview.currentWebview();

	for(var i = 0; i < 2; i++) {
		var tempPage = plus.webview.create(subPages[i], subPages[i], subPages[i],subPagesStyle);
		if(i > 0) {
			
			tempPage.hide();
		}
		
		self.append(tempPage);
	}

}
/*浏览器的兼容处理方法*/
var createIframe = function(el, opt) {
	var elContainer = document.querySelector(el);
	var wrapper = document.querySelector(".mui-iframe-wrapper");
	if(!wrapper) {
		// 创建wrapper 和 iframe
		wrapper = document.createElement('div');
		wrapper.className = 'mui-iframe-wrapper';
		for(var i in opt.style) {
			wrapper.style[i] = opt.style[i];
		}
		var iframe = document.createElement('iframe');
		iframe.src = opt.url;
		iframe.id = opt.id || opt.url;
		iframe.name = opt.id;
		wrapper.appendChild(iframe);
		elContainer.appendChild(wrapper);
	} else {
		var iframe = wrapper.querySelector('iframe');
		iframe.src = opt.url;
		iframe.id = opt.id || opt.url;
		iframe.name = iframe.id;
	}
}
var subpages = ["answerQuestion.html", "raisedQuestion.html","favoriteQuestions.html"];
var subpage_style = {
	top: "100px",
	bottom: "0px"
};
var aniShow = {};
// 当前激活选项
var activeTab = subpages[0];
var title = document.getElementById("title");
if(mui.os.plus) {
	// 创建子页面，首个选项卡页面显示，其它均隐藏；
	mui.plusReady(function() {
		//获得事件参数		
		var self = plus.webview.currentWebview();
		for(var i = 0; i < 3; i++) {
			var temp = {};
			var sub = plus.webview.create(subpages[i], subpages[i],subpage_style);
			if(i > 0) {
				sub.hide();

			} else {
				temp[subpages[i]] = "true";
				mui.extend(aniShow, temp);
			}
			self.append(sub);
		}

	});
} else {
	// 创建iframe代替子页面
	createIframe('.mui-content', {
		url: activeTab,
		style: subpage_style
	});
}
var raisedQuestion = false;
var favoriteQuestions = false;
// 选项卡点击事件
mui('.mui-scroll').on('tap', 'a', function(e) {
	var targetTab = this.getAttribute('href');
	if(targetTab == activeTab) { return; }
	//更换标题
	//title.innerHTML = this.querySelector('.mui-tab-label').innerHTML;
	//显示目标选项卡
	if(mui.os.plus) {
		var waiting = showWaiting();
		var detailPage = plus.webview.getWebviewById(targetTab);
		closeWaiting(waiting);
		if(detailPage.id == "raisedQuestion.html" && !raisedQuestion) {
			mui.fire(detailPage, 'show', {
				show: true
			})
			raisedQuestion = true;
		}
		if(detailPage.id == "favoriteQuestions.html" && !favoriteQuestions) {
			mui.fire(detailPage, 'show', {
				show: true
			})
			favoriteQuestions = true;
		}
		//若为iOS平台或非首次显示，则直接显示
		if(mui.os.ios || aniShow[targetTab]) {
			plus.webview.show(targetTab);
		} else {
			//否则，使用fade-in动画，且保存变量
			var temp = {};
			temp[targetTab] = "true";
			mui.extend(aniShow, temp);
			plus.webview.show(targetTab, "fade-in", 300);
		}
		//隐藏当前;
		plus.webview.hide(activeTab);
	} else {
		// 创建iframe代替子页面
		createIframe('.mui-content', {
			url: targetTab,
			style: subpage_style
		});
	}
	//更改当前活跃的选项卡
	activeTab = targetTab;
});

//自定义事件，模拟点击“首页选项卡”
document.addEventListener('gohome', function() {
	var defaultTab = document.getElementById("defaultTab");
	//模拟首页点击
	mui.trigger(defaultTab, 'tap');
	//切换选项卡高亮
	var current = document.querySelector(".mui-bar-tab>.mui-tab-item.mui-active");
	if(defaultTab !== current) {
		current.classList.remove('mui-active');
		defaultTab.classList.add('mui-active');
	}
});