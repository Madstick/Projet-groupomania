<template>
  <div>
    <h1>Poster un message</h1>
    <hr>
    <div>
      <div>
        <form method="post" @submit.prevent="submitForm">
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
            <label for="">Pièces jointes</label>
            <input type="file" ref="attachment" name="attachment"
                   :class="{ 'is-invalid': errors && errors.attachment }"
                   @change='handleFileUpload'
                   accept="image/jpeg,image/jpg,image/png,image/gif">
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
        </form>
      </div>
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
        title: null,
        content: null,
        attachment: '',
        username: this.$auth.user[0].username,
      },
      errors: null,
      url: null,
    }
  },
  methods: {
    async submitForm() {
      const formData = new FormData()

      formData.append('idUSERS', this.$auth.user[0].idUSERS)
      formData.append('title', this.message.title)
      formData.append('content', this.message.content)
      formData.append('attachment', this.attachment,)
      formData.append('message_parent', null)
      formData.append('username', this.$auth.user[0].username)

      await this.$axios
        .$post('http://localhost:3000/api/messages', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          console.log(response)
          // TODO Gérer la réponse : response.message
          if (response.message._id) {
            this.$router.push('/messages/:id?')
          }
        })
        .catch((error) => {
          console.log(error)
          if (error.response.message.errors) {
            this.errors = error.response.message.errors
          }
        })
    },
    handleFileUpload(e) {
      this.attachment = this.$refs.attachment.files[0];
      const file = e.target.files[0];
      this.url = URL.createObjectURL(file);
    },
  },
}
</script>

<style scoped></style>
