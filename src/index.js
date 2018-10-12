import React, { Component } from 'react'
import VPIntersectionObserver from './vp-intersection-observer' 
import uuidv4 from 'uuid/v4'
import styles from './styles.css'
import PropTypes from 'prop-types'

class BetterImage extends Component {

  constructor(props){
    super(props)
    this.state = {
      id: uuidv4(),
      placeholderStyle: { backgroundImage: `url(${props.placeholder})` },
      imageStyle: ``,
      startLoad: false
    }
    this.observedTarget = null
  }

  componentDidMount() {
    const { id } = this.state
    const { enter, leave, onlyEnter } = this.props
    const { target } = this
    
    if(!this.observedTarget) this.observedTarget = new VPIntersectionObserver()

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

  render(){
    const { id, placeholderStyle } = this.state
    return (
      <div
        ref={ currRef => this.target = currRef }
        data-id={ id }
        className={ styles.wrapper }
        style={ placeholderStyle }
      >
        { this.renderImage() }
      </div>
    )
  }
}

BetterImage.propTypes = {
  source: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  onload: PropTypes.func,
  enter: PropTypes.func,
  leave: PropTypes.func,
  onlyEnter: PropTypes.bool
}

BetterImage.defaultProps = {
  alt: '',
  onlyEnter: true
}

export default BetterImage
