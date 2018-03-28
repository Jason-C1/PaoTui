<?php
/**
 * Created by PhpStorm.
 * User: YT
 * Date: 2018/3/20
 * Time: 19:03
 */

 function getData($mysqli,$sql)
{

    $result=mysqli_query($mysqli,$sql);
    $data = mysqli_fetch_all($result,MYSQLI_ASSOC);

    return $data;
}
function connect(){
    $mysqli = new mysqli('localhost','root','');
    $mysqli->select_db('paotui');
    if($mysqli->connect_errno){
        die('CONNECT ERROR:'.$mysqli->connect_error);
    }
    $mysqli->set_charset('utf8');
    return $mysqli;
}
/*
 * 记录插入
 */
function insert($mysqli,$table,$array){

    $keys=join(",",array_keys($array));
    $vals="'".join("','",array_values($array))."'";

    $sql="insert into {$table} ($keys) values ({$vals})";

    mysqli_query($mysqli,$sql);
    echo mysqli_error($mysqli);
    return mysqli_affected_rows($mysqli);
}
/*
 * 记录跟新
 */
function update($table,$array,$where=null){
    $mysqli=connect();
    $str=null;
    foreach($array as $key=>$val) {

        if ($str == null) {
            $seq = "";
        } else {
            $seq = ",";
        }
        $str = $seq . $key . "='" . $val . "'";
    }
    $sql = "update{$table}set{$str}".($where==null?null:"where ".$where);
    mysqli_query($mysqli,$sql);
    return mysqli_affected_rows($mysqli);


}
/*
 * 删除
 */
function delete($table,$where=null)
{
    $mysqli=connect();
    $where=$where==null?null:"where ".$where;
    $sql ="delete  from {$table} {$where}";
    $result=mysqli_query($mysqli,$sql);
    return mysqli_affected_rows($mysqli);
}