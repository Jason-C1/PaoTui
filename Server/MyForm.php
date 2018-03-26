<?php
/**
 * Created by PhpStorm.
 * User: YT
 * Date: 2018/3/26
 * Time: 12:49
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
/**
我的订单
 */
error_reporting(0);
$id = $_GET['id'];
$state=$_GET['state'];
$message = "登录信息失效,请重新登陆";
if(false) {
    $mysqli = connect();
    if ($state == 5) {
        $sql = " select orderform.title,user.userName,orderform.oId,user.uId,orderform.dateTime,orderform.deadline,orderform.price,orderform.oFrom,orderform.oTo from orderform,user where user.uId=orderForm.userId and uId = " . $id . " order by oId desc";
    } else {
        $sql = " select orderform.title,user.userName,orderform.oId,user.uId,orderform.dateTime,orderform.deadline,orderform.price,orderform.oFrom,orderform.oTo from orderform,user where user.uId=orderForm.userId and state = " . $state . " and  uId = " . $id . " order by oId desc";
    }

    $data = getData($mysqli, $sql);
    echo json_encode($data);
}
else
{
	$data=['message'=>$message];
    echo json_encode($data);
}