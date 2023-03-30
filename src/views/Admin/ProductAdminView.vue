
<template>
    <div>
        <div class="card">
            <Toolbar class="mb-4">
                <template #start>
                    <Button label="New" icon="pi pi-plus" severity="success" class="mr-2" @click="openNew" />
                    <Button label="Delete" icon="pi pi-trash" severity="danger" @click="confirmDeleteSelected"
                        :disabled="!selectedProducts || !selectedProducts.length" />
                </template>

                <template #end>
                <!-- <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import"
                                                                                                                                                                                                                                                                                                                                        class="mr-2 inline-block" /> -->
                    <!-- <Button label="Export" icon="pi pi-upload" severity="help" @click="exportCSV($event)" /> -->
                </template>
            </Toolbar>

            <DataTable ref="dt" :value="products" v-model:selection="selectedProducts" dataKey="id" :paginator="true"
                :rows="10" :filters="filters"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products">
                <template #header>
                    <div class="flex flex-wrap gap-2 align-items-center justify-content-between">
                        <h4 class="m-0">Manage Products</h4>
                        <span class="p-input-icon-left">
                            <i class="pi pi-search" />
                            <InputText v-model="filters['global'].value" placeholder="Search..." />
                        </span>
                    </div>
                </template>

                <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
                <Column field="name" header="Name" sortable style="min-width:16rem"></Column>
                <Column header="Image">
                    <template #body="slotProps">
                        <img :src="`https://primefaces.org/cdn/primevue/images/product/${slotProps.data.url}`"
                            :alt="slotProps.data.url" class="shadow-2 border-round" style="width: 64px" />
                    </template>
                </Column>
                <Column field="price" header="Price" sortable style="min-width:8rem">
                    <template #body="slotProps">
                        Rs.{{ slotProps.data.price }}
                    </template>
                </Column>
                <Column field="category.name" header="Category" sortable style="min-width:8rem">
                <!-- <template #body="slotProps">
                        {{ slotProps.data.category.name }}
                        </template> -->
                </Column>
                <Column :exportable="false" style="min-width:8rem">
                    <template #body="slotProps">
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editProduct(slotProps.data)" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger"
                            @click="confirmDeleteProduct(slotProps.data)" />
                    </template>
                </Column>
            </DataTable>
        </div>

        <Dialog v-model:visible="productDialog" :style="{ width: '450px' }" header="Product Details" :modal="true"
            class="p-fluid">
            <img v-if="product.url" :src="`https://primefaces.org/cdn/primevue/images/product/${product.url}`"
                :alt="product.url" class="block m-auto pb-3" />
            <div class="field">
                <label for="name">Product Name</label>
                <InputText id="name" v-model.trim="product.name" required="true" autofocus
                    :class="{ 'p-invalid': submitted && !product.name }" />
                <small class="p-error" v-if="submitted && !product.name">Name is required.</small>
            </div>
            <div class="field">
                <label for="price">Url</label>
                <InputText id="price" v-model.trim="product.url" required="true" autofocus
                    :class="{ 'p-invalid': submitted && !product.url }" />
                <small class="p-error" v-if="submitted && !product.url">image is required.</small>
            </div>

            <div class="field">
                <label for="inventoryStatus" class="mb-3">Category</label>
                <Dropdown id="inventoryStatus" v-model="product.category" :options="categories" optionLabel="name" autofocus
                    required="true" :class="{ 'p-invalid': submitted && !product.category }" placeholder="Select a Status">
                    <template #value="slotProps">
                        <div v-if="slotProps.value && slotProps.value.name">
                            <Tag :value="slotProps.value.name" :severity="slotProps.value.name" />
                        </div>
                        <div v-else-if="slotProps.value && !slotProps.value.name">
                            <Tag :value="slotProps.value" :severity="slotProps.value" />
                        </div>
                        <span v-else>
                            {{ slotProps.placeholder }}
                        </span>
                    </template>
                </Dropdown>
                <small class="p-error" v-if="submitted && !product.category">Category is required.</small>
            </div>


            <div class="formgrid grid">
                <div class="field col">
                    <label for="price">Price</label>
                    <InputNumber id="price" v-model="product.price" mode="currency" currency="INR" locale="en-IN" autofocus
                        required="true" :class="{ 'p-invalid': submitted && !product.price }" />
                    <small class="p-error" v-if="submitted && !product.price">Price is required.</small>
                </div>
            </div>
            <template #footer>
                <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Save" icon="pi pi-check" text @click="saveProduct" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteProductDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="confirmation-content">
                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                <span v-if="product">Are you sure you want to delete <b>{{ product.name }}</b>?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteProductDialog = false" />
                <Button label="Yes" icon="pi pi-check" text @click="deleteProduct" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteProductsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="confirmation-content">
                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                <span v-if="product">Are you sure you want to delete the selected products?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteProductsDialog = false" />
                <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedProducts" />
            </template>
        </Dialog>
        <Toast />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { FilterMatchMode } from 'primevue/api';
import { useToast } from 'primevue/usetoast';
import axios from 'axios';

onMounted(() => {
    axios.get("product")
        .then((response) => {
            products.value = response.data
        })
        .catch((error) => {
            console.log(error);
        })

    axios.get("category")
        .then((response) => {
            categories.value = response.data
        })


});

const toast = useToast();
const dt = ref();
const products = ref();

const categories = ref([]);

const productDialog = ref(false);
const deleteProductDialog = ref(false);
const deleteProductsDialog = ref(false);
const product = ref({});
const selectedProducts = ref();
const filters = ref({
    'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const submitted = ref(false);

const openNew = () => {
    product.value = {};
    submitted.value = false;
    productDialog.value = true;
};
const hideDialog = () => {
    productDialog.value = false;
    submitted.value = false;
};
const saveProduct = () => {
    submitted.value = true;
    if (product.value.name.trim()) {
        if (product.value.id) {
            axios.patch(`product/${product.value.id}`, {
                "name": product.value.name,
                "price": product.value.price,
                "categoryId": product.value.category.id
            }).then((response) => {
                console.log(response);
            }).catch((error) => {
                console.log(error);
            }).then(() => {

            })
            products.value[findIndexById(product.value.id)] = product.value;
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });

        }
        else {
            console.log('on edit4:', JSON.stringify(product.value));

            axios.post("product", {
                "name": product.value.name,
                "price": product.value.price,
                "url": "product-placeholder.svg", //default
                "categoryId": product.value.category.id
            }).catch((error) => {
                console.log(error);
            }).then((response) => {
                console.log(response.data);
            })
            products.value.push(product.value);
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
        }

        productDialog.value = false;
        product.value = {};
    }
};
const editProduct = (prod) => {
    product.value = { ...prod };
    console.log('on edit:', JSON.stringify(product.value));
    productDialog.value = true;
};
const confirmDeleteProduct = (prod) => {
    product.value = prod;
    deleteProductDialog.value = true;
};
const deleteProduct = () => {
    products.value = products.value.filter(val => val.id !== product.value.id);
    deleteProductDialog.value = false;
    product.value = {};
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
};
const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < products.value.length; i++) {
        if (products.value[i].id === id) {
            index = i;
            break;
        }
    }

    return index;
};

const confirmDeleteSelected = () => {
    deleteProductsDialog.value = true;
};
const deleteSelectedProducts = () => {
    products.value = products.value.filter(val => !selectedProducts.value.includes(val));
    deleteProductsDialog.value = false;
    selectedProducts.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
};

</script>
