<template>
  <div>
    <h1>Poster un message</h1>
    <hr>

    <div>
      <div>
        <form action=""
          method="post"
          @submit.prevent="submitForm()">

          <div>
            <label for="">Titre</label>
            <input type="text" class="form-control"
              :class="{ 'is-invalid': errors && errors.title }"
              v-model="message.title">
            <div class="invalid-feedback" v-if="errors && errors.title">
              {{ errors.title.msg }}
            </div>
          </div>

          <div>
            <label for="">Pièces jointes</label>
            <input type="file" ref="attachment"
              :class="{ 'is-invalid': errors && errors.attachment }"
              @change = 'handleFileUpload'
              accept ="image/jpeg,image/jpg,image/png">
            <div class="invalid-feedback" v-if="errors && errors.attachment">
              {{ errors.attachment.msg }}
            </div>
          </div>
          <div id="preview">
            <img v-if="url" :src="url" />
          </div>

          <div>
            <label for="">Votre message</label>
            <textarea 
              :class="{ 'is-invalid': errors && errors.content }"
              v-model="message.content"></textarea>
            <div class="invalid-feedback" v-if="errors && errors.content">
              {{ errors.content.msg }}
            </div>
          </div>

           <button @click="submitForm()" >Envoyer</button>
          <nuxt-link to="/messages">Cancel</nuxt-link>

        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  middleware: 'auth',
  data(){
    return{
      message: {
      idUSERS: this.$auth.user[0].idUSERS,
      title:null,
      content:null,
      attachment:'',
      created_at:null,
      username: this.$auth.user[0].username,
      },
    errors:null,
    url: null,
    }
  },
  methods:{
    async submitForm(){
      let formData = new FormData();
            /*
                Add the form data we need to submit
            */
      formData.append('idUSERS', this.$auth.user[0].idUSERS),
      formData.append('title',this.message.title),
      formData.append('content',this.message.content),
      formData.append('attachment', this.attachment); 
      formData.append('created_at',new Date),
      formData.append('message_parent', null)
      formData.append('username', this.$auth.user[0].username),

     await this.$axios.$post( 'http://localhost:3000/api/messages', 
          formData,
          {
          headers: {
                    'Content-Type': 'multipart/form-data'
                }
          })
        .then((response) => {
          console.log(response)
          if(response.data._id){
            this.$router.push({ name:'messages', params:{ created:'yes' } })
          }
        })
        .catch( (error) => {
          console.log(error)
          if(error.response.data.errors){
            this.errors = error.response.data.errors
          }
        });
    },
    handleFileUpload(e){
        this.attachment = this.$refs.attachment.files[0];
        const file = e.target.files[0];
        this.url = URL.createObjectURL(file);
      }
  }
}  
</script>

<style scoped>

</style>