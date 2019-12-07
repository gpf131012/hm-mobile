<template>
  <div>
    <!-- 导航栏 -->
    <van-nav-bar :title="title" left-arrow
        @click-left="$router.back()"
    />
    <!-- 导航栏 -->
    <!-- 文章列表 -->
    <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
    >
        <van-cell
            v-for="item in list"
            :key="item.art_id.toString()"
            :title="item.title"
        >
        </van-cell>
    </van-list>
    <!-- 文章列表 -->

  </div>
</template>

<script>
import { getSearch } from '@/api/search'

export default {
  name: 'SearchResult',
  components: {},
  props: {},
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1 // 分页
    }
  },
  computed: {
    title () {
      return `${this.$route.params.q}的搜索结果`
    }
  },
  watch: {
  },
  created () {},
  methods: {
    async onLoad () {
      // 异步更新数据
      const res = await getSearch({
        page: this.page, // 页数，不传默认1
        per_page: 20, // 每页数量，不传每页数量有后端决定
        q: this.$route.params.q // 搜索关键字
      })
      // 2.将数据添加到数据列表
      const results = res.data.data.results
      this.list.push(...results)
      // 将本次loading 设置为false
      this.loading = false
      // 4.判断是否还有数据，如果没有则将finished设置为reue
      if (results.length) {
        this.page++
      } else {
        this.finished = true
      }
    }
  }
}
</script>

<style scoped></style>
