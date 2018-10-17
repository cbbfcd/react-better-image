import React, { Component } from 'react'
import VPIntersectionObserver from './vp-intersection-observer' 
import uuidv4 from 'uuid/v4'
import styles from './styles.css'
import PropTypes from 'prop-types'
import { isFunction } from './utils'

class BetterImage extends Component {

  constructor(props){
    super(props)
    this.state = {
      id: uuidv4(),
      imageStyle: ``,
      startLoad: false
    }
    this.oberserver = null
  }

  componentDidMount() {
    const { id } = this.state
    const { enter, leave, onlyEnter, root, rootMargin } = this.props
    const { target } = this
    
    if(!this.oberserver) this.oberserver = new VPIntersectionObserver(root, rootMargin)

    this.oberserver.on({
      id,
      target,
      enter: (target) => {
        this.setState({startLoad: true})
        if(enter) enter(target)
        if(onlyEnter) this.oberserver.off(id)
      },
      leave: (target) => {
        if(leave) leave(target)
      }
    })
  }

  componentWillUnmount(){
    if(this.oberserver) this.oberserver.destory()
    if(this.target) this.target = null
    this.oberserver = null
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

    if(placeholder && isFunction(placeholder)){
      return <React.Fragment>{ placeholder() }</React.Fragment>
    }

    if(placeholder && React.isValidElement(placeholder)){
      return <React.Fragment>{ placeholder }</React.Fragment>
    }

    return (
      <img 
        src={ placeholder }
        alt={ alt }
        className={ styles.placeholder }
      />
    )
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
    PropTypes.func,
    PropTypes.element
  ]).isRequired,
  alt: PropTypes.string,
  onload: PropTypes.func,
  enter: PropTypes.func,
  leave: PropTypes.func,
  onlyEnter: PropTypes.bool,
  root: PropTypes.node,
  rootMargin: PropTypes.string
}

BetterImage.defaultProps = {
  alt: '',
  onlyEnter: true
}

export default BetterImage
