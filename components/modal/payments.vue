<template>
  <v-dialog
    v-model="model"
    max-width="max-content"
    :overlay-opacity=".9"
    content-class="modal-payments"
  >
    <aside class="d-flex justify-end mb-5">
      <v-text-field
        v-model="search"
        hide-details solo
      >
        <template #append>
          <img src="@/assets/sources/icons/magnify.svg" alt="search icon">
        </template>
      </v-text-field>
    </aside>


    <v-card class="payments-card">
      <div
        v-if="loading"
        class="payments-card__wrapper"
        style="text-align: center;"
      >
      Cargando....
      </div>
      <div
        v-else
        class="payments-card__wrapper"
      >
        <v-card
          v-for="(item, i) in dataTokensFinal" :key="i"
          color="transparent"
          class="payments-card-coin space"
          @click="onSelected(item)"
        >
          <div class="center" style="gap: 14px;">
            <v-img-load
              :src="item.icon"
              :alt="`${item.name}s' coin`"
              sizes="29px"
              cover
            />

            <h5 class="mb-0">{{ item.name }}</h5>
          </div>

          <div class="d-flex flex-column">
            <span>{{ item.balance }} {{ item.coin }}</span>
            <span>${{ item.balance_usd }}</span>
          </div>
        </v-card>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from 'axios';
import tokens from '@/services/tokens';

export default {
  name: "ModalCryptos",
  props: {
    dataTokens: {
      type: Array,
      default: undefined,
    }
  },
  data() {
    return {
      model: false,
      search: '',
      selectedCoin: undefined,
      loading: false,
      tokensData: [],
      dataTokensFinal: [
        // {
        //   contract: ,
        //   balance: walletUtils.formatTokenAmount(balance, metadata.decimals, 5),
        //   name: metadata.name,
        //   symbol: metadata.symbol,
        //   decimals: metadata.decimals,
        //   icon: metadata.icon,
        //   balance_usd: Number(walletUtils.formatTokenAmount(balance, metadata.decimals, 5)) * Number(price),
        //   price
        // }*
        {
          icon: require('@/assets/sources/countries/usa.svg'),
          coin: "USD",
          name: "PAYPAL",
          balance: "50,000",
          balance_usd: "0.98 USD/USDT"
        },
        {
          icon: require('@/assets/sources/countries/vnzla.svg'),
          coin: "VES",
          name: "PAGO MOVIL",
          balance: "59.744",
          balance_usd: "79.379"
        },
        {
          icon: require('@/assets/sources/countries/arg.svg'),
          coin: "ARS",
          name: "MERCADO PAGO",
          balance: "59.744",
          balance_usd: "79.379"
        },
        {
          icon: require('@/assets/sources/countries/eur.svg'),
          coin: "EUR",
          name: "BIZUM",
          balance: "59.744",
          balance_usd: "79.379"
        },
        {
          icon: require('@/assets/sources/countries/ngn.svg'),
          coin: "NGN",
          name: "TRANSFERENCIA (NGN)",
          balance: "59.744",
          balance_usd: "79.379"
        },
      ]
    }
  },
  watch: {
    model(value) {
      if (!value) this.search = ''
    },
    search(value) {
      if(this.dataTokensFinal.length <= 0) return
      if(!this.dataTokensFinal[0]?.name) return

      if (!value){
        this.dataTokensFinal = [].concat(this.tokensData); // Set sorted inventory data
      } else {
        this.dataTokensFinal = this.tokensData.filter((item) => item?.name.toLowerCase().includes(value))
      }
    }
    
  },

  mounted() {
    this.loadTokens();
  },

  methods: {
    async getContractIds(wallet) {
      if (process.env.Network === "mainnet") {
        const serviceUrl = `https://api.fastnear.com/v0/account/${wallet}/ft`;

        const result = await axios.get(serviceUrl);

        return result.data.contract_ids
      } else {
        const serviceUrl = `https://api-testnet.nearblocks.io/v1/account/${wallet}/tokens`;

        const result = await axios.get(serviceUrl);

        return result.data.tokens.fts
      }
    },
    /**
     * Loads tokens data from session storage or API, sorts the inventory based on token values,
     * calculates the total balance, and stores it in session storage.
     * @returns {Promise<void>} A promise that resolves when the tokens data is loaded and processed.
     */
    async loadTokens() {
      this.loading = true;
      // console.log('Loading data...');

      // Check if data exists in session storage
      const storedTokenBalances = JSON.parse(sessionStorage.getItem('allTokenBalances'));

      let inventory;
      // console.log('Stored data:', storedTokenBalances);
      if (storedTokenBalances) {
        // If session storage data exists, use it as the inventory
        inventory = { fts: storedTokenBalances };
        // console.log('Loaded data from session storage:', inventory);
      } else {
        // Otherwise, fetch the inventory from the API
        inventory = await tokens.updateBalanceLocalStorage(); // await tokens.getListTokensBalance();
        // console.log('Fetched data from API:', inventory);
      }

      if (!inventory) {
        this.loading = false;
        return;
      }

      // Sort the inventory array based on token values from more to less
      /* inventory.fts.sort((a, b) => {
        // Compare the balance_usd property of each token object
        return b.balance_usd - a.balance_usd;
      }); */

      this.tokensData = inventory.fts;

      
      // console.log('Sorted data:', this.tokensData);

      // Sum all balances
      /* let totalBalance = 0;
      for (const token of this.tokensData) {
        totalBalance += Number(token.balance_usd);
      } */
      // console.log('Total balance:', totalBalance);

      // Store the total balance in session storage
      // sessionStorage.setItem('balance', totalBalance.toFixed(2));
      // console.log('Stored total balance in session storage:', totalBalance);

      this.loading = false;
      this.dataTokensFinal = [].concat(this.tokensData); // Set sorted inventory data
      // console.log('Final data:', this.dataTokensFinal);
    },
    onSelected(item) {
      this.model = false;
      this.$emit('on-selected-coin', item)
    }
  },

}
</script>

