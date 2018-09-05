<template>
  <div class="container">
    <br/>
    <h3 class="center">Please enter exchange rate you wants to track:</h3>
    <br/>
    <multiselect
      placeholder="From"
      v-model="selectedFrom"
      :options="availableCurrencies">
    </multiselect>
    <br/>
    <multiselect
      placeholder="To"
      v-model="selectedTo"
      :options="availableCurrencies">
    </multiselect>
    <br/>
    <button type="button" class="btn btn-success btn-lg" 
      @click="addItem()">Add to my list</button>
    <br/>
    <hr/>
    <table class="table">
      <thead class="thead-dark">
        <tr>
          <th scope="col">From</th>
          <th scope="col">To</th>
          <th scope="col">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in currencyTable"
          :key="item.id">
          <td>{{ item.from.toUpperCase() }}</td>
          <td>{{ item.to.toUpperCase() }}</td>
          <td>{{ item.amount.toFixed(4) }}</td>
        </tr>
      </tbody>
    </table>
    <br/>
    <span>Updated at: {{ timeFromNow }}</span>
  </div>
</template>
<script>

import Multiselect from 'vue-multiselect'

export default {
  components: { Multiselect },

  data() {
    return {
      availableCurrencies: [],
      userList: [],
      currencyTable: [],
      timeFromNow: null,
      selectedFrom: null,
      selectedTo: null,
    }
  },

  beforeMount () {
    this.loadAvailableCurrencies();
    this.loadUserList();

    setInterval(this.updateData, 60000);
  },

  beforeDestroy () {
    clearInterval(this.updateData)
  },

  methods: {
    async updateData(){
      await this.$store.dispatch('fillCurencyTable');

      this.currencyTable = this.$store.getters.currency_table;
      this.timeFromNow = (new Date).toUTCString()
    },

    loadUserList(){
      this.$store.dispatch('loadUserList');
      this.userList = this.$store.getters.user_list;

      this.updateData();
    },

    async loadAvailableCurrencies(){
      await this.$store.dispatch('getAvailableCurrencies');
      this.availableCurrencies = this.$store.getters.available_currencies

      this.timeFromNow = (new Date).toUTCString()
    },

    addItem(){
      if(this.selectedFrom && this.selectedTo){
        this.$store.dispatch('addItemToList', [this.selectedFrom, this.selectedTo]);
        
        this.loadUserList();
      }

      this.selectedFrom = null;
      this.selectedTo = null;
    }
  }
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style>
  .center {
    text-align: center
  }

  .container {
    max-width: 375px;
  }
</style>

