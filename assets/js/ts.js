var ToolStack = {}, module = module || { exports: {}};

module.exports.ToolStack = ToolStack;

//the current in use version of Class
ToolStack.version = "0.3.4";
ToolStack.ObjectClassName = "ToolStack";

ToolStack.noConflict = function(){
    root.ToolStack = previousToolStack;
    return this; 
};

ToolStack.Utility = {
  
    //meta_data
    name:"ToolStack.Utility",
    description: "a set of common,well used functions for the everyday developer,with cross-browser shims",
    licenses:[ { type: "mit", url: "http://mths.be/mit" }],
    author: "Alexander Adeniyi Ewetumo",
    version: "0.3.0",

    letters: ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"],
    
    symbols: ["!", "\"",":",";",".","=",",","/","|","/", "#", "$", "%", "&", "'", "(", ")", "*","?","+","@","^","[","]","{","}","-","+","_","<",">"],

    escapeHTML: function(html){
      return String(html)
        .replace(/&(?!\w+;)/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    },

    throttle: function(fn,ms){
      var self = this,
          tmo,
          ctx,
          args,
          res,
          prev = 0,
          next = function next(){
            prev = new Date;
            tmo = null;
            res = fn.apply(ctx,args);
          };

      return function(){
        var now = new Date;
        var rem = ms - ( now - prev);
        ctx = this;
        args = self.arranize(arguments);
        if(rem <= 0){
          clearTimeout(tmo);
          tmo = null;
          prev = now;
          res = fn.apply(ctx,args)
        }else if(!tmo){
          tmo = setTimeout(next,rem);
        }
        return res;
      };
    },

    clinseString: function(source){
      return String(source).replace(/"+/ig,'');
    },

    chunk: function Chunk(word,spot,res){
      if(!word.length || !this.isString(word)) return res;
      var self = this,o = this.toArray(word), out = res || [];
      out.push(this.makeSplice(o,0,spot || 1).join(''));
      if(o.length) return self.chunk(o.join(''),spot,out); 
      return out;
    },

    toArray: function(o){
      if(this.isString(o) || this.isObject(o)) return this.values(o);
      return [o];
    },

    fixJSCode: function(js){
      return String(js)
      .replace(/\/*([^/]+)\/\n/g, '')
      .replace(/\n/g, '')
      .replace(/ +/g, ' '); 
    },

    clinse : function(o){
      if(this.isNull(o)) return "null";
      if(this.isUndefined(o)) return "Undefined";
      if(this.isNumber(o)) return (""+o);
      if(this.isString(o)) return o;
      if(this.isBoolean(o)) return o.toString();
      return o;
    },


    processIt: function(o){
      if(this.isArray(o)) return this.map(o,function(e){ return this.clinse(e); },this);
      if(this.isFunction(o) || this.isObject(o)) return (o.name ? o.name : this.isType(o));
      return this.clinse(o);
    },

    templateIt: function(source,keys){
     if(!this.isString(source) && !this.isArray(keys)) return;

      var src = source;
      
      this.forEach(keys,function(e,i,o){
          var reggy = new RegExp("\\{"+(i)+"\\}");
          src = src.replace(reggy,e);
      });
      
      return src;
    },


    fixPath: function(start,end){
        var matchr = /\/+/,pile;
        pile = (start.split(matchr)).concat(end.split(matchr));
        this.normalizeArray(pile);
        return "/"+pile.join('/');
     },

    clockIt : function(fn){
        var start = Time.getTime();
        fn.call(this);
        var end = Time.getTime() - start;
        return end;
    },

    guid: function(){
        return 'xxxxxxxx-xyxx-4xxx-yxxx-xxxyxxyxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
          return v.toString(16); }).toUpperCase();
    },

    revGuid: function(rev){
        return ((rev && this.isNumber(rev) ? rev : '1')+'-xxyxyxyyyyxxxxxxyxyxxxyxxxyyyxxxxx').replace(/[xy]/g, function(c) {
          var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
          return v.toString(16); });
    },

    //use to match arrays to arrays to ensure values are equal to each other,
    //useStrict when set to true,ensures the size of properties of both
    //arrays are the same
    matchArrays: function(a,b,beStrict){
           if(this.isArray(a) && this.isArray(b)){
            var alen = a.length, i = 0;
            if(beStrict){
             if(alen !== (b).length){ return false; }
           }

           for(; i < alen; i++){
             if(a[i] === undefined || b[i] === undefined) break;
             if(b[i] !== a[i]){
              return false;
              break;
            }
          }
          return true;
        }
    },

    //alternative when matching objects to objects,beStrict criteria here is
    //to check if the object to be matched and the object to use to match
    //have the same properties
    matchObjects: function(a,b,beStrict){
           if(this.isObject(a) && this.isObject(b)){

            var alen = this.keys(a).length, i;
            for(i in a){
             if(beStrict){
              if(!(i in b)){
               return false;
               break;
             }
           }
           if((i in b)){
            if(b[i] !== a[i]){
             return false;
             break;
           }
         }
       }
       return true;
     }
    },

    memoizedFunction : function(fn){
         var _selfCache = {},self = this;
         return function memoized(){
          var memory = self.clone(arguments,[]),
          args = ([].splice.call(arguments,0)).join(",");
          if(!_selfCache[args]){
           var result = fn.apply(this,memory);
           _selfCache[args] = result;
           return result;
         }
         return _selfCache[args];
       };
    },


    createChainable: function(fn){
       return function chainer(){
        fn.apply(this,arguments);
        return this;
      }
    },

    chain: function(o){
      if(!this.isObject(o)) return;
      var self = this,orig = o, chained = { implode: function(){ self.explode(this); } };
      this.forEach(o,function(e,i,o){
        if(this.has(orig,i) && this.isFunction(e) && !(i === 'implode')) chained[i] = function(){ orig[i].apply(orig,arguments); return chained; }
      },this);
      return chained;
    },

    //takes a single supplied value and turns it into an array,if its an
    //object returns an array containing two subarrays of keys and values in
    //the return array,if a single variable,simple wraps it in an array,
    arranize: function(args){
        if(this.isObject(args)){
          return [this.keys(args),this.values(args)];
        }
        if(this.isArgument(args)){
         return [].splice.call(args,0);
        }
        if(!this.isArray(args) && !this.isObject(args)){
          return [args];
        }
    },

    //simple function to generate random numbers of 4 lengths
    genRandomNumber: function () { 
      var val = (1 + (Math.random() * (30000)) | 3); 
      if(!(val >= 10000)){
        val += (10000 * Math.floor(Math.random * 9));
      } 
      return val;
    },

    makeArray: function(){
     return ([].splice.call(arguments,0));
    },

    makeSplice: function(arr,from,to){
     return ([].splice.call(arr,from,to));
    },

    //for string just iterates a single as specificed in the first arguments 
    forString : function(i,value){
           if(!value) return;
           var i = i || 1,message = "";
           while(true){
            message += value;
            if((--i) <= 0) break;
          }

          return message;
    },

    isEmptyString: function(o,ignorespace){
         if(this.isString(o)){
          if(o.length === 0) return true;
          if(o.match(/^\s+\S+$/) && !ignorespace) return true;
        }
    },

    isEmptyArray: function(){
        if(this.isArray(o)){
          if(o.length === 0 || this.isArrayEmpty(o)){ return true; }
        }
    },

    isEmptyObject: function(o){
        if(this.isObject(o)){
          if(this.keys(o).length === 0){ return true; }
        }
    },

    isEmpty: function(o){
        if(this.isString(o)) return this.isEmptyString(o,true);
        if(this.isArray(o)) return this.isEmptyArray(o);
        if(this.isObject(o)) return this.isEmptyObject(o);
        return false;
    },

    isArrayEmpty: function(o){
      if(!this.isArray(o)) return false;

      var i = 0,step = 0, tf = 0,len = o.length,item;
      for(; i < len; i++){
        item = o[i];
        if(typeof item === "undefined" || item === null || item === undefined) ++tf;
        if( ++step === len && tf === len) return true;
      };
      return false;
    },

    makeString : function(split){
       var split = split || "",
       args = this.makeArray.apply(null,arguments);
       return args.splice(1,args.length).join(split);
    },

    createProxyFunctions: function(from,to,context){
        if(!context) context = to;

        this.forEach(from,function proxymover(e,i,b){
           if(!this.isFunction(e)) return;
           to[i] = function(){ 
            return b[i].apply(context,arguments);
          }
        },this);
    },

    toJSON: function(obj,showfunc,indent,custom){
      var self = this;
      indent = indent || 5;
      if(!showfunc) return JSON.stringify(obj,indent);
      return JSON.stringify(obj,function(i,v){
        if(custom) return custom(i,v);
        if(self.isFunction(v)) return v.toString();
        return v;
      },indent);
    },

    createProperty: function(obj,name,fns,properties){
       if(!("defineProperty" in Object) && Object.__defineGetter__ && Object.__defineSetter__){
        if(fns.get) obj.__defineGetter__(name,fns.get);
        if(fns.set) obj.__defineSetter__(name,fns.set);
        if(properties) obj.defineProperty(name,properties);

        return;
      }

      Object.defineProperty(obj,name,{
        get: fns.get, set: fns.set
      },properties);
      return;
    },
    
    // destructive extends
    extends:function(){
           var obj = arguments[0];
           var args = Array.prototype.splice.call(arguments,1,arguments.length);

           this.forEach(args,function(o,i,b){
            if(o  !== undefined && typeof o === "object"){
             for(var prop in o){
               var g = o.__lookupGetter__(prop), s = o.__lookupSetter__(prop);
               if(g || s){ this.createProperty(obj,prop,{get:g, set:s}); }
               else obj[prop]=o[prop];
            }
          }
        },this);

    },

    // returns the position of the first item that meets the value in an array
    any: function(o,value,fn){
       if(this.isArray(o)){
        return this._anyArray(o,value,fn);
      }
      if(this.isObject(o)){
        return this._anyObject(o,value,fn);
      }
    },

    contains: function(o,value){
       var state = false;
       this.forEach(o,function contain_mover(e,i,b){
        if(e === value) {
         state = true; 
         }
       },this);

       return state;
    },

    merge: function(a,b,explosive){
      var out = {};
      this.forEach(a,function(e,i,o){
        if(b[i] === a[i] && !explosive) return;
        out[i] = e;
      });
      return out;
    },


    push: function(a,val,key){
      if(this.isArray(a) || this.isString(a)) return Array.prototype.push.call(a,val);
      if(this.isObject(a)) return a[key] = val;
    },

    matchReturnType: function(a,b){
      if(!this.matchType(a,this.isType(b))) return;
      if(this.isObject(a)) return {};
      if(this.isString(a) || this.isArray(a)) return [];
      return;
    },

    intersect: function(a,b,withKey){
      var out = this.matchReturnType(a,b);
      if(this.isString(a)){ a = this.values(a); b = this.values(b); }

      this.forEach(a,function(e,i,o){
          if(withKey === false && this.contains(b,e)) this.push(out,e,i);
          if(this.hasOwn(b,i,e)) this.push(out,e,i);
          return;
      },this);

      if(this.isString(a)) return this.normalizeArray(out).join('');
      if(this.isArray(a)) return this.normalizeArray(out);
      return out;
    },

    disjoint: function(a,b,withKey){
      var out = this.matchReturnType(a,b);
      
      if(this.isString(a)){ a = this.values(a); b = this.values(b); }

      this.forEach(a,function(e,i,o){
          if(withKey === false && !this.contains(b,e)) this.push(out,e,i);
          if(!this.hasOwn(b,i,e)) this.push(out,e,i);
          return;
      },this);

      this.forEach(b,function(e,i,o){
          if(withKey === false && !this.contains(a,e)) this.push(out,e,i);
          if(!this.hasOwn(a,i,e)) this.push(out,e,i);
          return;
      },this);

      if(this.isString(a)) return this.normalizeArray(out).join('');
      if(this.isArray(a)) return this.normalizeArray(out);
      return out;
    },

    _anyArray: function(o,value,fn){
         for(var i=0,len = o.length; i < len; i++){
          if(value === o[i]){
           if(fn) fn.call(this,o[i],i,o);
           return true;
           break;
         }
       }
       return false;
    },

    _anyObject: function(o,value,fn){
       for(var i in o){
        if(value === i){
         if(fn) fn.call(this,o[i],i,o);
         return true;
         break;
       }
     }
     return false;
    },

      //mainly works wth arrays only
      //flattens an array that contains multiple arrays into a single array
    flatten: function(arrays,result){
       var self = this,flat = result || [];
       this.forEach(arrays,function(a){

        if(self.isArray(a)){
         self.flatten(a,flat);
       }else{
         flat.push(a);
       }

     },self);

       return flat;
    },

    filter: function(obj,fn,scope,breaker){
       if(!obj || !fn) return false;
       var result=[],scope = scope || this;
       this.forEach(obj,function filter_mover(e,i,b){
         if(fn.call(scope,e,i,b)){
          result.push(e);
        }
      },scope,breaker);
       return result;
    },

    //returns an array of occurences index of a particular value
    occurs: function(o,value){
       var occurence = [];
       this.forEach(o,function occurmover(e,i,b){
         if(e === value){ occurence.push(i); }
       },this);
       return occurence;
    },

    //performs an operation on every item that has a particular value in the object
    every: function(o,value,fn){
       this.forEach(o,function everymover(e,i,b){
         if(e === value){ 
          if(fn) fn.call(this,e,i,b);
        }
      },this);
       return;
    },

    delay: function(fn,duration){
       var args = this.makeSplice(arguments,2);
       return setTimeout(function(){
        fn.apply(this,args)
      },duration);
    },

    nextTick: function(fn){
        if(typeof process !== 'undefined' || !(process.nextTick)){
          return process.nextTick(fn);
        }
        return setTimeout(fn,0);
    },

    //destructive splice,changes the giving array instead of returning a new one
    //writing to only work with positive numbers only
    splice: function(o,start,end){
       var i = 0,len = o.length;
       if(!len || len <= 0) return false;
       start = Math.abs(start); end = Math.abs(end);
       if(end > (len - start)){
        end = (len - start);
      }

      for(; i < len; i++){
        o[i] = o[start];
        start +=1;
        if(i >= end) break;
      }

      o.length = end;
      return o;

    },

    shift: function(o){
          if(!this.isArray(o) || o.length <= 0) return;
          var data =  o[0];
          delete o[0];
          this.normalizeArray(o);
          return data;
    },

    unShift: function(o,item){
          if(!this.isArray(o)) return;
          var i = (o.length += 1);
          for(; i < 0; i--){
            o[i] = o[i-1];
          }

          o[0]= item;
          return o.length;
    },

    explode: function(){
           if(arguments.length == 1){
            if(this.isArray(arguments[0])) this._explodeArray(arguments[0]);
            if(this.matchType(arguments[0],"object")) this._explodeObject(arguments[0]);
          }
          if(arguments.length > 1){
            this.forEach(arguments,function(e,i,b){
             if(this.isArray(e)) this._explodeArray(e);
             if(this.matchType(e,"object")) this._explodeObject(e);
           },this);
          }
    },

    _explodeArray: function(o){
         if(this.isArray(o)){
          this.forEach(o,function exlodearray_each(e,i,b){
           delete b[i];
         },this);
          o.length = 0;
        };

        return o;
    },

    _explodeObject: function(o){
       if(this.matchType(o,"object")){
        this.forEach(o, function exploder_each(e,i,b){
         delete b[i];
       },this);
        if(o.length) o.length = 0;
      }

      return o;
    },

    is: function(prop,value){
       return (prop === value) ? true : false;
    },

    // forEach: function(obj,callback,scope,breakerfunc){
    //       if(!obj || !callback) return false;
    //       if(('length' in obj && !this.isFunction(obj)) || this.isArray(obj) || this.isString(obj)){
    //         var len = obj.length; i=0;
    //         for(; i < len; i++){
    //          callback.call(scope || this,obj[i],i,obj);
    //          if(breakerfunc && (breakerfunc.call(scope,obj[i],i,obj))) break;
    //        }
    //        return true;
    //      }

    //      if(this.isObject(obj) || this.isFunction(obj)){
    //       var counter = 0;
    //       for(var e in obj){
    //        callback.call(scope || this,obj[e],e,obj);
    //        if(breakerfunc && (breakerfunc.call(scope,obj[i],i,obj))) break;
    //      }
    //      return true;
    //    }
    // },

    forEach: function(obj,callback,scope,breakerfunc,complete){
         if(!obj || !callback) return false;

         if(typeof obj === 'string') obj = this.values(obj);

         if(('length' in obj && !this.isFunction(obj) && !this.isObject(obj)) || this.isArray(obj) || this.isString(obj)){
            return this._eachArray(obj,callback,scope,breakerfunc,complete);
         }
         if(this.isObject(obj) || this.isFunction(obj)){
            return this._eachObject(obj,callback,scope,breakerfunc,complete);
         }
    },

    _eachArray: function(obj,callback,scope,breakerfunc,complete){
        if(!obj.length || obj.length === 0) return false;
           var i = 0, len = obj.length;

           if(!len) callback();

           for(; i < len; i++){
              if(breakerfunc && (breakerfunc.call((scope || this),obj[i],i,obj))){
                  // if(complete) complete.call((scope || this));
                   break;
              }
              (function eachmover(z,a,b,c){
                callback.call(z,a,b,c);
              })((scope || this),obj[i],i,obj)
           }
           return true;
    },

    _eachObject: function(obj,callback,scope,breakerfunc,complete){
          for(var e in obj){
            if(breakerfunc && (breakerfunc.call((scope || this),obj[e],e,obj))){
                // if(complete) complete.call((scope || this)); 
                break;
            }
            (function eachmover(z,a,b,c){
              callback.call(z,a,b,c);
            })((scope || this),obj[e],e,obj)
          }
          return true;
    },

    eachAsync: function(obj,iterator,complete,scope,breaker){
          if(!iterator || typeof iterator !== 'function') return false;
          if(typeof complete !== 'function') complete = function(){};

          var step = 0;
          if(this.isArray(obj)) step = obj.length;
          if(this.isObject(obj)) step = this.keys(obj).length;

          this.forEach(obj,function mover(x,i,o){
            iterator.call(scope,x,i,o,function innerMover(err){
                if(err){
                  complete.call((scope || this),err);
                  return complete = function(){};
                }else{
                  step -= 1;
                  if(step === 0) return complete.call((scope || this));
                }
            });
          },scope,breaker,complete);

    },

    eachSync: function(obj,iterator,complete,scope,breaker){
          if(!iterator || typeof iterator !== 'function') return false;
          if(typeof complete !== 'function') complete = function(){};


          var step = 0, keys = this.keys(obj),fuse;

          // if(typeof obj === 'string') obj = this.values(obj);

          if(!keys.length) return false;
          
          fuse = function(){
            var key = keys[step];
            var item = obj[key];

            (function(z,a,b,c){
              if(breaker && (breaker.call(z,a,b,c))){ /*complete.call(z);*/ return; }
              iterator.call(z,a,b,c,function completer(err){
                  if(err){
                    complete.call(z,err);
                    complete = function(){};
                  }else{
                    step += 1;
                    if(step === keys.length) return complete.call(z);
                    else return fuse();
                  }
              });
           }((scope || this),item,key,obj));
          };

          fuse();
    },


    map: function(obj,callback,scope,breaker){
       if(!obj || !callback) return false;
       var result = [];

       this.forEach(obj,function iterator(o,i,b){
        var r = callback.call(scope,o,i,b);
        if(r) result.push(r);
      },scope || this,breaker);
       return result;
    },

    eString : function(string){
      var a = (string),p = a.constructor.prototype;
      p.end = function(value){
        var k = this.length - 1;
        if(value){ this[k] = value; return this; }
        return this[k];
      };
      p.start = function(value){
        var k = 0;
        if(value){ this[k] = value; return this; }
        return this[0];
      };
     
      return a;
    },
    //you can deep clone a object into another object that doesnt have any
    //refernce to any of the values of the old one,incase u dont want to
    //initialize a vairable for the to simple pass a {} or [] to the to arguments
    //it will be returned once finished eg var b = clone(a,{}); or b=clone(a,[]);
    clone: function(from,to){
          var to = null;
          if(this.isArray(from)) to = [];
          if(this.isObject(from)) to = {};
          if(to) to = to;

          this.forEach(from,function cloner(e,i,b){
            if(this.isArray(e)){
             if(!to[i]) to[i] = [];
             this.clone(e,to[i]);
             return;
           }
           if(this.isObject(e)){
             if(!to[i]) to[i] = {};
             this.clone(e,to[i]);
             return;
           }

           to[i] = e;
         },this);
          return to;
    },

    isType: function(o){
          return ({}).toString.call(o).match(/\s([\w]+)/)[1].toLowerCase();
    },

    matchType: function(obj,type){
          return ({}).toString.call(obj).match(/\s([\w]+)/)[1].toLowerCase() === type.toLowerCase();
    },

    isRegExp: function(expr){
         return this.matchType(expr,"regexp");
    },

    isString: function(o){
       return this.matchType(o,"string");
    },

    isObject: function(o){
       return this.matchType(o,"object");
    },

    isArray: function(o){
       return this.matchType(o,"array");
     },

    isDate: function(o){
      return this.matchType(o,"date");
    },

    isFunction: function(o){
       return (this.matchType(o,"function") && (typeof o == "function"));
     },

    isPrimitive: function(o){
       if(!this.isObject(o) && !this.isFunction(o) && !this.isArray(o) && !this.isUndefined(o) && !this.isNull(o)) return true;
       return false;
    },

    isUndefined: function(o){
       return (o === undefined && this.matchType(o,'undefined'));
    },

    isNull: function(o){
       return (o === null && this.matchType(o,'null'));
    },

    isValid: function(o){
      return (!this.isNull(o) && !this.isUndefined(o) && !this.isEmpty(o));
    },

    isNumber: function(o){
       return this.matchType(o,"number") && o !== Infinity;
    },

    isInfinity: function(o){
       return this.matchType(o,"number") && o === Infinity;
     },

    isArgument: function(o){
       return this.matchType(o,"arguments");
    },

    isFalse: function(o){
      return (o === false);
    },

    isTrue: function(o){
      return (o === true);
    },

    isBoolean: function(o){
      return this.matchType(o,"boolean");
    },

    has: function(obj,elem,value,fn){
     var self = this,state = false;

     this.any(obj,elem,function __has(e,i){
      if(value){
       if(e === value){
        state = true;
        if(fn && self.isFunction(fn)) fn.call(e,i,obj);
        return;
      }
      state = false;
      return;
     }

     state = true;
     if(fn && self.isFunction(fn)) fn.call(e,i,obj);
    });

     return state;
    },

    hasOwn: function(obj,elem,value){

       if(Object.hasOwnProperty){
              if(!value) return Object.hasOwnProperty.call(obj,elem);
              else return (Object.hasOwnProperty.call(obj,elem) && obj[elem] === value);
        }

        var keys,constroKeys,protoKeys,state = false,fn = function own(e,i){
          if(value){
           state = (e === value) ? true : false;
           return;
         }
         state = true;
       };

       if(!this.isFunction(obj)){
          /* when dealing pure instance objects(already instantiated
           * functions when the new keyword was used,all object literals
           * we only will be checking the object itself since its points to
           * its prototype against its constructors.prototype
           * constroKeys = this.keys(obj.constructor);
           */

           keys = this.keys(obj);
          //ensures we are not dealing with same object re-referening,if
          //so,switch to constructor.constructor call to get real parent
          protoKeys = this.keys(
           ((obj === obj.constructor.prototype) ? obj.constructor.constructor.prototype : obj.constructor.prototype)
           );

          if(this.any(keys,elem,(value ? fn : null)) && !this.any(protoKeys,elem,(value ? fn : null))) 
            return state;
        }

       /* when dealing with functions we are only going to be checking the
       * object itself vs the objects.constructor ,where the
       * objects.constructor points to its parent if there was any
       */ 
       //protoKeys = this.keys(obj.prototype);
       keys = this.keys(obj);
       constroKeys = this.keys(obj.constructor);

       if(this.any(keys,elem,(value ? fn : null)) && !this.any(constroKeys,elem,(value ? fn : null))) 
         return state;
    },

    proxy: function(fn,scope){
                 scope = scope || this;
                 return function(){
                  return fn.apply(scope,arguments);
                };
    },

    //allows you to do mass assignment into an array or array-like object
    //({}),the first argument is the object to insert into and the rest are
    //the values to be inserted
    pusher: function(){
         var slice = [].splice.call(arguments,0),
         focus = slice[0],rem  = slice.splice(1,slice.length);

         this.forEach(rem,function pushing(e,i,b){
          _pusher.call(focus,e);
        });
         return;
    },

    keys: function(o,a){
      var keys = a || [];
      for(var i in o){
         keys.push(i);
      }
      return keys;
    },

    values: function(o,a){
      var vals = a || [];
      for(var i in o){
         vals.push(o[i]);
      }
      return vals;
    },

      //normalizes an array,ensures theres no undefined or empty spaces between arrays
    normalizeArray: function(a){
            if(!a || !this.isArray(a)) return; 

            var i = 0,start = 0,len = a.length;

            for(;i < len; i++){
             if(!this.isUndefined(a[i]) && !this.isNull(a[i]) && !(this.isEmpty(a[i]))){
              a[start]=a[i];
              start += 1;
            }
          }

          a.length = start;
          return a;
    },

    // namespaceGen : function(space,fn){
    //      var self = this,
    //      space = space.split('.'),
    //      splen = space.length,
    //      index = 0,
    //      current = null,
    //      adder = function(obj,space){ 
    //        if(!obj[space]) obj[space] = {};
    //        obj[space]._parent = obj;
    //        return obj[space];
    //      };

    //      while(true){
    //       if(index >= splen){
    //         self._parent[current] = fn;
    //         break;
    //       };
    //               //we get the item,we add and move into lower levels
    //               current = space[index];
    //               self = adder(self,current);
    //               index++;
    //             };

    //             self = this;
    //             return self;
    // }

    //ns: namespace generates a namespaced objects as giving by the value of space eg "core.module.server"
    //using the "." as the delimiter it generates "core ={ module: { server: {}}}" ,if a second value is supplied
    //that becomes the value of the final namespace and if a third value of an object is supplied,then that becomes
    //the object it extends the namespaces on
    ns : function(space,fn,scope){
       var obj = scope || {},
          space = space.split('.'),
          len = space.length,
          pos = len - 1,
          index = 0,
          current = obj;

       this.forEach(space,function(e,i){
           if(!current[e]) current[e] = {};
           current[e].parent = current;
           current = current[e];
           if(i === pos){
            current.parent[e] = fn;
           }
       },this);

       // obj = obj[space[0]];
       delete obj.parent;
       return obj;
    },

    reduce: function(obj,fn,scope){
      var final = 0;
      this.forEach(obj,function(e,i,o){
        final = fn.call(scope,e,i,o,final)
      },scope);

      return final;
    },

    joinEqualArrays: function(arr1,arr2){
        if(arr1.length !== arr2.length) return false;
        var f1 = arr1.join(''), f2 = arr2.join('');
        if(f1 === f2) return true;
        return false;
    },

    sumEqualArrays: function(arr1,arr2){
        if(arr1.length !== arr2.length) return false;
        var math = function(e,i,o,prev){
          return (e + prev);
        },f1,f2;

        f1 = this.reduce(arr1,math); f2 = this.reduce(arr2,math);
        if(f1 === f2) return true;
        return false;
    },

    matchObjects: function(a,b){
      if(JSON.stringify(a) === JSON.stringify(b)) return true;
      return false;
    }
};


