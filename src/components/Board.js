import React from 'react'

class Board extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            board_name: '',
            nb_part: '',
            parts: [],
            errors : {}
        }
    }

    handleBoardName = (e) => {
        const board_name = e.target.value
        let errors = this.state.errors

        if(board_name){
            errors["board"] = ''
        } else {
            errors["board"] = "This field cannot be empty."
        }

        this.setState({
            board_name: board_name,
            errors: errors
        })
    }

    handleNbPart = (e) => {
        const nb_part = e.target.value
        let errors = this.state.errors
        let parts = []

        if(nb_part < 0 || nb_part > 10){            
            errors["nb_part"] = "Invalid number of parts."
        } else {            
            errors["nb_part"] = ''

            for(let i=0; i < nb_part; i++){
                parts.push({
                    'name': '',
                    'acronym': '',
                    'errors': {}
                })
            }
        }

        this.setState({
            nb_part: nb_part,
            parts: parts,
            errors: errors
        })
        
    }

    handlePartName = (index, e) => {
        const name = e.target.value
        let parts = this.state.parts;
        let errors = parts[index]["errors"]


        if(name){
            errors["part_name"] = ''
        } else {
            errors["part_name"] = "Part cannot be empty."
        }

        parts[index]["name"] = name
        parts[index]["errors"] = errors

        this.setState({
            parts: parts
        })
    }

    handlePartAcronym = (index, e) => {
        const acronym = e.target.value
        let parts = this.state.parts;
        let errors = parts[index]["errors"]

        if(acronym){
            errors["acronym"] = ''
        } else {
            errors["acronym"] = "Acronym cannot be empty."
        }

        parts[index]["acronym"] = acronym
        parts[index]["errors"] = errors


        this.setState({
            parts: parts
        })
    }

    handleSumbit = async (e) => {
        e.preventDefault()

        // Add Board in database        
        const res = await fetch('http://localhost:5000/api/board', {
            method : 'POST',
            headers : {
              'Content-Type' : 'application/json',
              'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            },
            body : JSON.stringify({
                name: this.state.board_name,
                nb_part: this.state.nb_part
            })
        })

        if(!res.ok){
            return this.setState({
                err: true
            })
            
        } 

        // Gather Id of Board
        const board = await res.json()

        // Add each Part of current Board in database
        // await all fetch before redirect to next step
        await Promise.all(this.state.parts.map( async ({name, acronym}, index) => {
            const res = await fetch('http://localhost:5000/api/part', {
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                },
                body : JSON.stringify({
                    name: name,
                    tag: acronym,
                    board_id: board.id
                })
            })

            if(!res.ok){
                return this.setState({
                    err: true
                })
            }
            
            return res
        }))
        return this.props.history.push('/dashboard/'+board.id)
        
    }


    render() {
        const errorDashboard = this.props.location.state && <span>Error unknow Board Identifier</span>
        const errors = this.state.errors
        let errorNbPart, errorBoard;
        if(errors["nb_part"]){
            errorNbPart = (
            <div>
                <span style={{color: "red"}}>{this.state.errors["nb_part"]}</span>
                <br/>
            </div>)
        }

        if(errors["board"]){
            errorBoard = (
                <div>
                    <span style={{color: "red"}}>{this.state.errors["board"]}</span>
                    <br/>
                </div>)
        }


        return (
            <div>
            { errorDashboard }            

            <form onSubmit={this.handleSumbit}>
                <div>
                    { errorBoard }
                    <label>Board</label>
                    <input type="text" required="required" value={this.state.board_name} onChange={this.handleBoardName} />
                </div>
                <div>
                    { errorNbPart }
                    <label>Number Part (max 10)</label>
                    <input type="number" required="required" max="10" value={this.state.nb_part} onChange={this.handleNbPart} />
                </div>

                {
                    this.state.parts.map(({name, acronym, errors}, index) => {
                        return(
                            <div key={index}>
                                <div>
                                    <span style={{color: "red"}}>{errors["part_name"]}</span><br/>
                                    <label>Part {index + 1} </label>
                                    <input type="text" required="required" value={name} onChange={(e) => this.handlePartName(index, e)}/>
                                </div>

                                <div>
                                    <span style={{color: "red"}}>{errors["acronym"]}</span><br/>
                                    <label>Acronym </label>
                                    <input type="text" required="required" value={acronym} onChange={(e) => this.handlePartAcronym(index, e)}/>
                                </div>
                            </div>
                        )
                    })
                }           
                
                <button>Valider</button>
            </form> 
            </div> 
        )
    }
    
}

export default Board
