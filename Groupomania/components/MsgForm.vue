<template>
  <v-form v-model="valid">
    <v-text-field v-model="formData.title" 
                  label="Titre" 
                  :rules="[required('titre'), minLength('Le titre', 2), maxLength('Le titre', 50)]"
    />

    <v-file-input
      v-model="formData.attachment"
      :rules="[imgFormat(formData.attachment), imgSize(formData.attachment)]"
      accept="image/png, image/jpeg, image/gif"
      placeholder="Votre image"
      prepend-icon="mdi-camera"
      label="Votre image"
      @change='handleFileUpload()'
    ></v-file-input>

    <div v-if="url" id="preview">
      <v-img  
        :src="url"
        max-width="1280"
        max-height="500"
        width="100%"
        contain
      ></v-img>  
    </div>

  

    <v-textarea v-model="formData.content"
                  label="Votre message"
                  :rules="[required('contenu'), minLength('Le contenu', 1), maxLength('Le contenu', 8000)]"
                  />            

    <v-btn @click="submitForm(formData)" :disabled="!valid">{{ buttonText }}</v-btn>
    <v-btn :to="'/messages/' + this.$route.params.id">Annuler</v-btn>
  </v-form>
</template>

<script>
    import validations from "@/utils/msgvalidation";
    export default {
    data() {
      return {
        valid: false,
        formData: {
            title: null,
            content: null,
            attachment: null,
            username: this.$auth.user[0].username,
        },
        url:null,
        ...validations
      }
    },
    props: {
        submitForm: {
            type: Function,
            required: true
        },
        buttonText: {
            type: String,
            required: true
        },
        message: {
            type: Object,
            required: true
        }
    },
    beforeMount() {
        console.log(this.message)
        this.formData = this.message;
    },
    methods: {
        handleFileUpload() {
            if (this.formData.attachment) {
                this.url = URL.createObjectURL(this.formData.attachment);
            }
            else {
                this.url = null
            }
            console.log(this.formData.attachment)
        },
    },
  }
</script>

<style lang="scss" scoped>

#preview{
  display: flex;
  justify-content: center;
}

#preview-img{
  max-width:1280px;
  width: 100%;
  max-height:500px;
  height: 100%;
}
</style> 
