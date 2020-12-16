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
        <nuxt-link :to="'messages/' + message._id + '/update'">Modifier</nuxt-link>
        <button @click="deleteRecord()">Supprimer</button>
      </div>
      <nuxt-link to="/messages">Back to messages</nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  middleware: 'auth',
  async asyncData(context){
    const {data} = await context.$axios.get('http://localhost:3000/api/messages/' + context.route.params.id)
    return {
      message : data
    }
  },
  methods:{
    deleteRecord(){
      if(confirm("Are you sure?") === true){
        this.$axios.delete('http://localhost:3000/api/messages/' + this.$route.params.id)
          .then((response) => {
            if(response.data._id){
              this.$router.push({ name:'messages', params:{ deleted:'yes' } })
            }
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