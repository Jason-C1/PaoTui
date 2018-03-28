<?php
/**
 * Created by PhpStorm.
 * User: YT
 * Date: 2018/3/23
 * Time: 17:13
 */

header('Access-Control-Allow-Methods:OPTIONS, GET, POST');

header('Access-Control-Allow-Headers:x-requested-with');

header('Access-Control-Max-Age:86400');

header('Access-Control-Allow-Origin:*');

header('Access-Control-Allow-Credentials:true');

header('Access-Control-Allow-Methods:GET, POST, PUT, DELETE, OPTIONS');

header('Access-Control-Allow-Headers:x-requested-with,content-type');
header("Content-Type:text/html;charset=utf-8");

header('Access-Control-Allow-Headers:Origin, No-Cache, X-Requested-With, If-Modified-Since, Pragma, Last-Modified, Cache-Control, Expires, Content-Type, X-E4M-With');
require_once 'mysql.fnc.php';
/*
 * 用户注册
 */
error_reporting(0);
$mysqli = connect();
$data=$_POST;
if($data['userName']==null||$data['userName']==""){
    $message['message']="用户名不能为空";

}else if($data['password']==null||$data['password']==""){
    $message['message']="密码不能为空";
}else if($data['phone']==null||$data['userName']==""){
    $message['message']="手机号不能为空";
}else if($data['idCard']==null||$data['userName']==""){
    $message['message']="身份证号不能为空";
}else if(strlen($data['userName'])>16||strlen($data['userName'])<4){
    $message['message']="用户名长度请在4-16个字符";
}else if(strlen($data['password'])>16||strlen($data['password'])<4){
    $message['message']="密码请在6-16个字符";
}else if($data['check']!=$data['password']){
    $message['message']="两次输入的密码不一致";
}else {
    $mysqli = connect();

    $sql = "select * from user where phone = '".$data['phone']."' or idCard = '".$data['idCard']."'";

    $result = getData($mysqli, $sql);
    if($result!=null) {
        $message['message'] = "用户已被注册";
    }
    else{
        unset($data['check']);
        insert($mysqli,'user',$data);
        $message['message'] = "注册成功";

    }
}
echo json_encode($message);