import React from 'react'
import {Link} from "react-router"

function Student({name, media, studentId}) {
  return (
    <div>{name} - { media} <Link to={`/notas/${studentId}`}>Adicionar nota</Link> - <Link to={`/notas/editar/${studentId}`} >Editar notas</Link></div>
  )
}

export default Student