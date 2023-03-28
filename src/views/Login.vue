<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router'
import axios from 'axios'
import jwt_decode from "jwt-decode";
import { useVuelidate } from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'
import { useToast } from "primevue/usetoast";


const router = useRouter()
const isRegister = ref(false);
const toast = useToast();



const showError = () => {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Invalid Credentials...!!', life: 3000 });
};

const formData = reactive({
    email: "",
    name: "",
    password: ""
})

const rules = computed(() => {
    return {
        email: { required, email },
        name: { required },
        password: { required }
    }
})

const v$ = useVuelidate(rules, formData)

onMounted(() => {
    const token = localStorage.getItem("token_user")
    if (token) {
        router.go(1)
    }

})

const onToggle = () => {
    // formData.email = "";
    formData.name = "";
    formData.password = "";
    isRegister.value = !isRegister.value
}

async function onSubmit() {
    console.log('is toggle falg :', isRegister.value);
    if (isRegister.value) {
        const result = await v$.value.$validate();
        if (result) {
            try {
                await axios.post("user", {
                    "name": formData.name,
                    "email": formData.email,
                    "password": formData.password,
                    "role": "USER"
                })
                    .then((response) => {
                        console.log('Register response :', response.data);
                        isRegister.value = !isRegister.value
                    })

            } catch (error) {
                console.log('errrrr', error)
            }
        }
    } else if (!isRegister.value) {
        formData.name = "default"
        const result = await v$.value.$validate();
        if (result) {

            try {
                await axios.post("auth/login", {
                    "email": formData.email,
                    "password": formData.password
                }).then((response) => {
                    const accessToken = response.data.access_token

                    axios.defaults.headers.common["Authorization"] =
                        "Bearer " + accessToken;
                    localStorage.setItem("token_user", accessToken);


                    var decoded = jwt_decode(response.data.access_token);
                    console.log('decoded token :' + JSON.stringify(decoded))
                    localStorage.setItem("user_id", decoded.sub)
                })
                    .finally(() => {
                        router.push('/')
                    })

            } catch (error) {
                console.log('errrrr', JSON.stringify(error))
                showError()
            }


        }

    }

}

</script>

<template>
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">
            <!-- <img :src="logoUrl" alt="Sakai logo" class="mb-5 w-6rem flex-shrink-0" /> -->
            <div v-show="!isRegister"
                style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
                    <div class="text-center mb-5">
                        <!-- <img src="/demo/images/login/avatar.png" alt="Image" height="50" class="mb-3" /> -->
                        <div class="text-900 text-3xl font-medium mb-3">Welcome</div>
                        <span class="text-600 font-medium">Sign in to continue</span>
                    </div>

                    <div>
                        <label for="email1" class="block text-900 text-xl font-medium mb-2">Email</label>
                        <InputText id="email1" type="text" placeholder="Email address" class="w-full md:w-30rem"
                            style="padding: 1rem" v-model="formData.email" /><br />
                        <span v-for="error in v$.email.$errors" :key="error.$uid" class="text-red-500">{{ error.$message
                        }}</span>

                        <label for="password1" class="block text-900 font-medium text-xl mt-5 mb-2">Password</label>
                        <Password id="password1" v-model="formData.password" placeholder="Password" :toggleMask="true"
                            class="w-full" inputClass="w-full" inputStyle="padding:1rem"></Password><br />
                        <span v-for="error in v$.password.$errors" :key="error.$uid" class="text-red-500">{{ error.$message
                        }}</span>

                        <Button label="Sign In" class="w-full p-3 text-xl mt-5" @click="onSubmit"></Button>
                        <div class="flex align-items-center justify-content-between mt-5 gap-5">
                            <span></span>
                            <Button link class="font-medium no-underline ml-2  cursor-pointer" @click="onToggle"
                                style="color: var(--primary-color)" label="Register here!" />
                            <span></span>
                        </div>
                    </div>
                </div>
            </div>
            <div v-show="isRegister"
                style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
                    <div class="text-center mb-5">
                        <!-- <img src="/demo/images/login/avatar.png" alt="Image" height="50" class="mb-3" /> -->
                        <div class="text-900 text-3xl font-medium mb-3">Welcome</div>
                        <span class="text-600 font-medium">Register here</span>
                    </div>

                    <div>
                        <label for="name1" class="block text-900 text-xl font-medium mb-2">Name</label>
                        <InputText id="name1" type="text" placeholder="Name" class="w-full md:w-30rem" style="padding: 1rem"
                            v-model="formData.name" /><br />
                        <span v-for="error in v$.name.$errors" :key="error.$uid" class="text-red-500">{{ error.$message
                        }}</span>
                        <label for="email1" class="block text-900 text-xl font-medium mt-5 mb-2">Email</label>
                        <InputText id="email1" type="text" placeholder="Email address" class="w-full md:w-30rem "
                            style="padding: 1rem" v-model="formData.email" /><br />
                        <span v-for="error in v$.email.$errors" :key="error.$uid" class="text-red-500">{{ error.$message
                        }}</span>

                        <label for="password1" class="block text-900 font-medium text-xl mt-5 mb-2">Password</label>
                        <Password id="password1" v-model="formData.password" placeholder="Create a Password" class="w-full "
                            inputClass="w-full" inputStyle="padding:1rem"></Password><br />
                        <span v-for="error in v$.password.$errors" :key="error.$uid" class="text-red-500">{{ error.$message
                        }}</span>

                        <Button label="Register" class="w-full p-3 text-xl mt-5" @click="onSubmit"></Button>
                        <div class="flex align-items-center justify-content-between mt-5 gap-5">
                            <span></span>
                            <Button link class="font-medium no-underline ml-2  cursor-pointer" @click="onToggle"
                                style="color: var(--primary-color)" label="Sign In here!" />
                            <span></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Toast />
    </div>
</template>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
