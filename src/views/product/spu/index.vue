<template>
    <div>
        <Category :scene="scene != 0"></Category>
        <el-card style="margin: 10px 0px">
            <div v-show="scene == 0">
                <el-button
                    @click="addSpu"
                    type="primary"
                    size="default"
                    icon="Plus"
                    :disabled="categoryStore.c3Id ? false : true"
                >
                    添加SPU
                </el-button>
                <!-- 展示已有SPU数据 -->
                <el-table style="margin: 10px 0px" border :data="records">
                    <el-table-column
                        label="序号"
                        type="index"
                        align="center"
                        width="80px"
                    ></el-table-column>
                    <el-table-column
                        label="SPU名称"
                        prop="spuName"
                    ></el-table-column>
                    <el-table-column
                        label="SPU描述"
                        prop="description"
                        show-overflow-tooltip
                    ></el-table-column>
                    <el-table-column label="SPU操作">
                        <!-- row:即为已有的SPU对象 -->
                        <template #="{ row }">
                            <el-button
                                type="primary"
                                size="small"
                                icon="Plus"
                                title="添加SKU"
                                @click="addSku(row)"
                            ></el-button>
                            <el-button
                                type="primary"
                                size="small"
                                icon="Edit"
                                title="修改SPU"
                                @click="updateSpu(row)"
                            ></el-button>
                            <el-button
                                type="primary"
                                size="small"
                                icon="View"
                                title="查看SKU列表"
                                @click="findSku(row)"
                            ></el-button>
                            <el-popconfirm
                                :title="`你确定删除${row.spuName}?`"
                                width="200px"
                                @confirm="deleteSpu(row)"
                            >
                                <template #reference>
                                    <el-button
                                        type="primary"
                                        size="small"
                                        icon="Delete"
                                        title="删除SPU"
                                    ></el-button>
                                </template>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>
                <el-dialog v-model="show" title="SKU列表">
                    <el-table border :data="skuArr">
                        <el-table-column
                            label="SKU名字"
                            prop="skuName"
                        ></el-table-column>
                        <el-table-column
                            label="SKU价格"
                            prop="price"
                        ></el-table-column>
                        <el-table-column
                            label="SKU重量"
                            prop="weight"
                        ></el-table-column>
                        <el-table-column label="SKU图片">
                            <template #="{ row }">
                                <img
                                    :src="row.skuDefaultImg"
                                    style="width: 100px; height: 100px"
                                />
                            </template>
                        </el-table-column>
                    </el-table>
                </el-dialog>
                <!-- 分页器 -->
                <el-pagination
                    v-model:current-page="pageNo"
                    v-model:page-size="pageSize"
                    :page-sizes="[3, 5, 7, 9]"
                    :background="true"
                    layout="prev, pager, next, jumper,->,sizes,total"
                    :total="total"
                    @current-change="getHasSpu"
                    @size-change="getHasSpu()"
                />
            </div>
            <SpuForm
                ref="spu"
                v-show="scene == 1"
                @changeScene="changeScene"
            ></SpuForm>
            <SkuForm
                ref="sku"
                v-show="scene == 2"
                @changeScene="changeScene"
            ></SkuForm>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { reqHasSpu, reqRemoveSpu, reqSkuList } from '@/api/product/spu'
import type {
    HasSpuResponseData,
    Records,
    SpuData,
    SkuInfoData,
} from '@/api/product/spu/type.ts'
import useCategoryStore from '@/store/modules/category'
import SkuForm from './skuForm.vue'
import SpuForm from './spuForm.vue'
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'

let categoryStore = useCategoryStore()
let scene = ref<number>(0)
let pageNo = ref<number>(1)
let pageSize = ref<number>(3)
let records = ref<Records>([])
let total = ref<number>(0)
let spu = ref<any>()
let sku = ref<any>()
let show = ref(false)
let skuArr = ref<SpuData[]>([])

watch(
    () => categoryStore.c3Id,
    () => {
        if (categoryStore.c3Id) getHasSpu()
    },
)

const getHasSpu = async (pager = 1) => {
    pageNo.value = pager
    let result: HasSpuResponseData = await reqHasSpu(
        pageNo.value,
        pageSize.value,
        categoryStore.c3Id,
    )
    if (result.code == 200) {
        records.value = result.data.records
        total.value = result.data.total
    }
}

const addSpu = () => {
    scene.value = 1
    spu.value.initAddSpu(categoryStore.c3Id)
}

const updateSpu = (row: SpuData) => {
    scene.value = 1
    spu.value.initHasSpuData(row)
}

const addSku = (row: SpuData) => {
    scene.value = 2
    sku.value.initSkuData(categoryStore.c1Id, categoryStore.c2Id, row)
}

const findSku = async (row: SpuData) => {
    const result: SkuInfoData = await reqSkuList(row.id as number)
    if (result.code == 200) {
        Object.assign(skuArr.value, result.data)
        //对话框显示出来
        show.value = true
    }
}

const deleteSpu = async (row: SpuData) => {
    let result = await reqRemoveSpu(row.id as number)
    console.log(result)
    if (result.code == 200) {
        ElMessage({
            type: 'success',
            message: '删除成功',
        })
        getHasSpu(pageNo.value)
    } else {
        ElMessage({
            type: 'error',
            message: result.data,
        })
    }
}

//子组件SpuForm绑定自定义事件:目前是让子组件通知父组件切换场景为0
const changeScene = (obj: any) => {
    //子组件Spuform点击取消变为场景0:展示已有的SPU
    scene.value = obj.flag
    if (obj.params == 'update') {
        //更新留在当前页
        getHasSpu(pageNo.value)
    } else {
        //添加留在第一页
        getHasSpu()
    }
}
</script>

<style lang="scss" scoped></style>
