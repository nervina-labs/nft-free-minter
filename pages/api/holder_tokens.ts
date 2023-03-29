import { NextApiRequest, NextApiResponse } from 'next'
import axios, { AxiosError } from 'axios'
import { NFTBOX_SERVER_URL } from '@/constants'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.status(404).end()
    return
  }
  try {
    const response = await axios.get(`${NFTBOX_SERVER_URL}/holder_tokens`, {
      params: {
        address: req.query.address,
      },
    })
    res.status(response.status).json(response.data)
  } catch (error) {
    console.error(error)
    if (error instanceof AxiosError) {
      res.status(error.status || 500).json(error.response?.data || {})
    } else {
      res.status(500)
    }
  }
  res.end()
}
