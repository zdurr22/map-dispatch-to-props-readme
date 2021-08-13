# Mapping Dispatch to Props

## Objectives

- Implement an action creator
- Learn how to use `mapDispatchToProps` to further streamline our code


### Introduction

In the previous lessons, we've learned how `mapStateToProps()` can help with 
separation of concerns. Specifically, we saw that we can use `mapStateToProps` 
to return needed information from the store's state. Then, by passing 
`mapStateToProps` as an argument to the `connect` method, the information is 
passed into our component as props. With this in place, we no longer need to 
access our store directly from the component. 

We've also learned that the `connect` method *automatically* passes the store's 
`dispatch` method to the component as props, enabling us to also dispatch actions 
without directly invoking the store. 

Finally, in the last lesson, we learned about action creators and the benefits of 
using them rather than passing action objects directly into the `dispatch` method. 

In this codealong we will implement an action creator for a simple todo list app. 
We will also learn how to pass a second argument to `connect`, `mapDispatchToProps`, 
to further streamline and compartmentalize our code.


## Our Todo App

To begin, let's take a look at the starting code provided in `src/App.js`:

```jsx
// ./src/App.js

import React, { Component } from "react";
import { connect } from "react-redux";
import "./App.css";

class App extends Component {

  state = {
    todo: ''
  }

  handleOnChange = event => {
    this.setState({
      todo: event.target.value
    });
  }

  handleOnSubmit = event => {
    event.preventDefault();
    console.log("Todo being added: ", this.state.todo);
    this.props.dispatch({ type: 'ADD_TODO', todo: this.state.todo });
    this.setState({ todo: '' });

  }

  render() {
    const renderTodos = () => this.props.todos.map(todo => <li key={todo}>{todo}</li>);
    return (
      <div className="App">
      <form onSubmit={(event) => this.handleOnSubmit(event)}>
        <input
          type="text"
          onChange={(event) => this.handleOnChange(event)}
          id="todos"
          placeholder="add todo" 
          value={this.state.todo}/>
        <input type="submit" />
      </form>
      <h2>Todos:</h2>
        <ol>{renderTodos()}</ol>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    todos: state.todos
  };
};

export default connect(mapStateToProps)(App);

```

In our `render` you can see we have a simple form with an `onSubmit` handler. 
The form includes a text input box with an `onChange` handler, and a submit 
button. Below the form we are rendering a list of the todos. 

```jsx
// ./src/app.js
...

  render() {
    const renderTodos = () => this.props.todos.map(todo => <li key={todo}>{todo}</li>);
    return (
      <div className="App">
      <form onSubmit={(event) => this.handleOnSubmit(event)}>
        <input
          type="text"
          onChange={(event) => this.handleOnChange(event)}
          id="todos"
          placeholder="add todo" 
          value={this.state.todo}/>
        <input type="submit" />
      </form>
      <h2>Todos:</h2>
        <ol>{renderTodos()}</ol>
      </div>
    );
  }
};

...
```

In order to make our `App` component a controlled component, we have created a 
local `state` variable which is updated in our `handleOnChange` method and used 
to populate the text input field:

```jsx
// ./src/app.js
...

  state = {
    todo: ''
  }

  handleOnChange = event => {
    this.setState({
      todo: event.target.value
    });
  }

...
```

When the Submit button is clicked, our `handleOnSubmit` method dispatches an 
action object with type `ADD_TODO` and a payload taken from `this.state`. The 
reducer, which you can see in `reducers/todoListReducer.js`, then uses the 
information in the action to update the store. 

```jsx
// ./src/app.js
...

  handleOnSubmit = event => {
    event.preventDefault();
    console.log("Todo being added: ", this.state.todo);
    this.props.dispatch({ type: 'ADD_TODO', todo: this.state.todo });
    this.setState({ todo: '' });
  }

...
```

Finally, the `connect` method passes the return value of the `mapStateToProps` 
method as props to our component, enabling us to access `this.props.todos` in 
our `render` method. `connect` also passes the `dispatch` method as props 
automatically, enabling us to access `this.props.dispatch` in our 
`handleOnSubmit` method:

```jsx
// ./src/app.js
...

const mapStateToProps = (state) => {
  return {
    todos: state.todos
  };
};

export default connect(mapStateToProps)(App);

```

Boot up the app in your browser and open the console. If you refresh the page, 
you should see the initial action logged by the reducer. Enter a todo in the 
input box and click submit to verify that the store is being updated and the 
list of todos is being rendered to the screen. In the console, you should see 
the todo that's being added logged from the `handleOnSubmit` method and the 
action logged from the reducer.

