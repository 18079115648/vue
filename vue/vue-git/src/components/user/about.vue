<template>
    <section class="about-warp">
        <h1></h1>
        <article></article>
    </section>
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
      this.init()
      axios.get(this.$store.state.uri + 'agreement/aboutus')
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
      init() {
//        document.title = '关于我们'
      }
  },
  computed: {
  }
}
</script>

<style lang="scss" scoped>
    .about-warp {
        width: 100%;
        height: 100%;
        min-height: 100vh;
        font-size: .24rem;
        color: #222;
        overflow: hidden;
        h1 {
            width: 2.96rem;
            height: 1.75rem;
            margin: 1rem auto;
            background: url('/static/ui/logo.png') no-repeat center;
            background-size: cover
        }
        article {
            padding: 0rem .34rem
        }
    }
</style>