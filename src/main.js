import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config';
import './axios';
import '@/assets/styles.scss';


import "./assets/app.css"
import "primevue/resources/themes/lara-light-indigo/theme.css"; 
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";
import '/node_modules/primeflex/primeflex.css'  
        // PrimeFlex

import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import DataView from 'primevue/dataview';
import DataViewLayoutOptions from 'primevue/dataviewlayoutoptions'  
import Splitter from 'primevue/splitter';
import SplitterPanel from 'primevue/splitterpanel';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';   // optional
import Row from 'primevue/row';  
import Dialog from 'primevue/dialog';  
import ToastService from 'primevue/toastservice';
import Toast from 'primevue/toast';
import DialogService from 'primevue/dialogservice';
import Textarea from 'primevue/textarea';
import Dropdown from 'primevue/dropdown';
import Tag from 'primevue/tag';
import ConfirmDialog from 'primevue/confirmdialog';
import ConfirmationService from 'primevue/confirmationservice';
import ConfirmPopup from 'primevue/confirmpopup';










const app = createApp(App)
const pinia = createPinia()


app.use(router)
app.use(PrimeVue);
app.use(pinia)
app.use(ToastService);
app.use(DialogService);
app.use(ConfirmationService);


app.component('InputText', InputText);
app.component('Password', Password);
app.component('Button', Button);
app.component('TabView', TabView);
app.component('TabPanel', TabPanel);
app.component('DataView', DataView);
app.component('DataViewLayoutOptions', DataViewLayoutOptions);
app.component('Splitter', Splitter);
app.component('SplitterPanel', SplitterPanel);
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('ColumnGroup', ColumnGroup);
app.component('Row', Row);
app.component('Dialog', Dialog);
app.component('Toast', Toast);
app.component('Textarea', Textarea);
app.component('Dropdown', Dropdown);
app.component('Tag', Tag);
app.component('ConfirmDialog', ConfirmDialog);
app.component('ConfirmPopup', ConfirmPopup);



app.mount('#app')
