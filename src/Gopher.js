import "./App.css";
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Form, Image } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import axios from "axios";
import websocketHandler from "./websocketHandler";
const HOST = "localhost";
const PORT = 1323;

const Gopher = () => {
  const [freelancers, setFreelancers] = useState([]);
  const [newFreelancersNumber, setNewFreelancersNumber] = useState(1);
  const [newTasksNumber, setNewTasksNumber] = useState(1);

  const messageHandler = (freelancer, event) => {
    let message = JSON.parse(event.data);
    if (message.Type === "freelancer_state_report") {
      onWorkerStateReportHandler(freelancer, message);
    } else if(message.Type == "freelancer_fire_report"){
      onWorkerRemoveHandler(freelancers, message)
    }
  };

  const onWorkerStateReportHandler = (data, message) => {
    let freelancer = message.Data;
    let freelancers = data;

    let index = freelancers.findIndex((f) => f["ID"] === freelancer["ID"]);
    if (index === -1) {
      freelancers.push(freelancer);
    } else {
      freelancers[index] = freelancer;
    }

    const newFreelancers = []
    for (let f of freelancers){
      newFreelancers.push(f)
    }
    newFreelancers.sort((f) => f["ID"]);

    setFreelancers(newFreelancers);
  };

  const onWorkerRemoveHandler = (freelancers, message) => {
    let freelancer = message.Data
    console.log(freelancer)
    let index = freelancers.findIndex((f)=>f['ID']==freelancer['ID'])
    if(index == -1){
        freelancers.push(freelancer)
    } else{
        freelancers[index] = freelancer
    }

    setFreelancers(freelancers.filter((f)=>f['ID'] != freelancer['ID']))
}

  useEffect(() => {
    (async () => {
      let results = await axios.get(`http://${HOST}:${PORT}/api/freelancers`);
      setFreelancers(results.data.sort((f) => f["ID"]));
    })();
    if (window["WebSocket"]) {
      let conn = new WebSocket(`ws://${HOST}:${PORT}/ws`);
      conn.onclose = function (evt) {
        const item = document.createElement("div");
        item.innerHTML = "<b>Connection closed.</b>";
      };
      conn.onmessage = function (evt) {
        messageHandler(freelancers, evt);
      };
    } else {
      const item = document.createElement("div");
      item.innerHTML = "<b>Your browser does not support WebSockets.</b>";
    }
  }, []);

  const onChangeNewFreelancersNumber = (e) => {
    const newFreelancerNumber = parseInt(e.target.value);
    setNewFreelancersNumber(newFreelancerNumber);
  };

  const onChangeNewTasksNumber = (e) => {
    const newTaskNumber = parseInt(e.target.value);
    setNewTasksNumber(newTaskNumber);
  };

  const addFreelancers = async () => {
    await axios.post(`http://${HOST}:${PORT}/api/freelancers`, {
      Number: newFreelancersNumber,
    });
  };

  const addTasks = async () => {
    await axios.post(`http://${HOST}:${PORT}/api/tasks`, {
      Number: newTasksNumber,
    });
    // console.log(result);
  };

  return (
    <div className="mt-5 mb-5">
      <Container>
        <Row>
          <Col>
            <h1>Freelancer::Go concurrenct worker simulation</h1>
          </Col>
        </Row>
        <Row className="justify-content-md-center">
          <Col sm={6}>
            <Image src="/workers.png" fluid />
          </Col>
        </Row>
        <Row>
          <Col>
            <p>
              이 프로그램은 Go에서의 concurrency pattern 중 하나인 worker pool
              pattern을 직관적으로 이해할 수 있게 도와줍니다.
            </p>
            <p>
              이 프로그램 내에서 우리 귀여운 Gopher들은 Freelancer로 활동합니다.
              일이 있으면 일을 하고 없으면 쉽니다. Freelancer를 더 고용할 수도
              있고, 자를 수도 있습니다. 마찬가지로 작업(Task)를 추가할 수도
              있습니다.
            </p>
          </Col>
        </Row>
      </Container>
      <Container>
        <Row>
          <Col>
            <h2>현재 고용중인 프리랜서 Gopher 목록</h2>
          </Col>
        </Row>
        <Row>
          <Col sm="3">
            <Form.Control
              onChange={onChangeNewFreelancersNumber}
              type="number"
              placeholder="추가할 Gopher 수"
            />
          </Col>
          <Col>
            <Button onClick={addFreelancers}>새로운 Gopher 고용하기</Button>
          </Col>
        </Row>
        <Row>
          <Col sm="3">
            <Form.Control
              onChange={onChangeNewTasksNumber}
              type="number"
              placeholder="추가할 작업 수"
            />
          </Col>
          <Col>
            <Button onClick={addTasks}>작업 추가하기</Button>
          </Col>
        </Row>
        <Row>
          {freelancers.map((freelancer, i) => {
            return (
              <Col xs={2} key={i} className={freelancer["State"]}>
                <div style={{ textAlign: "center" }}>
                  <Image src="https://icon-icons.com/icons2/2107/PNG/48/file_type_go_gopher_icon_130571.png" />
                </div>
                <p>
                  ID: {freelancer["ID"]}
                  <br />
                  Name: {freelancer["Name"]}
                  <br />
                  State: {freelancer["State"]}
                  <br />
                  TasksDone: {freelancer["TasksDone"]}
                  <br />
                  WorkingHour: {freelancer["WorkingHour"]}
                </p>
              </Col>
            );
          })}
        </Row>
      </Container>
    </div>
  );
};

export default Gopher;
