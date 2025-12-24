import { defineStore } from 'pinia'
import axios from 'axios'

const api = axios.create({
  baseURL: 'https://51383.wu.elitepro.ltd/api',
  timeout: 5000,
})

interface User {
  id: number
  name: string
  age: number
}

interface UserResponse {
  code: number
  message: string
  data: User[]
}

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [] as User[],
    loading: false,
  }),
  actions: {
    // 取得用戶清單
    async fetchUsers() {
      try {
        const { data } = await api.get<UserResponse>('/user')
        this.users = data.data
      } catch (error) {
        console.error('Fetch error:', error)
      }
    },
    // 修改用戶資訊
    async updateUser(user: User) {
      try {
        await api.put(`/user`, user)
        await this.fetchUsers()
      } catch (error) {
        console.error('Update error:', error)
      }
    },
    // 創建用戶
    async addUser(user: Omit<User, 'id'>) {
      try {
        await api.post('/user', user)
        await this.fetchUsers() // 重新整理列表
      } catch (error) {
        console.error('Add error:', error)
      }
    },

    // 刪除用戶
    async deleteUser(id: number) {
      try {
        await api.delete(`/user`, { data: { id } })
        await this.fetchUsers()
      } catch (error) {
        console.error('Delete error:', error)
      }
    },
  },
})
