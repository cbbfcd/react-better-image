import React, { Component } from 'react'
import VPIntersectionObserver from './vp-intersection-observer' 
import uuidv4 from 'uuid/v4'
import styles from './styles.css'
import PropTypes from 'prop-types'
import { isFunction, isString } from './utils'

class BetterImage extends Component {

  constructor(props){
    super(props)
    this.state = {
      id: uuidv4(),
      imageStyle: ``,
      startLoad: false
    }
    this.observedTarget = null
  }

  componentDidMount() {
    const { id } = this.state
    const { enter, leave, onlyEnter, observerOpts } = this.props
    const { target } = this
    
    if(!this.observedTarget) this.observedTarget = new VPIntersectionObserver(observerOpts)

    this.observedTarget.on({
      id,
      target,
      enter: (target) => {
        this.setState({startLoad: true})
        if(enter) enter(target)
        if(onlyEnter) this.observedTarget.off(id)
      },
      leave: (target) => {
        if(leave) leave(target)
      }
    })
  }

  componentWillUnmount(){
    if(this.observedTarget) this.observedTarget.destory()
    if(this.target) this.target = null
    this.observedTarget = null
  }

  imgOnLoad = () => {
    const { onload } = this.props
    this.setState({imageStyle: `${styles.imageFadeIn}`})
    if(onload) onload()
  }

  renderImage = () => {
    const { alt, source } = this.props
    const { imageStyle, startLoad } = this.state
    if(!startLoad) return
    return (
      <img 
        src={ source }
        onLoad={ this.imgOnLoad }
        className={ `${styles.image} ${imageStyle}` }
        alt={ alt }
      />
    )
  }

  renderPlaceholder = () => {
    const { placeholder, alt } = this.props

    if(isString(placeholder)) {
      return (
        <img 
          src={ placeholder }
          alt={ alt }
          className={ styles.placeholder }
        />
      )
    }

    if(placeholder && isFunction(placeholder)){
      return <React.Fragment>{ placeholder() }</React.Fragment>
    }

    return null
  }

  render(){
    const { id } = this.state
    return (
      <div
        ref={ currRef => this.target = currRef }
        data-id={ id }
        className={ styles.wrapper }
      >
        { this.renderPlaceholder() }
        { this.renderImage() }
      </div>
    )
  }
}

BetterImage.propTypes = {
  source: PropTypes.string.isRequired,
  placeholder: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func
  ]),
  alt: PropTypes.string,
  onload: PropTypes.func,
  enter: PropTypes.func,
  leave: PropTypes.func,
  onlyEnter: PropTypes.bool,
  observerOpts: PropTypes.object
}

BetterImage.defaultProps = {
  alt: '',
  onlyEnter: true,
  observerOpts : {
    root: null,
    rootMargin: '-10px 0px',
    threshold: [0.0, 1.0]
  }
}

export default BetterImage
