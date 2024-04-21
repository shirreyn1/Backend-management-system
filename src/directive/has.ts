import useUserStore from '@/store/modules/user'

export const isHasButton = (app: any) => {
    const userStore = useUserStore()
    app.directive('has', {
        mounted(el: any, option: any) {
            if (!userStore.buttons.includes(option.name)) {
                // el.remove()
                el.disabled = true
            }
        },
    })
}