#### Implementing an Action Creator

Currently, in our `handleOnSubmit` method, we are passing our action directly:

```jsx
this.props.dispatch({ type: 'ADD_TODO', todo: this.state.todo });
```

As we learned in the previous lesson, we can instead use an action creator 
method to DRY up our code a bit. Let's go ahead and add an `addTodo` method to 
our `App` component:

```jsx
// ./src/app.js
...

  addTodo = () => {
    return ({
      type: 'ADD_TODO',
      todo: this.state.todo
    })
  }

...
```

The `addTodo` action creator returns an action object with a type of 'ADD_TODO' 
and a todo payload taken from our local state. Then we just need to update our 
`handleOnSubmit` method to use our action creator:

```jsx
  handleOnSubmit(event) {
    event.preventDefault();
    console.log("Todo being added: ", this.state.todo)
    this.props.dispatch(this.addTodo()); //Code change: using our action creator method instead of passing the action directly
    this.setState({ todo: '' })
  }

```

If we go back to the browser we should see that everything is still working.

Defining our action creator inside our component works just fine, but you can 
imagine that with a more complicated app where we need to implement more than 
one or two actions, this could get out of hand quickly. A common pattern, 
therefore, is to create a separate folder to hold our action creators.

Let's go ahead and make an `actions` folder inside the `src` folder. Then inside 
that folder we'll create a new file, `todos.js`, and move our action creator 
from the `App` component into the new file. Note that because the action creator 
is no longer defined inside our `App` component, we now need to define it with 
`const` and export the function so it will be available to our component. We also 
need to pass the todo as an argument to `addTodo`. It should look like this: 

```jsx
// ./src/actions/todo.js
export const addTodo = (todo) => {
  return { 
    type: 'ADD_TODO',
    todo: todo
  };
};
```

To get everything hooked up, let's import our action creator into `App.js`:

```jsx
import { addTodo } from  './actions/todos';
```

Then we just need to modify our dispatch inside the `handleOnSubmit` method as 
follows:

```jsx
this.props.dispatch(addTodo(this.state.todo));
```

Let's go back to the browser again and give it a try. Everything still works!

### Using `mapDispatchToProps`

To quickly review: The first argument passed into `connect()` is a function.
That function is written to accept the Redux store's state as an argument and
returns an object created using all or some of that state. Key/value pairs in
this returned object will become values we can access in the component we've
wrapped with `connect()`. The below example, for instance, would make the entire
state available as a prop:

```jsx
const mapStateToProps = (state) => {
  return state;
};
```

We call this function `mapStateToProps` because that is what it does. This 
function is passed in as the _first_ argument to `connect()`. When 
`connect()` executes, it calls `mapStateToProps`, passing in the current 
state. It then makes the object that is returned available as a prop.

`connect()` can also take another function as its _second_ argument. When 
`connect()` executes, it calls both functions, passing _state_ in to the first 
and passing the _dispatch_ function to the second. This means we can write that 
second function assuming we have access to `dispatch()`. We call it 
`mapDispatchToProps` because that is what it does. We'll add the new method at 
the bottom of the `./src/App.js` file, and update our `export` statement 
accordingly:

```jsx
// src/App.js

...

// This new function takes in dispatch as an argument
// It then returns an object that contains a function as a value!

const mapDispatchToProps = dispatch => {
  return {
    addTodo: (todo) => {
      dispatch(addTodo(todo))
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
```

Okay, so let's see what we accomplished by adding our `mapDispatchToProps()` 
function, and passing it through as the second argument. We'll place a debugger 
in our component at the beginning of `render()`, just before the return
statement. 

```jsx
// src/App.js
...

  render() {
    debugger;
    const renderTodos = () => this.props.todos.map(todo => <li key={todo}>{todo}</li>);
    return (
      <div className="App">
      <form onSubmit={(event) => this.handleOnSubmit(event)}>
        <input
          type="text"
          onChange={(event) => this.handleOnChange(event)}
          id="todos"
          placeholder="add todo" 
          value={this.state.todo}/>
        <input type="submit" />
      </form>
      <h2>Todos:</h2>
        <ol>{renderTodos()}</ol>
      </div>
    );
  }
};
...
```

