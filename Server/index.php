
<?php
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
   首页显示订单;
 */




    $mysqli=connect();
    $response = array();
    $set="select orderform.title,orderform.oId,user.uId,orderform.dateTime,orderform.deadline,orderform.price,orderform.oFrom,orderform.oTo from orderform,user where user.uId=orderForm.userId";
    $array = array('\'校园帮帮\'','\'同城快送\'','\'生鲜蔬果\'','\'其他产品\'');
    $response['C0']=getData($mysqli,$set);

    for($i=1;$i<4;$i++)
    {
        $sql=$set." and cate = ".$array[$i];
        $data=getData($mysqli,$sql);
        $response['C'.$i]=$data;

    }


    echo json_encode($response);
