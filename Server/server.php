<?php
	//允许连接
	header('Access-Control-Allow-Methods:OPTIONS, GET, POST');
	
header('Access-Control-Allow-Headers:x-requested-with');
	
header('Access-Control-Max-Age:86400');  
	
header('Access-Control-Allow-Origin:'.$_SERVER['HTTP_ORIGIN']);
	
header('Access-Control-Allow-Credentials:true');
	
header('Access-Control-Allow-Methods:GET, POST, PUT, DELETE, OPTIONS');
	
header('Access-Control-Allow-Headers:x-requested-with,content-type');
	
header('Access-Control-Allow-Headers:Origin, No-Cache, X-Requested-With, If-Modified-Since, Pragma, Last-Modified, Cache-Control, Expires, Content-Type, X-E4M-With');



	//接收并返回注册信息
	$userInfo = json_decode($_POST["userInfo"],true);
	$userInfo["result"] = "checkOK";
	$userInfo = json_encode($userInfo);
	echo $userInfo;
?>