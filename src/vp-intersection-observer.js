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
  return (
    typeof window !== 'undefined' &&
    'IntersectionObserver' in window &&
    'IntersectionObserverEntry' in window &&
    'isIntersecting' in window.IntersectionObserverEntry.prototype &&
    'intersectionRatio' in window.IntersectionObserverEntry.prototype
  )
}

class VPIntersectionObserver {
  
  constructor({root = null, rootMargin = '-10px 0px', threshold = 1.0, ...rest}){
    const opts = {
      root: root,
      rootMargin: rootMargin,
      threshold: threshold,
      ...rest
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
        this.emitEnter(observedId, target)
        this.intersected = true
      }

      // leave
      if(this.intersected && !isIntersected){
        this.emitLeave(observedId, target)
        this.intersected = false
      }
    })
  }

  emitEnter = (id, target) => {
    this.observers.forEach(observer => {
      if(observer.id === id) {
        observer.enter(target)
      }
    })
  }

  emitLeave = (id, target) => {
    this.observers.forEach(observer => {
      if(observer.id === id) {
        observer.leave(target)
      }
    })
    this.off(id)
  }

  on = (observer = {}) => {
    const { id, enter=() => {}, leave=() => {}, target } = observer
    if(!id || !target) return
    if(!this.isFunction(enter) || !this.isFunction(leave)) throw new TypeError('the enter or leave callbacks must be a function!')

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

  isFunction = fn => Object.prototype.toString.call(fn) === '[object Function]' 

  getCurrObserver = () => this.observer

  destory = () => {
    if(this.observer) this.observer.disconnect()
    this.observer = null
    this.observers = []
  }
}

export default VPIntersectionObserver