ToolStack.Utility.bind = ToolStack.Utility.proxy;
ToolStack.Utility.each = ToolStack.Utility.forEach;

ToolStack.Callbacks = (function(SU){

         var flagsCache = {},
            su = SU,
            makeFlags = function(flags){
               if(!flags || su.isEmpty(flags)) return;
               if(flagsCache[flags]) return flagsCache[flags];

               var object = flagsCache[flags] = {};
               su.forEach(flags.split(/\s+/),function(e){
                     object[e] = true;
               });

               return object;
            },
            callbackTemplate = function(fn,context,subscriber){
               return {
                  fn:fn,
                  context: context || null,
                  subscriber: subscriber || null
               }
            },
            occursObjArray = function(arr,elem,value,fn){
               var oc = [];
               su.forEach(arr,function(e,i,b){
                  if(e){
                     if((elem in e) && (e[elem] === value)){
                       oc.push(i);
                       if(fn && su.isFunction(fn)) fn.call(null,e,i,arr);
                     }
                  }
               },this);

               return oc;
               
            },
           callback = function(flags){
                var  list = [],
                     fired = false,
                     firing = false,
                     fired = false,
                     fireIndex = 0,
                     fireStart = 0,
                     fireLength = 0,
                     flags = makeFlags(flags) || {},

                     _fixList = function(){
                        if(!firing){
                           su.normalizeArray(list);
                        }
                     },
                     _add = function(args){
                        su.forEach(args,function(e,i){
                           if(su.isArray(e)) _add(e);
                           if(su.isObject(e)){
                              if(!e.fn || (e.fn && !su.isFunction(e.fn))){ return;}
                              if(!su.isNull(e.context) && !su.isUndefined(e.context) && !su.isObject(e.context)){ return; }
                              if(flags.unique && instance.has('fn',e.fn)){ return; }
                              list.push(e);
                           }
                        });
                     },

                     _fire = function(context,args){
                        firing = true;
                        fired = true;
                        fireIndex = fireStart || 0;
                        for(;fireIndex < fireLength; fireIndex++){
                           if(!su.isUndefined(list[fireIndex]) && !su.isNull(list[fireIndex])){
                              var e = list[fireIndex];
                              if(!e || !e.fn) return;
                              if(flags.forceContext){
                                 e.fn.apply(context,args);
                              }else{
                                 e.fn.apply((e.context ? e.context : context),args);
                              }
                              if(flags.fireRemove) delete list[fireIndex];
                           }
                        }
                        firing = false;

                        // if(list){
                        //    if(flags.once && fired){
                        //       instance.disable();
                        //    }
                        // }else{
                        //    list = [];
                        // }
                       
                        return;
                     },

                     instance =  {

                        add: function(){
                           if(list){
                              if(arguments.length === 1){
                                 if(su.isArray(arguments[0])) _add(arguments[0]);
                                 if(su.isObject(arguments[0])) _add([arguments[0]]);
                                 if(su.isFunction(arguments[0])){
                                    _add([
                                          callbackTemplate(arguments[0],arguments[1],arguments[2])
                                    ]);
                                 }
                              }else{
                                 _add([
                                       callbackTemplate(arguments[0],arguments[1],arguments[2])
                                 ]);
                              }

                              fireLength = list.length;
                           };
                           return this;
                        },

                        fireWith: function(context,args){
                           if(this.fired() && flags.once) return;

                           if(!firing ){
                              _fire(context,args);
                           }
                           return this;
                        },

                        fire: function(){
                           var args = su.arranize(arguments);
                           (function(_){
                              _.fireWith(_,args);
                           })(instance);
                           return this;
                        },

                        remove: function(fn,context,subscriber){
                           if(list){
                              if(fn){
                                 this.occurs('fn',fn,function(e,i,b){
                                    if(context && subscriber && (e.subscriber === subscriber) && (e.context === context)){
                                       delete b[i];
                                       su.normalizeArray(b);
                                       return;
                                    }
                                    if(context && (e.context === context)){
                                       delete b[i];
                                       su.normalizeArray(b);
                                       return;
                                    }
                                    if(subscriber && (e.subscriber === subscriber)){
                                       delete b[i];
                                       su.normalizeArray(b);
                                       return;
                                    }

                                    delete b[i];
                                    su.normalizeArray(b);
                                    return;
                                 });
                                 return this;
                              }

                              if(context){
                                 this.occurs('context',context,function(e,i,b){
                                    if(subscriber && (e.subscriber === subscriber)){
                                       delete b[i];
                                       su.normalizeArray(b);
                                       return;
                                    }

                                    delete b[i];
                                    su.normalizeArray(b);
                                    return;

                                 });
                                 return this;
                              }

                              if(subscriber){
                                 this.occurs('subscriber',subscriber,function(e,i,b){
                                    if(context && (e.context === context)){
                                       delete b[i];
                                       su.normalizeArray(b);
                                       return;
                                    }

                                    delete b[i];
                                    su.normalizeArray(b);
                                    return;
                                 });
                                 return this;
                              }
                           }

                           return this;
                        },

                        flush: function(){
                           su.explode(list);
                           return this;
                        },

                        disable: function(){
                           list = undefined;
                           return this;
                        },

                        disabled: function(){
                           return !list;
                        },

                        has: function(elem,value){
                          var i=0,len = list.length;
                          for(; i < len; i++){
                              if(su.has(list[i],elem,value)){
                                    return true;
                                    break;
                              }
                          }
                              return false;
                        },

                        occurs: function(elem,value,fn){
                           return occursObjArray.call(this,list,elem,value,fn);
                        },

                        fired: function(){
                           return !!fired;
                        }

                     };

                return instance;
         };

         return {
           create : callback,
           name:"ToolStack.Callbacks",
           description: "Callback API with the pub-sub pattern implementation(the heart of Promise and Events)",
           licenses:[ { type: "mit", url: "http://mths.be/mit" }],
           author: "Alexander Adeniyi Ewetumo",
           version: "0.3.0",
         };

})(ToolStack.Utility);



