# JSSM

A lightweight JavaScript finite state machine library.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Overview

JSSM is a simple yet powerful finite state machine implementation for JavaScript. It allows you to define states, transitions between them, and actions to execute during transitions.

## Installation

### Direct include
```html
<script src="path/to/jssm.min.js"></script>
```

### AMD
```javascript
define(['path/to/JSSM'], function(JSSM) {
  // Your code here
});
```

## Basic Usage

```javascript
// Create a new state machine
const turnstile = new JSSM({
  transitions: [
    // Initial state transition (automatically invoked)
    { name: 'init', from: 'none', to: 'locked' },
    
    // Regular transitions
    { name: 'insertCoin', from: 'locked', to: 'unlocked' },
    { name: 'push', from: 'unlocked', to: 'locked' }
  ],
  
  // Actions to execute during transitions
  actions: {
    init: function() {
      console.log('Initialized to locked state');
    },
    insertCoin: function(info, coin) {
      console.log(`Coin inserted: ${coin}`);
    },
    push: function(info) {
      console.log('Turnstile pushed');
    }
  },
  
  // Optional context for actions
  context: null
});
```

## Triggering Transitions

```javascript
// Trigger transitions
turnstile.insertCoin(25); // Passes 25 as the coin value
turnstile.push();

// Chain transitions
turnstile.insertCoin(25).push().insertCoin(25);
```

## Configuration

```javascript
const fsm = new JSSM({
  // Optional settings
  _settings: {
    log: true,     // Enable console logging
    strict: false, // Don't throw errors for invalid transitions
    history: false // Don't track transition history
  },
  
  transitions: [
    // Your transitions here
  ],
  
  actions: {
    // Your actions here
  }
});
```

## State Management

```javascript
// Get current state
const currentState = turnstile.current();  // or turnstile._current

// Get previous state
const previousState = turnstile._previous;

// Check if a transition is possible
if (turnstile.can('push')) {
  console.log('Can push the turnstile');
}

// Check if a transition is not possible
if (turnstile.cannot('insertCoin')) {
  console.log('Cannot insert coin in current state');
}
```

## Transition Info

The transition info object is always passed as the first argument to action callbacks:

```javascript
function insertCoin(info, coin) {
  console.log(info); 
  // Outputs: { name: 'insertCoin', from: 'locked', to: 'unlocked' }
  
  console.log(`Inserted ${coin} cents`);
}
```

## Advanced Usage

### Multiple 'from' States

```javascript
// Allow transition from multiple states
{ name: 'reset', from: ['locked', 'unlocked', 'broken'], to: 'locked' }
```

## License

MIT

