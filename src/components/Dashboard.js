import React from 'react'
import Part from './Part'
import Chat from './Chat'
import { Container, Col, Row } from 'react-bootstrap'

class Dashboard extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            board: null,
            parts: []
        }
    }

    async componentDidMount(){
        const boardId = this.props.match.params.boardId

        const res = await fetch('http://localhost:5000/api/board/'+boardId+'/parts', {
            method : 'GET',
            headers : {
              'Content-Type' : 'application/json',
              'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        })

        // TODO
        if(!res.ok){
            return this.props.history.push(
                '/board',
                { errorDashboard: true }
            )
            
        } 

        // Gather Board data
        const data = await res.json()

        const board = {
            'id': data.id,
            'name': data.name,
            'nb_part': data.nb_part}

        return this.setState({
            board: board,
            parts: data.parts
        })

    }

    getMessage = (msg, acronym) => {
        let messages;

        if(acronym){      
        
            for(let i = 0; i<this.state.board.nb_part; i++){
                if(this.state.parts[i].tag === acronym){
                    messages = this.state.parts[i].msgs
                    messages.push(msg)
                    break
                }
            }

            // Magie ?
            this.setState({
                messages
            })
        }
    }

    render() {
        
        return this.state.board ? (
            <Container fluid>                
                <Row>
                    <Col>
                        <h1> Tableau : {this.state.board.name }</h1>

                        <h2> Identifiant : {this.state.board.id }</h2>
                    </Col>
                </Row>
                
                <Row>
                    <Col sm='10'>
                        <Row>
                        {
                            this.state.parts.map((part) => {
                                return (
                                    <Col key={part.id} sm={12 / this.state.board.nb_part}>
                                        <Part part={part}/>
                                    </Col>
                                )
                            })
                        }
                        </Row>
                    </Col>
                    <Col sm='2'>
                        <Chat boardId={this.state.board.id} getMessage={this.getMessage}/>
                    </Col>
                </Row>
            </Container>
        ) : 
        <Container>Loading...</Container> 
    }
}

export default Dashboard;
