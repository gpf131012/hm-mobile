// 搜索相关接口模块
import request from '@/utils/request'

export function getSuggestions (q) {
  return request({
    method: 'GET',
    url: '/app/v1_0/suggestion',
    params: {
      q
    }

  })
}
