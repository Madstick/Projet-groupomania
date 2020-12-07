<template>
  <v-container>
    <v-tabs>
      <v-tab to="/admin/users">Utilisateurs</v-tab>
      <v-tab to="/admin/messages">Messages</v-tab>
    </v-tabs>
    <router-view></router-view>
  </v-container>
</template>

<script>
  export default {
    middleware: ['auth-admin']
  }
</script>

<style lang="scss" scoped>
