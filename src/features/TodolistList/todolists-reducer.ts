import {v1} from 'uuid';
import {todolistsAPI, TodolistType} from '../../api/todolists-api'
import {Dispatch} from "redux";
import {AppActionsType, RequestStatusType, setAppErrorAC, setAppStatusAC} from "../../app/app-reducer";
import {addTaskAC} from "./tasks-reducer";


const initialState: Array<TodolistDomainType> = [
    /*{id: todolistId1, title: 'What to learn', filter: 'all', addedDate: '', order: 0},
    {id: todolistId2, title: 'What to buy', filter: 'all', addedDate: '', order: 0}*/
]

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: TodolistActionsType): Array<TodolistDomainType> => {
    switch (action.type) {
        case 'SET-TODOLISTS': return action.todolists.map(el => ({...el, filter: 'all', entityStatus:'idle' }))
        case 'REMOVE-TODOLIST': return state.filter(tl => tl.id !== action.id)
        case 'ADD-TODOLIST': return [{...action.todolist, filter: 'all', entityStatus:'idle'}, ...state]
        case 'CHANGE-TODOLIST-TITLE': return state.map(tl =>tl.id === action.id ? {...tl,title:action.title} : tl)
        case 'CHANGE-TODOLIST-FILTER': return state.map(tl =>tl.id === action.id ? {...tl,filter:action.filter} : tl)
        case 'TODO/CHANGE-TODOLIST-STATUS': return state.map(tl =>tl.id === action.id ? {...tl, entityStatus:action.status} : tl)
        default:
            return state;
    }
}

//actions
export const removeTodolistAC = (id: string) =>
    ({type: 'REMOVE-TODOLIST', id} as const)
export const addTodolistAC = (todolist: TodolistType) =>
    ({type: 'ADD-TODOLIST', todolist} as const)
export const changeTodolistTitleAC = (id: string, title: string) =>
    ({type: 'CHANGE-TODOLIST-TITLE', id, title} as const)
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) =>
    ({type: 'CHANGE-TODOLIST-FILTER', id, filter} as const)
export const setTodolistsAC = (todolists: Array<TodolistType>) =>
    ({type: 'SET-TODOLISTS', todolists} as const)
export const changeTodolistStatusAC = (id: string, status: RequestStatusType) =>
    ({type: 'TODO/CHANGE-TODOLIST-STATUS', id, status} as const)

//thunks
export const fetchTodolistTC = () => (dispatch: Dispatch<TodolistActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    todolistsAPI.getTodolists()
        .then((res) => {
            dispatch(setTodolistsAC(res.data))
            dispatch(setAppStatusAC('succeeded'))
        })
        .catch((e)=>{
            dispatch(setAppStatusAC('failed'))
            dispatch(setAppErrorAC(e.message))
        })
}
export const createTodolistTC = (title: string) => (dispatch: Dispatch<TodolistActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    todolistsAPI.createTodolist(title)
        .then(res => {
            dispatch(addTodolistAC(res.data.data.item))
            dispatch(setAppStatusAC('succeeded'))
        })
        .catch((e)=>{
            dispatch(setAppStatusAC('failed'))
            dispatch(setAppErrorAC(e.message))
        })
}
export const deleteTodolistTC = (id: string) => (dispatch: Dispatch<TodolistActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    dispatch(changeTodolistStatusAC(id,'loading'))
    todolistsAPI.deleteTodolist(id)
        .then(res => {
            if(res.data.resultCode === 0){
                dispatch(removeTodolistAC(id))
                dispatch(setAppStatusAC('succeeded'))
            }
            else{
                if(res.data.messages.length){
                    dispatch(setAppErrorAC(res.data.messages[0]))
                }else{
                    dispatch(setAppErrorAC('Some error'))
                }
                dispatch(setAppStatusAC('failed'))
            }
        })
        .catch((e)=>{
            dispatch(changeTodolistStatusAC(id,'failed'))
            dispatch(setAppStatusAC('failed'))
            dispatch(setAppErrorAC(e.message))
        })
}
export const updateTodolistTitleTC = (id: string, title: string) => (dispatch: Dispatch<TodolistActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    todolistsAPI.updateTodolist(id, title)
        .then(res => {
            dispatch(changeTodolistTitleAC(id, title))
            dispatch(setAppStatusAC('succeeded'))
        })
        .catch((e)=>{
            dispatch(setAppStatusAC('failed'))
            dispatch(setAppErrorAC(e.message))
        })
}

//types
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>
export type SetTodolistActionType = ReturnType<typeof setTodolistsAC>
type TodolistActionsType =
    | RemoveTodolistActionType
    | AddTodolistActionType
    | SetTodolistActionType
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof changeTodolistFilterAC>
    | ReturnType<typeof changeTodolistStatusAC>
    | AppActionsType

export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus:RequestStatusType
}