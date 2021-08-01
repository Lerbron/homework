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
      axios.get(`/api/v1/topic/${id}`)
        .then(res => {
          console.log('detail000-<', res)
          this.detail = {
            title: res?.data?.data?.title,
            content: res?.data?.data?.content
          }
        })
    }
  }
}
</script>
