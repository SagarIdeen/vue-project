<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }]
    },
    {
        items: [{ label: 'Products', icon: 'pi pi-fw pi-table', to: '/product' }]
    },
    {
        items: [{ label: 'Cart', icon: 'pi pi-fw pi-cart-plus', to: '/cart' }]
    },
    {
        items: [{ label: 'Orders', icon: 'pi pi-fw pi-shopping-bag', to: '/orders' }]
    },
    {
        items: [{ label: 'Sales Return', icon: 'pi pi-fw pi-undo', to: '/salesReturn' }]
    },



]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
