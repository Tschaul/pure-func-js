const hFactory = require("./hFactory.js");
/** @jsx hFactory */

const { create, diff, patch, h } = require("./node_modules/virtual-dom/dist/virtual-dom.js");
const { Record, List } = require("./node_modules/immutable/dist/immutable.js")
const { Subject, Observable } = require("./node_modules/rxjs/bundles/Rx.js")

function render(count)  {

    return (
        <div 
            style = {{
                textAlign: 'center',
                lineHeight: (100 + count) + 'px',
                border: '1px solid red',
                width: (100 + count) + 'px',
                height: (100 + count) + 'px'
            }}        
        >
            {count}
        </div>
    )

}

var count = 0;

var tree = render(count);
var rootNode = create(tree);
document.body.appendChild(rootNode);

setInterval(function () {
      count++;

      var newTree = render(count);
      var patches = diff(tree, newTree);
      rootNode = patch(rootNode, patches);
      tree = newTree;
}, 1000);






