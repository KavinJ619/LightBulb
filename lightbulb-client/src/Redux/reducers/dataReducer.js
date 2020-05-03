import { SET_IDEAS, LIKE_IDEA, UNLIKE_IDEA, LOADING_DATA, DELETE_IDEA, POST_IDEA, SET_IDEA, SUBMIT_COMMENT } from "../types"

const initialState={
    ideas: [],
    idea: {},
    loading:false
}

export default function(state=initialState, action){
    switch(action.type){
        case LOADING_DATA:
            return {
                ...state,
                loading:true
            }
        case SET_IDEAS:
            return{
                ...state,
                ideas:action.payload,
                loading:false
            }
        case SET_IDEA:
            return {
                ...state,
                idea: action.payload
            }
        case LIKE_IDEA:
        case UNLIKE_IDEA:
            let index = state.ideas.findIndex((idea) => idea.ideaId === action.payload.ideaId)
            state.ideas[index] = action.payload
            return {
                ...state
            };
        case DELETE_IDEA:
            let index1 = state.ideas.findIndex(idea => idea.ideaId === action.payload);
            state.ideas.splice(index1, 1);
            return {
                ...state
            };
        case POST_IDEA:
            return {
                ...state,
                ideas: [
                    action.payload,
                    ...state.ideas
                ]
            }
        case SUBMIT_COMMENT:
            return {
                ...state,
                idea: {
                    ...state.idea,
                    comments : [action.payload, ...state.idea.comments]
                }
            }

        default:
            return state
    }
}