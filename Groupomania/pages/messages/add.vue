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
            <input type="file" ref="file"
              :class="{ 'is-invalid': errors && errors.attachment }"
              @change = 'extractfile'
              accept ="image/jpeg,image/png">
            <div class="invalid-feedback" v-if="errors && errors.attachment">
              {{ errors.attachment.msg }}
            </div>
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

           <button @click="submitFile()">Envoyer</button>
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
      title:null,
      attachment:null,
      content:null,
      file:''
      },
    errors:null
    }
  },
  methods:{
    submitFile(){
        /*
                Initialize the form data
            */
            let formData = new FormData();
            /*
                Add the form data we need to submit
            */
            formData.append('file', this.file);
        /*
          Make the request to the POST /single-file URL
        */
            this.$axios.post( 'http://localhost:3000/api/images/',
                formData,
                {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
              }
            ).then(function(){
          console.log('SUCCESS!!');
        })
        .catch(function(){
          console.log('FAILURE!!');
        });
      },
      /*
        Handles a change on the file upload
      */
      handleFileUpload(){
        this.file = this.$refs.file.files[0];
      },
    submitForm(){
      this.$axios.post( 'http://localhost:3000/api/messages/', {
          title: this.title,
          content: this.content,
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
    }
  }
}  
</script>

<style scoped>

</style>