ToolStack.Class =  {
         name: "ToolStack.Class",
         version: "0.0.2",
         description: "basic classical OOP for your js apps",
         description: "basic class structure for your js apps",
           licenses:[ { type: "mit", url: "http://mths.be/mit" }],
           author: "Alexander Adeniyin Ewetumo",
            
            inherit : function(child,parent){

               function empty(){};
               empty.prototype = parent.prototype ? parent.prototype : parent;
               
               child.prototype = new empty();
               
               child.prototype.constructor = child;
               if(parent.prototype) child.parent = parent.prototype;
               if(parent.prototype && parent.prototype.constructor) parent.prototype.constructor = parent;

               return true;
            },


            mixin : function(from,to){
               for(var e in from){
                  if(e in to) return;
                  to[e] = from[e];
               }
            },

            createProperty: function(obj,name,fns,properties){
                 if(!("defineProperty" in Object) && Object.__defineGetter__ && Object.__defineSetter__){
                    if(fns.get) obj.__defineGetter__(name,fns.get);
                    if(fns.set) obj.__defineSetter__(name,fns.set);
                    if(properties) obj.defineProperty(name,properties);
                    return;
                 }

                 Object.defineProperty(obj,name,{
                    get: fns.get, set: fns.set
                 });
                 return true;
            },


            extendWith : function(to,from){
               var self = this,g,s;
                  for(var e in from){
                      g = from.__lookupGetter__(e); s = from.__lookupSetter__(e);
                      if(g || s){
                        self.createProperty(to,e,{ get: g, set: s})
                    }else{
                        to[e] = from[e];
                    }
                  }

                  return to;
            },
            
            create : function(classname,ability,parent,beLightweight){

                  var self = this, 
                     Class = function Class(){
                        if(!(this instanceof Class)){
                           return new Class;
                        }
                     if(Class.parent && Class.parent.constructor){
                        Class.parent.constructor.apply(this,arguments);
                        this.super = Class.parent;
                        this.superd = false;
                             
                     }
                    
                     // if(this.init && typeof this.init === 'function'){
                     //    this.init.apply(this,arguments);
                     // }
                     
                     return this;

                  };
                  

                  if(parent){ self.inherit(Class,parent); }
                  
                  if(ability){
                     if(!ability.instance && !ability.static){ 
                        self.extendWith(Class.prototype, ability);
                     }
                     if(ability.instance){ 
                        self.extendWith(Class.prototype, ability.instance);
                     }
                     if(ability.static){ 
                        self.extendWith(Class,ability.static);
                     }
                  }
                  
                  //shortcut to all Class objects prototype;
                  Class.fn = Class.prototype;
                  //sets the className for both instance and Object level scope
                  Class.ObjectClassName = Class.fn.ObjectClassName = classname;
                  
                  Class.fn.Super = function(){
                      if(this.super.init && typeof this.super.init === 'function' && !this.superd){
                           this.super.init.apply(this,arguments);
                        }
                  };

                  Class.fn.Method = function(name,fn){
                    //destructive Method
                      var self = this;
                      self[name] = function(){
                        fn.apply(self,arguments);
                        return self;
                      };
                  };

                  Class.fn.cloneSelf = function(){
                    var clone = self.extendWith({},this);
                    return clone;
                  }



                  //because calling new Class().init() can be a hassle,alternative wrapper method that calls these methods
                  //is created: simple do Class.make(), it will create a new Class object and call setup with required arguements

                  Class.make = function(){
                     var shell = Class();
                     shell.init.apply(shell,arguments);
                     if(beLightweight){ delete shell.Super; delete shell.super; }
                     return shell;
                  };
                  
                  Class.extend = ToolStack.Class.extend;
                  Class.mixin = ToolStack.Class.mixin;

                  return Class;
            },

               //allows a direct extension of the object from its parent directly
            extend : function(name,ability){
                  return ToolStack.Class.create(name,ability,this);
            }

};

