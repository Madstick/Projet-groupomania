<template>
  <div>
    <h1>Update message</h1>
    <hr>

    <div class="row">
      <div class="col-md-6">
        <form action=""
          method="post"
          @submit.prevent="submitForm()">

          <div class="form-group">
            <label for="">Titre</label>
            <input type="text" class="form-control"
              :class="{ 'is-invalid': errors && errors.title }"
              v-model="title">
            <div class="invalid-feedback" v-if="errors && errors.title">
              {{ errors.title.msg }}
            </div>
          </div>

            <div>
            <label for="">Pièces jointes</label>
            <input type="file" ref="attachment" name="attachment"
                   :class="{ 'is-invalid': errors && errors.attachment }"
                   @change='handleFileUpload'
                   accept="image/jpeg,image/jpg,image/png">
            <div class="invalid-feedback" v-if="errors && errors.attachment">
              {{ errors.attachment.msg }}
            </div>
          </div>
          <div v-if="url" id="preview">
            <img :src="url"/>
          </div>

          <div class="form-group">
            <label for="">Votre message</label>
            <textarea cols="30" rows="4" class="form-control"
              :class="{ 'is-invalid': errors && errors.content }"
              v-model="content"></textarea>
            <div class="invalid-feedback" v-if="errors && errors.content">
              {{ errors.content.msg }}
            </div>
          </div>

          <input type="submit" value="Submit" class="btn btn-primary mr-3">
          <nuxt-link :to="'/messages/' + $route.params.id" class="btn btn-secondary mr-3">Cancel</nuxt-link>

        </form>
      </div>
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
  data(){
    return{
      errors:null,
      title:null,
      attachment:null,
      content:null
    }
  },
  mounted(){
    this.fillFormData()
  },
  methods:{
    fillFormData(){
      this.title = this.message.title
      this.attachment = this.message.attachment
      this.content = this.message.content
    },
    submitForm(){
      this.$axios.put( 'http://localhost:3000/api/messages/modifyMessage' + this.$route.params.id , {
          title: this.title,
          attachment: this.attachment,
          content: this.content,
        })
        .then((response) => {
          console.log(response)
          if(response.data._id){
            this.$router.push({ name:'idMESSAGE', params:{ updated:'yes', id: this.$route.params.id } })
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