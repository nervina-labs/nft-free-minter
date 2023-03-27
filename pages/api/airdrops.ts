import { NextApiRequest, NextApiResponse } from 'next'
import axios, { AxiosError } from 'axios'
import { NFTBOX_ACCESS_TOKEN, NFTBOX_SERVER_URL } from '@/constants'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(404).end()
    return
  }
  if (!('address' in req.body)) {
    res.status(401).end()
    return
  }
  const address = req.body.address
  try {
    await axios.post(
      `${NFTBOX_SERVER_URL}/airdrops`,
      { address },
      {
        params: {
          access_token: NFTBOX_ACCESS_TOKEN,
        },
      }
    )
    res.status(200)
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
