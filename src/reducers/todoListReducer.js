export default function todoListReducer(state = {
  todos: []
}, action) {
  console.log(action)
  switch(action.type) {

    case 'ADD_TODO':
      return Object.assign({}, {
        todos: state.todos.concat(action.todo)
      });

    default:
      return state;
  }
};
