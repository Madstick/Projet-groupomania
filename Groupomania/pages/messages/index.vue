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
        :to="'/messages/' + message.id"
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
  middleware: 'auth',
    data() {
    return {
      messages:{
      message: {
        idUSERS: this.$auth.user[0].idUSERS,
        title: '',
        content: '',
        attachment: '',
        username: this.$auth.user[0].username,
        created_at_formated: '',
        likes:0,
      },
      },
      errors: null,
      url: null,
    }
  },
  mounted(){
    this.asyncData()
  },
  methods:{
    async asyncData(){
    await this.$axios.get('http://localhost:3000/api/messages/') 
    .then((response) => {
        console.log(response)
        this.message = response.data.results[0]       
        })
        .catch((error) => {
          console.log(error)
          if (error.response.message.errors) {
            this.errors = error.response.message.errors
          }
        })
    },
  }
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