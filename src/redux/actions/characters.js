import * as API from '../../utils/api'
export const RECEIVE_CHARACTERS = 'RECEIVE_CHARACTERS'
export const CREATE_CHARACTERS = 'CREATE_CHARACTERS'
export const UPDATE_CHARACTER = 'UPDATE_CHARACTER'
export const DELETE_CHARACTER = 'DELETE_CHARACTER'
export const REMOVE_CHARACTER = 'REMOVE_CHARACTER'


export function createCharacter(token, payload) {
  return (dispatch) => {
    return API.createCharacter(token, payload)
      .then((response) => {
        dispatch(createCharacters(response.createdCharacter))
      })
  }
}

export function patchCharacter(token, payload, url) {
  return (dispatch) => {
    return API.patchByUrl(token, payload, url)
      .then((response) => {
        if(response.status.code === 200) {
          dispatch(updateCharacter(payload, response._id))
        }
      })
  }

}

export function deleteCharacter(token, id) {
  return (dispatch) => {
    return API.deleteCharacter(token, id)
      .then(response => {
        if (response.status.code === 200) {
          dispatch(removeCharacter(id))
        }
      })
  }
}

export function removeCharacter(id) {
  return {
    type: REMOVE_CHARACTER,
    id
  }
}

export function updateCharacter(payload, id) {
  return {
    type: UPDATE_CHARACTER,
    id,
    payload
  }
}

export function receiveCharacters(characters, user) {
  return {
    type: RECEIVE_CHARACTERS,
    characters,
    user
  }
}

export function createCharacters(character) {
  return {
    type: CREATE_CHARACTERS,
    character
  }
}