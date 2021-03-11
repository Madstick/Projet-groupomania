<template>
  <div>
    <h1>Poster un message</h1>
    <hr>
    <div>
      <div>
        <MsgForm buttonText="Envoyer" :submitForm="submitForm" :message="message" :key="componentkey"/>
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
  data(){
    return {
      message: {
        title: null,
        content: null,
        attachment: null,
        username: this.$auth.user[0].username,
      },
      componentkey : 0,
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
        this.componentkey++     
        })
        .catch((error) => {
          console.log(error)
        })
    },
    async submitForm(msgInfo) {
      const formData = new FormData()
      
      formData.append('title', msgInfo.title)
      formData.append('content', msgInfo.content)
      formData.append('message_parent', null)
      formData.append('username', this.$auth.user[0].username)
      if (msgInfo.attachment){
        formData.append('attachment', msgInfo.attachment)
      }

      await this.$axios
        .$put('http://localhost:3000/api/messages/' + this.$route.params.id, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          console.log(response)
          if (response.id) {
            this.$router.push('/messages/'+ this.$route.params.id )
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
  },
}
</script>

<style scoped></style>
