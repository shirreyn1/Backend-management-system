<template>
    <template v-for="item in menuList" :key="item.path">
        <template v-if="!item.meta.hidden">
            <el-menu-item
                :index="item.path"
                v-if="!item.children"
                @click="goRoute"
            >
                <el-icon>
                    <component :is="item.meta.icon"></component>
                </el-icon>
                <template #title>
                    <span>{{ item.meta.title }}</span>
                </template>
            </el-menu-item>
            <el-menu-item
                :index="item.children[0].path"
                v-if="item.children && item.children.length === 1"
                @click="goRoute"
            >
                <el-icon>
                    <component :is="item.children[0].meta.icon"></component>
                </el-icon>
                <template #title>
                    <span>{{ item.children[0].meta.title }}</span>
                </template>
            </el-menu-item>
            <el-sub-menu
                :index="item.path"
                v-if="item.children && item.children.length > 1"
            >
                <template #title>
                    <el-icon>
                        <component :is="item.meta.icon"></component>
                    </el-icon>
                    <span>{{ item.meta.title }}</span>
                </template>
                <Menu :menuList="item.children"></Menu>
            </el-sub-menu>
        </template>
    </template>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
defineProps(['menuList'])

let $router = useRouter()
const goRoute = (vc: any) => {
    $router.push(vc.index)
}
</script>
<script lang="ts">
export default {
    name: 'Menu',
}
</script>

<style lang="scss">
.el-menu-item.is-active {
    color: rgb(136, 78, 87);
}
.el-sub-menu__title:hover {
    background-color: rgb(158, 111, 111) !important;
}
.el-menu-item:hover {
    background-color: rgb(158, 111, 111);
}
</style>
