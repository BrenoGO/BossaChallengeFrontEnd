
const api = 'https://bossabox-challenge-backend.herokuapp.com/';
// const api = 'http://localhost:3001/';

export const ApiService = {
  get(endpoint) {
    return fetch(`${api}${endpoint}`)
      .then(resp => resp.json())
      .catch(err => ({ err }));
  },
  login(data) {
    return fetch(`${api}login`, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(data)
    })
      .then((resp) => {
        if (resp.status === 401) {
          throw new Error('Not authorized.');
        }
        return resp.json();
      })
      .catch(err => ({ err }));
  },
  post(endpoint, data) {
    return fetch(`${api}${endpoint}`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `JWT ${localStorage.getItem('token@bossabox')}`
      }
    })
      .then((resp) => {
        if (resp.status === 401) {
          throw new Error('Not authorized.');
        }
        return resp.json();
      })
      .catch(err => ({ err }));
  },
  delete(endpoint, id) {
    return fetch(`${api}${endpoint}/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `JWT ${localStorage.getItem('token@bossabox')}`
      }
    })
      .then((resp) => {
        if (resp.status === 401) {
          throw new Error('Not authorized.');
        }
        return {};
      })
      .catch(err => ({ err }));
  }
};
