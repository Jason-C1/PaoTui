  window.Validator = function(rule) {
  	var self = this;
  	this.rule = {};
  	this.val = "";
  	//初始化函数
  	(function() {
  		var i;
  		var rule_str = rule;
  		if(!rule_str) return;
  		var rule_arr = rule_str.split('|'); // [ 'min:18', 'maxlength:10']
  		for(i = 0; i < rule_arr.length; i++) {
  			var item_str = rule_arr[i];
  			var item_arr = item_str.split(':'); // ['min','18']
  			self.rule[item_arr[0]] = item_arr[1]; // {min: 18}
  		}
  	})();
  	/*
  	{
  	  max: 10,
  	  min: 2
  	}
  	*/
  	this.is_valid = function(val) {
  		var key;
  		this.val = val || "0";
  		/*如果不是必填项且用户未填写任何内容则直接判定为合法*/
  		if(this.rule.required)
  			return true;
  		for(key in this.rule) {
  			/*防止重复检查*/
  			if(key === 'required')
  				continue;
  			/*调用rule中相对应的方法*/
  			var r = this['validate_' + key]();
  			if(!r) return false;
  		}
  		return true;
  	}
  	this.validate_max = function() {
  		pre_max_min();
  		return this.val <= this.rule.max;
  	}
  	this.validate_min = function() {
  		pre_max_min();
  		return this.val >= this.rule.min;
  	}
  	this.validate_maxlength = function() {
  		pre_length();
  		return this.val.length <= this.rule.maxlength;
  	}
  	this.validate_minlength = function() {
  		pre_length();
  		return this.val.length >= this.rule.minlength;
  	}
  	this.validate_numeric = function() {
  		var reg = new RegExp("/^[1-9]\\d*$/");
  		return reg.test(this.val);
  	}
  	this.validate_required = function() {
  		var real = this.val.trim();
  		if(!real && real !== 0) {
  			return false;
  		}
  		return true;
  	}
  	this.validate_pattern = function() {
  		var reg = new RegExp(this.rule.pattern);
  		return reg.test(this.val);
  	}
  	/* 用于完成this.validate_max 或
  	  this.validate_min的前置工作
  	  * */
  	function pre_max_min() {
  		self.val = parseFloat(self.val);
  	}
  	/* 用于完成this.validate_maxlength或
  	  this.validate_minlength的前置工作
  	  * */
  	function pre_length() {
  		self.val = self.val.toString();
  	}
  }