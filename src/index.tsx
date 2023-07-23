import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './app/App';
import reportWebVitals from './reportWebVitals';
import {Provider} from 'react-redux';
import {store} from './app/store';
import {BrowserRouter} from "react-router-dom";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <Provider store={store}>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();






























// import React, { useEffect } from 'react'
// import ReactDOM from 'react-dom/client';
// import { applyMiddleware, combineReducers, legacy_createStore as createStore, Dispatch } from 'redux'
// import thunk, { ThunkAction, ThunkDispatch } from 'redux-thunk'
// import { Provider, TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
// import axios, { AxiosError } from 'axios'
//
// // TYPES
// type TodoType = {
//     id: string;
//     title: string;
//     order: number;
//     createdAt: string;
//     updatedAt: string;
//     completed: boolean;
// }
//
// type UserType = {
//     id: string;
//     name: string;
//     age: number;
// }
//
// type UsersResponseType = {
//     items: UserType[]
//     totalCount: number
// }
//
//
// // API
// const instance = axios.create({baseURL: 'https://exams-frontend.kimitsu.it-incubator.ru/api/'})
//
// const api = {
//     getTodos() {
//         return instance.get<TodoType[]>('todos')
//     },
//     getUsers() {
//         return instance.get<UsersResponseType>('users')
//     },
// }
//
//
// // Reducer
// const initState = {
//     isLoading: false,
//     error: null as string | null,
//     todos: [] as TodoType[],
//     users: [] as UserType[],
// }
//
// type InitStateType = typeof initState
//
// const appReducer = (state: InitStateType = initState, action: ActionsType): InitStateType => {
//     switch (action.type) {
//         case 'APP/GET-TODOS':
//             return {...state, todos: action.todos}
//         case 'APP/GET-USERS':
//             return {...state, users: action.users}
//         case 'APP/IS-LOADING':
//             return {...state, isLoading: action.isLoading}
//         case 'APP/SET-ERROR':
//             return {...state, error: action.error}
//         default:
//             return state
//     }
// }
//
// const getUsersAC = (users: UserType[]) => ({type: 'APP/GET-USERS', users} as const)
// const getTodosAC = (todos: TodoType[]) => ({type: 'APP/GET-TODOS', todos} as const)
// const setLoadingAC = (isLoading: boolean) => ({type: 'APP/IS-LOADING', isLoading} as const)
// const setError = (error: string | null) => ({type: 'APP/SET-ERROR', error} as const)
//
// type ActionsType =
//     | ReturnType<typeof getUsersAC>
//     | ReturnType<typeof getTodosAC>
//     | ReturnType<typeof setLoadingAC>
//     | ReturnType<typeof setError>
//
//
// // Utils functions
// function baseSuccessHandler<T>(dispatch: Dispatch, actionCreator: Function, data: T) {
//     dispatch(actionCreator(data))
//     dispatch(setLoadingAC(false))
// }
//
// // Thunk
// const getTodosTC = (): AppThunk => (dispatch) => {
//     dispatch(setLoadingAC(true))
//     api.getTodos()
//         .then((res) => {
//             // XXX
//             // console.log(res)
//             baseSuccessHandler(dispatch,getTodosAC,res.data)
//         })
//         .catch((e: AxiosError) => {
//             dispatch(setError(e.message))
//             dispatch(setLoadingAC(false))
//         })
// }
//
// const getUsersTC = (): AppThunk => (dispatch) => {
//     dispatch(setLoadingAC(true))
//     api.getUsers()
//         .then((res) => {
//             // YYY
//             console.log(res.data)
//             baseSuccessHandler(dispatch,getUsersAC,res.data.items)
//         })
//         .catch((e: AxiosError) => {
//             dispatch(setError(e.message))
//             dispatch(setLoadingAC(false))
//         })
// }
//
// // Store
// const rootReducer = combineReducers({
//     app: appReducer,
// })
//
// const store = createStore(rootReducer, applyMiddleware(thunk))
// type RootState = ReturnType<typeof store.getState>
// type AppDispatch = ThunkDispatch<RootState, unknown, ActionsType>
// type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, ActionsType>
// const useAppDispatch = () => useDispatch<AppDispatch>()
// const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
//
//
// // COMPONENTS
// // Loader
// export const Loader = () => {
//     return (
//         <h1>Loading ...</h1>
//     )
// }
//
// const App = () => {
//     return (
//         <>
//             <h1>✅Todos & 🙂Users</h1>
//             <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
//                 <Todos/>
//                 <Users/>
//             </div>
//         </>
//     )
// }
//
// const Todos = () => {
//     const dispatch = useAppDispatch()
//     const todos = useAppSelector(state => state.app.todos)
//     const error = useAppSelector(state => state.app.error)
//     const isLoading = useAppSelector(state => state.app.isLoading)
//
//     useEffect(() => {
//         dispatch(getTodosTC())
//     }, [])
//
//     return (
//         <div>
//             <h2>✅ Список тудулистов</h2>
//             {!!error && <h2 style={{color: 'red'}}>{error}</h2>}
//             {isLoading && <Loader/>}
//             {
//                 todos.map((t) => {
//                     return (
//                         <div style={t.completed ? {color: 'grey'} : {}} key={t.id}>
//                             <input type="checkbox" checked={t.completed}/>
//                             <b>Описание</b>: {t.title}
//                         </div>
//                     )
//                 })
//             }
//         </div>
//     )
// }
//
// const Users = () => {
//     const dispatch = useAppDispatch()
//     const users = useAppSelector(state => state.app.users)
//     const error = useAppSelector(state => state.app.error)
//     const isLoading = useAppSelector(state => state.app.isLoading)
//
//     useEffect(() => {
//         dispatch(getUsersTC())
//     }, [])
//
//     return (
//         <div>
//             <h2>🙂 Список юзеров</h2>
//             {!!error && <h2 style={{color: 'red'}}>{error}</h2>}
//             {isLoading && <Loader/>}
//             <div>
//                 {
//                     users.map(u => {
//                         return (
//                             <div key={u.id}>
//                                 <b>name</b>:{u.name} - <b>age</b>:{u.age}
//                             </div>
//                         )
//                     })
//                 }</div>
//         </div>
//     )
// }
//
// const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
// root.render(<Provider store={store}> <App/></Provider>)
//
//
// // 📜 Описание:
// // Перед вами список тудулистов и пользователей, которые находятся в постоянной загрузке.
// // Откройте network и вы увидите что запросы на сервер уходят и возвращаются с хорошими данными,
// // но вместо этого пользователь видит на экране Loader.
// // Для обработки успешного результата написана утилитная функция baseSuccessHandler.
// // Ваша задача воспользоваться этой функцией отобразить Todos и Users
// // Что нужно написать вместо XXX и YYY, чтобы реализовать данную задачу?
// // Ответ дайте через пробел.
//
// // 🖥 Пример ответа: dispatch(baseSuccessHandler(1,2,3))  dispatch(baseSuccessHandler(3,2,1)
