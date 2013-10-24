	var libs = ((typeof require != 'undefined') ?  require('./init.js') : module.exports);
	if(!libs.Q) throw new Error('Q library  Unavailable!');

	var QManager = function(id){

		var ts = libs.ToolStack;
		var util = ts.Utility;
		var q = libs.Q;
		var model = q.model('qmanager#'+id);
		var edit = q.view('#coverwrap','#edit','#wall','#list_template','#editView',model);
		var add = q.view('#coverwrap','#add','#wall','#list_template','#addView',model);
		var view = q.elem('#content','#qp','#item_template','#option_template','#idSelect');

		model.controller = view;


		q.live('#wall','click','id','close',function(e){
			$('#wall').hide(300);
			edit.deactivate();
			add.deactivate();
		});

		edit.onSubmit = (function(data){
			model.update(data);
		});

		add.onSubmit = (function(data){
			model.create(data);
		});

		model.store.event.on('loaddb',function(db){
			view.populate(db);
		});

		model.store.event.on('add',function(item){
			view.add(item);
		});

		model.store.event.on('update',function(item){
			view.update(item);
		});

		model.store.event.on('delete',function(item){
			view.remove(item);
		});

		model.store.event.on('reset',function(oldid,newid,elem){
			view.reset(oldid,newid,elem);
		});

    	model.store.loadDB();


		return {
			model:model,
			edit: edit,
			add: add,
			view: view,
			q:q
		};
	};