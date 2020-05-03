import { SET_USER, SET_UNAUTHENTICATED, SET_AUTHENTICATED, LOADING_USER, LIKE_IDEA, UNLIKE_IDEA, MARK_NOTIFICATIONS_READ } from "../types"

const initialState ={
    authenticated : false,
    credentials : {},
    likes: [],
    notifications: [],
    loading:false
};

export default function(state = initialState, action){
    switch(action.type){
        case SET_AUTHENTICATED:
            return {
                ...state,
                authenticated: true
            };
        case SET_UNAUTHENTICATED:
            return initialState;
        case SET_USER:
            return {
                authenticated: true,
                loading: false,
                ...action.payload
            };
        case LOADING_USER:
            return {
                ...state,
                loading:true
            }
        case LIKE_IDEA:
            return {
                ...state,
                likes : [
                    ...state.likes,
                    {
                        userHandle: state.credentials.handle,
                        ideaId: action.payload.ideaId
                    }
                ]
            }
        case UNLIKE_IDEA:
            return {
                ...state,
                likes: state.likes.filter((like) => like.ideaId !== action.payload.ideaId)
            }
        case MARK_NOTIFICATIONS_READ:
            state.notifications.forEach((not) => (not.read = true));
            return {
                ...state
            };
        default:
            return state;
    }
}