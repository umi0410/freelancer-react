function messageHandler(freelancer, event, action) {
  let message = JSON.parse(event.data);
  // event.data에는 서버에서 전송한 JSON string이 들어있다.
  // 이는 Type: string, Data: JSON object or array이다.
  // Type에 따른 핸들러를 실행.
  if (message.Type === "freelancer_state_report") {
    onWorkerStateReportHandler(freelancer, message, action);
  }
}

function onWorkerStateReportHandler(data, message, action) {
  let freelancer = message.Data;

  let freelancers = data;

  let index = freelancers.findIndex((f) => f["ID"] === freelancer["ID"]);
  if (index === -1) {
    freelancers.push(freelancer);
  } else {
    freelancers[index] = freelancer;
  }

  const newFreelancer = freelancers.sort((f) => f["ID"]);

  return newFreelancer;
  //   console.log("new freelancer", newFreelancer);
  //   return newFreelancer;
  //   freelancers = freelancers.sort((f) => f["ID"]);

  //   return freelancers;

  //   action(freelancers);

  // self.setState(state=>{return {
  //     ...state, freelancers:  freelancers.sort((f)=>f['ID'])}
  // })
  //   setFreelancer(freelancers.sort((f) => f["ID"]));
}

function onWorkerRemoveHandler(self, message){
    let freelancer = message.Data
    console.log(freelancer)
    let freelancers = self.state['freelancers']
    let index = freelancers.findIndex((f)=>f['ID']==freelancer['ID'])
    if(index == -1){
        freelancers.push(freelancer)
    } else{
        freelancers[index] = freelancer
    }
    self.setState(state=>{
        return {
            ...state, freelancers:  freelancers.filter((f)=>f['ID'] != freelancer['ID'])}
    })
}

export default {
  messageHandler: messageHandler,
};
