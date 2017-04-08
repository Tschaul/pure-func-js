const hFactory = require("./hFactory.js");
/** @jsx hFactory */

const create = require("./node_modules/virtual-dom/dist/virtual-dom.js").create;

const element = create(hFactory(
  "h1",
  null,
  "Hello World!"
));

// SIDEEFFECT !!
document.body.appendChild(element);
