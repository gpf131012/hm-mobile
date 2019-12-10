<template>
  <div class="article-comments">
    <!-- 评论列表 -->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell
        v-for="item in list"
        :key="item.com_id.toString()"
        :title="item"
      >
        <van-image
          slot="icon"
          round
          width="30"
          height="30"
          style="margin-right: 10px;"
          :src="item.aut_photo"
        />
        <span style="color: #466b9d;"
        slot="title"
        >{{item.aut_name}}</span>
        <div slot="label">
          <p style="color: #363636;">{{item.content}}</p>
          <p>
            <span style="margin-right: 10px;">{{item.pubdate | relativeTime}}</span>
            <van-button size="mini" type="default">回复</van-button>
          </p>
        </div>
        <van-icon
        slot="right-icon"
        color="red"
        :name="item.is_liking ? 'like' : 'like-o'"
        @click="onCommentLike(item)"

        />
      </van-cell>
    </van-list>
    <!-- 评论列表 -->

    <!-- 发布评论 -->
    <van-cell-group class="publish-wrap">
      <van-field
        clearable
        v-model="inputComment"
        placeholder="请输入评论内容"
      >
        <van-button
        slot="button"
        size="mini"
        type="info"
        @click="onAddComment"
        >发布</van-button>
      </van-field>
    </van-cell-group>
    <!-- /发布评论 -->
  </div>
</template>

<script>
import { getComments, addComment, addCommentlike, deleteCommentlike } from '@/api/comment'

export default {
  name: 'ArticleComment',
  props: {},
  data () {
    return {
      list: [], // 评论列表
      loading: false, // 上拉加载更多的 loading
      finished: false, // 是否加载结束
      offset: null, // 获取下一页数据评论页码
      inputComment: ''
    }
  },

  methods: {
    async onCommentLike (comment) {
      if (comment.is_liking) {
        await deleteCommentlike(comment.com_id)
      } else {
        // 如果没有赞，则点赞
        await addCommentlike(comment.com_id)
      }
      // 更新视图状态
      comment.is_liking = !comment.is_liking
      this.$toast('操作成功')
    },
    async onAddComment () {
      const inputComment = this.inputComment.trim()
      // 非空校验
      if (!inputComment.length) {
        return
      }
      const res = await addComment({
        target: this.$route.params.articleId // 评论的目标id（评论文章即为文章id，对评论进行回复则回复为评论id）
      })
      this.list.puth(res.data.data.new_obj)
    },
    async onLoad () {
      // 1，请求获取数据
      const res = await getComments({
        type: 'a', // a或c，评论类型，a-对文章（article）的评论，c-对评论（comment）的回复
        source: this.$route.params.articleId, // 源id，文章或评论id
        offset: this.offset
        // 值为评论id，表示从此id的数据向后取，不传表示 从第一页开始读取数据
      })
      // 2. 将数据添加到列表中
      this.list.push(...res.data.data.results)
      // 3.关闭转圈圈
      this.loading = false
      // 4.判断如果没有数据了，则亮finished设置为true
      const lastId = res.data.data.last_id
      if (lastId) {
        // 更新获取西亚一页数据的页码（偏移量）
        this.offset = lastId
      } else {
        this.finished = true
      }
    }
  }
}
</script>

<style scoped lang='less'>
.publish-wrap {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
}

.van-list {
  margin-bottom: 45px;
}
</style>
