(function(){

  this.module =  (typeof module != 'undefined' ? module :  { exports: {} } );

  var ts = module.exports.ToolStack,
      hash = ts.Helpers.HashMaps,
      tsUtil = ts.Utility,
      util = {};

  util.colors = ['grey', 'black', 'yellow', 'red', 'green', 'blue', 'white', 'cyan', 'magenta'];
  util.colorClasses = ['lightblue', 'lightgreen', 'orange', 'red','pink','blue','purple','grassgreen'];

  util.color = function(){
    var peek = Math.abs((Math.floor((Math.round(Math.random(8)*2300)/90) - this.colorClasses.length)));
    if(peek >= this.colorClasses.length) peek =  Math.abs(Math.random((190*peek) - this.colorClasses.length));
    return !!this.colorClasses[peek] ? this.colorClasses[peek] : 'blue';
  };
  util.toArray = function(arg,n,m){
    if(m == null ) return [].splice.call(arg,(n == null ? 0 : n));
    return [].splice.call(arg,(n == null ? 0 : n),(m == null ? arg.length : m));
  };
  util.each = function(a,fn){
    var i=0,len = a.length;
    for(; i < len; i++) fn(a[i],i);
  };  
  util.eachMap = function(a,fn){
    for(var i in a) fn(a[i],i);
  };
  util.keys = function(arr){
    var c = [];
    for(var i in arr) c.push(i);
    return c;
  };
  util.values = function(arr){
    var c = [];
    for(var i in arr) c.push(arr[i]);
    return c;
  };
  util.event = function(elem,fn){
    var em = document.getElementById(elem.replace('#',''));
    if(em == null) return;
    if(em.attachEvent) return em.attachEvent(elem,fn);
    return em.addEventListener(elem,fn,false);
  };
  util.live = function(hook,event,key,val,fn){
    $(hook).bind(event,function(e){
      var target = e.target;
      var value = (val.replace('#','').replace('.',''));
      var attr = target.getAttribute(key);
      var fns = function(e){
        fn(e);
        e.stopPropagation();
        e.preventDefault();
        return false;
      };

      if(attr === null) return false;

      var sets = attr.split(/\s+/);
      if(sets.length > 1){
        for(var i=0,len = sets.length; i < len; i++) if(sets[i] === value) return fns(e);;
        return false;
      };

      if(attr === value) return fns(e);

    });
  }

  var questionGenerator = function(id,question){
    return {
      id: id,
      question: question || null,
      options:[],
      answer:null,
      checked: false,
      color: null
    };
  };

  var optionGenerator = function(weight,data){
    return {
      weight: weight,
      data: data,
    };
  };

  var jsonGenerator = function(id,data){
    return {
      group: null,
      data: null
    };
  };

  var viewController = function(parent,trigger,modal,template,view,man){

      var controller = {};
      controller.manager = man;
      controller.parentView = $(parent);
      controller.view = $(view);
      controller.modal = $(modal);
      controller.template = $(template);
      controller.trigger = $(trigger);
      controller.onSubmit = function(){};

      util.live(parent,'click','id',trigger,function(e){
        controller.modal.show(300);
        controller.activate();
      });

      util.live(view,'click','id','submit',function(e){
        if(!$(e.target).parent().find('ul#itemContent li').length) return;

        controller.generate();
        $(e.target).parent().find('input').val('');
        $(e.target).parent().find('#itemContent').html('');
      });

      util.live(view,'click','id','addsubmit',function(e){
        var target = $(e.target);
        var parent = target.parent();
        var weight = parent.find('input#weightInput');
        var question = parent.find('input#questionInput');

        if((!weight.val() || !question.val())) return false;
        var template = controller.template.html().toString();

        var items = parent.parent().find('#itemContent');

        items.append($(template
          .replace('{{weight}}',parseInt(weight.val()))
          .replace('{{data}}',question.val())));

        weight.val('');
        question.val('');
      });

      util.live(view,'click','class','dataFace',function(e){
        var target = $(e.target);
        var parent = target.parent().find('.inputCover');
        var input = parent.find('input');
        var button = parent.find('.button');
        var close = target.parent().find('.destroyButton');

        parent.show(100);
        input.attr('value',target.html());
        target.hide(100);
        close.hide(100);
      });

      util.live(view,'click','class','okbutton',function(e){
        var target = $(e.target);
        var parent = target.parent();
        var kase = parent.parent();
        var input = parent.find('input');
        var close = kase.find('.destroyButton');
        var em = kase.find('em.dataFace');

        em.html(input.val());
        parent.hide(100);
        close.show(100);
        em.show(100);
      });

      util.live(view,'click','class','destroyButton',function(e){
        var target = $(e.target).parent().parent();
        target.remove();
      });

      util.live(view,'click','id','itemDelete',function(e){
        var n = $('#idSelect');
        if(n.val() === null) return;
        controller.manager.delete(parseInt(n.val()));
      });

      util.live(view,'change','id','idSelect',function(e){
        var n = $('#idSelect');
        controller.populate(controller.manager.get(parseInt(n.val())));
      });

      controller.activate = function(){
        controller.view.show(300);
      };

      controller.deactivate = function(){
        controller.view.hide();
      };

      controller.generate = function(){
        var target = this.view;
        var options = target.find('ul#itemContent li');
        var question = target.find('p.question input');
        var id = target.find('p.pid select#idSelect');
        
        if(id.val() === 'none') return;
        if(!question.val()) return;


        var question =  questionGenerator(parseInt(id.val()),question.val());
        options.each(function(e){
          var item = $(options.get(e)).find('section.data em');
          var option = optionGenerator(item.attr('weight'),item.html());
          question.options.push(option);
        });

        this.onSubmit(question);
      };

      controller.populate = function(data){
        if(!data){
          return this.view.find('input').val('');
        }

        var question = data;
        var target = this.view;
        var template = this.template.html().toString();
        var options = target.find('ul#itemContent');
        var question = target.find('p.question input');
        var id = target.find('p.pid select#idSelect');


        if(question.val() === null) return;


        question.val(data.question);
        options.html('');
        util.each(data.options,function(e,i){
          options.append(template.replace('{{weight}}',e.weight).replace('{{data}}',e.data));
        });

      };


      return controller;
  };

  var qelem = function(pane,view,item,option,list){

    var controller = {};
    controller.parent = $(pane);
    controller.list = $(list);
    controller.item = $(item);
    controller.view = $(view);
    controller.option = $(option);
    controller.event = ts.Events();

    controller.event.set('add');
    controller.event.set('update');
    controller.event.set('populate');
    controller.event.set('remove');
        
    controller.templator = function(json){
      var template = $(this.item.html()
      .replace('{{number}}',json.id)
      .replace('{{color}}',util.color())
      .replace('{{question}}',json.question)
      .replace('{{number}}',json.id));


      var option = template.find('ul');

      util.each(json.options,function(e,i){
        var tem = $(controller.option.html().toString()
        .replace("{{type}}",json.id)
        .replace("{{weight}}",e.weight)
        .replace("{{data}}",e.data));
        option.append(tem);
      });

      return template;
    }

    controller.remove = function(json){
      this.view.find('#'+json.id).remove();
      this.event.emit('remove',json);
    };

    controller.add = function(json){
      this.view.append(this.templator(json));
      this.event.emit('add',json);
    };

    controller.reset = function(oldid,newid){
      var elem = this.view.find('#'+oldid);

      if(!elem.length) return;

      elem.attr('id',newid);
      elem.find('div#pos').html(newid);
    };

    controller.update = function(json){
      var elem = this.view.find('#'+json.id);

      if(!elem.length) return;

      var data = this.templator(json);
      elem.html(data.html());
      this.event.emit('update',json);
    };


    controller.accumulate = function(fn){
      var items =[],qo = this.view.find('.qo'), counter = 0;

      qo.each(function(i){
        var data = {},
        elem = $(this),
        lists = elem.find('ul#options li input');

        lists.each(function(n){
          var cur = $(this);
          if(!!cur[0].checked){
            var span = cur.parent().find('span');
            data.answer = span.html();
            data.weight = Math.abs(parseInt(span.attr('weight')));
            if(data.weight === 0 || data.weight === 1) data.weight = 10;
            items.push(data);
          }
        });

        counter += 1;
        if(counter >= qo.length && fn) fn(items);
      });

      return;
    };

    controller.populate = function(db){
      this.event.emit('populate');     
      tsUtil.eachAsync(db,function(e){
        this.add(e);
      },null,this);
    };

    controller.event.on('add',function(item){
      controller.list.append("<option>"+item.id+"</option>");
    });

    controller.event.on('populate',function(item){
      controller.list.html("<option>none</option>");
    });

    return controller;
  };

  var Storage = function(id){
    var store = {};
    store.id = id;
    store.db = {};
    store.size = 0;
    store.event = ts.Events();
    store.get = function(i){ return hash.fetch.call(this.db,i); }
    store.has = function(i){ return hash.exists.call(this.db,i); }

    store.event.set('delete');
    store.event.set('add');
    store.event.set('update');
    store.event.set('loaddb');
    store.event.set('restoredb');
    store.event.set('savedb');
    store.event.set('reset');


    store.delete = function(o){
      var m = hash.fetch.call(this.db,o);
      hash.remove.call(this.db,o);
      this.event.emit('delete',m,util.keys(this.db).length,this.db);
      this.reset();
    };

    store.add = function(k,o){
      hash.add.call(this.db,k,o);
      this.event.emit('add',o,util.keys(this.db).length);
    };

    store.update = function(k,o){
      hash.modify.call(this.db,k,o);
      this.event.emit('update',o,util.keys(this.db).length);
    };

    store.reset = function(k,o){
      tsUtil.eachAsync(this.db,function(e,i,o){
        var old = e.id;
        o[i] = e; e.id = i;
        this.event.emit('reset',old,i,e);
      },null,this);
    };

    store.loadDB = function(){
      var local = window.localStorage[this.id] || "{}";
      this.db = JSON.parse(local);
      this.size = util.keys(this.db).length;
      store.event.emit('loaddb',this.db,this.size);
      return this.db;
    };

    store.saveDB = function(){
      window.localStorage[this.id] = JSON.stringify(this.db);
      store.event.emit('savedb',window.localStorage[this.id]);
    };

    store.restoreDB = function(db){
      this.db = db;
      this.size = util.keys(this.db).length;
      store.event.emit('restoredb',db);
    };

    store.event.on('add',function(db,len){ store.size = len;  store.saveDB(); });
    store.event.on('update',function(db,len){ store.saveDB(); });
    store.event.on('delete',function(db,len){ store.saveDB(); });

    return store;
  };

  var qmanager = function(id){
    
    var man = {
      id: id,
      controller: null
    };

    man.store = Storage(id);
    man.get = tsUtil.bind(man.store.get,man.store);
    man.delete = tsUtil.bind(man.store.delete,man.store);

    man.create = function(json){
      var k = util.keys(this.store.db).length;
      json.id = k;
      this.store.add(k,json);
    };

    man.update = function(json){
      this.store.update(json.id,json);
    };
    
    return man;
  };

  module.exports.Q = {
    view: viewController,
    util: util,
    live: util.live,
    model: qmanager,
    store: Storage,
    elem: qelem
  };

})();