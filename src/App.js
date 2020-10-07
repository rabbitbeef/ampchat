import React, { Component } from 'react';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react';
import { listTodos } from './graphql/queries';
import { createTodo } from './graphql/mutations';
import { onCreateTodo } from './graphql/subscriptions';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      description: '',
      username: '',
    };
  }

  handleChange = (event) => {
    this.setState({ description: event.target.value });
  };

  componentDidMount = async () => {
    try {
      const user = await Auth.currentUserInfo();
      this.setState({ username: user.username });

      const Todos = await API.graphql(graphqlOperation(listTodos));

      this.setState({
        data: Todos.data.listTodos.items,
      });

      API.graphql(graphqlOperation(onCreateTodo)).subscribe({
        next: (data) => {
          console.log(('change:', data.value.data.onCreateTodo));
          this.setState({ data: [...this.state.data, data.value.data.onCreateTodo] });
        },
      });
    } catch (e) {
      console.log(e);
    }
  };

  postTodo = async () => {
    const todo = { name: this.state.username, description: this.state.description };
    try {
      await API.graphql(graphqlOperation(createTodo, { input: todo }));
      this.setState({
        description: '',
      });
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    return (
      <div className="App">
        <form>
          <input type="text" value={this.state.description} onChange={this.handleChange}></input>
        </form>
        <button onClick={this.postTodo}>Add Todo</button>
        <div>
          {this.state.data.length > 0 ? (
            this.state.data.map((todo) => (
              <p key={todo.id}>
                {todo.name} : {todo.description}
              </p>
            ))
          ) : (
            <p>add some todo!</p>
          )}
        </div>
      </div>
    );
  }
}

export default withAuthenticator(App);
