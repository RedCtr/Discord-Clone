import React from 'react'

type ServerType = {
    params: {
        serverId: string
    },
}
const ServerPage = ({params}:ServerType) => {
  return (
    <div>{params.serverId}</div>
  )
}

export default ServerPage