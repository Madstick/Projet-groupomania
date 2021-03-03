<template>
  <v-form v-model="valid">
    <v-text-field v-model="message.title" 
                  label="Titre" 
                  :rules="[required('Titre'), minLength('contenu', 2)]"
    />

  <v-file-input
    v-model="message.attachment"
    :rules="[imgFormat()]"
    accept="image/png, image/jpeg, image/gif"
    placeholder="Votre image"
    prepend-icon="mdi-camera"
    label="Votre image"
    @change='handleFileUpload()'
  ></v-file-input>

  <div v-if="url" id="preview">
            <img :src="url"/>
  </div>

    <v-textarea v-model="message.content"
                  label="Votre message"
                  :rules="[required('contenu'), minLength('contenu', 8)]"
                  />            

    <v-btn @click="submitForm(message)" :disabled="!valid">{{ buttonText }}</v-btn>
  </v-form>
</template>

<script>
  import validations from "@/utils/msgvalidation";
  export default {
    data() {
      return {
        valid: false,
        message: {
          idUSERS: this.$auth.user[0].idUSERS,
          title: null,
          content: null,
          attachment: null,
          username: this.$auth.user[0].username,
        },
        url:null,
        ...validations
      }
    },
    props: ["submitForm", "buttonText"],
    methods: {
      handleFileUpload() {
        if (this.message.attachment){
          this.url = URL.createObjectURL(this.message.attachment);
        }
        else{
          this.url = null
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
</style> 