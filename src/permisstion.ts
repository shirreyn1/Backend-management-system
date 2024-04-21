//路由鉴权:鉴权,项目当中路由能不能被的权限的设置(某一个路由什么条件下可以访问、什么条件下不可以访问)
import router from '@/router'
import setting from './setting'
//@ts-ignore
import nprogress from 'nprogress'
//引入进度条样式
import 'nprogress/nprogress.css'
nprogress.configure({ showSpinner: false })
//获取用户相关的小仓库内部token数据,去判断用户是否登录成功
import useUserStore from './store/modules/user'

router.beforeEach(async (to: any, _: any, next: any) => {
    document.title = `${setting.title} - ${to.meta.title}`

    nprogress.start()
    const userStore = useUserStore()
    const token = userStore.token

    const username = userStore.username
    if (token) {
        if (to.path == '/login') {
            next({ path: '/' })
        } else {
            if (username) {
                next()
            } else {
                try {
                    await userStore.userInfo()
                    //万一:刷新的时候是异步路由,有可能获取到用户信息、异步路由还没有加载完毕,出现空白的效果
                    next({ ...to })
                } catch (error) {
                    //token过期:获取不到用户信息了
                    //用户手动修改本地存储token
                    //退出登录->用户相关的数据清空
                    await userStore.userLogout()
                    next({ path: '/login', query: { redirect: to.path } })
                }
            }
        }
    } else {
        //用户未登录判断
        if (to.path == '/login') {
            next()
        } else {
            next({ path: '/login', query: { redirect: to.path } })
        }
    }
})
//全局后置守卫
router.afterEach(() => {
    nprogress.done()
})
