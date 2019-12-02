<template>
  <div>
      <van-nav-bar
            title="首页"
            left-arrow
        />
        <van-tabs v-model="active">
            <van-tab
            :title="channel.name"
            v-for="channel in channels "
            :key="channel.id">
                 <!--
          文章列表
          van-pull-refresh 下拉刷新功能
          van-list 列表，带有上拉加载更多功能
        -->
            <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
                <van-list
                    v-model="loading"
                    :finished="finished"
                    finished-text="没有更多了"
                    @load="onLoad"
                >
                <van-cell
                    v-for="item in channel.articles"
                    :key="item"
                    :title="item"
                />
            </van-list>
            </van-pull-refresh>
            </van-tab>
        </van-tabs>
  </div>
</template>

<script>
import { getUserChannels } from '@/api/user'
// import { getArticles } from '@/api/article'
export default {
  name: 'HomePage',
  components: {},
  props: {},
  data () {
    return {
      active: 0,
      list: [],
      loading: false,
      finished: false,
      isLoading: false,
      channels: [] // 频道列表

    }
  },
  computed: {},
  watch: {
  },
  created () {
    this.loadUserChannels()
  },
  methods: {
    async loadUserChannels () {
      const res = await getUserChannels()
      const channels = res.data.data.channels
      channels.forEach(channel => {
        channel.articles = []
        channel.finished = false
      })
      this.channels = channels
    },
    onLoad () {
      // 获取当前频道
      // this.active双向绑定了标签页组件，该组件正好对应频道的索引
      const activeChannel = this.channels[this.active]
      // 获取当前文章的频道列表5
      const articles = activeChannel.articles

      // 异步更新数据
      // 请求加载数据
      setTimeout(() => {
        // 2.将数据添加到当前频道的文章列表中
        for (let i = 0; i < 10; i++) {
          articles.push(articles.length + 1)
        }
        // 加载状态结束
        // 关闭本次的loading 状态，它会判定当前数据是否够一频，不够就继续自动onload
        this.loading = false
        // 4.判断如果没有数据了，将当前品达的结束状态finished 设置为true
        // 数据全部加载完成
        if (articles.length >= 40) {
          // 如果没有数据了，将当前频道的结束状态设置为true，之后不再触发onload
          activeChannel.finished = true
        }
      }, 500)
    },
    onRefresh () {
      setTimeout(() => {
        this.$toast('刷新成功')
        this.isLoading = false
      }, 2000)
    }
  }

}
</script>

<style>

</style>
