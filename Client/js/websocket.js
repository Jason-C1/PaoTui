ws = new WebSocket("ws://");
ws.onopen = function() {
	//console.log("open");
};
ws.onmessage = function(evt) {
	//console.log(evt.data);
	var jsondata = JSON.parse(evt.data);
	var user = jsondata.user;
	var msg = jsondata.msg;
	var fulltime = jsondata.fulltime;
	var datetime = new Date();
	//if(user!=="system"){
	var year = datetime.getFullYear();
	var month = datetime.getMonth() + 1;
	var date = datetime.getDate();
	var hour = datetime.getHours();
	var minute = datetime.getMinutes();
	var second = datetime.getSeconds();
	var msecond = datetime.getMilliseconds();
	var fulltime = year + "/" + month + "/" + date + " " + hour + ":" + minute + ":" + second + "." + msecond;
	//alert(fulltime);
	var db = openDatabase("chat", "1.0", "聊天", 2 * 1024 * 1024);
	db.transaction(function(tx) {
		tx.executeSql("INSERT INTO message VALUES ('" + user + "','" + msg + "','" + fulltime + "',0)");
		/*tx.executeSql('SELECT * FROM message', [], function (tx, results) {
           	var len = results.rows.length;
           	//alert("查询记录条数: " + len); 
			var sum="";
           	for (var i = 0; i < len; i++){
              	sum=sum+results.rows.item(i).username+" "+results.rows.item(i).msg+" "+results.rows.item(i).time+" "+results.rows.item(i).read+"\n";
           	}
           	alert(sum);
        }, null);*/
	});
	//}
};
ws.onclose = function(evt) {
	//console.log("WebSocketClosed!");
	mui.toast("连接已关闭,请稍后再试");
};
ws.onerror = function(evt) {
	//console.log("WebSocketError!");
	mui.toast("网络连接失败,请稍后再试");
};