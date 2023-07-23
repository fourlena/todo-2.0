import {AppActionsType, setAppErrorAC, setAppStatusAC} from "../app/app-reducer";
import {Dispatch} from "redux";
import { ResponseType } from '../api/todolists-api'

export const handleServerNetworkError = (error:string,dispatch:Dispatch<AppActionsType>) =>{
    dispatch(setAppErrorAC(error))
    dispatch(setAppStatusAC('failed'))
}

export const handleServerAppError = <T>(data:ResponseType<T>,dispatch:Dispatch<AppActionsType>) =>{
    if(data.messages.length){
        dispatch(setAppErrorAC(data.messages[0]))
    }else{
        dispatch(setAppErrorAC('Some error'))
    }
    dispatch(setAppStatusAC('failed'))
}