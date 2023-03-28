<script setup>

</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <DataTable v-model:editingRows="editingRows" :value="products" editMode="row" dataKey="id"
                    @row-edit-save="onRowEditSave" tableClass="editable-cells-table" tableStyle="min-width: 50rem">
                    <template #header>
                        <div class="flex flex-wrap align-items-center justify-content-between gap-2">
                            <span class="text-xl text-900 font-bold">Your Shopping Cart</span>
                        </div>
                    </template>
                    <Column field="product.name" header="Name"></Column>
                    <Column header="Image">
                        <template #body="slotProps">
                            <img :src="`https://primefaces.org/cdn/primevue/images/product/${slotProps.data.product.url}`"
                                :alt="slotProps.data.product.url" class="w-6rem shadow-2 border-round" />
                        </template>
                    </Column>
                    <Column field="product.price" header="Price">
                        <template #body="slotProps">
                            {{ "Rs." + slotProps.data.product.price }}
                        </template>
                    </Column>

                    <Column field="quantity" header="Quantity">
                        <template #editor="{ data, field }">
                            <InputText v-model="data[field]" />
                        </template>
                    </Column>
                    <Column :rowEditor="true" style="width: 10%; min-width: 8rem" bodyStyle="text-align:center"></Column>

                    <Column field="total" header="Total">
                        <template #body="slotProps">
                            {{ slotProps.data.product.price * slotProps.data.quantity }}
                        </template>

                    </Column>
                    <Column :exportable="false" style="min-width:8rem">
                        <template #body="slotProps">
                            <Button icon="pi pi-trash" outlined rounded severity="danger"
                                @click="confirmDeleteProduct(slotProps.data)" />
                        </template>
                    </Column>

                    <template #footer> In total there are {{ products ? products.length : 0 }} products. </template>
                </DataTable>
            </div>
        </div>
        <div class="col-12">
            <div class="card">
                <h4>
                    Place your Order
                </h4>

                <!-- Addressssssssss -->
                <div class="p-fluid formgrid grid">
                    <div v-if="userAddress.length && !showNewAddress" class="field col-10 md:col-4">
                        <label for="city">Shipping Address
                        </label>
                        <Dropdown v-show="userAddress.length" id="address" v-model="selectedAddress" :options="userAddress"
                            optionLabel="address" placeholder="Select One"></Dropdown>
                    </div>
                    <div v-if="userAddress.length && !showNewAddress"
                        class="field col-2 md:col-2 flex align-content-center flex-wrap ">
                        <Button v-if="selectedAddress" class="mt-2" icon="pi pi-trash" severity="danger" text
                            @click="onAddressDelete()" />
                        <Button class="mt-2" icon="pi pi-plus" text @click="showNewAddress = !showNewAddress" />
                    </div>
                    <!-- else -->

                    <div v-if="userAddress.length == 0 || showNewAddress" class="field col-10 md:col-4">
                        <label for="city">Shipping Address
                        </label>
                        <Textarea v-model="address" placeholder="Enter your shipping address" rows="5" cols="30" />
                    </div>
                    <div v-if="userAddress.length == 0 || showNewAddress"
                        class="field col-2 md:col-2 flex align-content-center flex-wrap ">
                        <Button class="mt-2" icon="pi pi-check" text @click="onAddressSave()" />
                        <Button class="mt-2" icon="pi pi-times" text @click="showNewAddress = !showNewAddress" />
                    </div>
                    <!-- Addressss END -->


                    <div class="field col-12 md:col-3">
                        <label for="state">Total Amount</label>
                        <InputText id="zip" type="text" disabled :value="getTotalAmount()" />
                    </div>
                    <div class="field col-12 md:col-3">
                        <label for="zip">Total Quantity</label>
                        <InputText id="zip" type="text" disabled :value="getTotalQty()" />
                    </div>
                    <div class="col-12">
                        <Button label="Place Order" raised @click="onSubmit()" />
                    </div>
                </div>
            </div>
        </div>
        <Dialog v-model:visible="deleteProductDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="confirmation-content">
                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                <span v-if="product">Are you sure you want to delete <b>{{ product.product.name }}</b>?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteProductDialog = false" />
                <Button label="Yes" icon="pi pi-check" text @click="deleteProduct" />
            </template>
        </Dialog>
        <Toast />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ProductService } from '@/service/ProductService';
