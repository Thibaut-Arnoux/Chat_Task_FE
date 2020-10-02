import React, { Component } from 'react'
import { Redirect, Route } from 'react-router-dom'

class ProtectedRoute extends Component {
    render() {
        const Component = this.props.component;
        const path = this.props.path
        const isAuthenticated = localStorage.getItem('access_token')

        return isAuthenticated ? (
            <Route exact path={path} component={Component} />
        ) : 
        (
            <Redirect to='/' />
        );
    }
}

export default ProtectedRoute;
