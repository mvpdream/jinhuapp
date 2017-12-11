 
var day = document.getElementById("day");
		var infomation = document.getElementById("information");
		var newInfo = document.getElementById("newInfo");
		var nowMonth = document.getElementById("nowMonth");
		var money = document.getElementById("money");
		GetDate();
		GetSign();
		function setSign(isSign){
			postDatawithToken('User/SetSignIn',{},function(data) {
				if(data.Type == 1) {
					if(data.Data=='签到失败'){
						if(isSign){
							mui.toast('今日已签到');
						}else{
							mui.toast(data.Data);
						}
					}else{
						mui.toast(data.Data);
						GetSign();
						GetInformation()
					}
				}else {
					//逻辑错误
					if(data.Data !='签到失败'){
						mui.toast(data.Data);
					}					
					return;
				}
			}, function(err) {
				setErr('','',false)
			})
		}
		window.onload = function() {//   var myDate = new Date();  myDate.getMonth();       //获取当前月份(0-11,0代表1月)  myDate.getDate(); 
			if(mui.os.plus) {
				mui.plusReady(function() {
					GetInformation();
				});
			} else {
				GetInformation();
			}
			if(mui.os.wechat){
				var currUrl = location.href.split('#')[0];
				weChatLogin(currUrl)
			}
		}	
		function GetDate(){
			var myDate = new Date();
			var nowDay = myDate.getDate();
			//var nowDay = 5;
			var a = [];
			var td;
			var tdMonth;
			for(var i = 0;i<7;i++){
				a.push(nowDay);
				if(nowDay == 1){
					var prev = myDate.getMonth();
					switch(prev){
						case 1 :
							nowDay = "32";
						break;
						case 2 :
							var year = myDate.getFullYear()
							nowDay = ((year % 4)==0) && ((year % 100)!=0) || ((year % 400)==0) == true ? "29" : "28";
						break;
						case 3 :
							nowDay = "32";
						break;
						case 4 :
							nowDay = "31";
						break;
						case 5 :
							nowDay = "32";
						break;
						case 6 :
							nowDay = "31";
						break;
						case 7 :
							nowDay = "32";
						break;
						case 8 :
							nowDay = "32";
						break;
						case 9 :
							nowDay = "31";
						break;
						case 10 :
							nowDay = "32";
						break;
						case 11 :
							nowDay = "31";
						break;
						case 12 :
							nowDay = "32";
						break;
						default : 
						break;
					}
				}
				nowDay --;
			}
			//console.log(Math.max.apply(null, a));//最大值
			//console.log(Math.min.apply(null, a));//最小值		
			day.innerHTML = "";
			nowMonth.innerHTML = "";
			for(var j = a.length - 1; j >=0; j--){
				td = document.createElement("td");
				td.id = a[j];
				td.innerHTML = a[j];
				day.appendChild(td);
				
				tdMonth = document.createElement("td");
				tdMonth.id = a[j];
				nowMonth.appendChild(tdMonth);
			}
			var nowMonthIds = nowMonth.getElementsByTagName("td");
			var min = Math.min.apply(null, a);
				for(var n = 0;n<nowMonthIds.length;n++){//myDate.getMonth()
					if(nowMonthIds[n].id == min){
						nowMonthIds[n].innerText = myDate.getMonth() + 1  +"月";
					}
					if(nowMonthIds[n].id == min && n != 0){
						if(myDate.getMonth()== 0){
							nowMonthIds[0].innerText = "12" +"月";
						}else{
							nowMonthIds[0].innerText = myDate.getMonth()  +"月";
						}
						
					}
				}
		}
		function GetSign() {
			getDatawithToken('User/GetUserSignIn',{},function(data) {
				if(data.Type == 1) {
					setSign(data.Data.IsSign);
					infomation.innerHTML = "已连续签到" + '<span>'+ data.Data.ContinuedSignCount + '</span>天，累计签到<span>'+ data.Data.SignCount +'</span>天'
					money.innerHTML = '签到累计奖励<span>' + data.Data.TradePointSum +'</span>'+data.Data.CategoryName;
					if(data.Data.IsSign == true){
						newInfo.style.display = "block";
					}else{
						newInfo.style.display = "none";
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
				setErr('','50px')
			})
		}
		function GetInformation() {
			getDatawithToken('User/GetUserHistorDetails',{},function(data) {
				if(data.Type == 1) {					
					if(data.Data && typeof(data.Data) == 'object'&&data.Data.HistorDays.length>0){
						var ids = day.getElementsByTagName("td");
						for(var i =0;i<data.Data.HistorDays.length;i++){
							for(var j = 0;j<ids.length;j++){
								if(ids[j].innerText == data.Data.HistorDays[i]){
									ids[j].className = "on";									
								}
							}
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
				setErr('','50px')
			})
		}