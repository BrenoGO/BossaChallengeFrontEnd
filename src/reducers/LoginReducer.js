import { LOGIN, LOGOUT } from '../actions/LoginActions';

const INITIAL_STATE = {
  userName: localStorage.getItem('name@bossabox')
    ? localStorage.getItem('name@bossabox')
    : '',
  boolLogged: Boolean(localStorage.getItem('token@bossabox'))
};
export default function LoginReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case LOGIN:
      return { ...state, boolLogged: true, userName: action.userName };
    case LOGOUT:
      return { ...state, boolLogged: false, userName: '' };
    default:
      return state;
  }
}
