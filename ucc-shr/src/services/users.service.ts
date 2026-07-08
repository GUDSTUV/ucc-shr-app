import { api } from './api'

export const usersService = {
  changePassword: async (data: any) => {
    return api.post('/user/password', data)
  },
  getSavedItems: async () => {
    return api.get('/user/saved')
  },
  saveItem: async (data: { type: string, id: string }) => {
    return api.post('/user/saved', data)
  },
  unsaveItem: async (data: { type: string, id: string }) => {
    return api.delete('/user/saved', { body: JSON.stringify(data) })
  }
}
