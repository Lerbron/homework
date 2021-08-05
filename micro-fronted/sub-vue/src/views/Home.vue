<template>
  <div class="home">
    <div class="title">{{detail.title}}</div>
    <div v-html="detail.content" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'
export default {
  name: 'Home',
  data () {
    return {
      detail: {
        title: '',
        content: ''
      }
    }
  },
  computed: {
    // 通过global获取user的信息
    ...mapState('global', {
      topicId: (state) => state.topicId
    })
  },
  watch: {
    topicId: function () {
      console.log('change00000---->', this.topicId)
      this.getTopicDetail(this.topicId)
    }
  },
  methods: {
    getTopicDetail (id) {
      if (!id) return null
      axios.get(`/toutiao/content?key=294b924ec8773fee518de6c90d08250d&uniquekey=${id}`)
        .then(res => {
          console.log('detail000-<', res)
          this.detail = {
            title: res?.data?.data?.title,
            content: res?.data?.result?.content
          }
        })
    }
  }
}
</script>
