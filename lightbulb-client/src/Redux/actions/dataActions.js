import { SET_IDEAS, LOADING_DATA, LIKE_IDEA, UNLIKE_IDEA, DELETE_IDEA, LOADING_UI, SET_ERRORS, CLEAR_ERRORS, POST_IDEA, SET_IDEA, STOP_LOADING_UI, SUBMIT_COMMENT } from "../types"
import axios from "axios";


//Get All Ideas
export const getIdeas = () => dispatch =>{
    dispatch({
        type: LOADING_DATA
    });
    axios.get('/ideas')
        .then(res => {
            dispatch({
                type:SET_IDEAS,
                payload: res.data
            })
        })
        .catch(err => {
            dispatch({
                type:SET_IDEAS,
                payload: []
            })
        })
}

//Post an idea
export const postIdea = (newIdea) => (dispatch) => {
    dispatch({ type: LOADING_UI });
    axios
      .post('/idea', newIdea)
      .then((res) => {
        dispatch({
          type: POST_IDEA,
          payload: res.data
        });
        dispatch(clearErrors());
      })
      .catch((err) => {
        dispatch({
            type:SET_ERRORS,
            payload: err.response.data
        })
    })
  };

// Like an Idea
export const likeIdea = (ideaId) => dispatch => {
    axios.get(`/idea/${ideaId}/like`)
        .then(res => {
            dispatch({
                type:LIKE_IDEA,
                payload:res.data
            })
        })
        .catch(err => {
            console.log(err)
        })
}

// Unlike an Idea

export const unLikeIdea = (ideaId) => (dispatch) => {
    axios
      .get(`/idea/${ideaId}/unlike`)
      .then((res) => {
        dispatch({
          type: UNLIKE_IDEA,
          payload: res.data
        });
      })
      .catch((err) => console.log(err));
  };

  //Submit a comment
  export const submitComment = (ideaId, commentData) => dispatch => {
      axios.post(`/idea/${ideaId}/comment`, commentData)
        .then(res => {
            dispatch({
                type: SUBMIT_COMMENT,
                payload: res.data
            });
            dispatch(clearErrors());
        })
        .catch(err => {
            dispatch({
                type:SET_ERRORS,
                payload: err.response.data
            })
        })
  } 

  //Delete an idea

  export const deleteIdea = ideaId => dispatch => {
      axios.delete(`/idea/${ideaId}`)
        .then(() => {
            dispatch({
                type: DELETE_IDEA,
                payload: ideaId
            })
        })
  }

  export const clearErrors = () => dispatch => {
      dispatch({
          type:CLEAR_ERRORS
      })
  }

  export const getIdea = (ideaId) => dispatch => {
      dispatch({ type:LOADING_UI })
      axios.get(`/idea/${ideaId}`)
        .then(res => {
            dispatch({
                type:SET_IDEA,
                payload: res.data
            })
            dispatch({ type:STOP_LOADING_UI })
        })
        .catch(err => {
            console.log(err)
        })
  }

  export const getUserData = (userHandle) => dispatch => {
      dispatch ({
          type:LOADING_DATA
      })
      axios.get(`/user/${userHandle}`)
        .then(res => {
            dispatch({
                type:SET_IDEAS,
                payload: res.data.ideas
            });
        })
        .catch(() => {
            dispatch({
                type:SET_IDEAS,
                payload: null
            })
        })
  }