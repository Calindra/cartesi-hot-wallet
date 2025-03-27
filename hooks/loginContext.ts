import { createContext } from 'react'

const LoginContext = createContext({
  address: '',
  setAddress: (_v: string) => {},
})
export default LoginContext
