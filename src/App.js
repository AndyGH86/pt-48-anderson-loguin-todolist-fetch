import React, { useState, useEffect } from 'react';
import Spinner from './spinner';
import { MdDelete } from "react-icons/md";
import './App.css';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [isThereSession, setIsThereSession] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [list, setList] = useState([]);
  const [loggedToDo, setLoggedToDo] = useState(false);

  useEffect(() => {
    setCredentials({ username: username, password: password });
  }, [username, password]);

  const login = async () => {
    setIsLoading(true);
    await new Promise((resolve) => {
      setTimeout(() => resolve(true), 3000);
    });
    setIsThereSession(credentials.username && credentials.password);
    setIsLoading(false);
    setLoggedToDo(true);
    await obtenerInfoServer();
  };
  const SERVER_URL =
    'https://playground.4geeks.com/apis/fake/todos/user/';
  const GET_HTTP_METHOD = 'GET';
  const PUT_HTTP_METHOD = 'PUT';
  

  const obtenerInfoServer = async () => {
    const response = await fetch(`${SERVER_URL}${username}`, { method: GET_HTTP_METHOD });
    const data = await response.json();
    setList(data);
  };
  
  const createNewTodo = async (label) => {
    const newTodo = { label, id: '', done: false };
    const state = [...list, newTodo];
    await fetch(`${SERVER_URL}${username}`, {
      method: PUT_HTTP_METHOD,
      body: JSON.stringify(state),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    await obtenerInfoServer();
  };
  const deleteTodo = async (label) => {
    const updatedList = list.filter((todo) => todo.label !== label);
    await fetch(`${SERVER_URL}${username}`, {
      method: PUT_HTTP_METHOD,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedList),
    });
    await obtenerInfoServer();
  };

  useEffect(() => {
    obtenerInfoServer();
  }, []);

  return (
    <>
      <div className="app__container">
        <div className="login-container">
          {!isLoading && !loggedToDo && (
            <>
              <input className="input_loguin"
                type="text"
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
              />
              <input className="input_loguin"
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button className="signin-button" onClick={() => 
                login()
                }>
                Sign in
              </button>
            </>
          )}
          {isLoading && !loggedToDo && (
            <>
              <Spinner />
            </>
          )}

          {loggedToDo && (
            <>
              <div className="todolist-container">
                <h1>Todos</h1>
                <ul>
                  <li>
                    <input className="input_todo"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          createNewTodo(inputValue);
                          setInputValue('');
                        }
                      }}
                      placeholder="What do you need to do?"
                    />
                  </li>
                  {list.map(({ id, done, label }) => (
                    <li key={id}>
                      {label}{' '}
                      <button
                        className="button_todo"
                        onClick={() => deleteTodo(label)}
                      >
                       <MdDelete />
                      </button>
                    </li>
                  ))}
                  <li>{list.length} items left</li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
