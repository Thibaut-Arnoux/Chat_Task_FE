import React from 'react'
import { Button, Form, Container, Alert, Row, Col } from 'react-bootstrap'

class Auth extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            username: '',
            err: false,
            success: false
        }
    }
    


    handlePseudo = (e) => {
        this.setState({
            username: e.target.value,
            err: false        
        })
    }

    handleSumbit = async (e) => {
        e.preventDefault()

        // Try to get tokens
        const res = await fetch('http://localhost:5000/api/auth/signup', {
            method : 'POST',
            headers : {
              'Content-Type' : 'application/json',
            },
            body : JSON.stringify({name: this.state.username})
        })

        if(!res.ok){
            console.log(res)
            return this.setState({
                username: '',
                err: true
            })
        } 

        // const data = await res.json()
        return this.setState({
            username: '',
            success: true
        })
    }
    
    render() {

        return(
            <Container fluid>
                <Row>
                    <Col sm='8'></Col>
                    <Col sm='4'>
                        <h1>Création Utilisateur</h1>
                        { this.state.err && (
                        <Alert variant='danger'>
                            Utilisateur déjà existant !
                        </Alert>)}

                        { this.state.success && (
                        <Alert variant='success'>
                            Utilisateur crée !
                        </Alert>)}


                        <Form onSubmit={this.handleSumbit}>
                            <Form.Group controlId="formPseudo">
                                <Form.Label>Pseudo</Form.Label>
                                <Form.Control required type="text" value={this.state.username} onChange={this.handlePseudo} placeholder='Pseudo'/>
                            </Form.Group>
                            <Button variant="primary" type="submit">Valider</Button>
                        </Form>
                    </Col>
                </Row>            
            </Container>
        )    
    }
}

export default Auth
