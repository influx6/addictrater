var q = ((typeof require != 'undefined') ?  require('./init.js') : module.exports)('pyshco');

var man = q.create('1','how long did you watch tv')('4 hours','2 hours','1 hour');
var elem = q.elem($('#qp'),$('#item_template'),$('#wall #pane'));

console.log(man);
console.log(elem);
