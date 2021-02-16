import React, { Component } from "react";
import axios from "axios";
import { Card, Header, Form, Input, Icon, Button, Checkbox, Radio, Select, TextArea, Divider, Segment} from "semantic-ui-react";

let endpoint = "http://localhost:4747";

class ToDoList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: "",
      body: "",
      completed: "",
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
    let { title, body } = this.state;
    // console.log("pRINTING task", this.state.task);
    if (title) {
      axios
        .post(
          endpoint + "/todo",
          {
            title, body
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
            title: "",
            body: ""
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

            if (item['completed'] === "") {
              color = "green";
            }
            return (

    //           <Card.Content header='About Amy' />
    // <Card.Content description={description} />
    // <Card.Content extra>
    //   <Icon name='user' />4 Friends
    // </Card.Content>


              <Card key={item.id} color={color} fluid>
                <Card.Content>
                  <Card.Header textAlign="left">
                    <div style={{ wordWrap: "break-word" }}>{item.title}</div>
                  </Card.Header>
                  <Card.Content description={item.body} />
                  <Card.Content description={item["created_at"]} />
                  <Card.Content description={item["completed"]} />
                  <Card.Meta textAlign="right">
                    <Icon
                      name="check circle"
                      color="green"
                      onClick={() => this.updateTask(item["id"])}
                    />
                    <span style={{ paddingRight: 10 }}>Done</span>
                    <Icon
                      name="undo"
                      color="yellow"
                      onClick={() => this.undoTask(item["id"])}
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
        "completed":"yes"
      },
      {
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

        <Segment>

        <div className="row">
          <Header className="header" as="h2">
            TO DO LIST
          </Header>
        </div>


        
        <Form onSubmit={this.onSubmit}>
        <Form.Group widths='equal'>
          
          <Form.Field
            control={Input}
            type="text"
            name="title"
            onChange={this.onChange}
            fluid
            placeholder="Create Task"
            label='title'
            value={this.state.title}
          />
          {/* <Form.Field
            control={Input}
            label='Last name'
            placeholder='Last name'
          /> */}
        </Form.Group>
        <Form.Field
          control={TextArea}
          onChange={this.onChange}
          label='body'
          type='body'
          name='body'
          fluid
          value={this.state.body}
          placeholder='Task Description'
        />
        {/* <Form.Field
          control={Checkbox}
          label='I agree to the Terms and Conditions'
        /> */}
        <Form.Field control={Button}>Submit</Form.Field>
      </Form>
      <Divider section />
        <div className="row">
          <Card.Group>{this.state.items}</Card.Group>
        </div>
        </Segment>
      </div>
    );
  }
}

export default ToDoList;