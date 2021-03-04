
<template>
  <div class="container">
    <div>
      <h1 class="title">Votre compte</h1>
      <img src="~/assets/icon.svg" />
      {{$auth.user}}
    </div>
  </div>
</template>

<script>
export default {}

</script>

<style scoped>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
</style>