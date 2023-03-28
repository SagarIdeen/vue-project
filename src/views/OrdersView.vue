
<template>
    <div class="card">
        <DataTable v-model:expandedRows="expandedRows" :value="products" dataKey="id" @rowExpand="onRowExpand"
            @rowCollapse="onRowCollapse" tableStyle="min-width: 60rem">
            <template #header>
                <div class="flex flex-wrap justify-content-end gap-2">
                    <Button text icon="pi pi-plus" label="Expand All" @click="expandAll" />
                    <Button text icon="pi pi-minus" label="Collapse All" @click="collapseAll" />
                </div>
            </template>
            <Column expander style="width: 5rem" />
            <Column field="createdAt" header="Date">
                <template #body="slotProps">
                    {{ formatDate(slotProps.data.createdAt) }}
                </template>

            </Column>
            <Column field="address" header="Shipping Address">
            </Column>
            <Column field="totalAmount" header="Total Amount">
                Rs. {{ slotProps.data.totalAmount }}
            </Column>
            <Column field="totalProducts" header="Total Quantity">
            </Column>
            <template #expansion="slotProps">
                <div class="p-3">
                    <h5>Product Details</h5>
                    <DataTable :value="slotProps.data.salesChilds">
                        <Column header="Image">
                            <template #body="slotProps">
                                <img :src="`https://primefaces.org/cdn/primevue/images/product/${slotProps.data.product.url}`"
                                    :alt="slotProps.data.image" class="shadow-4" width="64" />
                            </template>
                        </Column>
                        <Column field="product" header="Name">
                            <template #body="slotProps">
                                {{ slotProps.data.product.name }}
                            </template>
                        </Column>
                        <Column field="quantity" header="quantity"></Column>
                        <Column field="unitPrice" header="unitPrice"></Column>
                        <Column field="subTotal" header="subTotal"></Column>
                        <Column headerStyle="width:4rem">
                            <template #body="slotProps">
                                <Button v-if="!slotProps.data.salesReturn" label="Return" severity="warning" outlined
                                    @click="onReturn(slotProps.data)" />
                                <Button v-if="slotProps.data.salesReturn" label="Returned" plain outlined disabled />
                            </template>
                        </Column>
                    </DataTable>
                </div>
            </template>
        </DataTable>
        <Toast />
        <Dialog v-model:visible="visible" modal header="Reaturn Product" :style="{ width: '40vw' }">
            <div class="flex flex-column gap-2">
                <label for="username">Reason</label>
                <Textarea v-model="value" />
                <small id="username-help">Enter your reason to return this product.</small>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" @click="visible = false" text />
                <Button label="Yes" icon="pi pi-check" @click="onReturnSubmit()" autofocus />
            </template>
        </Dialog>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import axios from 'axios';



const user_id = localStorage.getItem("user_id")

const products = ref();
const expandedRows = ref([]);
const toast = useToast();
const visible = ref(false);
const productReturn = ref();
const value = ref('');


onMounted(() => {
    getSales();

});

const getSales = async () => {
    axios.get(`sales/${user_id}`)
        .then((res) => {
            products.value = res.data;
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .finally(() => {
            console.log(JSON.stringify(products.value));
        })
}

const onReturnSubmit = async () => {

    console.log('quantity :', productReturn.value.quantity)
    console.log('price :', productReturn.value.product.price)
    console.log('reason :', value.value)
    console.log('salesChild :', productReturn.value.id)

    await axios.post("sales-return", {
        "quantity": productReturn.value.quantity,
        "price": productReturn.value.product.price,
        "reason": value.value,
        "status": "PENDING",
        "salesChild": productReturn.value.id
    })
        .then((response) => {
            console.log(JSON.stringify(response.data))
        })
        .catch((error) => {
            console.error();
        })
        .finally(() => {
            getSales()
            visible.value = false
            value.value = null
            productReturn.value = null
        })

}

const onReturn = (i) => {
    console.log(JSON.stringify(i));
    productReturn.value = i
    visible.value = true
}

const onRowExpand = (event) => {
    toast.add({ severity: 'info', summary: 'Product Expanded', detail: event.data.name, life: 3000 });
};
const onRowCollapse = (event) => {
    toast.add({ severity: 'success', summary: 'Product Collapsed', detail: event.data.name, life: 3000 });
};
const expandAll = () => {
    expandedRows.value = products.value.filter((p) => p.id);
};
const collapseAll = () => {
    expandedRows.value = null;
};
const formatDate = (value) => {
    console.log(value);
    const d = new Date(value).toLocaleDateString();
    return d
};



</script>