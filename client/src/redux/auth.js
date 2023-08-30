const initialState = {
  user: localStorage.getItem('user'),
  details: JSON.parse(localStorage.getItem('details')),
};


const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN':
      console.log("Hitted")
      localStorage.setItem('user', action.data.email);
      localStorage.setItem('details', JSON.stringify(action.data));
      return { details: action.data, user: action.data.email }
    case 'LOGOUT':
      localStorage.removeItem('user')
      localStorage.removeItem('details')
      return { user: '', details: '' };
    default:
      return state;
  }
};

export default userReducer;