import axios from 'axios'
import { useToast } from 'primevue/usetoast';


const toast = useToast();

const products = ref();
const editingRows = ref([]);
const selectedProducts = ref();
const deleteProductDialog = ref(false);
const showNewAddress = ref(false);
const product = ref({});
const userAddress = ref([])
const address = ref('');
const selectedAddress = ref();
const totalAmount = ref(0);
const totalQty = ref(0);

const user_id = localStorage.getItem("user_id")

onMounted(async () => {
    try {
        // const user_id = localStorage.getItem("user_id")
        const response = await axios.get(`cart/${user_id}`);
        products.value = response.data;

        userAddress.value = await getUserAddress(user_id);

    } catch (error) {
        const response = await axios.get(`cart/${user_id}`);
   
    }
});

const getUserAddress = async (user)=>{
    try {
        const response = await axios.get(`address/${user}`)
        return response.data
    } catch (error) {
        
    }
}

const onRowEditSave = async (event) => {
    let { newData, index } = event;

    try {
        const response = await axios.patch(`cart/${newData.id}`,{
        "quantity": parseInt(newData.quantity)
        })
        console.log(JSON.stringify(response.data));
        products.value[index] = newData;
    } catch (error) {
        console.log(error);
    }
};

const confirmDeleteSelected = () => {
    deleteProductsDialog.value = true;
};

const confirmDeleteProduct = (prod) => {
    product.value = prod;
    deleteProductDialog.value = true;
};

const deleteProduct = async () => {
    console.log(product.value);
    try {
        const response = await axios.delete(`cart/${product.value.id}`)
        products.value = products.value.filter(val => val.id !== product.value.id);
        deleteProductDialog.value = false;
        product.value = {};
        toast.add({severity:'success', summary: 'Successful', detail: 'Product Deleted', life: 3000});

    } catch (error) {
        console.error();
    }
    
}



const onAddressSave =async ()=>{

    if (showNewAddress && address) {
        try {
            const response = await axios.post("address",{
            "address": address.value,
            "userId": user_id
        })
            console.log(response.data);
            userAddress.value = await getUserAddress(user_id);
            showNewAddress.value = false
        } catch (error) {
            console.error();
        }

    }
}

const onAddressDelete = async ()=>{
console.log('enter');
    try {
        const response = await axios.delete(`address/${selectedAddress.value.id}`)
        userAddress.value = await getUserAddress(user_id);
        selectedAddress.value = ""

    } catch (error) {
        console.error();
    }
}

const onSubmit = async()=>{

   const p =await Promise.all(products.value?.map((i)=>{
        return {
            "unitPrice": i.product.price,
            "quantity": i.quantity,
            "subTotal": parseInt(i.quantity) * parseInt(i.product?.price),
            "productId": i.product.id
        } 
    }))

   try {
        const response = await axios.post("sales",{
            "totalAmount": getTotalAmount(),
            "totalProducts": getTotalQty(),
            "userId": user_id,
            "address": selectedAddress.value.address,
            "salesChild": p
        })

        products.value?.map(async (i)=>{
            await axios.delete(`cart/${i.id}`)
                .then((res)=>{
                    console.log(res);
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                })
        })

        products.value = null
        

   } catch (error) {
    console.error();
   }
}

const getTotalAmount = (()=>{
    return products.value?.reduce((total, item) => {
        return total +( item.quantity * item.product.price)
      }, 0)
})
const getTotalQty = (()=>{
    return products.value?.reduce((total, item) => {
        return total +item.quantity
      }, 0)
})


</script>

<style lang="scss" scoped>
::v-deep(.editable-cells-table td.p-cell-editing) {
    padding-top: 0.6rem;
    padding-bottom: 0.6rem;
}
</style>