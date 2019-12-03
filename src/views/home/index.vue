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
                    :finished="channel.finished"
                    finished-text="没有更多了"
                    @load="onLoad"
                >

                <van-cell
                    v-for="article in channel.articles"
                    :key="article.art_id.toString()"
                    :title="article.title"
                />
            </van-list>
            </van-pull-refresh>
            </van-tab>
        </van-tabs>
  </div>
</template>

<script>
import { getUserChannels } from '@/api/user'
import { getArticles } from '@/api/article'
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

    async onLoad () {
      // 获取当前频道
      // this.active双向绑定了标签页组件，该组件正好对应频道的索引
      const activeChannel = this.channels[this.active]
      // 获取当前文章的频道列表5
      const articles = activeChannel.articles

      // 异步更新数据
      // 请求加载数据
      // setTimeout(() => {
      //   // 2.将数据添加到当前频道的文章列表中
      //   for (let i = 0; i < 10; i++) {
      //     articles.push(articles.length + 1)
      //   }
      //   // 加载状态结束
      //   // 关闭本次的loading 状态，它会判定当前数据是否够一频，不够就继续自动onload
      //   this.loading = false
      //   // 4.判断如果没有数据了，将当前品达的结束状态finished 设置为true
      //   // 数据全部加载完成
      //   if (articles.length >= 40) {
      //     // 如果没有数据了，将当前频道的结束状态设置为true，之后不再触发onload
      //     activeChannel.finished = true
      //   }
      // }, 500)
      const res = await getArticles({
        channel_id: activeChannel.id, // 频道id
        timestamp: activeChannel.timestamp || Date.now(),
        // 获取下一页数据的时间戳，Date。new（）表示获取当前最新数据
        with_top: 1
      })
      articles.push(...res.data.data.results)
      // 将loading设置为false
      this.loading = false
      // 4.判断还有下一页数据，则获取下一页数据时间戳
      // 如果没有了，则将finished 设置为true 不用再加载更多了
      const pritimes = res.data.data.pre_timestamp
      if (pritimes) {
        activeChannel.timestamp = pritimes
      } else {
        activeChannel.finished = true
      }
    },
    async loadUserChannels () {
      const res = await getUserChannels()
      const channels = res.data.data.channels
      channels.forEach(channel => {
        channel.articles = [] // 频道文章列表
        channel.finished = false // 频道的加载结束状态
        channel.loading = false //  存储频道的加载更多的loading 状态
        channel.timestamp = null // 用于获取下一页数据的时间戳
        channel.isPullDowmLoading = false // 存储频道的下拉刷新loading状态
      })
      this.channels = channels //
    },
    // 下拉刷新
    async onRefresh () {
      // 获取当期激活频道对象
      const activeChannel = this.channels[this.active]
      // 1.请求获取最新推荐文章列表
      const res = await getArticles({
        channel_id: activeChannel.id,
        timestamp: Date.now(), // 下拉刷新永远都是在获取最新推荐的文章列表，所以传递当前最新时间戳
        with_top: 1
      })
      // 将数据添加到文章列表顶部
      activeChannel.articles.unshift(...res.data.data.results)
      activeChannel.isPullDowmLoading = false

      // const articles = res.data.data.results
      // activeChannel.articles.unshigt(...articles)
      // 停止下拉转圈圈
      this.isLoading = false
      // const message = articles.length
      // ? `更新了${articles.length}条数据` : '暂无数据'

      this.$toast('更新成功')
    }
  }

}
</script>

<style>

</style>
