<template>
  <v-app id="default-layout-variant-2">
    <Alerts ref="alerts" />
    <!-- <ModalConfirmMsg ref="confirmMsg" />
    <ModalConnect ref="connect" /> -->

    <img
      id="default-layout-background"
      :src="require(`~/assets/sources/images/circle-v2.svg`)"
      alt="background"
    >

    <v-main class="parent">
      <nuxt-child data-nuxt="childs" />
    </v-main>
  </v-app>
</template>

<script>
import localStorageUser from '@/services/local-storage-user';

export default {
  name: "DefaultLayoutVariant2",
  middleware: ['lock-password'],
  data() {
    return {
    }
  },
  created() {
    if (!localStorage.getItem('auth')) {
      this.$router.replace('/create-import')
      return
    }

    // get data profile
    this.$store.dispatch("getData");
  },
  mounted() {
    // this.unlockProcess()
   
    this.scrollX();
    // this.footerHeightListener(); 
    
    // resize listener
    // window.addEventListener("resize", this.footerHeightListener);
  },
  beforeDestroy() {
    // window.removeEventListener("resize", this.footerHeightListener);
  },
  methods: {
    unlockProcess() {
      if (localStorage.getItem('unlock')) {
        localStorage.removeItem('unlock')
        return
      }

      localStorage.removeItem("privateKey")
      localStorage.removeItem("publicKey")
      const address = localStorage.getItem("address")

      if (!address) {
        return
      }

      try {
        const account = localStorageUser.getAccount(address)

        if (account.publicKey.startsWith('ed25519:')) {
        localStorage.setItem("privateKey", account.privateKey)
        localStorage.setItem("publicKey", account.publicKey)
      } else {
        this.$router.push("/unlock-wallet")
      }
      } catch (error) {
        console.log("ERRRORR")
        // localStorage.removeItem("address")
        // localStorage.removeItem("listUser")
        // localStorage.removeItem("auth")
        // location.reload()
      }
    },
    scrollX() {
      const
        scrollableDesktop = document.querySelectorAll('.scrollx'),
        scrollableMobile = document.querySelectorAll('.scrollxmobile');
      if (scrollableDesktop) {
        for (const el of scrollableDesktop) {
          el.addEventListener("wheel", event => { event.preventDefault(); el.scrollLeft += event.deltaY })
        }
      }
      if (scrollableMobile) {
        for (const el of scrollableMobile) {
          el.addEventListener("wheel", event => {
            if (window.innerWidth <= 880) { event.preventDefault(); el.scrollLeft += event.deltaY }
          })
        }
      }
    },
    footerHeightListener() {
      setTimeout(() => {
        const footer = document.querySelector('#footer');
        document.documentElement.style.setProperty(
          '--h-footer', `${footer.getBoundingClientRect().height}px`
        );
      }, 400);
    },
  },
}
</script>

<style src="~/assets/styles/layouts/default-layout-variant-2.scss" lang="scss" />