ToolStack.Env =  {
         name: "ToolStack.Env",
         version: "1.0.0",
         description: "simple environment detection script",
         licenses:[ { type: "mit", url: "http://mths.be/mit" }],
         author: "Alexander Adeniyin Ewetumo",  
         detect: (function(){ 
            var envs = {
               unop: function(){ return "unknown" },
               node: function(){ return "node" },
               headless: function(){ return "headless" },
               browser: function(){ return "browser" },
               rhino: function(){ return "rhino" },
               xpcom: function(){ return "XPCOMCore" },
            };

            //will check if we are in a browser,node or headless based system
            if(typeof XPCOMCore !== "undefined"){
               return envs.xpcom;
            }
            else if(typeof window === "undefined" && typeof java !== 'undefined'){
               return envs.rhino;
            }
            else if(typeof window !== "undefined" && typeof window.document !== 'undefined'){
               return envs.browser;
            }
            else if(typeof module !== 'undefined' && typeof module.exports !== 'undefined'){
               return envs.node;
            }else{
               return detect = envs.unop;
            }
         })()

};

ToolStack.Events = (function(ToolStack){


      return function(){
            
          var e = {
               name: "ToolStack.Events",
               version: "1.0.0",
               description: "Publication-Subscription implementation using Callback API",
               licenses:[ { type: "mit", url: "http://mths.be/mit" }],
               author: "Alexander Adeniyin Ewetumo",

              set: function(es,flag){
                  if(!this.events) this.events = {};
                  if(!this.events[es]){
                    var flags = (flag && typeof flag === 'string') ? flag.concat('unique') : "unique";
                    return (this.events[es] = ToolStack.Callbacks.create(flag));
                  }
                  return this.events[es];
              },

              unset: function(es){
                  if(!this.events) this.events = {};
                  if(!this.events[es]) return;
                  delete this.events[es];
                  return true;
              },

              once: function(es,callback,context,subscriber){
                 if(!this.events) this.events = {};
                  if(!es || !callback){ return; }

                  var e = this.set(es,'fireRemove');
                  e.add(callback,context,subscriber);

                  return;
              },

              on:function(es,callback,context,subscriber){
                 if(!this.events) this.events = {};
                  if(!es || !callback){ return; }

                  var e = this.set(es);
                  e.add(callback,context,subscriber);

                  return;
               },
            
              off: function(es,callback,context,subscriber){
                  if(arguments.length  === 0){
                     
                     return this;
                  };
                  
                  var e = this.events[es];
                  if(!e) return;

                  if(!callback && !context && !subscriber){ e.flush(); return this; } 

                  e.remove(callback,context,subscriber);
                  return this;
               
               },

              emit: function(event){
                 if(!event || !this.events){ return this; }
                 
                 var args = ([].splice.call(arguments,1)),
                     e = this.events[event];

                 if(!e) return this;

                  e.fire.apply(null,args);

                 return this;
              }
            
          };

          //compatibility sake
          e.removeListener = e.removeAllListeners = e.off;
          return e;
      };

})(ToolStack);

