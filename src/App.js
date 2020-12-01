import logo from './logo.svg';
// import io from 'socket.io-client';
import './App.css';
import React from 'react'
import {Container, Row, Col, Button, Form, Image} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.css';
import axios from "axios";
const rootEndpoint = "localhost:1323"

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      freelancers: [],
      newFreelancersNumber: 1,
      newTasksNumber: 1,
    };
  }
  componentDidMount(){
    let self = this;
    (async ()=>{
      let results = await axios.get(`http://${rootEndpoint}/api/freelancers`)
      console.log(results)
      self.setState(state=>{
        return {
        ...state, freelancers:  results.data.sort((f)=>f['ID'])
      }})
    })()
    

    if (window["WebSocket"]) {
      let conn = new WebSocket(`ws://${rootEndpoint}/ws`);

      conn.onclose = function (evt) {
          var item = document.createElement("div");
          item.innerHTML = "<b>Connection closed.</b>";
      };
      
      conn.onmessage = function (evt) {
        let freelancer = JSON.parse(evt.data)
        console.log(freelancer)
        let freelancers = self.state['freelancers']
        let index = freelancers.findIndex((f)=>f['ID']==freelancer['ID'])
        if(index == -1){
          freelancers.push(freelancer)
        } else{
          freelancers[index] = freelancer
        }
        console.log(freelancers)
        self.setState(state=>{return {
          ...state, freelancers:  freelancers.sort((f)=>f['ID'])}
        })
      };
  } else {
      var item = document.createElement("div");
      item.innerHTML = "<b>Your browser does not support WebSockets.</b>";
  }
}
changeNewFreelancersNumber = (evt)=>{
  console.log(parseInt(evt.target.value))
  this.setState(state=>{return {
    ...state, newFreelancersNumber: parseInt(evt.target.value)}
  })
}

changeNewTasksNumber = (evt)=>{
  console.log(parseInt(evt.target.value))
  this.setState(state=>{return {
    ...state, newTasksNumber: parseInt(evt.target.value)}
  })
}

addFreelancers = async ()=>{
  let result = await axios.post(`http://${rootEndpoint}/api/freelancers`, {
    Number: this.state['newFreelancersNumber'],
  })
  console.log(result)
}

addTasks = async ()=>{
  let result = await axios.post(`http://${rootEndpoint}/api/tasks`, {
    Number: this.state['newTasksNumber'],
  })
  console.log(result)
}

  render() {
    return (
      <div>        
        <Container>
          <Row>
            <Col>
            <h1>Freelancer::Go concurrenct worker simulation</h1>

            <p>이 프로그램은 Go에서의 concurrency pattern 중 하나인 concurrent worker pool pattern을 직관적으로 이해할 수 있게 도와줍니다.</p>
            <p>이 프로그램 내에서 우리 귀여운 Gopher들은 Freelancer로 활동합니다. 일이 있으면 일을 하고 없으면 쉽니다.
              Freelancer를 더 고용할 수도 있고, 자를 수도 있습니다. 마찬가지로 작업(Task)를 추가할 수도 있습니다.</p>
            </Col>
          </Row>
          <Row>
            <Col>
              <h2>현재 고용중인 프리랜서 Gopher 목록</h2>
            </Col>
          </Row>
          <Row>
            <Col sm="3">
            <Form.Control onChange={this.changeNewFreelancersNumber.bind(this)} type="number" placeholder="추가할 Gopher 수" />
            </Col>
            <Col>
            <Button onClick={this.addFreelancers.bind(this)}>새로운 Gopher 고용하기</Button>
            </Col>
          </Row>
          <Row>
            <Col sm="3">
            <Form.Control onChange={this.changeNewTasksNumber.bind(this)} type="number" placeholder="추가할 작업 수" />
            </Col>
            <Col>
            <Button onClick={this.addTasks.bind(this)}>작업 추가하기</Button>
            </Col>
          </Row>
          <Row>
            {this.state.freelancers.map((freelancer, i)=>{
              return <Col xs={2} key={i} className={freelancer['State']}>
                <div style={{textAlign: "center"}}>
                  <Image src="https://icon-icons.com/icons2/2107/PNG/48/file_type_go_gopher_icon_130571.png"/>
                </div>
                <p>
                  ID: {freelancer['ID']}<br/>
                  Name: {freelancer['Name']}<br/>
                  State: {freelancer['State']}<br/>
                  
                  TasksDone: {freelancer['TasksDone']}<br/>
                  WorkingHour: {freelancer['WorkingHour']}</p>
                  {/* <p>{freelancer['ID']}</p> */}
              </Col>
            })}  
          </Row>
        </Container>
        
      </div>
    )
  }
}

// function App(props) {
//   const test = ()=>{
//     console.log("hello,world")
//   }
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo"/>
//         <button onClick={test}>aaa</button>
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

export default App;
