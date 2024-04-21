import { defineStore } from 'pinia'

const useLayOutSettingStore = defineStore('SettingStore', {
    state: () => {
        return {
            fold: false,
            refresh: false,
        }
    },
})

export default useLayOutSettingStore
