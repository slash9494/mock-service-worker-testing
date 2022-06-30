import { useEffect, useState } from 'react'
import { useForm, SubmitHandler } from "react-hook-form";
import { User } from './mocks/user';
import fetch from 'cross-fetch';

type Inputs = User

const baseURL = 'http://localhost:3000';

function App() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState<Inputs>()
  const { register, handleSubmit, formState: { errors }, reset} = useForm<Inputs>();
  const { register:loginRegister, handleSubmit:loginSubmit, formState: { errors:loginErrors }, reset:loginReset} = useForm<Inputs>();
  const onRegister: SubmitHandler<Inputs> = async data => {
    const res = await fetch(`${baseURL}/register`, {body: JSON.stringify(data), method: 'POST'})
    if(!res.ok) {
     return console.error('register failed')
    }
    setIsRegistered(true)
    reset() 
  };
  const onLogin: SubmitHandler<Inputs> = async (data) => {
    try {
      const res = await fetch(`${baseURL}/login`, {body: JSON.stringify(data), method: 'POST'})
      if(!res.ok) {
        return console.error('login failed')
      }
      loginReset() 
      const userData = await res.json()
      setUser(userData)
      setIsLogin(true)
    } catch (error) {}
  };

  useEffect(() => {
    setIsRegistered(false);
    setIsLogin(false);
    (async() => {
      const res = await fetch(`${baseURL}/auth`,{method: 'POST', credentials: 'same-origin',})
      if(!res.ok) {
        return console.error('auth failed')
      }
      const userData = await res.json()
      setUser(userData)
    })()
  },[])

  return (
    <div className="App">
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit(onRegister)}>
        <label htmlFor='register_name'>name:</label>
        <input {...register('name', { required: true })} id='register_name' aria-label='register_name'/>
        <br />
        <label htmlFor='register_password'>Password:</label>
        <input {...register('password', { required: true })} type='password' id='register_password' aria-label='register_password'/>

        {errors.name || errors.password ? <span>All fields must be filled </span>: null}
        
        <input type="submit" value='가입' aria-label='register_submit'/>
      </form>
      <h2>로그인</h2>
      <form onSubmit={loginSubmit(onLogin)}>
        <label htmlFor='login_name'>name:</label>
        <input {...loginRegister('name', { required: true })} id='login_name' aria-label='login_name'/>
        <br />
        <label htmlFor='login_password'>Password:</label>
        <input {...loginRegister('password', { required: true })} type='password' id='login_password' aria-label='login_password'/>

        {loginErrors.name || loginErrors.password ? <span>All fields must be filled </span>: null}
        
        <input type="submit" value='로그인' aria-label='login_submit'/>
      </form>  
      {user ? <h2>{user.name}님 환영합니다</h2> : null}
      {isRegistered && <span>가입성공</span>}
      {isLogin && <span>로그인성공</span>}
    </div>
  )
}

export default App
