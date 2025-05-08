import React from 'react'
import {Link} from "react-router"

function Student({name, media, studentId}) {
  return (
    <div>{name} - { media} <Link to={`/notas/${studentId}`}>Adicionar nota</Link> <Link to={`/boletim/${studentId}`} >Ver Boletim</Link></div>
  )
}

export default Student