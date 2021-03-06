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
  methods: {
    async submitForm(msgInfo) {
      const formData = new FormData()

      formData.append('idUSERS', this.$auth.user[0].idUSERS)
      formData.append('title', msgInfo.title)
      formData.append('content', msgInfo.content)
      formData.append('message_parent', null)
      formData.append('username', this.$auth.user[0].username)
      if (msgInfo.attachment){
        formData.append('attachment', msgInfo.attachment)
      }

      await this.$axios
        .$post('http://localhost:3000/api/messages', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          console.log(response)
          if (response.id) {
            this.$router.push('/messages/'+ response.id)
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
