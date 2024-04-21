<template>
    <div class="login_container">
        <el-row>
            <el-col :span="12" :xs="0"></el-col>
            <el-col :span="12" :xs="24">
                <!-- 登录的表单 -->
                <el-form
                    class="login_form"
                    :model="loginForm"
                    :rules="rules"
                    ref="loginForms"
                >
                    <h1>Hello</h1>
                    <h2>欢迎来到硅谷甄选</h2>
                    <el-form-item prop="username">
                        <el-input
                            :prefix-icon="User"
                            v-model="loginForm.username"
                        ></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input
                            type="password"
                            :prefix-icon="Lock"
                            v-model="loginForm.password"
                            show-password
                        ></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button
                            class="login_btn"
                            type="primary"
                            size="default"
                            :loading="loading"
                            @click="login"
                        >
                            登录
                        </el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </div>
</template>

<script setup lang="ts">
import { User, Lock } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import useUserStore from '@/store/modules/user.ts'
import { useRouter, useRoute } from 'vue-router'
import { ElNotification, FormRules } from 'element-plus'
import { getTime } from '@/utils/time.ts'

const validateName = (_: any, value: any, callback: any) => {
    if (value.length < 5) {
        callback(new Error('用户名长度至少五位'))
    } else {
        callback()
    }
}

const validatePass = (_: any, value: any, callback: any) => {
    if (value.length < 5) {
        callback(new Error('密码长度至少五位'))
    } else {
        callback()
    }
}

// 必须是rective
let loginForm = reactive({ username: 'admin', password: '111111' })
//获取el-form组件
let loginForms = ref()
//表单的规则
const rules = reactive<FormRules>({
    username: [{ validator: validateName, trigger: 'change' }],
    password: [{ validator: validatePass, trigger: 'change' }],
})

//获取路由器,返回路由器实例
let $router = useRouter()
//是一个响应式对象,是一个跳转的路由对象，
// 每一个路由都会有一个route对象，是一个局部的对象
// 可以获取对应的name,path,params,query等：
let $route = useRoute()
let userStore = useUserStore()
let loading = ref(false)

const login = async () => {
    //保证全部表单相校验通过再发请求element中form的属性
    await loginForms.value.validate()

    //加载效果:开始加载
    loading.value = true
    try {
        await userStore.userLogin(loginForm)

        let redirect: any = $route.query.redirect
        $router.push({ path: redirect || '/' })
        //登录成功提示信息
        ElNotification({
            type: 'success',
            message: '欢迎回来',
            title: `HI,${getTime()}好`,
        })
        loading.value = false
    } catch (error) {
        loading.value = false
        ElNotification({
            type: 'error',
            message: (error as Error).message,
        })
    }
}
</script>
<style scoped lang="scss">
.login_container {
    width: 100%;
    height: 100vh;
    background: url('@/assets/images/backgroundnew.jpg') no-repeat;
    background-size: cover;

    .login_form {
        position: relative;
        width: 80%;
        top: 24vh;
        background: url('@/assets/images/login_form.png') no-repeat;
        background-size: cover;
        padding: 40px;
        background-color: rgb(235, 204, 166);
        opacity: 1;

        h1 {
            color: white;
            font-size: 40px;
        }

        h2 {
            font-size: 20px;
            color: white;
            margin: 20px 0px;
        }

        .login_btn {
            background-color: rgb(218, 174, 115);
            width: 100%;
        }
    }
}
</style>
