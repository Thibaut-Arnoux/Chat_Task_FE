import React from 'react'

function Part({part}){
    return(
            <table style={{float: 'left'}}>
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
            </table>
    );
}

export default Part;