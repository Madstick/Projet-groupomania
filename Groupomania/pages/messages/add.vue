<template>
  <div>
    <h1>Poster un message</h1>
    <hr>
    <div>
      <div>
        <!-- <form method="post" @submit.prevent="submitForm">
          <div>
            <label for="">Titre</label>
            <input type="text" class="form-control" name="title"
                   :class="{ 'is-invalid': errors && errors.title }"
                   v-model="message.title" required>
            <div class="invalid-feedback" v-if="errors && errors.title">
              {{ errors.title.msg }}
            </div>
          </div>
          <div>
            <v-file-input v-model="message.attachment" name="attachment" label="Votre image"
                   :class="{ 'is-invalid': errors && errors.attachment }"
                   @change='handleFileUpload'
                   accept="image/*">
            </v-file-input>       
            <div class="invalid-feedback" v-if="errors && errors.attachment">
              {{ errors.attachment.msg }}
            </div>
          </div>
          <div v-if="url" id="preview">
            <img :src="url"/>
          </div>
          <div>
            <label for="">Votre message</label>
            <textarea required name="content"
              :class="{ 'is-invalid': errors && errors.content }"
              v-model="message.content"></textarea>
            <div class="invalid-feedback" v-if="errors && errors.content">
              {{ errors.content.msg }}
            </div>
          </div>
          <button type="submit">Envoyer</button>
          <nuxt-link to="/messages">Cancel</nuxt-link>
        </form> -->
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
  data() {
    return {
      // message: {
      //   idUSERS: this.$auth.user[0].idUSERS,
      //   title: null,
      //   content: null,
      //   attachment: null,
      //   username: this.$auth.user[0].username,
      // },
      // errors: null,
      // url: null,
    }
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
    // handleFileUpload(e) {
    //   this.url = URL.createObjectURL(msgInfo.attachment);
    // },
  },
}
</script>

<style scoped></style>
