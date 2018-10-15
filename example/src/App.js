import React, { Component } from 'react'
import { data } from './data'
import BetterImage from 'react-better-image'

export default class App extends Component {

  render () {

    return (
      <div className='example-wrapper'>
        {
          data.map(item => (
            <div className="example-item" key={item.alt}>
              <BetterImage 
                source={item.source}
                placeholder={item.placeholder}
                alt={item.alt}
                enter={() => console.log(`${item.alt}: then enter func is default be called, and you can cancel observed use off(id)`)}
                onload={() => console.log(`${item.alt}: onload event func (hava a observed dom element as arguments)`)}
                leave={() => console.log(`${item.alt}: if onlyEnter false, will print this message!`)}
              />
            </div>
          ))
        }
      </div>
    )
  }
}
