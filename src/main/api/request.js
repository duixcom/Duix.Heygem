import axios from 'axios'

const instance = axios.create({
  timeout: 0
})

instance.interceptors.response.use(function (response) {
  return response.data
})

export default instance
