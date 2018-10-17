import { isFunction } from './utils'

if(!supportsIntersectionObserver()){
  require('intersection-observer')
}

// or add some babel plugins use promise & dynamic-import 👇
// const loadPolyfills = () => {
//   const polyfills = []
//   if(!supportsIntersectionObserver()) polyfills.push(import('intersection-observer')) 
//   return new Promise.all(polyfills)
// }

// loadPolyfills.then(/*...*//)

function supportsIntersectionObserver(){
  let w = window
  return (
    typeof w !== 'undefined' &&
    'IntersectionObserver' in w &&
    'IntersectionObserverEntry' in w &&
    'isIntersecting' in w.IntersectionObserverEntry.prototype &&
    'intersectionRatio' in w.IntersectionObserverEntry.prototype
  )
}

class VPIntersectionObserver {
  
  constructor(root = null, rootMargin = '-10px 0px'){
    const opts = {
      root,
      rootMargin,
      threshold: [ 0, Number.MIN_VALUE, 0.01 ]
    }

    if(!this.observer){
      this.observer = new IntersectionObserver(this.handleEntries, opts)
    }

    this.intersected = false
    this.observers = []
  }

  handleEntries = (entries, observer) => {
    entries.forEach(entry => {
      const { isIntersecting, intersectionRatio, target } = entry

      // support IE 10 and under, dataset only works well for IE11
      const observedId = target.getAttribute('data-id')

      const isIntersected = isIntersecting || intersectionRatio > 0
      
      // enter
      if(!this.intersected && isIntersected) {
        this.intersected = true
        this.emitEnter(observedId)
      }

      // leave
      if(this.intersected && !isIntersected){
        this.intersected = false
        this.emitLeave(observedId)
      }
    })
  }

  emitEnter = id => {
    this.observers.forEach(observer => {
      if(observer.id === id) {
        observer.enter()
      }
    })
  }

  emitLeave = id => {
    this.observers.forEach(observer => {
      if(observer.id === id) {
        observer.leave()
      }
    })
    this.off(id)
  }

  on = (observer = {}) => {
    const { id, enter=() => {}, leave=() => {}, target } = observer
    if(!id || !target) return
    if(!isFunction(enter) || !isFunction(leave)) throw new TypeError('the enter or leave callbacks must be a function!')

    if(!!~this.observers.findIndex(observer => observer.id === id)) return

    this.observer.observe(target)
    this.observers.push(observer)
  }

  off = id => {

    // unobserve all target in queue
    if(!id){
      this.observers.forEach(({ target }) => {
        this.observer.unobserve(target)
      })
      this.observers = []
    }

    const idx = this.observers.findIndex(observer => observer.id === id)
    if(idx < 0) return

    const { target } = this.observers.splice(idx, 1)
    if(!target) return
    
    this.observer.unobserve(target)

    return this.observers
  }

  getCurrObserver = () => this.observer

  destory = () => {
    if(this.observer) this.observer.disconnect()
    this.observer = null
    this.observers = []
  }
}

export default VPIntersectionObserver