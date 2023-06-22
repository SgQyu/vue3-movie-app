<template>
  <footer>
    <Logo />
    <a
      href="https://github.com/SgQyu"
      target="_blank">
      (c){{ new Date().getFullYear() }} SgQyu
    </a>
  </footer>
</template>

<script>
import Logo from './Logo.vue'

export default {
  components: {
    Logo
  }
}
</script>

<style scoped lang="scss">
footer {
  padding: 70px 0;
  text-align: center;
  opacity: .3;
  .logo {
    display: block;
    margin-bottom: 4px;
  }

}

</style>