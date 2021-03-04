<template>
  <v-form v-model="valid">
    <v-text-field v-model="userInfo.username" 
                  label="Nom d'utilisateur" 
                  :rules="[required('nom utilisateur'), minLength('nom utilisateur', 4),maxLength('nom utilisateur', 50)]"
                  v-if="hasName" />

    <v-text-field v-model="userInfo.email" 
                  label="Email" 
                  :rules="[required('email'), emailFormat()]"/>

    <v-text-field v-model="userInfo.password"
                  label="Mot de passe"
                  :type="showPassword ? 'text' : 'password'" 
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="showPassword = !showPassword"
                  counter=true
                  :rules="[required('mot de passe'), minLength('mot de passe', 8)]"
                  />            

    <v-btn @click="submitForm(userInfo)" :disabled="!valid">{{ buttonText }}</v-btn>
  </v-form>
</template>

<script>
  import validations from "@/utils/validations";
  export default {
    data() {
      return {
        valid: false,
        showPassword: false,
        userInfo: {
          username:'',
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