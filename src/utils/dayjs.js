// 封装自定义dayjs日期处理模块
import Vue from 'vue'
import dayjs from 'dayjs'

import 'dayjs/locale/zh-cn' // 按需加载

import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.locale('zh-cn')

dayjs.extend(relativeTime)
// 扩展一个全局过滤器，计算相对时间
Vue.filter('relativeTime', value => {
  // dayjs（）获取当前最新时间
  // dayjs（）会把你给定的时间转为自己的时间类型
  //   2019-12-3 10:19:37
  //   156156156165
  //   2019
  //   2019-12-3
  return dayjs().from(dayjs(value))
})
