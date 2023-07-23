import {Dispatch} from "redux";
import {authAPI} from "../api/todolists-api";
import {setIsLoggedInAC} from "../features/Login/auth-reducer";

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = {
    status: 'loading' as RequestStatusType,
    error: null as null | string,
    isInitialized: false
}

type InitialStateType = typeof initialState

export const appReducer = (state: InitialStateType = initialState, action: AppActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case 'APP/SET-ERROR':
            return {...state, error: action.error}
        case "APP/SET-INITIALIZE":
            return {...state, isInitialized: action.isInitialized}
        default:
            return state
    }
}

export const setAppStatusAC = (status: RequestStatusType) =>
    ({type: 'APP/SET-STATUS', status} as const)
export const setAppErrorAC = (error: null | string) =>
    ({type: 'APP/SET-ERROR', error} as const)
export const setAppInitializeAC = (isInitialized: boolean) =>
    ({type: 'APP/SET-INITIALIZE', isInitialized} as const)

export const initializeAppTC = () => (dispatch: Dispatch) => {
    debugger;
    authAPI.me()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC(true));
            }
        })
        .finally(()=>{
            dispatch(setAppInitializeAC(true));
        })
}


export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>
export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>
export type SetAppInitializeActionType = ReturnType<typeof setAppInitializeAC>
export type AppActionsType =
    | SetAppStatusActionType
    | SetAppErrorActionType
    | SetAppInitializeActionType