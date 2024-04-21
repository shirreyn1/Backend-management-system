export const SET_TOKEN = (token: string) => {
    return localStorage.setItem('TOKEN', token)
}

export const GET_TOKEN = (): string | null => {
    return localStorage.getItem('TOKEN')
}

export const REMOVE_TOKEN = () => {
    localStorage.removeItem('TOKEN')
}
