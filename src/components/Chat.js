import React, { Component } from 'react'
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:5000";

class Chat extends Component {

    constructor(props){
        super(props);

        this.state = {
            socket: null,
            msgSend: '',
            messages: [],
            loadClient: false
        }
    }

    handleSend = (event) => {
        this.state.socket.emit('my_event', 
        {'content' : this.state.msgSend,
         'access_token' : localStorage.getItem('access_token'),
         'board_id' : this.props.boardId});

        this.setState({
            msgSend: ''
        })
    }

    handleMsgSend = (event) => {
        const msgSend = event.target.value
        this.setState({
            msgSend: msgSend
        })
    }

    addResponse = (response) => {
        const messages = this.state.messages
        const msg = JSON.parse(response)
        const content = msg['content']
        const acronym = msg['tag']
        // const date = new Date(msg['date'])
        // const hour = date.getHours()
        // const minute = date.getMinutes()
        // const second = date.getSeconds()

        messages.push(content)

        this.setState({
            messages: messages
        })

        this.props.getMessage(content, acronym)

    }

    componentDidMount(){
        const socket = socketIOClient(ENDPOINT);
        let loadClient;

        socket.on('connect', () => {
            loadClient = true

            this.setState({
                socket: socket,
                loadClient: loadClient
            })
        });      
        
        socket.on('my_event', (response) => {
            this.addResponse(response)             
        });
    }


    render() {

        const connexion = this.state.loadClient && (<h3>Welcome to the Chat</h3>)

        return this.state.loadClient ? (
            <div>
                { connexion }

                {
                    this.state.messages.map((msg, index) => {
                        return(
                            <p key={index}>{localStorage.getItem('current_user')} : {msg}</p>
                        )
                    })
                }
                <input type="text" value={this.state.msgSend} onChange={this.handleMsgSend}/>
                <button onClick={this.handleSend}>Send</button>
            </div>
        ) :
        <div>Loading...</div> 
    }
}

export default Chat;