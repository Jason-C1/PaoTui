<?php
/**
 * Created by PhpStorm.
 * User: YT
 * Date: 2018/3/23
 * Time: 10:58
 */


	header('Access-Control-Allow-Methods:OPTIONS, GET, POST');

header('Access-Control-Allow-Headers:x-requested-with');

header('Access-Control-Max-Age:86400');

header('Access-Control-Allow-Origin:*');

header('Access-Control-Allow-Credentials:true');

header('Access-Control-Allow-Methods:GET, POST, PUT, DELETE, OPTIONS');

header('Access-Control-Allow-Headers:x-requested-with,content-type');

header('Access-Control-Allow-Headers:Origin, No-Cache, X-Requested-With, If-Modified-Since, Pragma, Last-Modified, Cache-Control, Expires, Content-Type, X-E4M-With');

require_once 'mysql.fnc.php';
error_reporting(0);
session_start();
$userName=$_POST['userName'];
$password=$_POST['password'];
if($userName==null||$userName==""){
    $response['message']="用户名不能为空";
}else if($password==null||$password==""){
    $response['message']="密码不能为空";
}else {
    $token = md5($userName . time() . rand());
    $_SESSION['token'] = $token;
    $mysqli = connect();
    $sql = "select * from user where userName = '" . $userName . "' and password = '" . $password . "'";
    $info = getData($mysqli, $sql)[0];
    $_SESSION['info'] = $info;
    if ($info == null) {
        $response['message'] = "账号密码错误";

    } else {
        $info['token'] = $token;
        $response['info'] = $info;
        $response['message'] = "登陆成功";
    }

}
echo json_encode($response);