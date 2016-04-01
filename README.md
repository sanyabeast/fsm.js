# JSSM
JavaScript finite state-machine.

## What is it and what is it needed for
https://en.wikipedia.org/wiki/Finite-state_machine

## How to use 

1. Add JSSM as a dependency to your something:

```
/*AMD-style example*/
define(['*path_to*/JSSM'], function(JSSM){
  ...
})
```

2. Create new finite state-machine using JSSM-constructor, passing object that describes state-machine as an argument:

```
/*Adding state-machine to abstract Turnstail constructor*/

define(['*path_to*/JSSM'], function(JSSM){
    var Turnstile = function(){
    
      this.fsm = new JSSM({
        /*array of all possible transitions
        contains of name of event that trigger transition,
        one states or few states, when transition is possible and
        a name of state, that machine shifts to if transition has been completed
        */
        transitions : [
          /*Optional. Automatically invoking initialize-event from 'none-state'.
          It cannot be retriggered.*/
          { name : 'init'      , from : 'none'    , to : 'locked'  },
          { name : 'insertCoin', from : 'locked'  , to : 'unlocked'},
          { name : 'push'      , from : 'unlocked', to : 'locked'  }
        ],
        /*If needed. Actions that must be done to finish transition.*/
        actions : {
          init : init,
          insertCoin : insertCoin,
          push : push
        },
        /*Optional*/
        context : this
      });
    };
    
    function init(){}
    function inserCoin(){}
    function push()
    
});
...
```

## Settings
```
...
      this.fsm = new JSSM({
        /*Optional. You can add 'setting' named object as property.
        Here is default settings:
        */
        settings : {
          log    : true,  /*Allow console logging during work*/
          strict : false  /*Do not throw error if transition is not possible*/
        },
        transitions : [
          { name : 'init'      , from : 'none'    , to : 'locked'  },
          { name : 'insertCoin', from : 'locked'  , to : 'unlocked'},
...   
```
## Management
Object that contains transition info always passed as first argument to your callback:

```
this.fsm = new JSSM({
  events : ...
  actions : {
    ...
    push : push,
    ...
  }
});

...
function push(/*obj*/info, /*coin*/coin){
  console.log(info, coin);
}
...
...

turnstile.fsm.push(50);
//Object {name: "push", from: "unlocked", to: "locked"}, 50

```
Other things:
```
var turnstile = new Turnstile;

/*Triggering events example*/
turnstile.fsm.insetCoin();
turnstile.fsm.push();

/*Get current state name*/
turnstile.fsm.current(); /*or*/ turnstile.fsm._current;

/*Get prev. state name*/
turnstile.fsm._previous;

/*Check possibility*/
turnstile.fsm.current();
//'locked'
turnstile.fsm.can('push');
//false
turnstile.fsm.cannot('insetCoin');
//false
```
