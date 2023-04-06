import axios, { Axios } from 'axios'
import { HolderToken } from '@/api/models/HolderToken'
import { AuthResponseData, SignMessageResponseData } from '@joyid/core'

export class API {
  private axios: Axios

  constructor() {
    this.axios = axios.create()
  }

  postAirdrops(
    address: string,
    signData: SignMessageResponseData | AuthResponseData
  ) {
    return this.axios.post('/api/airdrops', {
      address,
      ...signData,
    })
  }

  getHolderTokens(address: string) {
    return this.axios.get<HolderToken>(`/api/holder_tokens`, {
      params: {
        address,
      },
    })
  }

  getClaimCount() {
    return this.axios.get<{ claimed_count: number }>('/api/airdrops')
  }
}

export const api = new API()
