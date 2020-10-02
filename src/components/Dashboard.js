import React, {Fragment} from 'react'
import Part from './Part'
import Chat from './Chat'

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
            <div> 
                <h1> Board Name : {this.state.board.name }</h1>
                <h2> Nb Part : {this.state.board.nb_part }</h2>
                {
                    this.state.parts.map((part) => {
                        return (
                            <Fragment key={part.id}>
                                <Part part={part}/>
                            </Fragment>
                        )
                    })
                }
                <div style={{display: 'inline-block'}}>
                    <Chat boardId={this.state.board.id} getMessage={this.getMessage}/>
                </div>
            </div>
        ) : 
        <div>Loading...</div> 
    }
}

export default Dashboard;
