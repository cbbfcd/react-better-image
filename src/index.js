import React, { Component } from 'react'
import uuid from 'uuid/v4'

class BetterImage extends Component {

  constructor(props){
    super(props)
    this.state = {
      id: uuid()
    }
  }

  componentDidMount() {
    
  }

  render(){
    const { id } = this.state
    return (
      <div
        ref={ currRef => this.imgContainer = currRef }
        data-id={ id }
      >

      </div>
    )
  }
}

export default BetterImage
