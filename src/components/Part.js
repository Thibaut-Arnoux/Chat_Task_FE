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
                        part.msgs.map((msg) => {
                            return(
                                <tr key={msg.id}>
                                    <td>{msg.content} </td>
                                </tr>
                            ) 
                        })
                    }                                       
                </tbody>
            </table>
    );
}

export default Part;