ToolStack.Helpers = (function Helpers(ts){

  var util = ts.Utility,
  validatorDefault = function(){ return true; },
  helper = {};
  helper.HashMaps = {
    fetch: function(key){
      if(!helper.HashMaps.exists.call(this,key)) return;
      return this[key];
    },
    exists: function(key,value){
      if(!this[key] && !util.has(this,key)) return false;
      if(value) return (this[key] === value)
      return true;
    },
    remove: function(key,value){
      if(helper.HashMaps.exists.call(this,key,value)) return (delete this[key]);
    },
    add: function(key,value,validator,force){
      if(!validator) validator = validatorDefault;
      if(helper.HashMaps.exists.call(this,key) || !validator(value)) return;
      this[key] = value;
      return true;
    },
    modify: function(key,value,validator){
      if(!validator) validator = validatorDefault;
      if(!helper.HashMaps.exists.call(this,key) || !validator(value)) return;
      this[key] = value;
      return true;
    }
  };

  return helper;
})(ToolStack);

ToolStack.ASColors = (function(ToolStack){

  var env,
  tool = ToolStack.Utility;

  if(typeof window !== 'undefined' && typeof window.document !== 'undefined') env = 'browser';
  else env = 'node';

  //----------------------the code within this region belongs to the copyright listed below
    /*
    colors.js

    Copyright (c) 2010

    Marak Squires
    Alexis Sellier (cloudhead)

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE.

    */
  var Styles = {
    web:{
        'bold'      : ['<b>',  '</b>'],
        'italic'    : ['<i>',  '</i>'],
        'underline' : ['<u>',  '</u>'],
        'inverse'   : ['<span class="inverse">',  '</span>'],
        //grayscale
        'white'     : ['<span class="white">',   '</span>'],
        'grey'      : ['<span class="grey">',    '</span>'],
        'black'     : ['<span class="black">',   '</span>'],
        //colors
        'blue'      : ['<span class="blue" >',    '</span>'],
        'cyan'      : ['<span class="cyan" >',    '</span>'],
        'green'     : ['<span class="green">',   '</span>'],
        'magenta'   : ['<span class="magenta">', '</span>'],
        'red'       : ['<span class="red">',     '</span>'],
        'yellow'    : ['<span class="yellow">',  '</span>']
    },
    terminal:{
      'bold'      : ['\033[1m',  '\033[22m'],
        'italic'    : ['\033[3m',  '\033[23m'],
        'underline' : ['\033[4m',  '\033[24m'],
        'inverse'   : ['\033[7m',  '\033[27m'],
        //grayscale
        'white'     : ['\033[37m', '\033[39m'],
        'grey'      : ['\033[90m', '\033[39m'],
        'black'     : ['\033[30m', '\033[39m'],
        //colors
        'blue'      : ['\033[34m', '\033[39m'],
        'cyan'      : ['\033[36m', '\033[39m'],
        'green'     : ['\033[32m', '\033[39m'],
        'magenta'   : ['\033[35m', '\033[39m'],
        'red'       : ['\033[31m', '\033[39m'],
        'yellow'    : ['\033[33m', '\033[39m'],

    
    }

  },

  sets = ['bold', 'underline', 'italic', 'inverse', 'grey', 'black', 'yellow', 'red', 'green', 'blue', 'white', 'cyan', 'magenta'],


  //----------------------end of the copyrighted code-----------------------------------

  css = ".white{ color: white; } .black{color: black; } .grey{color: grey; } "
  + ".red{color: red; } .blue{color: blue; } .yellow{color: yellow; } .inverse{ background-color:black;color:white;}"
  + ".green{color: green; } .magenta{color: magenta; } .cyan{color: cyan; } ";

  //basicly we pollute global String prototype to gain callabillity without using method assignments
  return (function(){

    var styles, sproto = String.prototype;
    if(sproto['underline'] && sproto['white'] && sproto['green']) return;


    if(env === 'browser'){
      styles = Styles.web;
      if(typeof document !== 'undefined' && typeof document.head !== 'undefined'){
        var style = "<style>"+css+"</style>",clean = document.head.innerHTML;
        document.head.innerHTML = style+"\n"+clean;
      }
    }
    if(env === 'node')  styles = Styles.terminal;


    tool.forEach(sets,function(e,i,o){
      var item = styles[e];
      tool.createProperty(sproto,e,{
        get: function(){
          return item[0] + this.toString() + item[1];
        },
        set: function(){}
      });

    });

  });


})(ToolStack);

