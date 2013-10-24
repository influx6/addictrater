$(function(){

	var ts = module.exports.ToolStack,
      	util = ts.Utility,
      	history = $('#secretData'),
		sanity = $("#sanityGraph"),
		sanityContext = sanity[0].getContext("2d"),
		data = {
				labels : ["Addiction"],
				datasets : [
					{
						fillColor : "rgba(220,220,220,0.5)",
						strokeColor : "rgba(220,220,220,1)",
						pointColor : "rgba(220,220,220,1)",
						pointStrokeColor : "#fff",
						data : [0,10,20,30,40,50,60,70,80,90,100]
					},
					{
						fillColor : "rgba(151,187,205,0.5)",
						strokeColor : "rgba(151,187,205,1)",
						pointColor : "rgba(151,187,205,1)",
						pointStrokeColor : "#fff",
						data : [0,10,20,30,40,50,60,70,80,90,50]
					}
				]
		},
		graph = new Chart(sanityContext).Bar(data),
      	q = module.exports.Q;

     var inita = function(id){

		var am = QManager(id),bar = WeightedBar('div#graphview',util,$);



			am.model.store.event.on('delete',function(o,id,item){ console.log('deleting',o,id,item); });

			am.q.live('#graph','click','id','gengraph',function(e){
			am.model.controller.accumulate(function(list){
					var target = $(e.target);
					var parent = target.parent();
					var canvas = parent.find('div#graphview');

					if(canvas.css('display') === 'none' && list.length <= 0) 
						return alert('We need the questions answered before we can graph your sanity!');


					bar.init();
					util.eachAsync(list,function(e,i,o,fn){ 
						bar.addWeight(e.weight);
						fn(false);
					},function(){
						bar.graph();
					});
					canvas.show();
				});
			});

			am.q.live('#graph','click','id','hidegraph',function(e){
				$(e.target).parent().parent().parent().find('div#graphview').hide();
			});

			return am;

     };

     var start = function(store){
		var selectDB = store;
     	var plane = $('#qlist');
     	var parent = $('#selectListCover');
     	var list = parent.find('ul#qselectElem');
     	var qHandlers = {};
     	var template = $('#select_template');

     	util.each(selectDB,function(e,i,o,fn){

     		var code = (template.html().toString()
     			.replace('{{name}}',i)
     			.replace("{{topic}}",e));

     		if(!list.find(e).length) list.append(code);
     	});

     	q.live('#selectListCover','click','class','qlistElem',function(e){
     		var target = $(e.target);
     		var title = target.attr('id');
     		if(!qHandlers[title]) qHandlers[title] = inita(title);
     		plane.hide();
     	});

     	q.live('#qselectElem','click','class','elemDestroy',function(e){
     		var target = $(e.target);
     		var parent = target.parent();


     		$(e.target).parent().remove();
     	});

	    q.live('#qadder','click','id','addSet',function(e){
     		var target = $(e.target);
     		var parent = target.parent();
     		var input = parent.find('input#inputElem');

     		if(selectDB[input.val()]) list.append(selectDB[input.val()]);

     		var code = (template.html().toString()
     			.replace('{{name}}',input.val())
     			.replace("{{topic}}",input.val()));

     		list.append(code);
     		selectDB['#'+input.val()] = input.val();
     		localStorage['selectDB'] = JSON.stringify(selectDB);
     	});     	
     };
     

     start(JSON.parse(localStorage['selectList'])||{});
});

