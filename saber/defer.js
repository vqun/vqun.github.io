(function(Context, undefined){
  function resolve(value) {
    var promise = null;
    if(value instanceof Promise) {
      promise = value
    }else if(typeof value === "object" && value.then) {
      promise = new Promise(value.then)
    }else {
      promise = fulfiled(value)
    }
    return promise
  }
  function fulfiled(value) {
    return new Promise(function(onFulfiled, onRejected) {
      try{
        resolve(typeof onFulfiled === "function" ? onFulfiled(value) : value)
        return this
      }catch(e){
        reject(e)
        return this
      }
    })
  }
  function rejected(reason) {
    return new Promise(function(onFulfiled, onRejected){
      try{
        reject(typeof onRejected === "function" ? onRejected(reason) : reason)
        return this
      }catch(e){
        rejected(e)
        return this
      }
    })
  }
  function reject(reason) {
    resolve(reason)
  }
  function Promise(then){
    this.then = then
  }
  function defer(){
    var promise = new Promise(then)
    var handlers = [];
    var deferred = {
      promise: promise,
      resolve: _resolve,
      reject: _reject,
      then: then
    }
    return deferred
    function then(onFulfiled, onRejected){
      var deferred = defer()
      handlers.push(function(promise) {
        promise.then(onFulfiled, onRejected)
        .then(deferred.resolve, deferred.reject)
      })
      return deferred
    }
    function _resolve(value){
      return promiseHandler(resolve(value))
    }
    function promiseHandler(promise) {
      for(var k = 0; k < handlers.length; k++) {
        handlers[k](promise)
      }
      return promise
    }
    function _reject(reason){
      return promiseHandler(reject(reason))
    }
  }
  Context.defer = defer;
})(Saber)