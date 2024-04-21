import { createApp } from 'vue'
//引入模板的全局的样式
import '@/styles/index.scss'
import App from '@/App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// @ts-ignore
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

//svg插件需要配置代码???
import 'virtual:svg-icons-register'

//引入自定义插件对象:注册整个项目全局组件
import gloalComponent from '@/components'

// 路由
import router from '@/router'

//使用大仓库
import pinia from './store/index'

// 暗黑模式的样式
import 'element-plus/theme-chalk/dark/css-vars.css'

//引入路由鉴权文件
import './permisstion'

// 自定义指令
import { isHasButton } from '@/directive/has'

const app = createApp(App)
app.use(ElementPlus, {
    locale: zhCn,
})
console.log(3)
app.use(gloalComponent)
app.use(router)
app.use(pinia)
app.use(isHasButton)
app.mount('#app')