ToolStack.Matchers = (function(ToolStack){
        
        ToolStack.ASColors();
    
        var Console = ToolStack.Console,
        util = ToolStack.Utility,
        makeString = function(split){
              var split = split || "",
              args = ([].splice.call(arguments,0));
              return args.splice(1,args.length).join(split);
            },
            generateResponse = function(name,item,should,message,scope,verbose){
              var template = util.templateIt(message,should),
                  head  = makeString(" ","Matcher:".bold.blue,name.bold.yellow);
                  checked = makeString(" ","\n","\t","Checked:".magenta," if",item,template,"\n").white;

                if(scope) head = head.concat(makeString(" ","  From:".bold.blue,scope.bold.yellow));
                var success = head.concat(makeString(" ","  Status:".bold.blue,"Passed!".bold.green,"\n","\t")),
                failed = head.concat(makeString(" ","    Status:".bold.blue,"Failed!".bold.red,"\n","\t"));

                var success = head.concat(makeString(" ","  Status:".bold.blue,"Passed!".bold.green)),
                failed = head.concat(makeString(" ","  Status:".bold.blue,"Failed!".bold.red));

                if(verbose){
                  success = success.concat(checked);
                  failed = failed.concat(checked);
                }else{
                  success = success.concat('\n');
                  failed = failed.concat('\n');
                }
                  
                return { pass: success, fail: failed };
            },

            responseHandler = function(state,response,throwable){
              if(!Console.log) Console.init('console');
              if(state) Console.log(response.pass);
              else{ Console.log(response.fail); 
                if(throwable) throw new Error(response.fail); 
              }
            },

            matchers = {
                 name: "Matchers",
                 version: "1.0.0",
                 description: "simple lightweight tdd style testing framework",
                 licenses:[ { type: "mit", url: "http://mths.be/mit" }],
                 author: "Alexander Adeniyin Ewetumo",
            };

            matchers.scope = null;
            matchers.item = null;
            matchers.compliant = false;
            matchers.verbose = true;

            matchers.scoped = function(scope){
              this.scope = scope;
              return this;
            };

            matchers.obj = function(item){
              if(util.isNull(item)) this.item = 'null';
              else if(util.isUndefined(item)) this.item = 'undefined';
              else this.item = item;
              return this;
            };

            matchers.createMatcher = function(name,message,fn){
                if(!name || typeof message !== 'string') throw new Error("Please provide a name for the matcher");
                if(!message || typeof message !== 'string') throw new Error("Please provide a message for the matcher");
                if(!fn || typeof fn !== 'function') throw new Error("Please provide function for the matcher");


                  var sandbox = matchers,
                      matcher = function(){
                          var should = util.arranize(arguments);
                          var desc = (util.isString(sandbox.scope) ? sandbox.scope : (util.isObject(sandbox.scope) ? sandbox.scope.desc : ''));
                          var res = fn.apply(sandbox,should),
                              response = generateResponse(name,util.processIt(sandbox.item),util.processIt(should),message,desc,sandbox.verbose);
                          return (res ? responseHandler(true,response,sandbox.compliant) : responseHandler(false,response,sandbox.compliant));
                      };
                
                  if(name in this) return false;
                  this[name] = matcher; return true;
            };

            matchers.createMatcher("is","is equal to "+"{0}".green,function(should){
                  if(this.item !== should) return false;
                  return true;
            });

            // matchers.createMatcher("is","is null",function(){
            //    util.explode(arguments);
            //    if(util.isNull(this.item)) return true;
            //    return false;
            // });
            
            matchers.createMatcher('indicate','operation indicated as'+"{0}".green,function(should){
                if(should === true) return true;
                return false;
            });

            matchers.createMatcher("isNot","is not equal to "+"{0}".red,function(should){
               if(this.item !== should) return true;
               return false;
            });

            // matchers.createMatcher("isTypeOf","is of type "+"{0}".magenta,function(should){
            //    if(this.item !== should) return true;
            //    return false;
            // });
             
            matchers.createMatcher("isValid","is a valid object",function(should){
                if(!util.isEmpty(this.item) && !util.isNull(this.item) && !util.isUndefined(this.item)) return true;
                return false;
            });

            matchers.createMatcher("isInstanceOf","is a instance of "+"{0}".green,function(should){
               if(this.item !== should) return true;
               return false;
            });

            matchers.createMatcher('hasKey',' has property '+"{0}".red,function(key){
                if(util.has(this.item,key)) return true;
                return false;
            });

            matchers.createMatcher('isType',' is type of '+"{0}".green,function(key){
                if(util.matchType(this.item,key)) return true;
                return false;
            });

            matchers.createMatcher('isTrue',' is '+"True".green,function(){
                if(this.item === true) return true;
                return false;
            });

            matchers.createMatcher('isEmpty',' is '+"Empty".red,function(){
                if(util.isEmpty(this.item)) return true;
                return false;
            });

            matchers.createMatcher('isObject',' is an '+"Object".red,function(){
                if(util.isObject(this.item)) return true;
                return false;
            });

            matchers.createMatcher('isArray',' is an '+"Array".red,function(){
                if(util.isArray(this.item)) return true;
                return false;
            });

            matchers.createMatcher('isFalse',' is '+"False".red,function(){
                if(this.item === false) return true;
                return false;
            });

            matchers.createMatcher('isKeyOfType','has property '+ "{0}".magenta +' of type '.white+ "{1}".green,function(key,form){
                if(util.matchType(this.item[key],form)) return true;
                return false;
            });

            matchers.createMatcher('isKeyWithValue','has property '+ "{0}".magenta +' with value '.white+ "{1}".green,function(key,value){
                if(this.item[key] === value) return true;
                return false;
            });

            matchers.createMatcher('isFunction','is a function!',function(){
                if(util.isFunction(this.item)) return true;
                return false;
            });

            // matchers.createMatcher('andFunctions','all operations are true'.green,function(){
            //   var state = true, args = util.arranize(arguments);
            //   util.each(args,function(){},this,function(e,i,o){
            //     if(util.isFunction(e) && e(this.item)) return false;
            //     state = false;
            //     return true;
            //   })
            //   return state;
            // });

            return matchers;

})(ToolStack);

