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
      <div slot="action" @click="onSearch">搜索</div>
    </van-search>
    <!-- /搜索框 -->

    <!-- 联想建议 -->
    <van-cell-group>
      <van-cell
        icon="search"
        :key="item"
        v-for="item in suggestions"
       >
       <div slot="title" v-html="highlight(item)"></div>
       </van-cell>
    </van-cell-group>
    <!-- /联想建议 -->

     <!-- 搜索历史记录 -->
     <van-cell-group>
       <van-cell title="历史记录">
         <span>全部删除</span>&nbsp;&nbsp;
         <span>完成</span>
         <van-icon name="delete" />
       </van-cell>
       <van-cell title="单元格">
         <van-icon name="close" />
       </van-cell>
       <van-cell title="单元格">
         <van-icon name="close" />
       </van-cell>
     </van-cell-group>
     <!-- /搜索历史记录 -->
  </div>
</template>

<script>
import { getSuggestions } from '@/api/search'

export default {
  name: 'SearchPage',
  components: {},
  props: {},
  data () {
    return {
      searchText: '', // 用户输入的搜索文本
      suggestions: []
    }
  },
  computed: {},
  watch: {
  },
  created () {},
  methods: {
    onSearch () {},
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
