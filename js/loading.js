var bigContainer = document.querySelector('body');

function creatloadingEL() {
	var div = document.createElement('div');
	div.style.display = 'none';
	div.className = 'DialogDiv';
	div.innerHTML = '<div class="U-guodu-box">' +
		'					<div>' +
		'						<table width="100%" cellpadding="0" cellspacing="0" border="0">' +
		'							<tr>' +
		'								<td align="center"><img src="../img/loading.gif"></td>' +
		'							</tr>' +
		'							<tr>' +
		'								<td valign="middle" align="center">提交中，请稍后！</td>' +
		'							</tr>' +
		'						</table>' +
		'					</div>' +
		'				</div>';
	bigContainer.appendChild(div);
}

function showLoading() {
	var height = document.documentElement.clientHeight || document.body.clientHeight;
	$("#BgDiv1").css({ display: "block", height: height });
	var yscroll = document.documentElement.scrollTop;
	var screenx = $(window).width();
	var screeny = $(window).height();
	$(".DialogDiv").css("display", "block");
	$(".DialogDiv").css("top", yscroll + "px");
	var DialogDiv_width = $(".DialogDiv").width();
	var DialogDiv_height = $(".DialogDiv").height();
	$(".DialogDiv").css("left", (screenx / 2 - DialogDiv_width / 2) + "px")
	$(".DialogDiv").css("top", (screeny / 2 - DialogDiv_height / 2) + "px")
}

function hideLoading() {
	$("#BgDiv1").css("display", "none");
	$(".DialogDiv").css("display", "none");
}