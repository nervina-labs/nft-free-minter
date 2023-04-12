import axios, { Axios } from 'axios'
import { HolderToken } from '@/api/models/HolderToken'
import { AuthResponseData, SignMessageResponseData } from '@joyid/core'
import { NFTBOX_PUBLIC_SERVER_URL } from '@/constants'

export class API {
  private axios: Axios
  private nftboxAxios: Axios

  constructor() {
    this.axios = axios.create()
    this.nftboxAxios = axios.create({
      baseURL: NFTBOX_PUBLIC_SERVER_URL,
    })
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
    return this.nftboxAxios.get<HolderToken>(`/holder_tokens`, {
      params: {
        address,
      },
    })
  }

  getClaimCount() {
    return this.nftboxAxios.get<{ claimed_count: number }>('/airdrops')
  }
}

export const api = new API()
