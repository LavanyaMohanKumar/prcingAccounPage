import { createApp } from 'vue';
import App from './App.vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import vuetify from './plugins/vuetify';


import './assets/styles.css'; 
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css';

import store from './store/index.js';

import { BContainer, BRow, BCol,BTable, BButton, BSpinner } from 'bootstrap-vue-next';                  

const app = createApp(App);

app.component('BContainer', BContainer);
app.component('BRow', BRow);
app.component('BCol', BCol);
app.component("BTable", BTable);
app.component("BButton", BButton);
app.component("BSpinner", BSpinner);

app.use(ElementPlus);
app.use(vuetify);
app.use(store);

app.mount('#app');