ToolStack.Promise = (function(SU,CU){
      var su = SU,
          callbacks = CU,
          isPromise = function isPromise(e){
           //jquery style,check if it has a promise function
           //adding extra check for type of promise and if return type matches objects
           if(su.isObject(e) && "promise" in e){
               //adding a tiny extra bit of check if its a Class promise,which has a signature
               //set to promise string
               if(e.__signature__ && e.__signature__ === "promise") return true;
               //usual checks
               if(e["promise"] && su.isFunction(e["promise"]) && su.isObject(e["promise"]())) return true;
           }

              return false;
      },
      promise = function PromiseCreator(fn){

         var state = "pending",lists = {
            done : callbacks.create("once forceContext"),
            fail : callbacks.create("once forceContext"),
            progress : callbacks.create("forceContext")
         },
         deferred = {},
         memory = [[],[],[]],
         memorydone=memory[0],
         memoryfail=memory[1],
         memorynotify=memory[2],
         handler,
         isRejected = function(){
            if(state === "rejected" && lists.fail.fired()){
               return true;
            }
            return false;
         },

         isResolved = function(){
            if(state === "resolved" && lists.done.fired()){
               return true;
            }
            return false;
         };

         su.extends(deferred, {

               __signature__: "promise",

               __show: function(){ return lists; },

               state : function(){
                  return state;
               },

               done: function(fn){
                  if(!fn) return this;
                  if(isResolved()){
                     su.forEach(su.arranize(arguments),function(e,i){
                        if(!su.isFunction(e)) return;
                        e.apply(memorydone[0],memorydone[1]);
                     });
                     return this;
                  }
                  lists.done.add(fn);
                  return this;
               },

               fail: function(fn){
                  if(!fn) return this;
                  if(isRejected()){
                     su.forEach(su.arranize(arguments),function(e,i){
                        if(!su.isFunction(e)) return;
                        e.apply(memoryfail[0],memoryfail[1]);
                     });
                     return this;
                  }
                  lists.fail.add(fn);
                  return this;
               },

               progress: function(fn){
                  if(!fn) return this;
                  if(isRejected() || isResolved()){
                     su.forEach(su.arranize(arguments),function(e,i){
                        if(!su.isFunction(e)) return;
                        e.apply(memorynotify[0],memorynotify[1]);
                     });
                     return this;
                  }
                  lists.progress.add(fn);
                  return this;
               },


               then: function(done,fail,progress){

                  //returns a new promise which resolves with this promise
                  //adds multiple sets to the current promise/deffered being
                  //called;

                  var self = this,
                      defer = ToolStack.Promise.create(),
                      isp = false,
                      stateHandler = function stateHandler(action,state,fn){
                        return function(){
                          if(!su.isFunction(fn)) return self[action](defer[state]); 
                          else{
                            var returned = fn.apply(this,arguments);
                            if(returned && isPromise(returned) && !isp){ 
                              returned.promise().then(defer.resolve,defer.reject,defer.notify);
                              isp = true;
                            }
                            else{
                              defer[state+"With"](this === self ? defer : self,[returned]);
                            }
                          }
                        }
                      };

                  self.done(stateHandler('done','resolve',done))
                  .fail(stateHandler('fail','reject',fail))
                  .progress(stateHandler('progress','notify',progress))
                  //add the call back


                  return defer.promise();
               },

               //return the value used to resolve,reject it
               get: function(){
                  if(isResolved()) return memorydone[1];
                  if(isRejected()) return memoryfail[1];
               },

               resolveWith: function(ctx,args){
                  if(isResolved() || isRejected()){ return this;}
                  //fire necessary callbacks;
                  state = "resolved";
                  lists.done.fireWith(ctx,args);
                  lists.progress.fireWith(ctx,args);
                  //store fired context and arguments for when callbacks are added after resolve/rejection
                  memorydone = [ctx,args];
                  //disable fail list if resolved
                  lists.fail.disable();
                  //set state to resolve
                  return this;
               },

               rejectWith: function(ctx,args){
                  if(isRejected() || isResolved()){ return this; }
                  //fire necessary callbacks;
                  state = "rejected";
                  lists.fail.fireWith(ctx,args);
                  lists.progress.fireWith(ctx,args);
                  //store fired context and arguments for when callbacks are added after resolve/rejection
                  memoryfail = [ctx,args];
                  //disable done/success list;
                  lists.done.disable();
                  //set state to rejected
                  return this;
               },

               notifyWith: function(ctx,args){
                 if(isRejected() || isResolved()) return this;
                 memorynotify = [ctx,args];
                 lists.progress.fireWith(ctx,args);
                 return this;
               },

               notify: function(){
                  var args = su.arranize(arguments);
                  su.bind(function(){
                    this.notifyWith(this,args);
                  },deferred)();
               },

               resolve: function(){
                  var args = su.arranize(arguments);
                  //ensure it keeps the current context
                  su.bind(function(){
                      this.resolveWith(this,args);
                  },deferred)();
                  return;
               },

               reject: function(){
                  var args = su.arranize(arguments);
                  //ensure it keeps the current context
                  su.bind(function(){
                     this.rejectWith(this,args);
                  },deferred)();
                  return;
               },

               delay: function(ms){
                 var pros = s.Promise.create();
                 setTimeout(pros.resolve,ms);
                 return pros;
               },

               promise: function(){
                  var _p = {};
                  su.extends(_p,this);
                  delete _p.resolve;
                  delete _p.reject;
                  delete _p.rejectWith;
                  delete _p.notifyWith;
                  delete _p.notify;

                  // delete _p.promise;
                  _p.promise = function(){ return this; };
                  delete _p.resolveWith;

                  return _p;
               }

         });

        

        if(su.isNull(fn) || su.isFalse(fn)){
           deferred.reject(fn);
           return deferred;
        };

        if(fn){

            //if(su.isTrue(fn)){ deferred.resolve(); return deferred; }

            if(su.isObject(fn) && this.isPromise(fn)){
               handler = fn.promise;
               fn.then(
                  function(){ deferred.resolve(arguments); },
                  function(){ deferred.reject(arguments); },
                  function(){ deferred.notify(arguments); }
               );
               return deferred;
            }

            if(su.isObject(fn) && !this.isPromise(fn)){
               handler = fn;
               deferred.resolve(fn);
               return deferred;
            }

            if(su.isFunction(fn)){ 
               handler = fn.call(deferred,deferred);
               return deferred; 
            }

            if(su.isPrimitive(fn)){
               handler = fn;
               deferred.resolve(fn);
               return deferred;
            }
         }


         
         return deferred;
      };

      return {
        name: "AppStack.Promises",
         version: "1.0.0",
         description: "Implementation of Promise A spec",
         licenses:[ { type: "mit", url: "http://mths.be/mit" }],
         author: "Alexander Ewetumo",
         create: promise,
         isPromise: isPromise,
         when: function(deffereds){
            //returns a new defferd/promise
            var lists = su.normalizeArray(su.arranize(arguments)),
                self = this,
                count = lists.length,
                procCount = count,
                resValues = new Array(count),
                newDiffered = self.create(),
                promise = newDiffered.promise();

                 su.eachSync(lists,function(e,i,o,fn){
                     var item = ((isPromise(e)) ? e.promise() : self.create(e).promise());
                     if(item){
                        item.then(function(){},function(){
                          newDiffered.reject(arguments);
                        },function(){
                          resValues[i] = arguments.length === 1 ? arguments[0] : su.arranize(arguments);
                        });
                        procCount--;
                        fn(false);
                     }
                 },function(){
                     var cargs = su.flatten(resValues);
                     if(su.isEmpty(cargs)) su.normalizeArray(cargs);
                     cargs = (cargs.length === 0 ? resValues : cargs);
                     if(!procCount) newDiffered.resolveWith(newDiffered,cargs); 
                 },this);                


            return promise;
         },
      }
})(ToolStack.Utility,ToolStack.Callbacks);


