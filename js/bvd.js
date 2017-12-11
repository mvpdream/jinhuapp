(function($) {
	//	var video=document.getElementById("video"); 
	//	video.controls=false;
	var bvd = function(dom) {
		var that = this;
		$.ready(function() {
			//获取视频元素
			that.video = document.querySelector(dom || 'video');
			//获取视频父元素
			that.vRoom = that.video.parentNode;
			//元素初始化
			that.initEm();
			
			if((mui.os.ios && parseFloat(mui.os.version) > 8)||(mui.os.android&&parseFloat(mui.os.version)>4.4)) {
				//计算样式
				that.initStyle();
				//事件初始化
				that.initEvent();
			}else{
				//给播放按钮图片添加事件
				that.vimg&&that.vimg.addEventListener('tap', function() {
					that.video.play();
				})
			}
			//记录信息
			that.initInfo();
			//当前播放模式 false 为 mini播放
			that.isMax = false;
		})

		$.plusReady(function() {
			//that.startWatchAcc();
		})

	}

	var pro = bvd.prototype;
	var waiting = false;
	//记录信息
	pro.initInfo = function() {
		var that = this;
		//在onload状态下，offsetHeight才会获取到正确的值
		window.onload = function() {
			that.miniInfo = { //mini状态时的样式
				zIndex: 1,
				width: that.video.offsetWidth + 'px',
				height: that.video.offsetHeight + 'px',
				position: that.vRoom.style.position
			}

			that.maxInfo = { //max状态时的样式
				zIndex: 99,
				width: '100%',
				height: that.sw + 'px',
				position: 'fixed'
			}

		}

	}

	pro.initEm = function() {
		//初始化视频高度宽度
		var info = [
			document.documentElement.clientWidth || document.body.clientWidth,
			document.documentElement.clientHeight || document.body.clientHeigth
		];
		this.sw = info[0]; //屏幕宽
		this.sh = info[1]; //屏幕高
		var vh = (this.sw / 3 * 2); //视频高

		this.vRoom.style.width = (this.vW = this.sw) + 'px';
		this.vRoom.style.height = (this.vH = vh) + 'px';
		
		if((mui.os.ios && parseFloat(mui.os.version) < 8)||(mui.os.android&&parseFloat(mui.os.version)<4.4)) {
			this.video.setAttribute('controls', 'controls');
		}else {
			var that = this;
			that.video.removeAttribute('controls');
			//先添加播放按钮
			this.vimg = document.createElement("img");
			//this.vimg.src = 'data:image/png;base64,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';
			this.vimg.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACkklEQVRYR8WXjVEUQRCFX0egGSgRCBEIEagRiBGIEagRiBEoESgRKBEIEQgZaARtfVTP2bs3szu7XNV11dXV3c5Mv3n9+mdNezbbs38tAuDuh5JeS+L7cXxzh2tJfyT9lHRpZvzusi4A7n4q6b2kp12nSreS3pnZ97n1kwDcHYdfJB03DrqJ/581nsPIGzMDUNWaANwdp9+C6rL5StJXqB4fGmBfSuLzPHkjNCetsFQBhPMf6ZA7Sadmxo1mLfYD9ElafFQDsQUghIZzRIZdhnNu0m3uzn40UNhgPyAG4agB4JZlE4qG0tXm7vk8QneSDxsACLUjOgzaD81s0c3HSIMJ0rKE41XOjjEA6CkLEU415oRpSa67OywiaOzWzA4K0A2AiP2veHBlZtXUS4cBlhTrFWYOxUaQGcC5pLcBgINR8Za5+4coSuXZbK6z0N3PJH2KTRQp/P0vxSOxHLSKRwVAAQKwzy3NRJ34PWY4M4BQ7iuamU0VqDEDmSUEe2ZmFw32fApAeXhjZjSbqk0wkNdX09fdNyIvl8wMFADXZnb0QAAXZkYDG9gcgF2E4G+EoCXgyRDkNFkjwo+Szh8iwrVpSK9AeM2W25uGCK8Uoq2aXYKZOuXSDrkJcTSl+6lpH6X4zsw2k9VUM4JSSuYumhHMFqeDHjPXjpuhaKVpJfWyuLd6TA0ASInPoziMA2ihi5iINkwHLE2NFKWLTg8kodgsSP7qnnJjP+2XxpOn6L6RLKkdENy+MMEjfjNmUWoHN4lm84LxLb0vsIebHy8aShMIbkBVy1NuDnMB0XpfYIpmmF0+lmcvMYRQqPKUO6XD7hrR9WY0CgvxLcIqzHBTjPCQObt9NetNuTXrFjGwxsHcnn8EnVEw6LfiQQAAAABJRU5ErkJggg==';
			this.vimg.className = 'vplay';
			this.vRoom.appendChild(this.vimg);
			if(navigator.userAgent.indexOf('UCBrowser') ==-1){
				//添加控制条
				this.vC = document.createElement("div");
				this.vC.classList.add('controls');
				this.vC.innerHTML = '<div><span class="current">00:00</span></div><div><div class="progressBar"><div class="timeBar"><div class="crr"></div></div></div></div><div><span class="duration">00:00</span></div><div><div class="fill"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAADyklEQVR4Xu2bf07bMBTH30urTZO2JpHK32MngBtQTrByAroTrDvB2AkGJ1g5AeUEwA3gBON/OjkpkyZQmjc5UtaQpInt2o0H6Z/t84/vx8+un/2M8MI/+ML1Qwug9YAcgVkQnAHgUAkM4ae+35solRUsNGPzISCdCZrnzGja97yD7JeFKTALQlKrHICIrrZ8b6BaXqTcHQsuEXFPxLbMpu+5TzRrBQAE533fVfMeQUUzFk4A4VDQvGCmDoDgnACuqxruQu/Y9zFQ7ZxIOcbIi2E+igG8VfbIf0P4rNkDKOhQd9/331ZCEBFh0oYDijC8QMBdzQB4dXZDqBPPFchNAYITAhog4s6Spp0QysQT0Q0CXmangxQAIvjG53UEIV95rYWwSnwX3EEE8zEifE0HUBrAlu8eJQ1YCqFKPF+Q71h4tDYATs9GCHXieb+1AbANgoh47QBsgSAq3giApiHIiDcGoCkIsuKNAtg0BBXxBQBEYd/3nmyhi8EQm48I4hECBh14Nfb9N7dVW9dN/Dsw9mc7woez7PaWb3L4/3xd7MHLLuDxmIA8BGeSD9e1nAiZhMDY790FRhcA+G/kRMWLxBxaAJiaDqbF835rA1ANwf1Q56r50eJetcDwp6mRT9vTCmAVBB5T8C21iEumNvkdnE63z/ZDO4BSCIQHfb83lQNwP0CML5IgXHDBk6nfmAekFS9PbpzrLf/dpUrn7tj9wIF414HeRHYKibZnxANEG7fBrgVgwyg02YfWA5qkb0PbrQfYMApN9qH1gCbp29B26wE2jEKTfWg9wBT9JBhy5odx7NysFQw58Y4T907/q2CocIC5bjgMdN0ld98EBO1ToPz0Vv5A5BcLx4TwPfVQMgRBK4DS+3misAPutuzoJUdiEN4ComsSgjYAq8V3B6pZJcmhKERTQHxvCoIWACbEZ0+W8lfzOqdD6cUIYJxkYXWo+6Vu9EyK1wEhuRjBB76WeEDOae3FSDZPsO40dxPi14WgNT8gu2fYpPh1IBgB0IR4VQjaATQpXgWCVgA2iJeFoA2ATeJlIGgBYKP4KgjZjNa1ASSJkvnc22R7q77D0x2BVuUnRLAYKucJAk+VRdorZma8HtZljugWWVffKghAeAUIH9PyUpmi+UZN3tLWCRT5vRzC05LKAGwXX70mLCGoA0A4dgAqH0M4ce9ENuwVGdn8DjR25qWPIVI7/pgCCcZldSsDEOros34yI0DgeTyaYuE0u2oK6F6abObZ3AiQfkj1a3maUnjUpeVARKkzlhRqAVgyEI1148V7wF9yO/VuKlNkeAAAAABJRU5ErkJggg=="/></div></div>';
				this.vRoom.appendChild(this.vC);
			}
			

			//添加锁定按钮
			this.vlock = document.createElement("img");
			this.vlock.src = 'data:image/png;base64,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';
			this.vlock.className = 'lock';
			this.vRoom.appendChild(this.vlock);
		}

	}

	pro.initEvent = function() {
		var that = this;

		//document.queryseletor('video').webkitPlaysinline
		//		that.video.setAttribute('webkit-playsinline');
		//		that.video.setAttribute('playsinline');
		//that.video.poster="http://c1.mifile.cn/f/i/2014/cn/goods/air/overall/video-main-poster.jpg";

		//给播放按钮图片添加事件
		this.vimg.addEventListener('tap', function() {
			that.video.play();
		})

		//获取到元数据
		this.eve('loadedmetadata', function() {
			console.log("loadedmetadata事件")
			that.vDuration = this.duration;
			that.vC.querySelector('.duration').innerHTML = stom(that.vDuration);
		});

		//视频播放事件
		this.eve('play', function() {
			console.log("play事件")
			that.vimg.style.display = 'none';
			that.vC.classList.add('vhidden');
			that.vCt = setTimeout(function() {
				that.vC.style.visibility = 'hidden';
			}, 4500);

			//新增Lock图标隐藏动画
			that.vlock.classList.add('lockhidden');
		});
		this.eve('waiting', function() {
			console.log("waiting")
			waiting = true;
			that.vimg.style.display = 'block';
			that.vimg.src = 'data:image/gif;base64,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';
		});
		this.eve('canplay', function() {
			console.log("canplay")
			if(waiting) {
				that.vimg.style.display = 'block';
				that.vimg.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACkklEQVRYR8WXjVEUQRCFX0egGSgRCBEIEagRiBGIEagRiBEoESgRKBEIEQgZaARtfVTP2bs3szu7XNV11dXV3c5Mv3n9+mdNezbbs38tAuDuh5JeS+L7cXxzh2tJfyT9lHRpZvzusi4A7n4q6b2kp12nSreS3pnZ97n1kwDcHYdfJB03DrqJ/581nsPIGzMDUNWaANwdp9+C6rL5StJXqB4fGmBfSuLzPHkjNCetsFQBhPMf6ZA7Sadmxo1mLfYD9ElafFQDsQUghIZzRIZdhnNu0m3uzn40UNhgPyAG4agB4JZlE4qG0tXm7vk8QneSDxsACLUjOgzaD81s0c3HSIMJ0rKE41XOjjEA6CkLEU415oRpSa67OywiaOzWzA4K0A2AiP2veHBlZtXUS4cBlhTrFWYOxUaQGcC5pLcBgINR8Za5+4coSuXZbK6z0N3PJH2KTRQp/P0vxSOxHLSKRwVAAQKwzy3NRJ34PWY4M4BQ7iuamU0VqDEDmSUEe2ZmFw32fApAeXhjZjSbqk0wkNdX09fdNyIvl8wMFADXZnb0QAAXZkYDG9gcgF2E4G+EoCXgyRDkNFkjwo+Szh8iwrVpSK9AeM2W25uGCK8Uoq2aXYKZOuXSDrkJcTSl+6lpH6X4zsw2k9VUM4JSSuYumhHMFqeDHjPXjpuhaKVpJfWyuLd6TA0ASInPoziMA2ihi5iINkwHLE2NFKWLTg8kodgsSP7qnnJjP+2XxpOn6L6RLKkdENy+MMEjfjNmUWoHN4lm84LxLb0vsIebHy8aShMIbkBVy1NuDnMB0XpfYIpmmF0+lmcvMYRQqPKUO6XD7hrR9WY0CgvxLcIqzHBTjPCQObt9NetNuTXrFjGwxsHcnn8EnVEw6LfiQQAAAABJRU5ErkJggg==';
				//that.vimg.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAPXklEQVR4Xu1dTXYbNxKuQjPycjzLeW8mok8Q+gShT2DlBKakLCOZOoHpE5iWshxJ9AkincD0CUKfIGSS92YZe5mEjZqH7qZMUuyuQqN/0CK1swmggaoP9YdCAWH3t9UUwK1e/W7xsAPAloNgKwDQ6//yGMPWN8u8VqjbBNA2/4cAU01quvw7BfOPo+GTTw8dHw8KAL3+/9qo//4GgTpA0EagNiB2nZhINCbAKSBMCXBC6quPo+G/VsDiNH7NnRsNAMPwQP/1LRF0AamLgNGOLvuPgKZAOEaEcaj2PjQZEI0DQK//e0eF4QtAOqiK4RygEkDc6CB4Nxr+e8K19+n3RgAg2enPAagHgB2fCHh/LjQBwFGo9m6bIBm8BsD3P/zWJQxfAuKB30xPmR3RDVLw9r8//mfs6/y9BEDC+FfOBpwvVCcaIwWvfQSCVwA4Pp29AKLeg2H8OgA9BIIXAIh0fPjndVmMJ6IPiDglgFX3jTD+N9KK94AAbSJqI+K3pQgRonEYPDr0wUaoFQAmQKO0eokAg0IITTQDxDERTBSpybw1n7gGc8wcW/NWR6PuIEIHiLqAuF/EfAlgoJV+6zpHl7nUBoDjH349IKXfFODK3RLBWAfBuCoXLHFFu4hggkzPXRhgXEjU6uzyx69vXMbJ27dyAES7PlRvEKGXd9JGpAOokQ7Cmzp3j5l/vJ7gAED3XFQGEYx0oM+qXk+lADA7J9Dz61y+PNFnQhxqtTfyQXduAq+xZZT+q4dEfUD8hz3AaRKq1mFVkiwyf+wnma/H0cmvPcBI5D+2GoFoRogjrfSw6t1hNc+lxolt08fYo7GyFwjoE5A6u7r4epT3+zb9KgHA0cns2lrkG8aDGlRFCBui2bQ1wEfQA2sgEIyuLvYPbb6Vp22pAHDQ929DpQdN2fEc4Q0dAq2Mp/OSa7v8exV2QWkAiBeN7230vTHudNDqV6kDbRji2jb2HuZDO2PR2AX0rKzNUAoArJlvDDzAwdXF/tCVyE3of3Qy6yOQUQtCQ7E8EBQOAFvmE9FHHbR6D3XXpwEykQYjRFzJVEoHcDkgKBQAtswHgHeh0v2yxJvv0iCxDYzUeyGba/EgKAwAtswnwsOmW/gypvGtIk8B6ZpvaVoUC4LCACB29Yg+A6leXaFPGZGrb5W4i0OJXWC8g6JcxEIAYMP8MGh1t03fS+EURUrD+bhKEDgDQCy+iD7vmM9DwQ4E7mrUCQCRJavn79nw7o75POdXQskySWDCxlq1nrlI1NwAEBt9O+ZbMX/RWC4J3IzC3AAQ632N3+0MvlwYAKl6dTEKcwHAJHOAop+4Ze1cPY5C/O9SEEDOjWYNgPioE38WZPK8uzzfz530wZNme1ocn87M0XBmsMhkFmlFT22DatYAODqdDRDgVRb54/AudW0nsz0stVtpfKpqrqJlh40J4PXV+b5VfqUVAJIbOr9kTn9n9NlxV9haahSGau+JTcaUFQCOT6bvudRtIjjbllM9Ie8KaxadIiK8YTbg+PKi/Uz6UTEAJMaIOc+/umi7XceWznxL2x2dTI0qyLyvgFo9k95CEgNAsvtDFTx1CUpsKU+tlh0n1oY/FyUFRACI7uop/Z6Z6dvL8/2+1Wp2jXNR4Ph0Zo6QM9PLpFJABAB29xPNwoA6O6s/Fz+tO0VR2NBULcnIKCIS2QIsACS7fxfwseahcweJTSaRAiwAjk9n5spS+vUnotnlRbuS0izOVHtgAxyfTD8xR8e3l+f7mbUVMgEg8fvzBB8eGB9qW44kKBcq/c8s1ZwJANbvjII+1PZJ9x+e/Ba5SBS0ZjYBkdq46PBhiS3AxWUyAXB8Ov05K6/fp92f3Da+Xs5NiG7eAg4uz/ffOdDZ6668FKDJ5Xn7adoiUgEg8Tdtw45lUZI3iGiCOjiTBkfKmmcZ40rUdFZ8JhUAnK/pS9QvOZ38hc1KMmqhpivYZTB+ecyjk+mEOShKjdGkAuDodGqImmrd++L6SdzUZWJFt28Bh1fn+6/LZkxV43MS0KjCq/P2k03z2QgAmVjJti6rWrwtABbzMkRROjh8CGohuWDyRxbN09T1RgBwiAIA1r/0HQB38yO6CYNHZ033GLh4TZrE3ggALgOFcy2qYr75Tl4JsEkt1F2wyYVurMsOsDFDa7MEYPS/L9Z/UQBYVgt1FmxyAQDntaXZAfcAwOp/z0K/RUiAe4T3qI6fDSi40PCmjXsPAIKMX6+SPVkAxLUDrer0fJEI9dfxswIAlzy6IXP4HgC4yJJP+l+iAky0Umk11hiayhzCu/hfyN6kaCJnB2yK3N6XAAyKJEeMNqh1bctJgOVF21fmWJpdpBZaZz5nPHG0MPUY1lP170sAJueMO11yZahtf27R66i3L8qwOiMiGOpAv/bpAGwxQy4esCl6u0kCUBYTLs/32RwCWya6tLcFwOJbpp+DWviEgH0fD5mOT2dW/FthZh4EuTCviL55AbD4tpNaAP8Ombis4XUJvgIAjpibdEgRTHQZg5uz5Mi6ALVQS53fTXTjgnjrNpwVACTEdGFmnr5FAKBAtWByD97mWUdRfTgvbgcAAaVd1UKZhR256e8AsEahvFLLUS3UFixzAgB3CpiXmBxqXX4vUgVsmkdeb6Eud5kDwPqp4IoNYNvZhXFF9S0bAHm9hboCZrabeAcACyQKzknuRmsmAJiKlduoAgxHk1fN3tg8YFkbAJgCHpkqoCpxarHp2KZlz/nodPYKgPqSpNO7yRJ9vrxo272Mwq5U1oBT4zs3UEbHKNNIq9DcM7C+9lbniekOAI5uYB5xv/bJWq/JlwqAhxoKvrP084j7pLMpjKUo6NedZcwlh2aqgG08DDL8cxH3EL12ovq+lL53OgwyxLA9ThSq1NKauRiBRYh73x63suXf1iWEFCTuvXzcKo8E36qUsALEvddvGXLSUJYSxgYS/KoDyC16EbxyFfdmHN9fLy0mKZQvBF3bSVfaYU1WBTPDOHMx2DqY88W6/6CDR70mXB3jkkE2FZS2vhiSddO0NEsvY2BOAuSek7lPQKrfpFL3R6fTP7IilqKLIZEncDI1JchSL1P4VBCycAAkr5TbFl3ODbSCOnJXwyDlRtfucugqA25Dtddvgrhfxw2n/9OCeLvr4YaSRDOkoFd3FM9FGHARQKvr4ewFUQCoK+NlnUhOKqCh4n6dBpz/b9pbFYiQ2AFNLRGzRLwH82wtlwWUpv8NLXIXiQJhLVoXsSbpaysBfDm0kaxN2oYr5wcA9kWiWKsyQ6zcF1G/d1QYmjdvHiPhbZGulURdRfN5oE/US9afVdCDqRSaXX5MkiK2CUhFqw+upJ3ZAb4d2kh3N9eOO/83Eu/qot1JG8epVGz8ciU9ybopu8k6jfs9elqku5Wogj4QdUwMwywcESeh2hsU+R2OIVX+LqmRyGUnlV4sOvV82hMbokqGFf0tbvfH1r9DsejIG2DKxXOh4UwLNedjh0UTsqnjcaFfSTk/9q6/xMrmdHqaFJDYEE1lTtnzZl0/4+IJHo9iAWAWwqUZca9WJkexk/XHDXw6UyibYUWOL9P9shfcRACQSIEsXzMG0a89BD1cgGC3+/NDQuD1iHZ/ZiBofXqcFIgNjuxn4wxyW/NWZ95qTR+qZZ6frbKekviMTSV3kQQwUxNJAUvLPn4TV70CpAMkmIRB67XPVbhkLCq3FfuCm1D3L2YpBoDEFogDbvKUseOT6U/r9+04g7Jc8vo9uuDIF2x2v5UKMI0lYcc4yNN6xu3krBMs87DD1cX+od/sqHZ2RvQrPX/P3VG0reNsJQEiKSB4Ph6AJlyZFO4IcweCLwCLaYXvs95viqRv2c/Hx1IgerXSuHSZ9XclDOSCTBIgVbsP6/na0cnsGhF6mV/P+XqrtQQwk5AWSuD0eWwEonkNO7WGr1EpqNVhkSeI9bAx31clAZ9o5JxR1VwAiEDAVaZO1suBQDqWzyVa87GW7yVmfspjEPwXMhJCuM6S3RvrJZlRKAFUkyp3c/TjfpcafebUUwfUzVu7OLcEiO2B3ztBOB8z79eKQSAzMCNfc4wUvG5yEmcWAKTMN0kuYdDqch5X1recABB5BUxdocXHxZLA3ExCPeJAFY1LNNaohtfnX99yO6opv4uZHy0fD12vpTsDQKrDbdRBol5uEDF6B5j7M6oBCG90sPe2ySFmG+YXVayjEADYggBInUmQm6tka/SwA32XVydyYCvrdyNJAfUbLtCTfL+w+5mFAUBqFN6pBKH4SqKPAwAwSaXCv+wHk4WDVNZMqkZjrZed42c76cIAEBuFvF+/PEGbt3wj8RjOzbs/IrXAnUzaEqqM9slh2Bs2yJN83NXi37SGQgGQBwRxtK91KLVkk9q9Aw4ItjHxMhicNWZ8rDu/5sK7XySmm7uXNpfCAZAHBFG0D9Cq1n6iGkwWcG+Dx+DN07abCH98OntJQAOhvo/EvouvnwXEUgCQBwTRJHO+zJXo0AMiegyIY18reSRxE1NytiuVOGUy38yhNAAsQBBoNbQz4KKcAm9f5pIybrndIvEFEfqW/Quz9itVAesfk4R51/s8lLDv8ensBQENpeJ+iQ6lM790CbDM1PWkUOlOMPYBAA6b9LJ3nLWrXuaqS1Rx4clSVcA6kxNXbpTzCdcECHvvfI32GcNU6b9e5GJ84uProNWTekTSTVSLEZj2Uce3eOJhicwB1ChU+rbuiF+ynueG6VKXLoU2tdQrqFQCLC88SirB6J5Arpe978YiujGWf6iCD1XtnCQ1+1sg6to8IrGR8TVXI6sNAHeuolZ9BHhVhDhLDoXGiDDRpCYUzD+6SgizwzFsfaNQd4igE6WwAxbyGIQPxSdrBcCC6ZHuDP80toEozGsNFqIxAU4BYbrcFyH+NwGsPgpB0Eagto2/bjMnk7rtS/FJLwCwIJ40zGtDbJ/aGsYrCgY+JbJ4BYCHCgQfGb+gtZcAWAYCKW2iZ8992skWc7lFrYY+7fj1uXsNgC82QnSHsAdAvTwxBAuGOTc1sXsANK+Jj1wNUOfJCAZoBACW15G4YD0gOnB2IQUEEjUxrhziTaj2hr4GqdLW0TgArILBeA9/dxGpm/jkbjEFEbfj0rIm9kCEYx18NW4a09c8Iemq/W8X5QjM/+6Qog4CtImo7epaGgMOEacEMEWNk7D11aTJDG+kDeAKvUVhiuVxNBo/n2L/n3CqCFdiBPPWfNIEHe5Km0arANfF7/qXnBCyI7D/FNhJAP95VOoM/w/9eiom7K02egAAAABJRU5ErkJggg==';
			}
		});

		//视频播放中事件
		this.eve('timeupdate', function() {
			that.vimg.style.display = 'none';
			var currentPos = this.currentTime; //获取当前播放的位置
			//更新进度条
			var percentage = 100 * currentPos / that.vDuration;
			that.vC.querySelector('.timeBar').style.width = percentage + '%';
			//更新当前播放时间
			that.vC.querySelector('.current').innerHTML = stom(currentPos);
		});

		//视频点击暂停或播放事件
		this.eve('tap', function() {
			console.log("视频点击暂停或播放事件")
			if(this.paused || this.ended) {
				//如果播放完毕，就重头开始播放
				this.ended && (this.currentTime = 0);
				this.play();
			} else {
				//播放时点击就暂停
				this.pause();
			}
		})

		//暂停or停止
		this.eve('pause', function() {
			that.vimg.style.display = 'block';
			that.vC.classList.remove('vhidden');
			that.vC.style.visibility = 'visible';
			that.vCt && clearTimeout(that.vCt);

			//新增Lock图标清除动画
			that.vlock.classList.remove('lockhidden');
		});

		//视频手势右滑动事件
		this.eve('swiperight', function() {
			that.setCurrentTime(5);
		});

		//视频手势左滑动事件
		this.eve('swipeleft', function() {
			that.setCurrentTime(-5);
		});

		//视频手势上滑动事件
		this.eve('swipeup', function() {
			//that.setVolume(0.2);
		});

		//视频手势下滑动事件
		this.eve('swipedown', function() {
			//that.setVolume(-0.2);
		});

		//全屏按钮点击事件
		this.vC.querySelector('.fill').addEventListener('tap', function() {
			that.nativeMax();
			//that.switch();
		});

		//全屏 时 锁定点击事件
		this.vlock.addEventListener('tap', function() {
			if(that.isLock) {
				that.unlockScreen();
				return;
			}
			that.lockScreen();
		});

		/**
		 *2016-9-3 
		 * 解决进度条拖动 在全屏和mini时的错位问题
		 */
		var crr = this.vC.querySelector('.crr');
		this.timeBar = that.vC.querySelector('.timeBar');
		crr.addEventListener('touchstart', function(e) {
			//暂停播放
			that.video.pause();
		});

		crr.addEventListener('touchmove', function(e) {
			//计算 手指x坐标 减去 进度条的x坐标
			var cha = e.touches[0].pageX - that.vCstyle.barLX;
			if(cha < 0) {
				cha = 0;
			} else if(cha > that.vCstyle.barW) {
				cha = that.vCstyle.barW;
			}
			//计算移动的x距离百分比
			that.bl = 100 * cha / that.vCstyle.barW;
			that.timeBar.style.width = that.bl + '%';
		});

		crr.addEventListener('touchend', function(e) {
			//跳转到百分比的视频进度
			that.video.currentTime = that.video.duration * that.bl / 100;
			//继续播放
			that.video.play();
		});

		this.oback = $.back;
		//监听安卓返回键
		$.back = function() {
			if(that.isMax) {
				if(!that.isLock) {
					setTimeout(function() {
						that.startWatchAcc();
					}, 1000);
					that.clearWatchAcc();
					that.switch();
				}
				return;
			}
			that.oback();
		}
	}
	pro.initStyle = function() {
		if(navigator.userAgent.indexOf('UCBrowser') ==-1){
			var bar = this.vC.querySelector('.progressBar'),
					barW = bar.offsetWidth,
					barLX = bar.offsetLeft,
					barRX = barLX + barW;
				this.vCstyle = {
					barW: barW,
					barLX: barLX,
					barRx: barRX
				};
		}
		
	}

	pro.setIsMax = function(state) {
		this.isMax = !state;
		this.switch();
	}
	pro.getIsMax = function() {
		return this.isMax;
	}

	//全屏 mini 两种模式切换
	pro.switch = function() {
		var vR = this.vRoom;
		//获取需要转换的样式信息
		var info = this.isMax ? this.miniInfo : this.maxInfo;
		this.isMax = !this.isMax;

		setTimeout(function() {
			for(var i in info) {
				vR.style[i] = info[i];
			}
			//重新计算视频宽度和进度条的左边距
			this.initStyle();
		}.bind(this), 500);

		plus.navigator.setFullscreen(this.isMax);

		if(this.isMax) {
			var video = document.getElementById("video");
			this.initStyle();
			//自感应横屏方向状态
			video.width = '500px';
			video.style.Position = 'fixed';
			video.top = 0;
			video.style.zIndex = '9999999999999'

			plus.screen.lockOrientation("landscape"); //-primary");
		} else {
			//锁定手机正竖直方向
			this.initStyle();
			plus.screen.lockOrientation("portrait-primary");
		}

		//全屏时 显示锁定 图标
		this.vlock.style.visibility = this.isMax ? 'visible' : 'hidden';

	}

	//锁定屏幕
	pro.lockScreen = function() {
		$.toast('锁定屏幕');
		var that = this;
		//更换video点击事件为 显示 lock图标，并保存 video之前的事件 
		this.videoTapFn = this.eve('tap', function() {
			that.lockT = setTimeout(function() {
				that.vlock.classList.add('lockhidden');
			}, 500);
			//重新开始播放样式
			that.vlock.classList.remove('lockhidden');
			that.vlock.style.visibility = 'visible';
			//that.vlock.classList.add('lockhidden');
		}, true);
		//隐藏控制条
		this.vC.style.visibility = 'hidden';
		//给Lock图标增加 隐藏样式类
		this.vlock.classList.add('lockhidden');
		//锁定屏幕时，不监控重力感应
		this.clearWatchAcc();
		//标识当前更改的Lock状态
		this.isLock = true;

	}

	//解锁屏幕
	pro.unlockScreen = function() {
		$.toast('解锁屏幕');
		//替换回video之前的点击事件
		this.eve('tap', this.videoTapFn, true);

		//给Lock图标清楚 隐藏样式类
		this.vlock.classList.remove('lockhidden');
		//不锁定屏幕时，监控重力感应
		this.startWatchAcc();
		//标识当前更改的Lock状态
		this.isLock = false;
	}

	//开启方向感应
	pro.startWatchAcc = function() {
		var that = this;
		this.watchAccFun = plus.accelerometer.watchAcceleration(function(a) {
			if(that.getIsMax()) {
				//当前为全屏状态
				//判断是否满足竖屏Mini状态
				a.yAxis >= 5 && that.setIsMax(false);
			} else {
				//当前为Mini状态
				//判断是否满足全屏Max状态
				Math.abs(a.xAxis) >= 5 && that.setIsMax(true);
			}
		}, function(e) {
			//出错了大不了 不自动旋转呗  让它手动 切换
			console.log("Acceleration error: " + e.message);
			that.clearWatchAcc();
		}, {
			frequency: 1200
		});
	}
	//关闭方向感应
	pro.clearWatchAcc = function() {
		this.watchAccFun && plus.accelerometer.clearWatch(this.watchAccFun);
	}

	//使用原生支持的方式播放
	pro.nativeMax = function() {
		if(!window.plus) {
			//非html5+环境
			return;
		}
		if($.os.ios) {
			console.log('ios')
			this.video.removeAttribute('webkit-playsinline');
			this.video.removeAttribute('playsinline');
			this.video.play()
		} else if($.os.android) {
			console.log('android');
			var url = this.video.querySelector('source').src;
			var Intent = plus.android.importClass("android.content.Intent");
			var Uri = plus.android.importClass("android.net.Uri");
			var main = plus.android.runtimeMainActivity();
			var intent = new Intent(Intent.ACTION_VIEW);
			var uri = Uri.parse(url);
			intent.setDataAndType(uri, "video/*");
			main.startActivity(intent);
		}
	}

	//跳转视频进度 单位 秒
	pro.setCurrentTime = function(t) {
		this.video.currentTime += t;
	}
	//设置音量大小 单位 百分比 如 0.1
	pro.setVolume = function(v) {
		v = this.video.volume + v;
		if(v < 0) v = 0;
		else if(v > 1) v = 1;
		this.video.volume = v;
	}
	//设置屏幕亮度  单位 百分比 如 0.1
	pro.setBrightness = function(b) {
		b = plus.screen.getBrightness() + v;
		if(b < 0) b = 0;
		else if(b > 1) b = 1;
		plus.screen.setBrightness(b);
	}
	//切换播放地址 
	pro.setUrl = function(nUrl) {
		var v = this.video;
		var source = v.querySelector('source');
		source.src = v.src = nUrl;
		source.type = 'video/' + nUrl.split('.').pop();
		v.play();
	}

	var events = {};

	//增加 或者删除事件    isBack 是否返回  这次添加事件时 被删除 的上一个 事件
	pro.eve = function(ename, callback, isBack) {
		var fn;
		if(callback && typeof(callback) == 'function') {
			isBack && (fn = arguments.callee.call(this, ename));
			events[ename] = callback;
			this.video.addEventListener(ename, events[ename]);
			console.log('添加事件：' + ename);
		} else {
			fn = events[ename];
			fn && this.video.removeEventListener(ename, fn);
			console.log('删除事件：' + ename);
		}

		return fn;
	}

	function stom(t) {
		var m = Math.floor(t / 60);
		m < 10 && (m = '0' + m);
		return m + ":" + (t % 60 / 100).toFixed(2).slice(-2);
	}

	var nv = null;
	$.bvd = function(dom) {
		return nv || (nv = new bvd(dom));
	}
}(mui))