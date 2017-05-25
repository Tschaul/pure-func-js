const hFactory = require("./hFactory.js");
/** @jsx hFactory */

const { create, diff, patch } = require("./node_modules/virtual-dom/dist/virtual-dom.js");
const { Record, List } = require("./node_modules/immutable/dist/immutable.js")

// MODEL

const Todo = Record({
    id: 0,
    name: "",
    done: false
})

const Model = Record({
    title: "",
    todos: List([
        new Todo({
            id: Math.random(),
            name: "Schokolade",
            done: false
        }),
        new Todo({
            id: Math.random(),
            name: "Milch",
            done: true
        })
    ]),
    newTodoName: ""
})

// VIEW 

const view = model => dispatch => (
    <div>
        <h1>{model.title}</h1>
        <ul>
            {model.todos.map(todo => (
                <li style={{
                    "text-decoration": todo.done ? "line-through" : "none"
                }} onclick={()=>dispatch({type: TOGGLE, id: todo.id})}>
                    {todo.name}
                </li>
            ))}
        </ul>
        <input value={model.newTodoName} oninput={event=>dispatch({type:UPDATE_NEW_TODO_NAME, value: event.target.value})}/>
        <button onclick={()=>dispatch({type:ADD_NEW_TODO})}>Add</button>
    </div>
);

// INTENT

const TOGGLE = Symbol("TOGGLE");
const UPDATE_NEW_TODO_NAME = Symbol("UPDATE_NEW_TODO_NAME");
const ADD_NEW_TODO = Symbol("ADD_NEW_TODO");

const update = model => intent => {
    switch(intent.type){
        case(UPDATE_NEW_TODO_NAME):
            return model.set("newTodoName",intent.value);
        case(ADD_NEW_TODO):
            const todosWithAdded = model.todos.push(new Todo({
                id: Math.random(),
                name: model.newTodoName,
                done: false
            }))
            return model.set("todos",todosWithAdded).set("newTodoName","");
        case(TOGGLE):
            const todosWithToggled = model.todos.map(todo => 
                todo.id === intent.id ? todo.update("done", d => !d) : todo
            )
            return model.set("todos", todosWithToggled );
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

    console.log(intent,nextModel)

    currentElement = nextElement;
    currentNode = nextNode;
    currentModel = nextModel;

}

dispatch({});






