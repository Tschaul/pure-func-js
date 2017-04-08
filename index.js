const hFactory = require("./hFactory.js");
/** @jsx hFactory */

const { create, diff, patch } = require("./node_modules/virtual-dom/dist/virtual-dom.js");
const { Record } = require("./node_modules/immutable/dist/immutable.js");

// MODEL

const Model = Record({
    count: 0
});

// VIEW

const view = model => dispatch => hFactory(
    "div",
    null,
    hFactory(
        "h1",
        null,
        "Count: ",
        model.count
    ),
    hFactory(
        "button",
        { onclick: dispatch(Increment) },
        "+"
    ),
    hFactory(
        "button",
        { onclick: dispatch(Decrement) },
        "-"
    )
);

// INTENT

const Increment = Symbol();
const Decrement = Symbol();

const update = model => intent => {
    switch (intent) {
        case Increment:
            return model.update("count", x => x + 1);
        case Decrement:
            return model.update("count", x => x - 1);
        default:
            return model;
    }
};

// BOOTSTRAPPING

var currentModel = new Model();
var currentNode = hFactory("span", null);
var currentElement = create(currentNode);

document.body.appendChild(currentElement);

// SIDEEFFECTS
const dispatch = intent => event => {

    const nextModel = update(currentModel)(intent);
    const nextNode = view(nextModel)(dispatch);
    const nextElement = patch(currentElement, diff(currentNode, nextNode));

    currentElement = nextElement;
    currentNode = nextNode;
    currentModel = nextModel;
};

dispatch()();
