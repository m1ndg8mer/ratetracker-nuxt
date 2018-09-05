import Vuex from "vuex";
import axios from 'axios';

const createStore = () => {
  return new Vuex.Store({
    state: {
      availableCurrencies: [],
      userList: [],
      currencyTable: []
    },

    getters: {
      available_currencies(state){
        return state.availableCurrencies;
      },

      user_list(state){
        return state.userList;
      },

      currency_table(state){
        return state.currencyTable;
      }
    },

    mutations: {
      getAvailableCurrencies(state, currencies){
        state.availableCurrencies = currencies;
      },

      loadUserList(state, userList){
        state.userList = userList;
      },

      updateUserList(state, item){
        let retrievedObject = localStorage.getItem('userList');
        let userList = []
        
        if(retrievedObject !== null){
          userList = JSON.parse(retrievedObject);
        }

        userList.unshift({ 
          from: item[0],
          to: item[1]
        })

        localStorage.setItem('userList', JSON.stringify(userList));
      },

      fillCurencyTable(state, table){
        state.currencyTable = table;
      }
    },

    actions: {
      async getAvailableCurrencies(context){
        const req = await axios.get(process.env.API_URL + '/currencies');
        context.commit('getAvailableCurrencies', req.data);
      },

      fillCurencyTable(context){
        let retrievedObject = localStorage.getItem('userList');
        let userList = []
        let table = []
        
        if(retrievedObject !== null){
          userList = JSON.parse(retrievedObject);

         userList.forEach(async (e, i) => {
            const req = await axios.get(process.env.API_URL + `/rates?from=${e.from}&to=${e.to}`);
            let response = req.data;

            response['id'] = i;
            table.unshift(response);
          });
        }

        context.commit('fillCurencyTable', table);
      },

      loadUserList(context){
        let retrievedObject = localStorage.getItem('userList');
        let userList = []
        
        if(retrievedObject !== null){
          userList = JSON.parse(retrievedObject);
        }

        context.commit('loadUserList', userList);
      },

      addItemToList(context, item){
        context.commit('updateUserList', item);
      }
    }
  });
};

export default createStore;
