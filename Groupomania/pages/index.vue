<template>
  <div class="custom-container d-flex justify-center text-center">
    <div>
      <img src="~/assets/icon-above-font.svg" class="img-marg"/>
      <h1>Bienvenue sur votre espace Groupomania</h1>
      <br />
      <section>
        <article id="CGU">
        <h2>Réglement :</h2>
        <v-divider></v-divider>               
          <ol>
            <br />
            <li>Cet espace et son accès sont strictement réservés au membre du personnel de Groupomania.</li>
            <br />
            <li>Vous ne pouvez avoir qu'un <b>UNIQUE</b> compte .</li>
            <br />  
            <li>Le respect est primordial pour bien évoluer au sein de l'entreprise. Aucune moquerie, insulte, propos injurieux, violent, diffamatoire, raciste, pédophile, ou pornographiques ne seront tolérée, dans le cas contraire vous risquez le <b>BAN</b> permanent et définitif.</li>
            <br />
            <li>Votre nom d'utilisateur doit être un minimum cohérent (évitez de vous endormir sur votre clavier en créant votre compte, des noms comme 'dfgrtgdfgr' ne seront pas acceptés). Il doit aussi respecter les autres points du réglement.</li>
            <br />
            <li>Veuillez faire attention à votre écriture pour le bien et la santé mentale de tous les utilisateurs (évitez le langage sms,..) </li>
            <br />
            <li>Pub, spam, et double post sont <b>interdits</b>. (vous avez l'option de modifier votre message en cas d'erreur)</li>
            <br />                                                    
            <li>Si vous rencontrez quelconque problème sur le site, veuillez contacter un modérateur et il/elle essaiera de vous répondre dans les plus brefs délais.</li>
            <br />
            <li>Le règlement est susceptible de changer à tout moment, veuillez vous tenir informés.</li>
          </ol>
        </article>

        <v-divider></v-divider>

        <article id="legals">
          <h3>Mentions Légales</h3>
          <em>Dernière mise à jour le 06/03/2020</em>
          <p>La société Groupomania est une société par actions simplifiée au capital de 100 00 € immatriculée au RCS de Paris sous le n. 100 288 000 et dont le siège social est situé au 1 rue Perceval 29000 Midgar, France (N° TVA intracommunautaire : FR 87 201 000 000). Groupomania est représentée par M. Cloud Strife, son Président.</p>
          <p>Groupomania est une societé commerciale de distribution.</p>
          <p>Le Directeur de la Publication de la plateforme et le Directeur de l'Établissement Privé à Distance est M. Guetso.</p>Le site est hébergé par GitHub dont l’adresse est la suivante :
          <br />GitHub 29000 THEWORLD
        </article>

        <v-divider></v-divider>

        <article id="contact">
          <h3>Nous contacter</h3>
          <ul>
            <li>Par téléphone : +33 1 00 50 00 50</li>
            <li>Par email : legalloisprovensal@gmail.com</li>
            <li>Par courrier : Groupomania, 1 rue Perceval 29000 Midgar, France</li>
          </ul>
        </article>

        <v-divider></v-divider>

        <article id="CNIL">
          <h3>Droits relatifs aux données</h3>
          <p>
            Vous bénéficiez d’un droit d’accès et de rectification aux informations qui vous concernent, que vous pouvez exercer par email à l’adresse suivante:
            <strong>data-protection@groupomania.com</strong>
            <br />ou par courrier à l'adresse suivante :
            <strong>Groupomania, 1 rue Perceval 29000 Midgar, France</strong>. 
            <br> Vous pouvez également, pour des motifs légitimes, vous opposer au traitement des données vous concernant.
            Pour plus d’informations sur tous vos droits vous pouvez vous référer à notre Politique de Protection des Données Personnelles.
          </p>
        </article>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  components:{
  },
  // beforeRouteEnter (to, from, next) {
  //   if (this.$auth.loggedIn){
  //     this.$router.push('/messages')
  //   }
  //   next();
  // },
  data() {
    return {
    }
  },
}
</script>

<style>

</style>
