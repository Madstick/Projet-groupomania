<template>
  <div>
    <h1>message Details</h1>

    <hr>

    <div 
      v-if="$route.params.updated=='yes'">Record updated successfully</div>

    <h2>{{ message.title }}</h2>

    <h6>{{ message.attachment }}</h6>

    <p>{{ message.content }}</p>

    <hr>
    <div>
      <div>
        <nuxt-link :to="'/messages/' + message.idMESSAGES + '/update'">Modifier</nuxt-link>
        <button @click="deleteRecord()">Supprimer</button>
      </div>
      <nuxt-link to="/messages">Back to messages</nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  middleware: 'auth',
    data() {
    return {
      message: {
        idUSERS: this.$auth.user[0].idUSERS,
        title: '',
        content: '',
        attachment: '',
        username: this.$auth.user[0].username,
        created_at_formated: '',
        likes:0,
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
    await this.$axios.get('http://localhost:3000/api/messages/' + this.$route.params.id) 
    .then((response) => {
      if (response.data.results.length === 0){
        this.$router.push({ name:'messages' })
      }
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

    deleteRecord(){
      if(confirm("Are you sure?") === true){
        this.$axios.delete('http://localhost:3000/api/messages/' + this.$route.params.id)
          .then((response) => {
              this.$router.push({ name:'messages', params:{ deleted:'yes' } })           
          })
          .catch( (error) => {
            console.log(error);
          });
      }
    }
  }
}
</script>
<style>

</style>