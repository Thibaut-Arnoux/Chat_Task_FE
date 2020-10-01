import React from 'react'

class Auth extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            username: '',
            err: false
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

        // Redirect to board
        this.props.history.push('/board')
    }
    
    render() {

        let error_banner;
        if(this.state.err){
            error_banner = <div>Error in pseudo.</div>
        }

        return(
            <div>
                {error_banner}
                <form onSubmit={this.handleSumbit}>
                    <label>Pseudo</label>
                    <input type="text" value={this.state.username} onChange={this.handlePseudo} />
                    <button>Valider</button>
                </form>                
            </div>
        )    
    }
}

export default Auth
