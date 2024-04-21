<template>
    <el-card style="height: 80px">
        <el-form :inline="true" class="form">
            <el-form-item label="角色名:" ref="form">
                <el-input
                    placeholder="请你输入搜索角色名"
                    v-model="keyword"
                ></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="default" @click="search">
                    搜索
                </el-button>
                <el-button type="primary" size="default" @click="reset">
                    重置
                </el-button>
            </el-form-item>
        </el-form>
    </el-card>
    <el-card style="margin: 10px 0px">
        <el-button type="primary" size="default" @click="addRole">
            添加角色
        </el-button>
        <el-table style="margin: 10px 0px" :data="allRole" border>
            <el-table-column
                label="#"
                align="center"
                type="index"
            ></el-table-column>
            <el-table-column
                label="ID"
                prop="id"
                align="center"
                width="150px"
            ></el-table-column>
            <el-table-column
                label="角色名称"
                align="center"
                prop="roleName"
                show-overflow-tooltip
            ></el-table-column>
            <el-table-column
                label="创建时间"
                align="center"
                prop="createTime"
                show-overflow-tooltip
            ></el-table-column>
            <el-table-column
                label="更新时间"
                align="center"
                prop="updateTime"
                show-overflow-tooltip
            ></el-table-column>
            <el-table-column label="操作" width="300px" align="center">
                <template #="{ row }">
                    <el-button
                        type="primary"
                        size="small"
                        icon="User"
                        @click="setPermisstion(row)"
                    >
                        分配权限
                    </el-button>
                    <el-button
                        type="primary"
                        size="small"
                        icon="Edit"
                        @click="updateRole(row)"
                    >
                        编辑
                    </el-button>
                    <el-popconfirm
                        :title="`你确定要删除?`"
                        width="260px"
                        @confirm="removeRole(row)"
                    >
                        <template #reference>
                            <el-button
                                type="primary"
                                size="small"
                                icon="Delete"
                            >
                                删除
                            </el-button>
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
            @current-change="reqHasRole"
            @size-change="sizeChange"
        />
    </el-card>
    <el-dialog
        v-model="dialogVisite"
        :title="RoleParams.id ? '更新职位' : '添加职位'"
    >
        <el-form :model="RoleParams" :rules="rules" ref="form">
            <el-form-item label="职位名称" prop="roleName">
                <el-input
                    placeholder="请你输入职位名称"
                    v-model="RoleParams.roleName"
                ></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button
                type="primary"
                size="default"
                @click="dialogVisite = false"
            >
                取消
            </el-button>
            <el-button type="primary" size="default" @click="save">
                确定
            </el-button>
        </template>
    </el-dialog>
    <el-drawer v-model="drawer">
        <template #header>
            <h4>分配权限</h4>
        </template>
        <template #default>
            <!-- 树形控件 -->
            <el-tree
                ref="tree"
                :data="menuArr"
                show-checkbox
                node-key="id"
                default-expand-all
                :default-checked-keys="selectArr"
                :props="defaultProps"
            />
        </template>
        <template #footer>
            <div style="flex: auto">
                <el-button @click="drawer = false">取消</el-button>
                <el-button type="primary" @click="handler">确定</el-button>
            </div>
        </template>
    </el-drawer>
</template>

<script setup lang="ts">
import {
    reqAllRoleList,
    reqAddOrUpdateRole,
    reqAllMenuList,
    reqSetPermisstion,
    reqDeleteIdRole,
} from '@/api/acl/role'
import { Role, MenuResponseData, Records } from '@/api/acl/role/type'
import { nextTick, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { MenuList } from '@/api/acl/role/type'
import useLayOutSettingStore from '@/store/modules/setting'

let pageNo = ref(1)
let pageSize = ref(10)
let total = ref(0)
let keyword = ref('')
let form = ref()
let allRole = ref<Records>([])
let dialogVisite = ref(false)
let RoleParams = ref<Role>({ roleName: '' })
let drawer = ref(false)
let menuArr = ref<MenuList>([])
let selectArr = ref<number[]>([])
let tree = ref()
let LayOutSettingStore = useLayOutSettingStore()

const defaultProps = {
    children: 'children',
    label: 'name',
}

onMounted(() => reqHasRole())

const reqHasRole = async (page = 1, keyword = '') => {
    pageNo.value = page
    let result: any = await reqAllRoleList(
        pageNo.value,
        pageSize.value,
        keyword,
    )
    if (result.code == 200) {
        total.value = result.data.total
        allRole.value = result.data.records
    }
}

//下拉菜单的回调
const sizeChange = () => {
    reqHasRole()
}

const addRole = () => {
    //对话框显示出来
    dialogVisite.value = true
    //清空数据
    Object.assign(RoleParams.value, {
        roleName: '',
        id: 0,
    })
    //清空上一次表单校验错误结果
    nextTick(() => {
        form.value.clearValidate('roleName')
    })
}

const validatorRoleName = (_: any, value: any, callback: any) => {
    if (value.trim().length >= 2) {
        callback()
    } else {
        callback(new Error('职位名称不能小于两位'))
    }
}

const rules = {
    roleName: [
        { required: true, trigger: 'blur', validator: validatorRoleName },
    ],
}

const search = async () => {
    reqHasRole(1, keyword.value)
    keyword.value = ''
}

const reset = () => {
    LayOutSettingStore.refresh = !LayOutSettingStore.refresh
}

const save = async () => {
    await form.value.validate()
    let result: any = await reqAddOrUpdateRole(RoleParams.value)
    if (result.code == 200) {
        ElMessage({
            type: 'success',
            message: RoleParams.value.id ? '更新成功' : '添加成功',
        })
        dialogVisite.value = false
        reqHasRole(RoleParams.value.id ? pageNo.value : 1)
    }
}

const updateRole = async (row: Role) => {
    dialogVisite.value = true
    Object.assign(RoleParams.value, row)
    nextTick(() => {
        form.value.clearValidate('roleName')
    })
}

const filterSelectArr = (allData: any, initArr: any) => {
    allData.forEach((item: any) => {
        if (item.select && item.level == 4) {
            initArr.push(item.id)
        }
        if (item.children && item.children.length > 0) {
            filterSelectArr(item.children, initArr)
        }
    })

    return initArr
}

const setPermisstion = async (row: Role) => {
    drawer.value = true
    let result: MenuResponseData = await reqAllMenuList(row.id as number)
    Object.assign(RoleParams.value, row)

    if (result.code == 200) {
        menuArr.value = result.data
        selectArr.value = filterSelectArr(menuArr.value, [])
    }
}

const removeRole = async (row: Role) => {
    let result: any = await reqDeleteIdRole(row.id as number)
    if (result.code == 200) {
        //提示信息
        ElMessage({ type: 'success', message: '删除成功' })
        reqHasRole(pageNo.value)
    } else {
        ElMessage({ type: 'error', message: result.data })
    }
}

const handler = async () => {
    let ID = RoleParams.value.id as number
    let arr = tree.value.getCheckedKeys()
    //半选的ID
    let arr1 = tree.value.getHalfCheckedKeys()
    let permissionId = arr.concat(arr1)
    let result: any = await reqSetPermisstion(ID, permissionId)
    if (result.code == 200) {
        //抽屉关闭
        drawer.value = false
        //提示信息
        ElMessage({ type: 'success', message: '分配权限成功' })
        //页面刷新
        const timer = setTimeout(() => {
            window.location.reload()
            clearTimeout(timer)
        }, 1000)
    } else {
        ElMessage({ type: 'success', message: result.data })
    }
}
</script>

<style lang="scss" scoped>
.form {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>
