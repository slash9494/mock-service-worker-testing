import { DefaultBodyType, PathParams, rest, RestRequest } from "msw";

export interface User {
    id: number;
    name: string;
    password: string;
}
export type ReqUserData = Omit<User,'id'>;


let users:Record<string,User> = window.localStorage.getItem('users') ? JSON.parse(window.localStorage.getItem('users') as string) : {};

const isValidToken = (token:string) => {
    return !!users[token];
}

const isValidKeys = (keys:Array<keyof ReqUserData>) => {
  const userInfoKeys:Array<keyof ReqUserData> = ['name', 'password'];
    return keys.every(key => userInfoKeys.includes(key));
}

const checkUser = (user:ReqUserData) => {
  const usersInfo = Object.values(users);
  const userInfo = usersInfo.find(u => u.name === user.name);
  return userInfo ? {id:userInfo.id,name:userInfo.name} : null;
}

const getToken = (user:ReqUserData) => {
  const token = Object.keys(users).find(key => users[key].name === user.name);
  return token;
}

export const userAPIHandlers = [
    rest.post('/auth', (req, res, ctx) => {
        const { authToken } = req.cookies
        if (isValidToken(authToken)) {
          return res(
            ctx.status(201),
            ctx.json<Omit<User,'password'>>({
              id: users[authToken].id,
              name: users[authToken].name,
            }),
          )
        }
        return res(
          ctx.status(403),
          ctx.json({ message: 'Not found token' }),
        )
      }),
    rest.post('/register', (req:RestRequest<string, PathParams<string>>
      , res, ctx) => {
        const parsedBody:ReqUserData = JSON.parse(req.body);
      if(isValidKeys(Object.keys(parsedBody) as Array<keyof ReqUserData>)) {
        const randomNum = Math.random().toString().split('0.')[1];
        const newUsers = {[randomNum]: {...parsedBody,id:Object.keys(users).length}}
        window.localStorage.setItem('users', JSON.stringify(newUsers))
        users = newUsers
        return res(
          ctx.status(201),
          ctx.json({ message: 'User created' }),
        )
      }
      return res(
        ctx.status(400),
        ctx.json({ message: 'Invalid body' }),
      )
    }),
    rest.post('/login', (req:RestRequest<string, PathParams<string>>, res, ctx) => {
      const parsedBody:ReqUserData = JSON.parse(req.body);
      if(!checkUser(parsedBody)) return res(
        ctx.status(403),
        ctx.json({ message: 'Invalid User' }),
      )
      return res(
        ctx.status(201),
        ctx.cookie('authToken', getToken(parsedBody)||''),
        ctx.json(checkUser(parsedBody)),
      )
    })
];