<template>
  <v-form v-model="valid">
    <v-text-field v-model="msgInfo.msgname" 
                  label="Titre" 
                  :rules="[required('Titre')]"
    />

    <v-text-field v-model="msgInfo.email" 
                  label="Email" 
                  :rules="[required('email'), emailFormat()]"/>

    <v-text-field v-model="msgInfo.password"
                  label="Contenu"
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
        showPassword: false,
        hasName: false,
        msgInfo: {
          title:'',
          email: '',
          password: ''
        },
        ...validations
      }
    },
    props: ["submitForm", "buttonText", "hasName"]
  }
</script>

<style lang="scss" scoped>
</style> 