<template>
    <div class="mainbck">
        <router-view v-slot="{ Component }">
            <component :is="Component" v-if="flag" />
        </router-view>

        <!-- <router-view></router-view> -->
    </div>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import useLayOutSettingStore from '@/store/modules/setting'

let flag = ref<boolean>(true)
let layOutSettingStore = useLayOutSettingStore()
watch(
    () => layOutSettingStore.refresh,
    () => {
        flag.value = false
        nextTick(() => {
            flag.value = true
        })
    },
)
</script>
<script lang="ts">
export default {
    name: 'Main',
}
</script>

<style lang="scss" scoped></style>
