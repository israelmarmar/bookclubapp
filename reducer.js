// The types of actions that you can dispatch to modify the state of the store
export const types = {
  ADD: 'ADD',
  REMOVE: 'REMOVE',
  ERASE: 'ERASE'
}

// Helper functions to dispatch actions, optionally with payloads
export const actionCreators = {
  add: (item) => {
    return {type: types.ADD, payload: item}
  },
  remove: (index) => {
    return {type: types.REMOVE, payload: parseInt(index)}
  },
  erase: () => {
    return {type: types.ERASE}
  }

}

// Function to handle actions and update the state of the store.
// Notes:
// - The reducer must return a new state object. It must never modify
//   the state object. State objects should be treated as immutable.
// - We set \`state\` to our \`initialState\` by default. Redux will
//   call reducer() with no state on startup, and we are expected to
//   return the initial state of the app in this case.

const initialState = {
  data: [],
}

export const reducer = (state = initialState, action) => {
  const {data} = state
  const {type, payload} = action
  console.log(payload)
  console.log(data.filter((d, i) => i !== payload))
  switch (type) {
    case types.ADD: {
      return {
        ...state,
        data: [...payload, ...data],
      }
    }
    case types.REMOVE: {
      return {
        ...state,
        data: data.filter((d, i) => i !== payload),
      }
    }
    case types.ERASE: {
      return {...state,
        data:[]}
    }
  }

  return state
}
