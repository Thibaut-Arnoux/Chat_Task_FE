import React from 'react'
import { Table } from 'react-bootstrap'

// <table style={{float: 'left'}}>

function Part({part}){
    return(
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th> {part.name} {part.tag} </th>
                </tr>
            </thead>
            <tbody>                                    
                {
                    part.msgs.map((msg, index) => {
                        return(
                            <tr key={index}>
                                <td>{msg} </td>
                            </tr>
                        ) 
                    })
                }                                       
            </tbody>
        </Table>
    );
}

export default Part;