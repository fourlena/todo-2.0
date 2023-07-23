import {
    AddTodolistActionType, changeTodolistStatusAC, removeTodolistAC,
    RemoveTodolistActionType,
    SetTodolistActionType,
} from './todolists-reducer';
import {TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType} from '../../api/todolists-api'
import {Dispatch} from "redux";
import {AppRootStateType} from "../../app/store";
import {AppActionsType, RequestStatusType, setAppErrorAC, setAppStatusAC} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import axios, {AxiosError} from "axios";



const initialState: TasksStateType = {
    /*"todolistId1": [
        { id: "1", title: "CSS", status: TaskStatuses.New, todoListId: "todolistId1", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "2", title: "JS", status: TaskStatuses.Completed, todoListId: "todolistId1", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "3", title: "React", status: TaskStatuses.New, todoListId: "todolistId1", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low }
    ],
    "todolistId2": [
        { id: "1", title: "bread", status: TaskStatuses.New, todoListId: "todolistId2", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "2", title: "milk", status: TaskStatuses.Completed, todoListId: "todolistId2", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "3", title: "tea", status: TaskStatuses.New, todoListId: "todolistId2", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low }
    ]*/

}

export const tasksReducer = (state: TasksStateType = initialState, action: TaskActionsType): TasksStateType => {
    switch (action.type) {
        case "SET-TASKS": return {...state,[action.todolistId] : action.tasks}
        case 'REMOVE-TASK': return {...state,[action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskId)}
        case 'ADD-TASK': return {...state,[action.task.todoListId]:[action.task,...state[action.task.todoListId]]}
        case 'UPDATE-TASK': return {...state,[action.todolistId]: state[action.todolistId].map(t => t.id === action.taskId ? {...t, ...action.model} : t)}
        case "TASK/CHANGE-TASK-STATUS": return {
            ...state,[action.todolistId] : state[action.todolistId].map(t => t.id === action.taskId ? {...t, entityStatus:action.status} : t)}
        case 'SET-TODOLISTS': {
            let copyState = {...state}
            action.todolists.forEach(td => copyState[td.id] = [])
            return copyState
        }
        case 'ADD-TODOLIST': return {...state,[action.todolist.id]: []}
        case 'REMOVE-TODOLIST': {
            const copyState = {...state};
            delete copyState[action.id];
            return copyState;
        }
        default:
            return state;
    }
}


//actions
export const removeTaskAC = (taskId: string, todolistId: string) =>
    ({type: 'REMOVE-TASK', taskId, todolistId} as const)
export const addTaskAC = (task: TaskType) =>
    ({type: 'ADD-TASK', task} as const)
export const updateTaskAC = (taskId: string, model: UpdateTaskDomainModelType, todolistId: string) =>
    ({type: 'UPDATE-TASK', model, todolistId, taskId} as const)
export const setTasksAC = (tasks: TaskType[], todolistId: string) =>
    ({type: 'SET-TASKS', tasks, todolistId} as const)
export const changeTaskStatusAC = (todolistId: string, taskId:string, status:RequestStatusType) =>
    ({type: 'TASK/CHANGE-TASK-STATUS', todolistId, taskId, status} as const)

//thunks
export const fetchTaskTC = (todolistId: string) => (dispatch: Dispatch<TaskActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    todolistsAPI.getTasks(todolistId)
        .then(res => {
            dispatch(setTasksAC(res.data.items, todolistId))
            dispatch(setAppStatusAC('succeeded'))
        })
        .catch(e =>{
            const err = e as Error | AxiosError
            if(axios.isAxiosError(err)){
                const error = err.response?.data ? (err.response.data as {error:string}).error : err.message
                handleServerNetworkError(error,dispatch)
            }
        })
}
export const deleteTaskTC = (todolistId: string, taskId: string) => (dispatch: Dispatch<TaskActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    dispatch(changeTaskStatusAC(todolistId, taskId, 'loading'))
    todolistsAPI.deleteTask(todolistId, taskId)
        .then(res => {
            dispatch(removeTaskAC(taskId, todolistId))
            dispatch(setAppStatusAC('succeeded'))
        })
        .catch(e =>{
            const err = e as Error | AxiosError
            if(axios.isAxiosError(err)){
                const error = err.response?.data ? (err.response.data as {error:string}).error : err.message
                handleServerNetworkError(error,dispatch)
            }
        })
}
export const addTaskTC = (todolistId: string, title: string) => (dispatch: Dispatch<TaskActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    todolistsAPI.createTask(todolistId, title)
        .then(res => {
            if(res.data.resultCode === 0){
                dispatch(addTaskAC(res.data.data.item))
                dispatch(setAppStatusAC('succeeded'))
            }
            else{
                handleServerAppError<{item:TaskType}>(res.data,dispatch)
            }
        })
        .catch(e =>{
            const err = e as Error | AxiosError
            if(axios.isAxiosError(err)){
                const error = err.response?.data ? (err.response.data as {error:string}).error : err.message
                handleServerNetworkError(error,dispatch)
            }
        })
}
export const updateTaskTC = (todolistId: string, taskId: string, domainModel: UpdateTaskDomainModelType) =>
    (dispatch: Dispatch<TaskActionsType>, getState: () => AppRootStateType) => {
        const task = getState().tasks[todolistId].find(el => el.id === taskId)
        if (!task) {
            console.warn('task not found in the state')
            return;
        }
        const apiModel: UpdateTaskModelType = {
            title: task.title,
            deadline: task.deadline,
            status: task.status,
            priority: task.priority,
            startDate: task.startDate,
            description: task.description,
            ...domainModel
        }
        dispatch(setAppStatusAC('loading'))
        dispatch(changeTaskStatusAC(todolistId, taskId, 'loading'))
        todolistsAPI.updateTask(todolistId, taskId, apiModel)
            .then(res => {
                if(res.data.resultCode === 0){
                    dispatch(updateTaskAC(taskId, domainModel, todolistId))
                    dispatch(changeTaskStatusAC(todolistId, taskId, 'succeeded'))
                    dispatch(setAppStatusAC('succeeded'))
                }
                else{
                    handleServerAppError<{item:TaskType}>(res.data,dispatch)
                }
            })
            .catch(e =>{
                const err = e as Error | AxiosError
                if(axios.isAxiosError(err)){
                    const error = err.response?.data ? (err.response.data as {error:string}).error : err.message
                    handleServerNetworkError(error,dispatch)
                }
            })
    }

//actions
export type UpdateTaskDomainModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}
type TaskActionsType =
    | ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof updateTaskAC>
    | ReturnType<typeof updateTaskAC>
    | ReturnType<typeof setTasksAC>
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodolistActionType
    | AppActionsType
    | ReturnType<typeof changeTaskStatusAC>
export type TasksStateType = {
    [key: string]: Array<TaskType>
}