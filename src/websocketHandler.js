function messageHandler(self, event) {
    let message = JSON.parse(event.data)
    // event.data에는 서버에서 전송한 JSON string이 들어있다.
    // 이는 Type: string, Data: JSON object or array이다.
    // Type에 따른 핸들러를 실행.
    if(message.Type == "freelancer_state_report"){
        onWorkerStateReportHandler(self, message)
    } if(message.Type == "freelancer_fire_report"){
        onWorkerRemoveHandler(self, message)
    }
}

function onWorkerStateReportHandler(self, message){
    let freelancer = message.Data
    console.log(freelancer)
    let freelancers = self.state['freelancers']
    let index = freelancers.findIndex((f)=>f['ID']==freelancer['ID'])
    if(index == -1){
        freelancers.push(freelancer)
    } else{
        freelancers[index] = freelancer
    }
    self.setState(state=>{return {
        ...state, freelancers:  freelancers.sort((f)=>f['ID'])}
    })
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
    'messageHandler': messageHandler,
}