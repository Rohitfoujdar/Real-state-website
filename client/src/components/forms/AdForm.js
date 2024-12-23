import React from 'react'

export default function AdForm({action, type}) {
  return (
    <div>
      <p>This is a create ad form</p>
      {action}/{type}
    </div>
  )
}
