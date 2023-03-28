
<template>
    <div class="card">
        <DataView :value="products" :layout="layout">
            <template #header>
                <div class="flex justify-content-end">
                    <DataViewLayoutOptions v-model="layout" />
                </div>
            </template>

            <template #list="slotProps">
                <div class="col-12">
                    <div class="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4">
                        <img class="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round"
                            :src="`https://primefaces.org/cdn/primevue/images/product/${slotProps.data.url}`"
                            :alt="slotProps.data.name" />
                        <div
                            class="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                            <div class="flex flex-column align-items-center sm:align-items-start gap-3">
                                <div class="text-2xl font-bold text-900">{{ slotProps.data.name }}</div>
                                <!-- <Rating :modelValue="slotProps.data.rating" readonly :cancel="false"></Rating> -->
                                <div class="flex align-items-center gap-3">
                                    <span class="flex align-items-center gap-2">
                                        <i class="pi pi-tag"></i>
                                        <span class="font-semibold">{{ slotProps.data.category.name }}</span>
                                    </span>
                                    <!-- <Tag :value="slotProps.data.inventoryStatus" :severity="getSeverity(slotProps.data)"> -->
                                    <!-- </Tag> -->
                                </div>
                            </div>
                            <div class="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                                <span class="text-2xl font-semibold">Rs.{{ slotProps.data.price }}</span>
                                <Button icon="pi pi-shopping-cart" rounded @click="confirm1($event)"></Button>
                            <!-- <Button icon="pi pi-shopping-cart" rounded @click="addCart(slotProps.data)"
                                                    :disabled="slotProps.data.inventoryStatus === 'OUTOFSTOCK'"></Button> -->
                            </div>
                        </div>
                    </div>
                </div>
            </template>

            <template #grid="slotProps">
                <div class="col-12 sm:col-6 lg:col-12 xl:col-4 p-2">
                    <div class="p-4 border-1 surface-border surface-card border-round">
                        <div class="flex flex-wrap align-items-center justify-content-between gap-2">
                            <div class="flex align-items-center gap-2">
                                <i class="pi pi-tag"></i>
                                <span class="font-semibold">{{ slotProps.data.category.name }}</span>
                            </div>
                            <!-- <Tag :value="slotProps.data.inventoryStatus" :severity="getSeverity(slotProps.data)"></Tag> -->
                        </div>
                        <div class="flex flex-column align-items-center gap-3 py-5">
                            <img class="w-9 shadow-2 border-round"
                                :src="`https://primefaces.org/cdn/primevue/images/product/${slotProps.data.url}`"
                                :alt="slotProps.data.name" />
                            <div class="text-2xl font-bold">{{ slotProps.data.name }}</div>
                            <!-- <Rating value="{product.rating}" readonly :cancel="false"></Rating> -->
                        </div>
                        <div class="flex align-items-center justify-content-between">
                            <span class="text-2xl font-semibold">${{ slotProps.data.price }}</span>
                            <Button icon="pi pi-shopping-cart" rounded @click="addCart(slotProps.data)"
                                :disabled="slotProps.data.inventoryStatus === 'OUTOFSTOCK'"></Button>
                        </div>
                    </div>
                </div>
            </template>
        </DataView>
        <ConfirmPopup></ConfirmPopup>

    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";

const confirm = useConfirm();
const toast = useToast();
const router = useRouter()
const layout = ref('grid');

const products = ref();


onMounted(async () => {
    try {
        const response = await axios.get("product")
        products.value = response.data


    } catch (error) {
        console.log(error);
    }
});

const confirm1 = (event) => {
    confirm.require({
        target: event.currentTarget,
        message: 'Do you want to delete this record?',
        icon: 'pi pi-info-circle',
        acceptClass: 'p-button-danger',
        accept: () => {
            toast.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted', life: 3000 });
        },
        reject: () => {
            toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
        }
    });
};

const addCart = async (item) => {
    const userId = localStorage.getItem("user_id");
    console.log(JSON.stringify(item), userId);
    try {
        const response = await axios.post("cart", {
            "quantity": 1,
            "userId": userId,
            "productId": item.id
        })
        console.log(JSON.stringify(response));

        router.push('/cart')

    } catch (error) {
        console.log(error);
    }

}




// const getSeverity = (product) => {
//     switch (product.inventoryStatus) {
//         case 'INSTOCK':
//             return 'success';

//         case 'LOWSTOCK':
//             return 'warning';

//         case 'OUTOFSTOCK':
//             return 'danger';

//         default:
//             return null;
//     }
// }

</script>