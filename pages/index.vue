<template>
  <div id="home" class="divcol center">
    <modalCryptos 
      ref="modalCryptos"
      :data-tokens=dataTokens
    ></modalCryptos>

    <!-- <v-alert
      v-model="alert"
      class="mt-3"
      close-text="Close Alert"
      shaped
      prominent
      :type="alertType"
      dismissible
    >
      <a :href="hashUrl" target="_blank">{{ hash }}</a>
    </v-alert> -->

    <Header show-append show-logotype>
      <template #prepend>
        <nuxt-link :to="localePath('/')">
          <img src="@/assets/sources/logos/logo.svg" alt="logo" style="--w: 34px">
        </nuxt-link>
      </template>
    </Header>

    <section id="section-available" style="padding-top: 23px;">
      <div class="space" style="gap: 10px">
        <v-btn
          :loading="loading"
          class="btn-outlined"
          style="--bg: var(--secondary); flex: 1 1"
          @click="openModalCrypto()"
        >
          BALANCES
        </v-btn>

        <v-btn
          class="btn"
          style="flex: 1 1"
          @click="$router.push('/documents')"
        >
          DOCUMENTOS
        </v-btn>
      </div>

      <div v-if="pendingTrades" class="centered-container">
        <v-btn
          class="btn-icon"
          @click="$router.push('trades-pending')"
        >
        <v-icon class="ml-1">mdi-information</v-icon>
        </v-btn>
      </div>
      <div v-if="pendingTrades">
          <span  class="centered-container-text" @click="$router.push('trades-pending')">P2P PENDIENTE</span>
      </div>

      <aside class="container-available">
        <h1 class="p" :class="{offuscate}">
          <span style="--fw: 400">$</span>{{ balance }}
          <span class="currency">USD</span>
        </h1>

        <div class="divcol center" style="margin-top: 25px;">
          <div clasS="d-flex align-center" style="gap: 10px">
            <h3 class="mb-0">SALDO DISPONIBLE</h3>
            <v-icon size="16" @click="offuscate = !offuscate">{{ offuscate ? 'mdi-eye-off' : 'mdi-eye'}}</v-icon>
          </div>
          <img src="../assets/sources/icons/warning-orange.svg"  alt="warning icon" style="--w: 25px; --h: 25px; margin-top: 6px" @click="$refs.modalCryptos.model = true">
        </div>
      </aside>

      <aside class="container-btns">
        <div v-for="(item, i) in dataBtns" :key="i">
          <v-btn class="btn-icon" @click="item.action">
            <img :src="item.icon" :alt="item.text">
          </v-btn>

          <span class="text">{{item.text}}</span>
        </div>
      </aside>
    </section>


    <section id="section-explore">
      <div id="section-explore-content">
        <v-btn
          class="btn-outlined"
          @click="openExplorer()"
        >
        IR A <span data-inner>AREPA DAO</span>
        </v-btn>

        <v-btn
          class="btn"
          @click="irBudares()"
        >
        explorar budares
        </v-btn>

        <article class="btn-outlined">
          ¡Un ciudadano!<br>¡Una voz!<br>¡Un voto!
        </article>

        <img src="@/assets/sources/images/background-explore-arepa.svg" alt="explore arepa background">
      </div>
    </section>


    <section id="section-recent-activity" class="mb-10">
      <div id="section-recent-activity__wrapper">
        <h1 class="p">actividad <br>reciente</h1>

        <div class="divcol" style="gap: 20px; cursor: pointer">
            <ActivityCard
              v-for="(item, i) in dataActivity" :key="i"
              :type="item.type"
              :account="item.account"
              :coin="item.coin"
              :amount="item.amount"
              :date="item.date"
              :text2="item.text2"
              :hash="item.hash"
              :desc="item.desc"
              @click.native="navigateToExternalLink(`${process.env.URL_EXPLORER_TXS}${item.hash}`)"
            />
        </div>

        <v-btn
          class="btn mb-10"
          @click="$router.push('/activity-history')"
        >
          ver todos
        </v-btn>
      </div>
    </section>


    <div class="text-center">
      <v-bottom-sheet
        v-model="sheet"
        inset
      >
        <v-sheet
          class="text-center"
          height="200px"
        >
          <v-btn
            class="mt-6"
            text
            color="error"
            @click="sheet = !sheet"
          >
            cerrar
          </v-btn>
          <div class="my-3" style="font-size:20px; font-weight: 900;">
            Esta opción estará disponible próximamente
          </div>
        </v-sheet>
      </v-bottom-sheet>
    </div>


  <v-row justify="center">
    <v-dialog
      v-model="revived"
      scrollable
      width="400"
    >
      <v-card class="rounded-xl">
        <v-card-title>Recibir</v-card-title>
        <v-divider></v-divider>
        <v-card-text style="height: 300px;">
          <v-row
            class="mt-3"
            justify="center"
          >
            <p>
              <vue-qr :text="address" :logo-src="logoWallet" qid="addressQr"></vue-qr>
            </p>
            <p>
              <span class="mr-4">Dirección: <strong>{{ address }}</strong></span>
              <v-btn
                class="btn-icon"
                @click="fnCopie(address)"
              >
              <v-icon v-if="copie">mdi-check</v-icon>
              <img v-if="!copie" src="@/assets/sources/icons/copy.svg" alt="copy to clipboard" style="--w: 15px">
              </v-btn>
            </p>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="pt-3 pb-3">
          <v-spacer></v-spacer>
          <v-btn
            class="btn-outlined"
            width="100"
            style="--bg: var(--secondary); --b-color: var(--primary); --c: var(--primary)"
            variant="text"
            @click="revived = false"
          >
            Cerrar
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>



    
  </div>
