$(function(){
	// ��ʼ�����
	$("#demo").zyUpload({
		width            :   "100%",                 // ���
		height           :   "250px",                 // ���
		itemWidth        :   "120px",                 // �ļ���Ŀ��
		itemHeight       :   "100px",                 // �ļ���ĸ߶�
		url              :   "http://192.168.0.155:9998/api/Post/UploadFiles",  // �ϴ��ļ���·��
		multiple         :   true,                    // �Ƿ���Զ���ļ��ϴ�
		dragDrop         :   false,                    // �Ƿ�����϶��ϴ��ļ�
		del              :   true,                    // �Ƿ����ɾ���ļ�
		finishDel        :   false,  				  // �Ƿ����ϴ��ļ���ɺ�ɾ��Ԥ��
		/* �ⲿ��õĻص��ӿ� */
		onSelect: function(files, allFiles){                    // ѡ���ļ��Ļص�����
			console.info("��ǰѡ���������ļ���");
			console.info(files);
			console.info("֮ǰû�ϴ����ļ���");
			console.info(allFiles);
		},
		onDelete: function(file, surplusFiles){ // ɾ��һ���ļ��Ļص�����
			console.info("��ǰɾ���˴��ļ���");
			console.info(file);
			console.info("��ǰʣ����ļ���");
			console.info(surplusFiles);
		},
		onSuccess: function(file){ 
			// �ļ��ϴ��ɹ��Ļص�����
			console.info("���ļ��ϴ��ɹ���");
			console.info(file);
		},
		onFailure: function(file){                    // �ļ��ϴ�ʧ�ܵĻص�����
			console.info("���ļ��ϴ�ʧ�ܣ�");
			console.info(file);
		},
		onComplete: function(responseInfo){           // �ϴ���ɵĻص�����
			console.info("�ļ��ϴ����");
			console.info(responseInfo);
		}
	});
});