If you go back to the browser you should see that the debugger has been 
triggered. Type in `this.props.addTodo` in the console. You'll see that it 
returns a function with dispatch inside. With `mapStateToProps()`, we added a 
prop `todos` that pointed to a value, an array containing all the todos. Here we 
add a prop `addTodo` that also points to a value, in this case a function. The 
`dispatch` function is available as an argument to `mapDispatchToProps`. By 
defining the function `addTodo` inside `mapDispatchToProps`, we're able to 
include `dispatch` in the definition; we've bundled everything we need into a 
single prop value.

With `dispatch` integrated into `this.props.addTodo`, we can change our code 
such that when the `handleOnSubmit()` function gets called, we execute our 
action creator by referencing it as a prop:

```jsx
// ./src/App.js

...

  handleOnSubmit = event => {
    event.preventDefault();
    console.log("Todo being added: ", this.state.todo);
    this.props.addTodo(this.state.todo); //Code change: we are no longer calling `dispatch` here
    this.setState({ todo: '' });
  }

...
```

This code calls the `handleOnSubmit()` function when the form is 
submitted. The `handleOnSubmit()` function references and then executes the 
`addTodo()` function from props.  Note that the method being called by 
`handleOnSubmit` is **not** the action creator itself; instead, the action 
creator is being dispatched _inside_ the function called with 
`this.props.addTodo()`. 

Let's remove the debugger and refresh the page to verify that everything still 
works.

## Alternative Method

There is an even simpler way to approach bundling our actions and `dispatch`
into props. The second argument of `connect` will accept a function (as we've 
seen) _or_ an object. If we pass in a function, `mapDispatchToProps()`, we must
incorporate `dispatch` as with the previous example. We must also explicitly 
handle the `todo` argument that is being passed to our action creator. If we pass 
in an object, however, `connect` handles both of these steps for us! The object 
just needs to contain key/value pairs for each action creator we want to become 
props. In our example, we're using the `addTodo` action creator, so the object
would look like this:

```jsx
{
  addTodo: addTodo
}
```

As of JavaScript ES6, when we have an object with a key and value with the same 
name, we can use the shorthand syntax and write:

```jsx
{
  addTodo
}
```

This is all we need to pass in as a second argument for `connect()`! So to 
implement this, we will remove the `mapDispatchToProps` method and change the 
export statement as follows:

```jsx

export default connect(mapStateToProps, { addTodo })(App); // Code change: no mapDispatchToProps function required!
```

We _could_ go further still and get rid of `mapStateToProps()` as well. We
still need to pass in a function as the first argument, but it can be an
anonymous arrow function that handles everything in one line:

```jsx
export default connect(state => ({ todos: state.todos }), { addTodo })(App);
```

This means we can, if we like, replace all of the code below with the above 
export statement:

```jsx
const mapStateToProps = (state) => {
  return {
    todos: state.todos
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addTodo: (todo) => {
      dispatch(addTodo(todo))
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
```

With these changes, our final code looks like this:

```jsx

// ./src/App.js


import React, { Component } from 'react';
import { connect } from 'react-redux';
import './App.css';
import { addTodo } from  './actions/todos';

class App extends Component {

  state = {
    todo: ''
  }

  addTodo = () => {
    return ({
      type: 'ADD_TODO',
      todo: this.state.todo
    })
  }

  handleOnChange = event => {
    this.setState({
      todo: event.target.value
    });
  }

  handleOnSubmit = event => {
    event.preventDefault();
    console.log("Todo being added: ", this.state.todo);
    this.props.addTodo(this.state.todo);
    this.setState({ todo: '' });
  }

  render() {
    const renderTodos = () => this.props.todos.map(todo => <li key={todo}>{todo}</li>);
    return (
      <div className="App">
      <form onSubmit={(event) => this.handleOnSubmit(event)}>
        <input
          type="text"
          onChange={(event) => this.handleOnChange(event)}
          id="todos"
          placeholder="add todo" 
          value={this.state.todo}/>
        <input type="submit" />
      </form>
      <h2>Todos:</h2>
        <ol>{renderTodos()}</ol>
      </div>
    );
  }
};

export default connect(state => ({ todos: state.todos }), { addTodo })(App);

```

```jsx

// ./src/actions/todos.js

export const addTodo = (todo) => {
    return { 
      type: 'ADD_TODO',
      todo: todo
    };
  };

```

## Summary

In this lesson, we saw how we can use action creators and the 
`mapDispatchToProps()` function to further compartmentalize and streamline our 
code, improving separation of concerns. We saw that `mapDispatchToProps()` 
allows us to bring in actions and combine them with `dispatch` to connect 
events on our page to actions in our store.
