<template>
    <el-card>
        <el-form :inline="true" size="large">
            <el-form-item label="一级分类">
                <!-- change:选中值发生变化时触发 -->
                <el-select
                    v-model="categoryStore.c1Id"
                    @change="handler"
                    placeholder="Select"
                    :disabled="scene"
                    style="width: 200px"
                >
                    <!-- label:即为展示数据 value:即为select下拉菜单收集的数据 -->
                    <el-option
                        v-for="c1 in categoryStore.c1Arr"
                        :key="c1.id"
                        :label="c1.name"
                        :value="c1.id"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="二级分类">
                <el-select
                    v-model="categoryStore.c2Id"
                    @change="handler1"
                    placeholder="Select"
                    :disabled="scene"
                    style="width: 200px"
                >
                    <el-option
                        v-for="c2 in categoryStore.c2Arr"
                        :key="c2.id"
                        :label="c2.name"
                        :value="c2.id"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="三级分类">
                <el-select
                    v-model="categoryStore.c3Id"
                    placeholder="Select"
                    :disabled="scene"
                    style="width: 200px"
                >
                    <el-option
                        v-for="c3 in categoryStore.c3Arr"
                        :key="c3.id"
                        :label="c3.name"
                        :value="c3.id"
                    ></el-option>
                </el-select>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script setup lang="ts">
import useCategoryStore from '@/store/modules/category'
import { onMounted } from 'vue'

defineProps(['scene'])

const categoryStore = useCategoryStore()

onMounted(() => {
    getC1()
})

const getC1 = () => {
    categoryStore.getC1()
}

const handler = () => {
    categoryStore.c2Id = ''
    categoryStore.c3Arr = []
    categoryStore.c3Id = ''
    //通知仓库获取二级分类的数据
    categoryStore.getC2()
}
//此方法即为二级分类下拉菜单的change事件(选中值的时候会触发,保证二级分类ID有了)
const handler1 = () => {
    //清理三级分类的数据
    categoryStore.c3Id = ''
    categoryStore.getC3()
}
</script>
