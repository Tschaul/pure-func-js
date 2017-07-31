const hFactory = require("./hFactory.js");
/** @jsx hFactory */

const { create, diff, patch, h } = require("./node_modules/virtual-dom/dist/virtual-dom.js");
const { Record, List } = require("./node_modules/immutable/dist/immutable.js");
const { Subject, Observable } = require("./node_modules/rxjs/bundles/Rx.js");

const Todo = Record({
    done: false,
    name: ""
});

const Model = Record({
    title: "Liste",
    todos: List([new Todo({
        name: "Milch"
    }), new Todo({
        name: "Kaffee"
    }), new Todo({
        name: "Schokolade"
    })])
});

TOGGLE = Symbol("TOGGLE");

const reduce = (state, action) => {
    switch (action.type) {
        case TOGGLE:
            return state.updateIn(["todos", action.index, "done"], x => !x);
        default:
            return state;
    }
};

const render = (state, dispatch) => hFactory(
    "div",
    null,
    hFactory(
        "h3",
        null,
        state.title
    ),
    hFactory(
        "ul",
        null,
        state.todos.map((todo, index) => hFactory(
            "li",
            {
                style: {
                    "text-decoration": todo.done ? "line-through" : "none"
                },
                onclick: () => dispatch({ type: TOGGLE, index: index })
            },
            todo.name
        ))
    )
);

const actionStream = new Subject();
const dispatch = action => actionStream.next(action);

const initialState = new Model();
const initialTree = render(initialState, dispatch);
const initialNode = create(initialTree);

document.body.appendChild(initialNode);

// action -> state
const stateStream = actionStream.scan((state, action) => {
    return reduce(state, action);
}, initialState);

// state -> vDOM
const renderStream = stateStream.map(state => render(state, dispatch)).startWith(initialTree);

// vDOM -> patches
const patchesStream = renderStream.pairwise().map(pair => {
    const [oldTree, newTree] = pair;
    return diff(oldTree, newTree);
});

// patches -> DOM
patchesStream.scan((node, patches) => {
    return patch(node, patches);
}, initialNode).subscribe();
