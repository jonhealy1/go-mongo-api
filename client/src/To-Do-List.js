import React, { Component } from "react";
import axios from "axios";
import { Card, Header, Form, Input, Icon } from "semantic-ui-react";

let endpoint = "http://localhost:4747";

class ToDoList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: "",
      items: []
    };
  }

  componentDidMount() {
    this.getTask();
  }

  onChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  onSubmit = () => {
    let { title } = this.state;
    // console.log("pRINTING task", this.state.task);
    if (title) {
      axios
        .post(
          endpoint + "/todo",
          {
            title
          },
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          }
        )
        .then(res => {
          this.getTask();
          this.setState({
            title: ""
          });
          console.log(res);
        });
    }
  };

  getTask = () => {
    axios.get(endpoint + "/todos").then(res => {
      console.log(res);
      if (res.data) {
        this.setState({
          items: res.data["data"].map(item => {
            let color = "yellow";

            if (item.id !== "dummy") {
              color = "green";
            }
            return (
              <Card key={item.id} color={color} fluid>
                <Card.Content>
                  <Card.Header textAlign="left">
                    <div style={{ wordWrap: "break-word" }}>{item.title}</div>
                  </Card.Header>

                  <Card.Meta textAlign="right">
                    <Icon
                      name="check circle"
                      color="green"
                      onClick={() => this.updateTask(item.id)}
                    />
                    <span style={{ paddingRight: 10 }}>Done</span>
                    <Icon
                      name="undo"
                      color="yellow"
                      onClick={() => this.undoTask(item.id)}
                    />
                    <span style={{ paddingRight: 10 }}>Undo</span>
                    <Icon
                      name="delete"
                      color="red"
                      onClick={() => this.deleteTask(item["id"])}
                    />
                    <span style={{ paddingRight: 10 }}>Delete</span>
                  </Card.Meta>
                </Card.Content>
              </Card>
            );
          })
        });
      } else {
        this.setState({
          items: []
        });
      }
    });
  };

  updateTask = id => {
    axios
      .put(endpoint + "/todo/" + id, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      })
      .then(res => {
        console.log(res);
        this.getTask();
      });
  };

  undoTask = id => {
    axios
      .put(endpoint + "/todo/" + id, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      })
      .then(res => {
        console.log(res);
        this.getTask();
      });
  };

  deleteTask = id => {
    axios
      .delete(endpoint + "/todo/" + id, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      })
      .then(res => {
        console.log(res);
        this.getTask();
      });
  };
  render() {
    return (
      <div>
        <div className="row">
          <Header className="header" as="h2">
            TO DO LIST
          </Header>
        </div>
        <div className="row">
          <Form onSubmit={this.onSubmit}>
            <Input
              type="text"
              name="title"
              onChange={this.onChange}
              value={this.state.title}
              fluid
              placeholder="Create Task"
            />
            {/* <Button >Create Task</Button> */}
          </Form>
        </div>
        <div className="row">
          <Card.Group>{this.state.items}</Card.Group>
        </div>
      </div>
    );
  }
}

export default ToDoList;