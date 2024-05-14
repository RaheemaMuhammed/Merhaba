import axios from 'axios'

export const baseURLUser = import.meta.env.VITE_DEVELOP === 'True'
  ? 'http://127.0.0.1:8000/'
  : 'https://backendapi.site/';

export const axiosInstance=axios.create({baseURL:baseURLUser})
