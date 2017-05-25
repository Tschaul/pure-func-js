
var h = require("./node_modules/virtual-dom/dist/virtual-dom.js").h
const { List } = require("./node_modules/immutable/dist/immutable.js")

module.exports = function(tag,props,children){
    
    var args = Array.prototype.slice.call(arguments);

    if(args.length>3){
        children = args.slice(2);
    }

    if(List.isList(children)){
        children = children.toArray();
    }

    return h(tag,props,children)
    

}