(function(ToolStack){

  var Console = ToolStack.Console = {};
  ToolStack.ASColors();

  var initialized = false,util = ToolStack.Utility;
  Console.initialized = false;

  var node = function(extended){

    extended.initialized = true;

    extended.out = console.log;

    extended.log = function log(){
      extended.out.apply(console,arguments)
    };

    extended.error = function error(){
      extended.out.apply(console,arguments)
    }

    return extended;
  };

  var browser = function(extended,pid){

    var tree,parent;

    function makeWord(msg){
      var item = document.createElement('span');
      item.style.display = 'block';
      // item.style["margin-left"] = "3px";
      item.innerHTML = msg;
      return item;
    };


    extended.initialized = true;

    if(pid) parent = document.getElementById(pid);

    tree = document.getElementById('console-screen');

    if(!tree){
      tree = document.createElement('div');
      tree.setAttribute('id','console-screen');

      // tree.appendChild(document.createElement('body'));
      // tree.body = tree.getElementsByTagName('body')[0];
      tree.style.padding= '10px';
      tree.style.width = '90%';
      tree.style.height = '90%';
      tree.style.overflow = 'auto';
    }

    extended.out = util.proxy(tree.appendChild,tree);

    extended.log = function log(msg){
      extended.out(makeWord("=>   ".green + msg));
    };

    extended.error = function error(msg){
      exteded.out(makeWord("=>   ".red + msg));
    }

    if(!parent) document.body.appendChild(tree);
    else parent.appendChild(tree);


    // var timer = setInterval(function(){
    //  if(document.body){
    //    ready();
    //    clearInterval(timer);
    //  }
    // },0);

    return extended;
  };

  var auto = function(extended,pid){
  var envi = ToolStack.Env.detect();
  if(envi === 'node') return node(extended);
  if(envi === 'browser') return browser(extended,pid);
  }

  Console.init = function init(pid,env){
  if(Console.initialized) return Console;

  if(!env || env === 'auto') return auto(Console,pid);

  if(env){
    if(env === 'node') return node(extended);
    if(env === 'web' || env === 'browser') return browser(extended,pid);
  }

  };

  Console.pipe = function(o,method){
  Console.out = util.proxy(o[method || 'out'],o);
  return Console;
  }

})(ToolStack);

