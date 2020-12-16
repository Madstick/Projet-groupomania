<template>
  <div>
    <div class="d-flex justify-content-between align-items-center">
      <h1>Messages</h1>
      <nuxt-link to="/messages/add">Poster un message</nuxt-link>
    </div>
    <hr>

    <div 
      v-if="$route.params.created=='yes'">Record added successfully</div>
    <div 
      v-if="$route.params.deleted=='yes'">Record deleted successfully</div>

    <div 
      v-if="messages.length">
      <nuxt-link 
        :to="'/messages/' + message._id"
        v-for="message in messages"
        :key="message._id">
        {{ message.title }}
      </nuxt-link>
    </div>

    <div
      v-else>
      Pas de messages à afficher
    </div>
  </div>
</template>

<script>
export default {
  async asyncData(context){
    const {data} = await context.$axios.get('http://localhost:3000/api/messages/')
    return {
      messages : data
    }
  },
}
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