import React from 'react'
import { Navbar, Nav, Button, Form, Container} from 'react-bootstrap'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'


class NavBar extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            username: '',
            err: false
        }

        this.handlePseudo = this.handlePseudo.bind(this)
        this.handleSumbit = this.handleSumbit.bind(this)
        this.handleLogOut = this.handleLogOut.bind(this)
    }

    handlePseudo = (e) => {
        this.setState({
            username: e.target.value,
            err: false        
        })
    }

    handleLogOut = (e) => {
        localStorage.clear();
        // Redirect to home
        return this.props.history.push('/')
    }

    handleSumbit = async (e) => {
        e.preventDefault()


        // Try to get tokens
        const res = await fetch('http://localhost:5000/api/auth/login', {
            method : 'POST',
            headers : {
              'Content-Type' : 'application/json',
            },
            body : JSON.stringify({name: this.state.username})
        })

        if(!res.ok){
            return this.setState({
                err: true
            })
        } 

        const data = await res.json()
        try {
            // Add username
            localStorage.setItem(
                'current_user',
                this.state.username
            );

            // Add access_token
            localStorage.setItem(
                'access_token',
                data.access_token
            );
        } catch (error) {
            this.setState({
                err: true
            })
        }
        
        this.setState({
            username: '',
            err: false
        })

        // Redirect to board
        return this.props.history.push('/board')
    }

    render(){
        const isAuthenticated = localStorage.getItem('access_token')

        return isAuthenticated ? (
            <Container>
                <Navbar bg="light" variant="light" className="mb-1 justify-content-between">
                    <Navbar.Brand as={Link} to="/">Accueil</Navbar.Brand>
                    <Nav className="mr-auto">
                        <Nav.Link as={Link} to="/board">Tableau</Nav.Link>
                    </Nav>

                    <Nav className="mr-3">{localStorage.getItem('current_user')}</Nav>
                    <Button variant="primary" onClick={this.handleLogOut}>Déconnexion</Button>
                </Navbar>
            </Container>
        ) : (
            <Container>
                <Navbar bg="light" variant="light" className="mb-1 justify-content-between">
                    <Navbar.Brand as={Link} to="/">Accueil</Navbar.Brand>
    
                    
                    <Form inline onSubmit={this.handleSumbit}>
                        <Form.Control required className="mr-sm-2" 
                        type="text"
                        value={this.state.username}
                        onChange={this.handlePseudo}
                        placeholder='Pseudo'/>
                        <Button variant="primary" type="submit">Connexion</Button>
                    </Form> 
                </Navbar>
            </Container>
        )
    }
    
}

export default withRouter(NavBar)
