import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config';
import './axios';


import "./assets/app.css"
import "primevue/resources/themes/lara-light-indigo/theme.css"; 
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";
import '/node_modules/primeflex/primeflex.css'          // PrimeFlex

import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';


const app = createApp(App)
const pinia = createPinia()


app.use(router)
app.use(PrimeVue);
app.use(pinia)
app.component('InputText', InputText);
app.component('Password', Password);
app.component('Button', Button);
app.component('TabView', TabView);
app.component('TabPanel', TabPanel);


app.mount('#app')
