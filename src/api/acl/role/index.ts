import request from '@/utils/request'
import { MenuResponseData, Role, RoleResponseData } from './type'

enum API {
    ALLROLE_URL = '/admin/acl/role/',
    ADDROLE_URL = '/admin/acl/role/save',
    UPDATEROLE_URL = '/admin/acl/role/update',
    //获取全部的菜单与按钮的数据
    ALLPERMISSTION = '/admin/acl/permission/toAssign/',
    //给相应的职位分配权限
    SETPERMISTION_URL = '/admin/acl/permission/doAssign/?',
    DELETEIDROEL_URL = '/admin/acl/role/remove/',
}

// 获取角色分页列表
export const reqAllRoleList = (
    page: number,
    limit: number,
    roleName: string,
) => {
    return request.get<any, RoleResponseData>(
        API.ALLROLE_URL + `/${page}/${limit}/?roleName=${roleName}`,
    )
}

// 添加或修改角色
export const reqAddOrUpdateRole = (data: Role) => {
    if (data.id) {
        return request.put<any, any>(API.UPDATEROLE_URL, data)
    } else {
        return request.post<any, any>(API.ADDROLE_URL, data)
    }
}

//获取全部菜单与按钮权限数据
export const reqAllMenuList = (roleId: number) => {
    return request.get<any, MenuResponseData>(API.ALLPERMISSTION + roleId)
}

//给相应的职位下发权限
export const reqSetPermisstion = (roleId: number, permissionId: number[]) =>
    request.post(
        API.SETPERMISTION_URL + `roleId=${roleId}&permissionId=${permissionId}`,
    )

//删除id列表的角色
export const reqDeleteIdRole = (ID: number) => {
    return request.delete<any, any>(API.DELETEIDROEL_URL + ID)
}
