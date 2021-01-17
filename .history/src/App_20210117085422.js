import './App.css';
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addTodo, toggleTodo, setFilter, editTodo } from "./redux/actions";
import cx from "classnames";
// import { getTodoById } from "../redux/selectors";
import { useSelector } from "react-redux";
import { getTodos } from "./redux/selectors";
import { VISIBILITY_FILTERS } from "./constants";

function App() {
  return (
    <div className="todo-app">
      <h1>Todo List</h1>
      <AddTodo />
      <TodoList />
      <VisibilityFilters />
    </div>
  );
}

export const AddTodo = props => {
  const [input, setInput] = useState(undefined);
  const dispatch = useDispatch();

  return (
    <div>
      <input onBlur={e => setInput(e.target.value)} />
      <button className="add-todo" onClick={() => dispatch(addTodo(input))}>
        Add Todo
      </button>
    </div>
  );
};

export const Todo = ({ todo }) => {
  const dispatch = useDispatch();
  return (
    <li className="todo-item" >
      {todo && todo.completed ? "👌" : "👋"}{" "}
      <span
        className={cx(
          "todo-item__text",
          todo && todo.completed && "todo-item__text--completed"
        )}
        onClick={() => dispatch(toggleTodo(todo.id))}
      >
        {todo.content}
      </span>
      <button onClick={() => dispatch(editTodo(todo.id,todo.content))}>edit</button>
    </li>
  );
};

export const TodoList = () => {
  const visibilityFilter = useSelector(state => state.visibilityFilter);
  const allTodos = useSelector(getTodos);
  const todos =
    visibilityFilter === VISIBILITY_FILTERS.ALL
      ? allTodos
      : visibilityFilter === VISIBILITY_FILTERS.COMPLETED
      ? allTodos.filter(todo => todo.completed)
      : allTodos.filter(todo => !todo.completed);

  return (
    <ul className="todo-list">
      {todos && todos.length
        ? todos.map((todo, index) => {
            return <Todo key={`todo-${todo.id}`} todo={todo} />;
          })
        : "No todos, yay!"}
    </ul>
  );
};

export const VisibilityFilters = () => {
  const activeFilter = useSelector(state => state.visibilityFilter);
  const dispatch = useDispatch();
  return (
    <div className="visibility-filters">
      {Object.keys(VISIBILITY_FILTERS).map(filterKey => {
        const currentFilter = VISIBILITY_FILTERS[filterKey];
        return (
          <span
            key={`visibility-filter-${currentFilter}`}
            className={cx(
              "filter",
              currentFilter === activeFilter && "filter--active"
            )}
            onClick={() => {
              console.log("setting", currentFilter);
              dispatch(setFilter(currentFilter));
            }}
          >
            {currentFilter}
          </span>
        );
      })}
    </div>
  );
};

export default App;
