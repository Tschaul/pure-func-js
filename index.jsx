const hFactory = require("./hFactory.js");
/** @jsx hFactory */

const create = require("./node_modules/virtual-dom/dist/virtual-dom.js").create;

const element = create(<h1>Hello World!</h1>);

// SIDEEFFECT !!
document.body.appendChild(element)



