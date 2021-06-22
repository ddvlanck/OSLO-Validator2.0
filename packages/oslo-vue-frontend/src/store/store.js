import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        shaclResult: null,
        requestBody: null
    },

    getters: {
        ShaclResult: state => {
            return state.shaclResult;
        },
        RequestBody: state => {
            return state.requestBody;
        }
    },

    mutations: {
        setResult(state, result){
            state.shaclResult = result;
        },
        setRequestBody(state, body){
            state.requestBody = body;
        }
    },

    actions: {
    }
});
