// src/counterReducer.js
const initialState = {
  allCarts: []
};



const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOAD_CART':
      return { allCarts: action.data }
    default:
      return state;
  }
};

export default userReducer;
