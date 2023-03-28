
<template>
    <div class="card">
        <DataTable :value="products" tableStyle="min-width: 50rem">
            <template #header>
                <div class="flex flex-wrap align-items-center justify-content-between gap-2">
                    <span class="text-xl text-900 font-bold">Returned Products</span>
                </div>
            </template>

            <Column field="createdAt" header="Date">
                <template #body="slotProps">
                    {{ formatDate(slotProps.data.createdAt) }}
                </template>

            </Column>

            <Column header="Image">
                <template #body="slotProps">
                    <img :src="`https://primefaces.org/cdn/primevue/images/product/${slotProps.data.salesChild.product.url}`"
                        :alt="slotProps.data.salesChild.product.url" class="w-6rem shadow-2 border-round" />
                </template>
            </Column>
            <Column field="name" header="Name">
                <template #body="slotProps">
                    {{ slotProps.data.salesChild.product.name }}
                </template>
            </Column>
            <Column field="price" header="Price">
                <template #body="slotProps">
                    Rs. {{ slotProps.data.price }}
                </template>
            </Column>
            <Column field="quantity" header="Quantity"></Column>
            <Column field="reason" header="Reason"></Column>
            <Column header="Status">
                <template #body="slotProps">
                    <Tag :value="slotProps.data.status" :severity="getSeverity(slotProps.data.status)" />
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios'

const user_id = localStorage.getItem("user_id")
const products = ref();


onMounted(() => {

    axios.get(`sales-return/${user_id}`)
        .then((response) => {
            console.log(response.data);
            products.value = response.data
        })
        .catch((error) => {
            console.log(error);
        })
});


const getSeverity = (product) => {
    switch (product) {
        case 'APPROVED':
            return 'success';

        case 'PENDING':
            return 'warning';

        case 'REJECTED':
            return 'danger';

        default:
            return null;
    }
};
const formatDate = (value) => {
    console.log(value);
    const d = new Date(value).toLocaleDateString();
    return d
};

</script>