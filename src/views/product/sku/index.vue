<template>
    <el-card>
        <el-table border style="margin: 10px 0px" :data="skuArr">
            <el-table-column
                label="序号"
                type="index"
                align="center"
                width="80px"
            ></el-table-column>
            <el-table-column
                label="名称"
                show-overflow-tooltip
                width="150px"
                prop="skuName"
            ></el-table-column>
            <el-table-column
                label="描述"
                show-overflow-tooltip
                width="150px"
                prop="skuDesc"
            ></el-table-column>
            <el-table-column label="图片" width="150px">
                <template #="{ row }">
                    <img
                        :src="row.skuDefaultImg"
                        alt=""
                        style="width: 100px; height: 100px"
                    />
                </template>
            </el-table-column>
            <el-table-column
                label="重量"
                width="150px"
                prop="weight"
            ></el-table-column>
            <el-table-column
                label="价格"
                width="150px"
                prop="price"
            ></el-table-column>
            <el-table-column label="操作" width="250px" fixed="right">
                <template #="{ row }">
                    <el-button
                        :type="row.isSale == 0 ? 'primary' : 'warning'"
                        size="small"
                        :icon="row.isSale == 1 ? 'Bottom' : 'Top'"
                        @click="updateSale(row)"
                    ></el-button>
                    <el-button
                        type="success"
                        size="small"
                        icon="Edit"
                        @click="updateSku"
                    ></el-button>
                    <el-button
                        type="info"
                        size="small"
                        icon="InfoFilled"
                        @click="findSku(row)"
                    ></el-button>
                    <el-popconfirm
                        :title="`你确定要删除${row.skuName}?`"
                        width="200px"
                        @confirm="removeSku(row.id)"
                    >
                        <template #reference>
                            <el-button
                                type="danger"
                                size="small"
                                icon="Delete"
                            ></el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            v-model:current-page="pageNo"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 30, 40]"
            :background="true"
            layout="prev, pager, next, jumper,->,sizes,total"
            :total="total"
            @size-change="handler"
            @current-change="getHasSku"
        />
        <el-drawer v-model="drawer">
            <!-- 标题部分 -->
            <template #header>
                <h4>查看商品的详情</h4>
            </template>
            <template #default>
                <el-row style="margin: 10px 0px">
                    <el-col :span="6">名称</el-col>
                    <el-col :span="18">{{ skuInfo.skuName }}</el-col>
                </el-row>
                <el-row style="margin: 10px 0px">
                    <el-col :span="6">描述</el-col>
                    <el-col :span="18">{{ skuInfo.skuDesc }}</el-col>
                </el-row>
                <el-row style="margin: 10px 0px">
                    <el-col :span="6">价格</el-col>
                    <el-col :span="18">{{ skuInfo.price }}</el-col>
                </el-row>
                <el-row style="margin: 10px 0px">
                    <el-col :span="6">平台属性</el-col>
                    <el-col :span="18">
                        <el-tag
                            style="margin: 5px"
                            v-for="item in skuInfo.skuAttrValueList"
                            :key="item.id"
                        >
                            {{ item.valueName }}
                        </el-tag>
                    </el-col>
                </el-row>
                <el-row style="margin: 10px 0px">
                    <el-col :span="6">销售属性</el-col>
                    <el-col :span="18">
                        <el-tag
                            style="margin: 5px"
                            v-for="item in skuInfo.skuSaleAttrValueList"
                            :key="item.id"
                        >
                            {{ item.saleAttrValueName }}
                        </el-tag>
                    </el-col>
                </el-row>
                <el-row style="margin: 10px 0px">
                    <el-col :span="6">商品图片</el-col>
                    <el-col :span="18">
                        <el-carousel
                            :interval="4000"
                            type="card"
                            height="200px"
                        >
                            <el-carousel-item
                                v-for="item in skuInfo.skuImageList"
                                :key="item.id"
                            >
                                <img
                                    :src="item.imgUrl"
                                    alt=""
                                    style="width: 100%; height: 100%"
                                />
                            </el-carousel-item>
                        </el-carousel>
                    </el-col>
                </el-row>
            </template>
        </el-drawer>
    </el-card>
</template>

<script setup lang="ts">
import {
    reqCancelSale,
    reqRemoveSku,
    reqSaleSku,
    reqSkuInfo,
    reqSkuList,
} from '@/api/product/sku'
import { SkuResponseData, SkuData, SkuInfoData } from '@/api/product/sku/type'
import { ElMessage } from 'element-plus'
import { ref, onMounted } from 'vue'

let pageNo = ref<number>(1)
let pageSize = ref(10)
let total = ref()
let skuArr = ref()
let drawer = ref(false)
let skuInfo = ref<any>({})

onMounted(() => {
    getHasSku()
})

const getHasSku = async (page = 1) => {
    pageNo.value = page
    let result: SkuResponseData = await reqSkuList(pageNo.value, pageSize.value)
    if (result.code == 200) {
        total.value = result.data.total
        skuArr.value = result.data.records
    }
}

const updateSale = async (row: SkuData) => {
    if (row.isSale == 1) {
        //下架操作
        await reqCancelSale(row.id as number)
        //提示信息
        ElMessage({ type: 'success', message: '下架成功' })
        //发请求获取当前更新完毕的全部已有的SKU
        getHasSku(pageNo.value)
    } else {
        //下架操作
        await reqSaleSku(row.id as number)
        //提示信息
        ElMessage({ type: 'success', message: '上架成功' })
        //发请求获取当前更新完毕的全部已有的SKU
        getHasSku(pageNo.value)
    }
}

const updateSku = () => {
    ElMessage({ type: 'success', message: '程序员在努力的更新中....' })
}

const findSku = async (row: SkuData) => {
    //抽屉展示出来
    drawer.value = true
    let result: SkuInfoData = await reqSkuInfo(row.id as number)
    skuInfo.value = result.data
    console.log(skuInfo.value)
}

const removeSku = async (skuId: number) => {
    let result = await reqRemoveSku(skuId)
    if (result.code == 200) {
        ElMessage({
            type: 'success',
            message: '删除成功',
        })
        getHasSku()
    } else {
        ElMessage({
            type: 'error',
            message: result.data,
        })
    }
}

//分页器下拉菜单发生变化触发,pagesize发生变化，current-change会给回调函数注入页数，不能共用getHashSku
const handler = (_: number) => {
    getHasSku()
}
</script>

<style lang="scss" scoped></style>
