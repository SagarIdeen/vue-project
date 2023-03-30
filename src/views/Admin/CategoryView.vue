<template>
    <div>
        <div class="card">
            <Toolbar class="mb-4">
                <template #start>
                    <Button label="New" icon="pi pi-plus" severity="success" class="mr-2" @click="openNew" />
                    <Button label="Delete" icon="pi pi-trash" severity="danger" @click="confirmDeleteSelected"
                        :disabled="!selectedCategories || !selectedCategories.length" />
                </template>

            </Toolbar>

            <DataTable ref="dt" :value="categories" v-model:selection="selectedCategories" dataKey="id" :rows="10"
                :filters="filters">
                <template #header>
                    <div class="flex flex-wrap gap-2 align-items-center justify-content-between">
                        <h4 class="m-0">Category</h4>
                        <span class="p-input-icon-left">
                            <i class="pi pi-search" />
                            <InputText v-model="filters['global'].value" placeholder="Search..." />
                        </span>
                    </div>
                </template>

                <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
                <!-- <Column field="id" header="Id" sortable style="min-width:12rem"></Column> -->
                <Column field="name" header="Category" sortable style="min-width:10rem"></Column>
                <Column :exportable="false" style="min-width:8rem">
                    <template #body="slotProps">
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editCategory(slotProps.data)" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger"
                            @click="confirmDeleteCategory(slotProps.data)" />
                    </template>
                </Column>
            </DataTable>
        </div>

        <Dialog v-model:visible="categoryDialog" :style="{ width: '450px' }" header="category Details" :modal="true"
            class="p-fluid">
            <div class="field">
                <label for="name">Name</label>
                <InputText id="name" v-model.trim="category.name" required="true" autofocus
                    :class="{ 'p-invalid': submitted && !category.name }" />
                <small class="p-error" v-if="submitted && !category.name">Category is required.</small>
            </div>
            <template #footer>
                <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Save" icon="pi pi-check" text @click="saveCategory" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteCategoryDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="confirmation-content">
                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                <span v-if="category">Are you sure you want to delete <b>{{ category.name }}</b>?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteCategoryDialog = false" />
                <Button label="Yes" icon="pi pi-check" text @click="deleteCategory" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteCategoriesDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="confirmation-content">
                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                <span v-if="category">Are you sure you want to delete the selected Category?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteCategoriesDialog = false" />
                <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedCategories" />
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

    getCategories()

});

const getCategories = () => {
    axios.get("category")
        .then((response) => {
            console.log(JSON.stringify(response.data));
            categories.value = response.data
        }).catch((error) => {
            console.log(error);
        })
}

const toast = useToast();
const dt = ref();
const categories = ref();
const categoryDialog = ref(false);
const deleteCategoryDialog = ref(false);
const deleteCategoriesDialog = ref(false);
const category = ref({});
const selectedCategories = ref();
const filters = ref({
    'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const submitted = ref(false);

const openNew = () => {
    category.value = {};
    submitted.value = false;
    categoryDialog.value = true;
};
const hideDialog = () => {
    categoryDialog.value = false;
    submitted.value = false;
};
const saveCategory = () => {
    submitted.value = true;

    if (category.value.name.trim()) {
        if (category.value.id) {
            axios.patch(`category/${category.value.id}`, {
                "name": category.value.name
            }).then((response) => {
                console.log('on edit', JSON.stringify(response.data));
            }).catch((error) => {
                console.log(error);
            }).finally(() => {

                toast.add({ severity: 'success', summary: 'Successful', detail: 'category Updated', life: 3000 });
            })
            categories.value[findIndexById(category.value.id)] = category.value;
        }
        else {
            axios.post("category", {
                "name": category.value.name
            }).then((response) => {
                console.log('on save:', JSON.stringify(response.data));
                categories.value.push(response.data);
                toast.add({ severity: 'success', summary: 'Successful', detail: 'category Created', life: 3000 });
            }).catch((error) => {
                console.log(error);
            })

        }

        categoryDialog.value = false;
        category.value = {};
    }
};
const editCategory = (prod) => {
    category.value = { ...prod };
    categoryDialog.value = true;
};
const confirmDeleteCategory = (prod) => {
    category.value = prod;
    deleteCategoryDialog.value = true;
};
const deleteCategory = () => {
    axios.delete(`category/${category.value.id}`)
        .then((response) => {
            categories.value = categories.value.filter(val => val.id !== category.value.id);
            deleteCategoryDialog.value = false;
            category.value = {};
            toast.add({ severity: 'success', summary: 'Successful', detail: 'category Deleted', life: 3000 });
            console.log('on delete', response.data);
        }).catch((error) => {
            console.log(error);
        })

};
const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < categories.value.length; i++) {
        if (categories.value[i].id === id) {
            index = i;
            break;
        }
    }

    return index;
};
const confirmDeleteSelected = () => {
    deleteCategoriesDialog.value = true;
};
const deleteSelectedCategories = async () => {
    console.log(JSON.stringify(selectedCategories.value));

    Promise.all(
        selectedCategories.value.map(async (i) => {
            console.log(i.id);
            await axios.delete(`category/${i.id}`)
                .catch((error) => {
                    console.log(error);
                })
        })
    )
    categories.value = categories.value.filter(val => !selectedCategories.value.includes(val));
    deleteCategoriesDialog.value = false;
    selectedCategories.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'categories Deleted', life: 3000 });
};


</script>