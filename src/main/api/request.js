import axios from 'axios'

const instance = axios.create({
  timeout: 1800000
})

instance.interceptors.response.use(function (response) {
  return response.data
})

export default instance
