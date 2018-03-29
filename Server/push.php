<?php
/**
 * Created by PhpStorm.
 * User: YT
 * Date: 2018/3/24
 * Time: 13:18
 * 发布订单
 */
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
$mysqli=connect();
error_reporting(0);
$data=$_POST;
if($data['cate']==null||$data['cate']==""){
    $message['message']="请填写类别";

}else if($data['title']==null||$data['title']==""){
    $message['message']="请填写标题";
}else if($data['content']==null||$data['content']==""){
    $message['message']="请填写具体内容";
}else if($data['oFrom']==null||$data['oFrom']==""){
    $message['message']="请填写用户地址";
}else if($data['oTo']==null||$data['oTo']==""){
    $message['message']="请填写目的地址";
}else if($data['price']==null||$data['price']==""){
    $message['message']="请输入跑腿费";
}else if($data['money']==null||$data['money']==""){
    $message['message']="请输入购货费";
}else if($data['deadline']==null||$data['deadline']==""){
    $message['message']="请输入截止时间";
}
else {
    $mysqli = connect();
    $data['dateTime'] = date("Y-m-d h:i:s");
    insert($mysqli,'orderform',$data);
    $message['message'] = "发布订单成功";

    }

echo json_encode($message);

