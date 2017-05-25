const hFactory = require("./hFactory.js");
/** @jsx hFactory */

const { create, diff, patch } = require("./node_modules/virtual-dom/dist/virtual-dom.js");
const { Record } = require("./node_modules/immutable/dist/immutable.js")

// MODEL

const Model = Record({
    count: 0
})

// VIEW

const view = model => dispatch => (
    <div>
        <h1>Count: {model.count}</h1>
        <button onclick={()=>dispatch({type:INCREMENT})}>+</button>
        <button onclick={()=>dispatch({type:DECREMENT})}>-</button>
    </div>
);

// INTENT

const INCREMENT = Symbol("INCREMENT");
const DECREMENT = Symbol("DECREMENT");

const update = model => intent => {
    switch(intent.type){
        case(Increment):
            return model.update("count", x => x+1);
        case(Decrement):
            return model.update("count", x => x-1);
        default:
            return model;
    }
}

// BOOTSTRAPPING

var currentModel = new Model();
var currentNode = (<span/>);
var currentElement = create(currentNode);

document.body.appendChild(currentElement)

// SIDEEFFECTS
const dispatch = intent => {

    const nextModel = update(currentModel)(intent);
    const nextNode = view(nextModel)(dispatch)
    const nextElement = patch(currentElement, diff(currentNode, nextNode))

    currentElement = nextElement;
    currentNode = nextNode;
    currentModel = nextModel;

}

dispatch();






