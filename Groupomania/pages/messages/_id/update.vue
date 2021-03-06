<template>
  <div>
    <h1>Poster un message</h1>
    <hr>
    <div>
      <div>
        <MsgForm buttonText="Envoyer" :submitForm="submitForm"/>
      </div>
    </div>
  </div>
</template>

<script>
import MsgForm from '@/components/MsgForm'
export default {
  middleware: 'auth',
  components:{
    MsgForm
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
    async submitForm() {
      const formData = new FormData()

      formData.append('idUSERS', this.$auth.user[0].idUSERS)
      formData.append('title', this.message.title)
      formData.append('content', this.message.content)
      formData.append('message_parent', null)
      formData.append('username', this.$auth.user[0].username)
      if (msgInfo.attachment){
        formData.append('attachment', msgInfo.attachment)
      }

      await this.$axios
        .$put('http://localhost:3000/api/messages', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          console.log(response)
          if (response.id) {
            this.$router.push('/messages/'+response.id)
          }
        })
        .catch((error) => {
          console.log(error)
          if (error.response.message.errors) {
            this.errors = error.response.message.errors
          }
        })
    },
  },
}
</script>

<style scoped></style>
