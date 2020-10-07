import React, { Component } from 'react'
import { Form, Button } from 'react-bootstrap'
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
        event.preventDefault()
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
        const user = msg['user']
        const content = msg['content']
        const acronym = msg['tag']
        // const date = new Date(msg['date'])
        // const hour = date.getHours()
        // const minute = date.getMinutes()
        // const second = date.getSeconds()

        messages.push({user: user, content: content})

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

            socket.emit('join', 
                {'access_token' : localStorage.getItem('access_token'),
                'board_id' : this.props.boardId
            });

            this.setState({
                socket: socket,
                loadClient: loadClient
            })
        });      
        
        socket.on('my_event', (response) => {
            this.addResponse(response)             
        });
    }

    componentWillUnmount(){
        this.state.socket.emit('leave', 
        {'access_token' : localStorage.getItem('access_token'),
         'board_id' : this.props.boardId
        });

         this.state.socket.disconnect()
    }

    render() {

        return this.state.loadClient ? (
            <div className="sticky-top">
                <h3>Chat</h3>
                <div className="overflow-auto mb-1" style={{height: "650px", border: "solid 1px"}}>
                    {
                        this.state.messages.map((msg, index) => {
                            return(
                                <p key={index}>{msg.user} : {msg.content}</p>
                            )
                        })
                    }
                </div>
                <Form onSubmit={this.handleSend}>
                    <Form.Control type="text" value={this.state.msgSend} onChange={this.handleMsgSend} placeholder='Envoyer un message'/>
                    <Button className="mt-1 float-right" variant="primary" type="submit">Envoyer</Button>
                </Form>
            </div>
        ) :
        <div>Loading...</div> 
    }
}

export default Chat;