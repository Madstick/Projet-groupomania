<template>
  <v-form v-model="valid">
    <v-text-field v-model="msgInfo.title" 
                  label="Titre" 
                  :rules="[required('Titre')]"
    />

    <v-text-area v-model="msgInfo.image" 
                  label="Votre message" 
                  :rules="[required('image'), imgFormat()]"/>

  <v-file-input
    :rules="[required('image'), imgFormat()]"
    accept="image/png, image/jpeg, image/bmp"
    placeholder="Votre image"
    prepend-icon="mdi-camera"
    label="Votre image"
  ></v-file-input>

    <v-text-field v-model="msgInfo.content"
                  label="Votre message"
                  :rules="[required('contenu'), minLength('contenu', 8)]"
                  />            

    <v-btn @click="submitForm(msgInfo)" :disabled="!valid">{{ buttonText }}</v-btn>
  </v-form>
</template>

<script>
  import validations from "@/utils/msgvalidations";
  export default {
    data() {
      return {
        valid: false,
        msgInfo: {
          title:'',
          image: '',
          content: ''
        },
        ...validations
      }
    },
    props: ["submitForm", "buttonText"]
  }
</script>

<style lang="scss" scoped>
</style> 