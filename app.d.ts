// 提示 ”无法找到 *.vue 声明文件“ 的解决方案
declare module '*.vue' {
    import { defineComponent } from 'vue'
    const Component: ReturnType<typeof defineComponent>
    export default Component
}