</template>


<script>
// import axios from 'axios';
// eslint-disable-next-line import/no-named-as-default
import gql from "graphql-tag";
// import * as nearAPI from "near-api-js";
import VueQr from 'vue-qr'
import logoWallet from "~/assets/sources/logos/logo.svg";
import tokens from '@/services/tokens';
import wallet from '@/services/local-storage-user';
// import { configNear } from "@/services/nearConfig";
import walletUtils from '@/services/wallet';
// const { utils } = nearAPI;


export default {
  name: "HomePage",
  components: {VueQr},
  // middleware: ["authenticated"],
  data() {
    return {
      alert: false,
      alertType: "success",
      hash: null,
      hashUrl: null,
      network: process.env.Network,
      copie: false,
      logoWallet,
      linkExplorer: "",
      linkExplorerDetail: "",
      sheet: false,
      revived: false,
      balance: "0.00",
      balance_near: 0.00,
      address: "",
      dataBtns: [
        {
          icon: require("@/assets/sources/icons/arrow-up.svg"),
          text: "enviar",
          action: () => { this.enviar() } ,// { this.alert = false; this.transfer = true; this.$refs.formEnvio.resetValidation(); this.$refs.formEnvio.reset(); },
        },
        {
          icon: require("@/assets/sources/icons/swap.svg"),
          text: "cambiar",
          action: () => {this.$router.push({ path: "/swap" })},
        },
        {
          icon: require("@/assets/sources/icons/plus.svg"),
          text: "recargar",
          action: () => { this.recargar() },
        },
        {
          icon: require("@/assets/sources/icons/arrow-down.svg"),
          text: "recibir",
          action: () => { this.$router.push({ path: "/send-qr" }) },// {this.revived = true;},
        },
      ],
      dataActivity: [],
      dataTokens: [],
      operationSymbol: "",
      pendingTrades: false,
      data: [],
      poolOrders: null,
      loading: false,
      offuscate: true,
    }
  },
  head() {
    const title = 'Home';
    return {
      title,
    }
  },
  beforeDestroy() {
    if(this.poolOrders) {
  		this.poolOrders.unsubscribe();
    }
	},
  mounted() {
    this.getOrders(); // Call orderSell function

    // this.orderSell();
    this.address = wallet.getCurrentAccount().address;
    sessionStorage.removeItem("create-import-proccess");

    // localStorage.removeItem("importEmailNickname");
    // localStorage.removeItem("importEmail");
    localStorage.removeItem("seedPhraseLoginNew");
    localStorage.removeItem("seedPhraseLogin");
    localStorage.removeItem("seedPhrase");
    localStorage.removeItem("login");
    // localStorage.removeItem("seedPhraseGenerate");
    localStorage.removeItem("token");
    
    /* if(!localStorage.removeItem("login") === undefined || !localStorage.getItem("privateKey") === undefined) {
      this.$router.push(this.localePath("/login"))
    } */
    
    /* if(localStorage.getItem("loginExternal") !== undefined && localStorage.getItem("loginExternal") !== null) {
      const ruta = localStorage.getItem("loginExternal");
      const json = JSON.stringify({
        wallet: this.address,
        cretaDate: new Date()
      })
      const token = btoa(json)
      localStorage.removeItem("loginExternal");
      location.replace(ruta+"?token="+token);
    } */
    
    this.linkExplorer = process.env.URL_EXPLORER + this.address
    this.linkExplorerDetail = process.env.ROUTER_EXPLORER_NEAR;
    // this.getBalance()
    this.loadTokens()
    
    // Call getListTokensBalance every 5 minutes
    // Run getListTokensBalance every 5 minutes

    this.recentActivity()
    /* setInterval(() => {
      this.getBalance()
      this.recentActivity()
    }, 1000*10); // se ejecuta cada 10 segundos */
    // eliminando variables de inicio de session
    // this.alertSend();
  },
  methods: {
    navigateToExternalLink(url) {
      window.open(url, '_blank');
    },

    async openModalCrypto() {
      
      this.loading = true;
      await this.$refs.modalCryptos.refreshTokens()
      
      // Run this line only once
      this.balance = '0...';
      this.balance = await tokens.getBalanceInitNear(this.address);
      // Set an interval to keep checking for a balance in session storage every 5 seconds
      
      // console.log('Checking for balance in session storage...');
      const storedBalance = sessionStorage.getItem('balance');
      if (storedBalance) {
        this.balance = storedBalance;
        this.$refs.modalCryptos.model = true;
        this.loading = false;
        // console.log('Loaded balance from session storage:', this.balance);
        // If a balance is found, clear the interval
      }
      
    },

    /**
     * Loads tokens and balance data from session storage.
     */
    async loadTokens() {
        // console.log('Loading data...');

        // condition one get from session storage allTokenBalances
        // Check if data exists in session storage
        let storedTokenBalances = JSON.parse(sessionStorage.getItem('allTokenBalances'));

        if (!storedTokenBalances) {
          console.log('No token balances found in session storage.');
        } else {
          // console.log('Loaded data from session storage:', storedTokenBalances);
          this.dataTokens = storedTokenBalances;
        }

        // Set an interval to keep checking for data in session storage every 5 seconds
        const intervalIdOne = setInterval(() => {
          // console.log('Checking for data in session storage...');
          storedTokenBalances = JSON.parse(sessionStorage.getItem('allTokenBalances'));

          if (storedTokenBalances) {
            // console.log('Loaded data from session storage:', storedTokenBalances);
            this.dataTokens = storedTokenBalances;

            // If data is found, clear the interval
            clearInterval(intervalIdOne);
          }
        }, 5000);

        // Condition two get from  session storage balance
        // Check if balance exists in session storage
        let storedBalance = sessionStorage.getItem('balance');

        if (storedBalance) {
          this.balance = storedBalance;
          // console.log('Loaded balance from session storage:', this.balance);
        } 

        // Run this line only once
        this.balance = '0...';
        this.balance = await tokens.getBalanceInitNear(this.address);
        
        // Set an interval to keep checking for a balance in session storage every 5 seconds
        const intervalIdTwo = setInterval(() => {
          // console.log('Checking for balance in session storage...');
          storedBalance = sessionStorage.getItem('balance');
          if (storedBalance) {
            this.balance = storedBalance;
            // console.log('Loaded balance from session storage:', this.balance);

            // If a balance is found, clear the interval
            clearInterval(intervalIdTwo);
          }
        }, 5000);
      },
    alertSend() {
      const result = sessionStorage.getItem("send-result");

      if(result) {
        const resultSend = JSON.parse(result);

        // this.hash = resultSend.hash;
        // this.hashUrl = resultSend.hashUrl;
        // this.alertType = resultSend.alertType;

        // this.alert = true;

        this.$alert(resultSend.alertType,{ desc: `<a href="${resultSend.hashUrl}" target="_blank">${resultSend.hash}</a>` })

        sessionStorage.removeItem("send-result");
      }
    },
    openExplorer() {
      window.open("https://dao.arepa.digital/Proposals?dao=arepa-digital.organizacion.near", 'self')
    },

    irBudares() {
      window.open("https://dao.arepa.digital/daos", 'self')
    },

    fnCopie(copy) {
      this.copie = true;
      navigator.clipboard.writeText(copy);
      const timer = setInterval(() => {
        this.copie = false;
        clearInterval(timer)
      }, 1000);
    },

    async getBalance() {
      let balance = 0.00;
      let balanceNear = 0.00;

      const { near, usd } = await walletUtils.getBalance();

      if(near) {
        balance = usd;
        balanceNear = near;
      }

      this.balance = balance.toFixed(2);
      this.balance_near = balanceNear.toFixed(5);

    },


    recentActivity() {
      walletUtils.getRecentActivity()
      .then((result) => {
        this.dataActivity = result;
      })
      .catch((error) => {
        console.error("Error al cargar recientes actividades: ", error);
      });
    },
    setOperationSymbol(symbol) {
      const tokenSymbol = symbol;
      if (tokenSymbol === "USDT") {
        this.operationSymbol = require("@/assets/sources/tokens/usdt.svg");
      } else {
        this.operationSymbol = require("@/assets/sources/tokens/near.svg");
      }
    },
    getOrders() {
      // console.log('entro', wallet.getCurrentAccount().address);
      const selects = gql`
        query MyQuery( $address : String) {
          ordersells(
            where: {signer_id: $address}
          orderBy: id
          orderDirection: desc
          ) {
          id
          amount_delivered
          asset
          exchange_rate
          fee_deducted
          fiat_method
          owner_id
          payment_method
          signer_id
          terms_conditions
          time
          operation_amount
          order_id
        }

        orderbuys(
            where: {signer_id: $address}
          orderBy: id
          orderDirection: desc
          ) {
          id
          amount_delivered
          asset
          exchange_rate
          fee_deducted
          fiat_method
          owner_id
          payment_method
          signer_id
          terms_conditions
          time
          operation_amount
          order_id
        }
      }
      `;    
      this.poolOrders = this.$apollo
          .watchQuery({
            query: selects,
            // fetchPolicy: 'network-only',
            pollInterval: 5000,
            variables: {
              address: wallet.getCurrentAccount().address // localStorage.getItem("address"),
            }
          })
          .subscribe(( response ) => {
            if(!response.data?.ordersells || !response.data?.orderbuys) return

            const orderBuys = response.data.orderbuys;
            const orderSells = response.data.ordersells;
            const data = orderSells.length > 0 ? orderSells :  orderBuys;
            this.operation = orderSells.length > 0 ? "SELL" : "BUY";
            
            if(data.length <= 0){
              localStorage.removeItem('emailCounter');
              sessionStorage.removeItem('orderId');
              localStorage.removeItem('operation');
              this.pendingTrades = false;
              return;
            }

            let orderId = sessionStorage.getItem('orderId');
            let operation = localStorage.getItem('operation');
            
            
            if(orderId === "undefined" || operation === "undefined" || orderId === undefined || operation === undefined || !orderId || !operation ) {
              sessionStorage.setItem('orderId', data[0].order_id);
              localStorage.setItem('operation', this.operation);
              orderId = data[0].order_id;
              operation = this.operation;
            }
            
            let order =  data.find((item) => item.order_id === orderId);

            if(order === "undefined" || order === undefined || !order){
              sessionStorage.setItem('orderId', data[0].order_id);
              localStorage.setItem('operation', this.operation);
              orderId = data[0].order_id;
              operation = this.operation;
              order =  data.find((item) => item.order_id === orderId);
            }

            this.data = [];
            this.data.push(order);
            this.pendingTrades = true;
            
          });
    },
    enviar() {
      this.$router.push({ path: "/send" });
      sessionStorage.setItem("push", "withdraw");
    },
    recargar() {
      this.$router.push({ path: "/deposit" });
      sessionStorage.setItem("push", "deposit");
    },
    // async orderBuy() {
    //   const selects = gql`
    //     query MyQuery( $address : String) {
    //       orderbuys(
    //         where: {signer_id: $address}
    //       orderBy: id
    //       orderDirection: desc
    //       first: 1
    //       ) {
    //       id
    //       amount_delivered
    //       asset
    //       exchange_rate
    //       fee_deducted
    //       fiat_method
    //       owner_id
    //       payment_method
    //       signer_id
    //       terms_conditions
    //       time
    //       operation_amount
    //       order_id
    //     }
    //   }
    //   `;    
    //   await this.$apollo
    //       .watchQuery({
    //         query: selects,
    //         fetchPolicy: 'network-only',
    //         pollInterval: 5000,
    //         variables: {
    //           address: wallet.getCurrentAccount().address,
    //         }
    //       })
    //       .subscribe(({ data }) => {
    //         // console.log(data.orderbuys)
    //         if (data.orderbuys.length > 0) {
    //           // console.log('Paso por aqui');
    //           Object.entries(data.orderbuys).forEach(([key, value]) => {
    //             this.data = [];
    //             this.data.push(value);
    //             this.pendingTrades = true;
    //           });
    //         } else {
    //             localStorage.removeItem('emailCounter');
    //             sessionStorage.removeItem('orderId');
    //             localStorage.removeItem('operation');
    //             this.pendingTrades = false;
    //         }
    //       });
    // },
  }
};
</script>

<style src="~/assets/styles/pages/index.scss" lang="scss" />
