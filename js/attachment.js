//渲染附件图标
function getDocumentType(type){
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
	return icon;
}
//创建详情中的附件列表
var creatAttachment = function(data,type) {
	var fragment = document.createDocumentFragment();
	var rows = "";
	var div;
	var Attachmentlength = data != null  ?  data.length  :  0;			
	for(var i = 0; i < data.length; i++) {
		var filename=data[i].FriendlyFileName;
		var icon = getDocumentType(filename.substring(filename.lastIndexOf('.')+1));
		var downloadUrl='';
		div = document.createElement('div');
		div.className='mui-row';
		div.innerHTML = '<div class="mui-col-xs-1">'+
			''+icon+''+
			'</div>'+
			'<div class="mui-col-xs-7 mui-ellipsis">'+data[i].FriendlyFileName.substring(0,15)+'</div>'+
			'<div class="mui-col-xs-2 text-muted mui-text-right">'+data[i].Size+'</div>'+
			'<div class="mui-col-xs-2 mui-text-right commentupload">'+
				'<a id='+data[i].Url+' title='+data[i].FriendlyFileName+'>下载</a>'+
			'</div>';
		rows += nodeToString(div);
		fragment.appendChild(div);
	}
	if(type == 'com'){
		var div = '<div class="tn-file-list" id="commentattachments">'+rows+'</div>';
		return div;
	}else{
		return fragment;
	}			
};