<?php
/**
 * Created by PhpStorm.
 * User: YT
 * Date: 2018/3/23
 * Time: 21:11
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
订单详情页面
 */




    $mysqli=connect();
    $data=$_GET['oId'];
    $sql="select cate,dateTime,deadline,price,money,userName,phone from user,orderform where user.uId=orderform.uId and orderform.uId ".$data;
    $response=getData($mysqli,$sql);


    echo json_encode($response);
