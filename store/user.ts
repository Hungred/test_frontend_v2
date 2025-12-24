import { defineStore } from 'pinia'
import {
  UserApi,
  Configuration,
  type MainGetUserInfoResp,
  type MainCreateUserInfoReq,
  type MainUpdateUserInfoReq,
} from '~/api-client'

const apiConfig = new Configuration({
  basePath: 'https://51383.wu.elitepro.ltd/api',
})

const api = new UserApi(apiConfig)

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [] as MainGetUserInfoResp[],
    error: null as string | null,
  }),

  actions: {
    // 取得用戶清單
    async fetchUsers() {
      try {
        const { data } = await api.getUserInfo()
        this.users = data.data || []
      } catch (error) {
        this.error = '無法取得用戶列表'
        console.error('Fetch error:', error)
      }
    },

    // 創建用戶
    async addUser(payload: MainCreateUserInfoReq) {
      try {
        await api.createUserInfo(payload)
        await this.fetchUsers()
      } catch (error) {
        console.error('Add error:', error)
      }
    },

    // 修改用戶資訊
    async updateUser(payload: MainUpdateUserInfoReq) {
      try {
        await api.updateUserInfo(payload)
        await this.fetchUsers()
      } catch (error) {
        console.error('Update error:', error)
      }
    },

    // 刪除用戶
    async deleteUser(id: number) {
      try {
        await api.deleteUserInfo({ id })
      } catch (error) {
        console.error('Delete error:', error)
      } finally {
        await this.fetchUsers()
      }
    },
  },
})
