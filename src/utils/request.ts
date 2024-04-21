//进行axios二次封装:使用请求与响应拦截器
import axios from 'axios'
import { ElMessage } from 'element-plus'
//引入用户相关的仓库
import useUserStore from '@/store/modules/user'
const request = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_API,
    timeout: 8000,
})
request.interceptors.request.use((config) => {
    const userStore = useUserStore()
    if (userStore.token) {
        config.headers.token = userStore.token as string
    }

    return config
})

//第三步:响应拦截器
request.interceptors.response.use(
    (response) => {
        return response.data
    },
    (error) => {
        let message = ''
        //http状态码
        const status = error.response.status
        switch (status) {
            case 401:
                message = 'TOKEN过期'
                break
            case 403:
                message = '无权访问'
                break
            case 404:
                message = '请求地址错误'
                break
            case 500:
                message = '服务器出现问题'
                break
            default:
                message = '网络出现问题'
                break
        }
        //提示错误信息
        ElMessage({
            type: 'error',
            message,
        })
        return Promise.reject(error)
    },
)
//对外暴露
export default request
