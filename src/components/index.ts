import SvgIcon from './svgIcon/index.vue'
// 导入svg图标
import 'virtual:svg-icons-register'
//引入element-plus提供全部图标组件
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
//引入三级分类组件
import Category from './Category/index.vue'

const allGloablComponent: any = { SvgIcon, Category }

export default {
    install(app: any) {
        Object.keys(allGloablComponent).forEach((key) => {
            app.component(key, allGloablComponent[key])
        })
        //将element-plus提供图标注册为全局组件
        for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
            app.component(key, component)
        }
    },
}
