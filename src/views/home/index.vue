<template>
  <div class="home">
      <van-nav-bar
            fixed
        >
          <van-button
            class="search-button"
            slot="title"
            round
            type="info"
            size="mini"
            @click="$router.push('/search')"
          >搜索</van-button>
        </van-nav-bar>
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
            <van-pull-refresh v-model="isLoading"
            @refresh="onRefresh">
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
                    @click="$router.push(`/article/${article.art_id}`)"
                >
                <div slot="label">
                  <van-grid :border="false" :column-num="3">
                    <van-grid-item v-for="(img,index) in article.cover.images"
                    :key="index">
                      <van-image height="80" :src="img" lazyload/>
                    </van-grid-item>
                  </van-grid>
                  <div class="article-info">
                    <span>{{article.aut_name}}</span>
                    <span>{{ article.comm_count}}评论</span>
                    <span>{{ article.pubdate | relativeTime}}</span>
                  </div>
                </div>
                </van-cell>
            </van-list>
            </van-pull-refresh>
            </van-tab>
              <!-- 面包按钮 -->
            <div slot="nav-right"
              class="wap-nav"
              @click="isChannelShow = true">
              <van-icon name="wap-nav" size="24" />
            </div>
              <!-- /面包按钮 -->
        </van-tabs>
        <!-- // 频道管理弹窗 -->
        <van-popup
          v-model="isChannelShow"
          round
          closeable
          close-icon-position="top-left"
          position="bottom"
          :style="{ height: '90%' }"
          @open="onChannelOpen"
        >
          <div class="channel-container">
              <van-cell title="我的频道" :border="false">
              <van-button type="danger" size="mini"
              @click = "isEdit = !isEdit"
              >{{isEdit ? '完成' :'编辑'}}</van-button>
            </van-cell>
            <van-grid :gutter="10">
              <van-grid-item
                v-for="(channel,index ) in channels"
                :key="channel.id"
                :text="channel.name"
                @click="onChannelActiveDelice(channel,index)"
              >
                <van-icon slot="icon"
                  v-show="isEdit"
                  size="15"
                  name="close"
                  class="close-icon"
                ></van-icon>
              </van-grid-item>
            </van-grid>

            <van-cell title="推荐频道" :border="false" />
            <van-grid :gutter="10">
              <van-grid-item
                v-for="channel in recommendChannels"
                :key="channel.id"
                :text="channel.name"
                @click = "onChannelAdd(channel)"
              />
            </van-grid>
          </div>
        </van-popup>
  </div>
</template>

<script>
import { getUserChannels } from '@/api/user'
import { getArticles } from '@/api/article'
import { getAllChannels } from '@/api/channels'
import { setItem, getItem } from '@/utils/storage'

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
      channels: [], // 频道列表
      isChannelShow: false,
      allChannels: [], // 所有频道列表
      isEdit: false // 控制删除频道显示
    }
  },
  computed: {
    recommendChannels () {
      const arr = []
      // 遍历所有频道
      this.allChannels.forEach(channel => {
        // 我的频道列表中是否包含当前遍历项
        const ret = this.channels.find(item => {
          // console.log(ret)
          return item.id === channel.id
        })
        // 如果不包含，那就收集到arr中
        if (!ret) {
          arr.push(channel)
        }
      })
      return arr
    }
  },
  watch: {
    channels () {
      setItem('channels', this.channels)
    }
  },
  created () {
    this.loadUserChannels()
  },
  methods: {
    // 当弹出层打开的时候触发
    async onChannelOpen () {
      const res = await getAllChannels()
      // console.log(res)
      this.allChannels = res.data.data.channels
      // console.log(this.allChannels)
    },
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
      let channels = []
      const localChannels = getItem('channels')
      // 如果有本地存储的频道列表，则获取使用
      if (localChannels) {
        channels = localChannels
      } else {
        // 如果没有，则请求获取线上推荐的频道列表
        const res = await getUserChannels()
        const onLineChannels = res.data.data.channels
        onLineChannels.forEach(channel => {
          channel.articles = [] // 频道文章列表
          channel.finished = false // 频道的加载结束状态
          channel.loading = false //  存储频道的加载更多的loading 状态
          channel.timestamp = null // 用于获取下一页数据的时间戳
          channel.isPullDowmLoading = false // 存储频道的下拉刷新loading状态
        })
        channels = onLineChannels
      }
      this.channels = channels//
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
    },
    onChannelAdd (channel) {
      // 将电机的频道项
      this.channels.push(channel)
      // 不需要刷新，我的频道改变，计算属性recommendChannel改变
    },
    onChannelActiveDelice (channel, index) {
      if (this.isEdit && channel.name !== '推荐') {
        // 编辑状态，执行删除操作
        this.channels.splice(index, 1)
      } else {
        // 非编辑状态，执行切换频道
        this.active = index
        this.isChannelShow = false
      }
    }
  }

}
</script>

<style scoped lang="less">
  .home {
     .channel-container {
    padding-top: 30px;
  }
    .article-info span {
      margin-right:10px
    }
    .van-tabs {
      // 频道列表
      /deep/ .van-tabs__wrap {
      position: fixed;
      top: 46px;
      z-index: 2;
      right: 0;
      left: 0;
    }
    // 频道内容
    /deep/ .van-tabs__content {
      margin-top: 90px;
    }
    }
    .wap-nav {
      position: sticky;
      right: 0;
      display: flex;
      align-items: center;
      background-color: #fff;
      opacity: 0.8; // 遮罩
    }
    .close-icon{
      position: absolute;
      top: -12px;
      right: -30px;
    }
    .search-button {
      width: 100px;
      background-color: #5babfb;
    }
  }
</style>
