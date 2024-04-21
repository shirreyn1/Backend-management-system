//创建用户相关的小仓库
import { defineStore } from 'pinia'
//引入接口
import { reqLogin, reqUserInfo, reqLogout } from '@/api/user'
import type {
    loginFormData,
    loginResponseData,
    userInfoReponseData,
} from '@/api/user/type'
import type { UserState } from './types/type'
//引入操作本地存储的工具方法
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from '@/utils/token'
//引入路由(常量路由)
import { constantRoute, asyncRoute, anyRoute } from '@/router/routes'

//引入深拷贝方法
//@ts-expect-error
import cloneDeep from 'lodash/cloneDeep'
import router from '@/router'
//用于过滤当前用户需要展示的异步路由
function filterAsyncRoute(asnycRoute: any, routes: any) {
    return asnycRoute.filter((item: any) => {
        if (routes.includes(item.name)) {
            if (item.children && item.children.length > 0) {
                item.children = filterAsyncRoute(item.children, routes)
            }
            return true
        }
    })
}

//创建用户小仓库
const useUserStore = defineStore('User', {
    //小仓库存储数据地方
    state: (): UserState => {
        return {
            token: GET_TOKEN(), //用户唯一标识token
            menuRoutes: constantRoute, //仓库存储生成菜单需要数组(路由)
            username: '',
            avatar: '',
            dark: false,
            //存储当前用户是否包含某一个按钮
            buttons: [],
        }
    },
    //异步|逻辑的地方
    actions: {
        //用户登录的方法
        async userLogin(data: loginFormData) {
            const result: loginResponseData = await reqLogin(data)
            if (result.code == 200) {
                this.token = result.data as string
                SET_TOKEN(result.data as string)
                return 'ok'
            } else {
                return Promise.reject(new Error(result.data))
            }
        },
        //获取用户信息方法
        async userInfo() {
            //获取用户信息进行存储仓库当中[用户头像、名字]
            const result: userInfoReponseData = await reqUserInfo()

            if (result.code == 200) {
                this.username = result.data.name
                this.avatar = result.data.avatar
                this.buttons = result.data.buttons
                const asyncroutes = filterAsyncRoute(
                    cloneDeep(asyncRoute),
                    result.data.routes,
                )
                this.menuRoutes = [...constantRoute, ...asyncroutes, anyRoute]
                //目前路由器管理的只有常量路由:用户计算完毕异步路由、任意路由动态追加
                ;[...asyncroutes, anyRoute].forEach((route: any) => {
                    router.addRoute(route)
                })

                return 'ok'
            } else {
                return Promise.reject(new Error(result.message))
            }
        },
        //退出登录
        async userLogout() {
            //退出登录请求
            const result: any = await reqLogout()

            if (result.code == 200) {
                this.token = ''
                this.username = ''
                this.avatar = ''
                REMOVE_TOKEN()
                return 'ok'
            } else {
                return Promise.reject(new Error(result.message))
            }
        },
    },
})
export default useUserStore