<style lang="scss">
.modal-payments {

  .v-input {
    flex-grow: 1;
    transform-origin: right;
    max-width: 31px !important;

    transition: .3s cubic-bezier(0.86, 0, 0.07, 1);

    &__slot {
      min-height: 31px !important;
      outline: none !important;
    }

    .v-input__append-inner img {
      transform: translateX(-8px);
      transition: transform .3s ease;
    }

    &--is-focused {
      max-width: 100% !important;
      
      .v-input__append-inner img { transform: translateX(0) }
    }
  }


  .payments-card {
    --height: 600px;
    --padding-block: 29px;

    width: 317px;
    max-height: var(--height);
    border-radius: 20px;
    border: 1px solid #000;
    background-color: #F6F6F7 !important;
    padding-block: var(--padding-block);
    padding-right: 2px;

    .payments-card__wrapper {
      display: flex;
      flex-direction: column;
      scrollbar-gutter: stable;
      max-height: calc(var(--height) - var(--padding-block) * 2);
      padding-left: 10px;
      border-radius: 0 !important;
      overflow-y: auto;
    }

    
    &-coin {
      --padding-inline: 20px;

      padding-inline: var(--padding-inline);
      padding-block: 16px;
      position: relative;

      &::after {
        content: '';
        position: absolute;
        inset: auto 0 0 0;
        margin-inline: auto;
        height: 1px;
        width: calc(100% - var(--padding-inline) * 2);
        background-color: var(--secondary);
      }

      /* &.active {
        background-color: hsl(216 99% 52% / .7) !important;
        &::after { background-color: #333 !important }

        * { color: #fff !important }
      } */
    }

    
    h5 {
      --fw: 700;
      --fs: 12px;
      color: #000;
      font-family: var(--font2);
      line-height: normal;
    }

    span:first-child {
      --fw: 700;
      color: #000;
      text-align: right;
      font-size: 12px;
      font-family: var(--font2);
      line-height: normal;

      + span {
        --fw: 400;
        color: #333;
        text-align: right;
        font-family: var(--font2);
        font-size: 10px;
        line-height: normal;
      }
    }
  }
}
</style>
