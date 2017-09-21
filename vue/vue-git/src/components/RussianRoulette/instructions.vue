<template>
    <article class="ro-in"></article>
</template>

<script>
import axios from 'axios'
import $ from 'jquery'
export default {
  components :{
  },
  data () {
    return {
    }
  },
  props: {
  },
  created () {
//    document.title = '游戏规则'
      axios.get(this.$store.state.uri + 'agreement/game_rule')
      .then((res) => {
          // console.log(res.data.result)
          $('article').append(res.data.result)
      })
      .catch((err) => {
          console.log(err)
      })
  },
  mounted () {
  },
  methods: {
  },
  computed: {
  }
}
</script>

<style lang="scss" scoped>
    .ro-in {
        font-size: .3rem;
        line-height: .48rem;
        padding: .4rem .34rem 0rem
    }
</style>