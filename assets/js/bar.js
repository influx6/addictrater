var WeightedBar = function(view,util,$){

	var bar = {
		weight:[],
		view: $(view),
		total:0
	};

	bar.addWeight = function(n){
		this.weight.push(n);
	};

	bar.init = function(start){
		if($('.barGraph').length) return;
		this.elem = $('<div class="barGraph"><ul></ul></div>');
		this.ul = this.elem.find('ul');
		this.view.css('position','relative');
		this.ul.css('position','relative');
		this.ul.css('top','0px');		
		this.view.append(this.elem);
	};

	bar.scale = function(e){
		if(e > 100) return e/2;
		if(e < 10) return e*10;
		return (e);
	};

	bar.graph = function(){
		console.log(this.weight);
		var self = this;
		this.ul = this.elem.find('ul');
		this.ul.html('');
		this.total = 0;
		util.eachAsync(this.weight,function(e,i,o,fn){
			var li = $('<li></li>');
			li.css('width','100%');
			li.css('height',this.scale(e));
			this.total += this.scale(e);
			util.delay(function(_){
				self.ul.append(li)
			},500);
			fn(false);
		},function(){

			var total = self.total;
			var msg = 'Addiction Weight: '+total+"\n"+"You are ";

			if(total > 0 && total < 50) msg = msg.concat('Normal');
			if(total >= 50 && total < 100) msg = msg.concat('Sane');
			if(total >= 100 && total < 200) msg = msg.concat('Active');
			if(total >= 200 && total < 300) msg = msg.concat('Over Active');
			if(total >= 300 && total < 400) msg = msg.concat('A Step to Insanity');
			if(total >= 400) msg = msg.concat('Insane');

			if(typeof alert === 'function') alert(msg);
			this.weight = [];

		},this);
	};

	return bar;
}