import React from 'react'
import { Button, Form, Container, Alert, Col, Row } from 'react-bootstrap'

class Board extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            board_name: '',
            nb_part: '',
            parts: [],
            errors : {},
            loadBoard: ''
        }
    }

    handleBoardId = (e) => {
        const loadBoard = e.target.value

        this.setState({
            loadBoard: loadBoard
        })
    }

    handleBoardName = (e) => {
        const board_name = e.target.value
        let errors = this.state.errors

        if(board_name){
            errors["board"] = ''
        } else {
            errors["board"] = "Ce champ ne peut être vide."
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
            errors["nb_part"] = "Nombre incorrect."
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
            errors["part_name"] = "Ce champ ne peut être vide."
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
            errors["acronym"] = "Ce champ ne peut être vide."
        }

        parts[index]["acronym"] = acronym
        parts[index]["errors"] = errors


        this.setState({
            parts: parts
        })
    }

    handleLoadSumbit = (e) => {
        e.preventDefault()

        return this.props.history.push('/board/'+this.state.loadBoard)
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
        return this.props.history.push('/board/'+board.id)
        
    }


    render() {
        return (
            <Container>
                <Row>
                    <Col sm='6'>
                    <h1>Création d'un Tableau</h1>
                    <Form onSubmit={this.handleSumbit}>
                        <Form.Group controlId="formBoard">
                            {/* Alert when error is trigger */}
                            { this.state.errors["board"] && (
                            <Alert variant='warning'>
                                {this.state.errors["board"]}
                            </Alert>)}
                            <Form.Label>Nom du tableau</Form.Label>
                            <Form.Control type="text" required="required" value={this.state.board_name} onChange={this.handleBoardName} />
                        </Form.Group>
                        <Form.Group controlId="formNbPart">
                            {/* Alert when error is trigger */}
                            { this.state.errors["nb_part"] && (
                            <Alert variant='warning'>
                                {this.state.errors["nb_part"]}
                            </Alert>)}
                            <Form.Label>Nombre de colonne(s) (max 10)</Form.Label>
                            <Form.Control type="number" required="required" max="10" value={this.state.nb_part} onChange={this.handleNbPart} />
                            </Form.Group>

                        {
                            this.state.parts.map(({name, acronym, errors}, index) => {
                                return(
                                    <Form.Group controlId={"formPart"+index} key={index}>
                                        { errors["part_name"] && (
                                        <Alert variant='warning' className="mb-0">
                                            {errors["part_name"]}
                                        </Alert>)}
                                        <Form.Label>Colonne {index + 1}</Form.Label>
                                        <Form.Control type="text" required="required" value={name} onChange={(e) => this.handlePartName(index, e)}/>

                                        { errors["acronym"] && (
                                        <Alert variant='warning' className="mt-2 mb-0">
                                            {errors["acronym"]}
                                        </Alert>)}
                                        <Form.Label>Acronyme</Form.Label>
                                        <Form.Control type="text" required="required" value={acronym} onChange={(e) => this.handlePartAcronym(index, e)}/>
                                    </Form.Group>
                                )
                            })
                        }     
                        
                        <Button variant="primary" type="submit">Valider</Button>
                    </Form> 
                    </Col>

                    <Col>
                    <h1>Chargement d'un Tableau</h1>
                    { this.props.location.state && (
                        <Alert variant='warning'>
                            Identifiant de tableau inconnu.
                        </Alert>
                    )}    
                    <Form onSubmit={this.handleLoadSumbit}>
                        <Form.Group controlId="formLoadBoard">
                            <Form.Label>Identifiant</Form.Label>
                            <Form.Control type="text" required="required" value={this.state.loadBoard} onChange={this.handleBoardId}/>
                        </Form.Group>
                        <Button variant="primary" type="submit">Valider</Button>
                    </Form>
                    </Col>
                </Row>
            </Container> 
        )
    }
    
}

export default Board
