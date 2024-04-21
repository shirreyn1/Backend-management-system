<template>
    <div>
        <Category :scene="scene"></Category>
        <el-card style="margin: 10px 0px">
            <div v-show="!scene">
                <el-button
                    @click="addAttr"
                    type="primary"
                    size="default"
                    icon="Plus"
                    :disabled="categoryStore.c3Id ? false : true"
                >
                    添加属性
                </el-button>
                <el-table border style="margin: 10px 0px" :data="attrArr">
                    <el-table-column
                        label="序号"
                        type="index"
                        align="center"
                        width="80px"
                    ></el-table-column>
                    <el-table-column
                        label="属性名称"
                        width="120px"
                        prop="attrName"
                    ></el-table-column>
                    <el-table-column label="属性值名称">
                        <template #="{ row }">
                            <el-tag
                                style="margin: 5px"
                                v-for="item in row.attrValueList"
                                :key="item.id"
                            >
                                {{ item.valueName }}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="120px">
                        <!-- row：已有的属性对象 -->
                        <template #="{ row }">
                            <!-- 修改已有属性的按钮 -->
                            <el-button
                                type="primary"
                                size="small"
                                icon="Edit"
                                @click="updateAttr(row)"
                            ></el-button>
                            <el-popconfirm
                                :title="`你确定删除${row.attrName}?`"
                                width="200px"
                                @confirm="deleteAttr(row.id)"
                            >
                                <template #reference>
                                    <el-button
                                        type="primary"
                                        size="small"
                                        icon="Delete"
                                    ></el-button>
                                </template>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div v-show="scene">
                <!-- 展示添加属性与修改数据的结构 -->
                <el-form :inline="true">
                    <el-form-item label="属性名称">
                        <el-input
                            placeholder="请你输入属性名称"
                            v-model="attrParams.attrName"
                        ></el-input>
                    </el-form-item>
                </el-form>
                <el-button
                    @click="addAttrValue"
                    :disabled="!attrParams.attrName"
                    type="primary"
                    size="default"
                    icon="Plus"
                >
                    添加属性值
                </el-button>
                <el-table
                    border
                    style="margin: 10px 0px"
                    :data="attrParams.attrValueList"
                >
                    <el-table-column
                        label="序号"
                        width="80px"
                        type="index"
                        align="center"
                    ></el-table-column>
                    <el-table-column label="属性值名称">
                        <!-- row:即为当前属性值对象 -->
                        <template #="{ row, $index }">
                            <el-input
                                :ref="(vc: any) => (inputArr[$index] = vc)"
                                v-if="row.flag"
                                @blur="toLook(row, $index)"
                                size="small"
                                placeholder="请你输入属性值名称"
                                v-model="row.valueName"
                            ></el-input>
                            <div v-else @click="toEdit(row, $index)">
                                {{ row.valueName }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="属性值操作">
                        <template #="{ index }">
                            <el-button
                                type="primary"
                                size="small"
                                icon="Delete"
                                @click="
                                    attrParams.attrValueList.splice(index, 1)
                                "
                            ></el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-button
                    type="primary"
                    size="default"
                    @click="save"
                    :disabled="
                        attrParams.attrValueList.length > 0 ? false : true
                    "
                >
                    保存
                </el-button>
                <el-button type="primary" size="default" @click="cancel">
                    取消
                </el-button>
            </div>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { reqAttr } from '@/api/product/attr'
import useCategoryStore from '@/store/modules/category'
import { watch, reactive, ref, nextTick, onBeforeUnmount } from 'vue'
import {
    Attr,
    AttrList,
    AttrResponseData,
    AttrValue,
} from '@/api/product/attr/type'
import { reqAddOrUpdateAttr, reqRemoveAttr } from '@/api/product/attr'
import { ElMessage } from 'element-plus'

let categoryStore = useCategoryStore()

let attrArr = ref<AttrList>([])
let scene = ref<boolean>(false)
let attrParams = reactive<Attr>({
    attrName: '',
    attrValueList: [],
    categoryId: '',
    categoryLevel: 3,
})
//准备一个数组:将来存储对应的组件实例el-input
let inputArr = ref<any>([])

watch(
    () => categoryStore.c3Id,
    () => {
        attrArr.value = []
        if (categoryStore.c3Id) {
            getdetail()
        } else {
            return
        }
    },
)

const getdetail = async () => {
    const { c1Id, c2Id, c3Id } = categoryStore
    let result: AttrResponseData = await reqAttr(c1Id, c2Id, c3Id)
    if (result.code == 200) {
        attrArr.value = result.data
    }
}

const addAttr = () => {
    //每一次点击的时候,先清空一下数据再收集数据
    Object.assign(attrParams, {
        attrName: '', //新增的属性的名字
        attrValueList: [
            //新增的属性值数组
        ],
        categoryId: categoryStore.c3Id, //三级分类的ID
        categoryLevel: 3, //代表的是三级分类
    })
    scene.value = true
}

const cancel = () => {
    scene.value = false
    getdetail()
}

const save = async () => {
    let result: any = await reqAddOrUpdateAttr(attrParams)

    if (result.code == 200) {
        scene.value = false
        ElMessage({
            type: 'success',
            message: attrParams.id ? '修改属性成功' : '添加属性成功',
        })
        getdetail()
    } else {
        ElMessage({
            type: 'error',
            message: attrParams.id ? '修改属性失败' : '添加属性失败',
        })
    }
}

const addAttrValue = () => {
    //点击添加属性值按钮的时候,向数组添加一个属性值对象
    attrParams.attrValueList.push({
        valueName: '',
        flag: true, //控制每一个属性值编辑模式与切换模式的切换
    })
    //获取最后el-input组件聚焦
    nextTick(() => {
        inputArr.value[attrParams.attrValueList.length - 1].focus()
    })
}

//属性值表单元素失却焦点事件回调
const toLook = (row: AttrValue, $index: number) => {
    //非法情况判断1：属性值为空
    if (row.valueName.trim() == '') {
        attrParams.attrValueList.splice($index, 1)
        ElMessage({
            type: 'error',
            message: '属性值不能为空',
        })
        return
    }
    //非法情况2：属性值相同
    let repeat = attrParams.attrValueList.find((item) => {
        if (item != row) {
            return item.valueName === row.valueName
        }
    })

    if (repeat) {
        //将重复的属性值从数组当中干掉
        attrParams.attrValueList.splice($index, 1)
        //提示信息
        ElMessage({
            type: 'error',
            message: '属性值不能重复',
        })
        return
    }
    //相应的属性值对象flag:变为false,展示div
    row.flag = false
}

const toEdit = (row: AttrValue, $index: number) => {
    row.flag = true
    nextTick(() => {
        // 第一种方式
        /* inputArr.value.find((item: any) => {
            if (item) {
                return item.focus()
            }
        }) */
        // 第二种
        inputArr.value[$index].focus()
    })
}

const updateAttr = (row: Attr) => {
    scene.value = !scene.value
    console.log(row, row.attrValueList)

    //ES6->Object.assign进行对象的合并,并进行深拷贝
    Object.assign(attrParams, JSON.parse(JSON.stringify(row)))
    // 不好用
    /* attrParams.attrName = row.attrName
    attrParams = row */
}

const deleteAttr = async (attrId: number) => {
    //发相应的删除已有的属性的请求
    let result: any = await reqRemoveAttr(attrId)
    //删除成功
    if (result.code == 200) {
        ElMessage({
            type: 'success',
            message: '删除成功',
        })
        //获取一次已有的属性与属性值
        getdetail()
    } else {
        ElMessage({
            type: 'error',
            message: '删除失败',
        })
    }
}

//路由组件销毁的时候，把仓库分类相关的数据清空
onBeforeUnmount(() => {
    //清空仓库的数据
    categoryStore.$reset()
})
</script>
