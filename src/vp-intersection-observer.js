class VPIntersectionObserver {
  constructor({root, rootMargin, threshold, ...rest}){
    const opts = {
      root: root || null,
      rootMargin: rootMargin || '50px 0px',
      threshold: threshold || 1.0,
      ...rest
    }

  }

  supportsIntersectionObserver = () => 'IntersectionObserver' in window || 'IntersectionObserver' in global

  
}

export default VPIntersectionObserver