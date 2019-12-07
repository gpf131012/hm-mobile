<template>
  <div class="search">
    <!-- 搜索框 -->
    <van-search
      v-model="searchText"
      placeholder="请输入搜索关键词"
      show-action
      shape="round"
      @search="onSearch"
      @input= "onSearchInput"
    >
      <div slot="action" @click="onSearch(searchText)">搜索</div>
    </van-search>
    <!-- /搜索框 -->

    <!-- 联想建议 -->
    <van-cell-group>
      <van-cell
        icon="search"
        :key="item"
        v-for="item in suggestions"
        @click="onSearch(item)"
       >
       <div slot="title" v-html="highlight(item)"></div>
       </van-cell>
    </van-cell-group>
    <!-- /联想建议 -->

     <!-- 搜索历史记录 -->
        <van-cell-group>
        <van-cell title="历史记录">
          <div v-show="isDelectShow">
            <span>全部删除</span>&nbsp;&nbsp;
            <span @click="isDelectShow = false">完成</span>
          </div>
            <van-icon
              v-show="!isDelectShow"
              @click="isDelectShow = true"
              name="delete" />
        </van-cell>
        <van-cell
            :title="item"
            :key="item"
            v-for="item in searchchHistories"
            @click="onSearch(item)"
        >
            <van-icon v-show="isDelectShow" name="close" />
        </van-cell>
</van-cell-group>
<!-- /搜索历史记录 -->
  </div>
</template>

<script>
import { getSuggestions } from '@/api/search'
import { setItem, getItem } from '@/utils/storage'

export default {
  name: 'SearchPage',
  components: {},
  props: {},
  data () {
    return {
      searchText: '', // 用户输入的搜索文本
      suggestions: [],
      searchchHistories: getItem('search-histories') || [], // 搜索历史记录
      isDelectShow: false
    }
  },
  computed: {},
  watch: {
  },
  created () {},
  methods: {
    onSearch (q) {
      if (!q.trim()) {
        return
      }
      // 最新的在最前面
      const index = this.searchchHistories.indexOf(q)
      if (index !== -1) {
        this.searchchHistories.splice(index, 1)
      }
      // 在跳转完成之前将搜索的关键字记录到收拾利索记录中
      this.searchchHistories.unshift(q)
      // 将搜索历史记录放到本地存储，以便持久化
      setItem('search-histories', this.searchchHistories)
      this.$router.push(`/search/${q}`)
    },
    async onSearchInput () {
      const searchText = this.searchText.trim()
      if (!searchText) {
        return
      }
      const res = await getSuggestions(this.searchText)
      this.suggestions = res.data.data.options
    },
    highlight (str) {
    // this.searchText 注：这里的一切都是字符串
    // 如果想动态创建一个正则表达式，使用new RegExp 手动构造
    // 他会根据字符串创建一正则表达式
    // 参数2，用来指定匹配模式，例如h劝酒，i忽略大小写
    // dsadsa/gi
      const reg = new RegExp(this.searchText, 'ig')
      return str.replace(reg, `<span style="color:red">${this.searchText}</span>`)
    }
  }

}
</script>

<style scoped>

</style>
