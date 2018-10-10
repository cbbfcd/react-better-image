if(!supportsIntersectionObserver()){
  require('intersection-observer')
}

// or add some babel plugin use promise 👇
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
    'IntersectionObserverEntry' in window
  )
}

class VPIntersectionObserver {
  constructor({root, rootMargin, threshold, ...rest}){
    const opts = {
      root: root || null,
      rootMargin: rootMargin || '50px 0px',
      threshold: threshold || 1.0,
      ...rest
    }

    if(!this.observer){
      this.observer = new IntersectionObserver(this.handleEntries, opts)
    }
    this.observers = []
  }

  handleEntries = (entries, observer) => {
    entries.forEach(entry => {
      const { isIntersecting, intersectionRatio, target } = entry
      
      // support IE 10 and under, dataset only works well for IE11
      const observedId = target.getAttribute('data-id')
      if(isIntersecting || intersectionRatio > 0) this.emit(observedId)
    })
  }

  emit = id => {
    this.observers.forEach(observer => {
      if(observer.id === id) {
        observer.cb()
      }
    })
  }

  on = (observer = {}) => {
    const { id, cb, target } = observer
    if(!id || !cb || !target) return
    if(!this.isFunction(cb)) throw new TypeError('the callback must be a function!')
    this.observer.observe(observer.target)
    this.observers.push(observer)
  }

  off = (id, target) => {
    const idx = this.observers.findIndex(observer => observer.id === id)
    if(idx < 0) return

    this.observers.splice(idx, 1)
    this.observer.unobserve(target)

    return this.observers
  }

  isFunction = fn => Object.prototype.toString.call(fn) === '[object Function]' 

  getCurrObserver = () => this.observer

  destory = () => {
    if(!this.observer) return
    this.observer.disconnect()
    this.observer = null
    this.observers = []
  }

}

export default VPIntersectionObserver