//账号信息的ts类型
export interface ResponseData {
    code: number
    message: string
    ok: boolean
}

//代表一个账号信息的ts类型
export interface Role {
    id?: number
    createTime?: string
    updateTime?: string
    roleName?: string
    remark?: null
}

export type Records = Role[]

//获取全部用户信息接口返回的数据ts类型
export interface RoleResponseData extends ResponseData {
    data: {
        records: Records
        total: number
        size: number
        current: number
        pages: number
    }
}

//菜单与按钮数据的ts类型
export interface MunuData {
    id: number
    createTime: string
    updateTime: string
    pid: number
    name: string
    code: string
    toCode: string
    type: number
    status: null
    level: number
    children?: MenuList
    select: boolean
}
export type MenuList = MunuData[]

//菜单权限与按钮权限数据的ts类型
export interface MenuResponseData extends ResponseData {
    data: MenuList
}
