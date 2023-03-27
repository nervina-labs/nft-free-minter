export interface HolderToken {
  holder_address: string
  meta: Meta
  token_list: Token[]
}

export interface Meta {
  total_count: number
  current_page: number
}

export interface Token {
  token_uuid: string
  n_token_id: number
  class_uuid: string
  class_name: string
  class_bg_image_url: string
  renderer_type: string
  class_description: string
  class_total: string
  class_issued: string
  is_class_banned: boolean
  tx_state: string
  issuer_name: string
  issuer_avatar_url: string
  issuer_uuid: string
  is_issuer_banned: boolean
  from_address: string
  to_address: string
  token_outpoint: TokenOutpoint
  verified_info: any
  class_likes: number
  card_back_content_exist: boolean
  configure: number
  n_state: number
  characteristic: string
  on_chain_timestamp: number
  script_type: string
}

export interface TokenOutpoint {
  tx_hash: any
  index: any
}
