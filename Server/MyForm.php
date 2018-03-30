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
$uId = $_GET['uId'];
$state=$_GET['state'];


    $mysqli = connect();
    if ($state == 5) {
        $sql = " select orderform.title,user.userName,orderform.oId,user.uId,orderform.dateTime,orderform.deadline,orderform.price,orderform.oFrom,orderform.oTo from orderform,user where user.uId=orderForm.uId and user.uId = " . $uId . " order by oId desc";
    } else {
        $sql = " select orderform.title,user.userName,orderform.oId,user.uId,orderform.dateTime,orderform.deadline,orderform.price,orderform.oFrom,orderform.oTo from orderform,user where user.uId=orderForm.uId and state = " . $state . " and  user.uId = " . $uId . " order by oId desc";
    }
    $data = getData($mysqli, $sql);
    echo json_encode($data);

