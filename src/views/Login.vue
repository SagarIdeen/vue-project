<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const email = ref('');
const password = ref('');

const name = ref('')
const isRegister = ref(false);

onMounted(()=>{
    const token = localStorage.getItem("token_user")
    if(token){
        router.go(1)
    }

})

const onToggle = ()=>{
    isRegister.value = !isRegister.value
}

async function onSubmit(){
    console.log('is toggle falg :',isRegister.value);
if (isRegister.value) {
    try {
        const response = await axios.post("user",{
            "name": name.value,
            "email": email.value,
            "password": password.value,
            "role": "USER"
        })
        console.log('create user data',response.data);
        
        name.value = ''
        // email.value = ''
        password.value = ''
        
        isRegister.value = !isRegister.value

    } catch (error) {
        console.log('errrrr',error)
    }
}else if(!isRegister.value){

    try {
        const response = await axios.post("auth/login",{
            "email": email.value,
            "password": password.value
        })
        console.log('response data',response.data);

        const accessToken  = response.data.access_token

        axios.defaults.headers.common["Authorization"] =
          "Bearer " + accessToken;
        await localStorage.setItem("token_user", accessToken);

        router.push('/')
    } catch (error) {
        console.log('errrrr',error)
    }
}
    
}

</script>

<template>
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">
            <!-- <img :src="logoUrl" alt="Sakai logo" class="mb-5 w-6rem flex-shrink-0" /> -->
            <div v-show="!isRegister" style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
                    <div class="text-center mb-5">
                        <!-- <img src="/demo/images/login/avatar.png" alt="Image" height="50" class="mb-3" /> -->
                        <div class="text-900 text-3xl font-medium mb-3">Welcome</div>
                        <span class="text-600 font-medium">Sign in to continue</span>
                    </div>

                    <div>
                        <label for="email1" class="block text-900 text-xl font-medium mb-2">Email</label>
                        <InputText id="email1" type="text" placeholder="Email address" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="email" />

                        <label for="password1" class="block text-900 font-medium text-xl mb-2">Password</label>
                        <Password id="password1" v-model="password" placeholder="Password" :toggleMask="true" class="w-full mb-5" inputClass="w-full" inputStyle="padding:1rem"></Password>
                        
                        <Button label="Sign In" class="w-full p-3 text-xl" @click="onSubmit"></Button>
                        <div class="flex align-items-center justify-content-between mt-5 gap-5">
                            <span></span>
                            <Button link class="font-medium no-underline ml-2  cursor-pointer" @click="onToggle" style="color: var(--primary-color)" label="Register here!"/>
                            <span></span>   
                        </div>
                    </div>
                </div>
            </div>
            <div v-show="isRegister" style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
                    <div class="text-center mb-5">
                        <!-- <img src="/demo/images/login/avatar.png" alt="Image" height="50" class="mb-3" /> -->
                        <div class="text-900 text-3xl font-medium mb-3">Welcome</div>
                        <span class="text-600 font-medium">Register here</span>
                    </div>

                    <div>
                        <label for="name1" class="block text-900 text-xl font-medium mb-2">Name</label>
                        <InputText id="name1" type="text" placeholder="Name address" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="name" />
                       
                        <label for="email1" class="block text-900 text-xl font-medium mb-2">Email</label>
                        <InputText id="email1" type="text" placeholder="Email address" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="email" />
        
                        <label for="password1" class="block text-900 font-medium text-xl mb-2">Password</label>
                        <Password id="password1" v-model="password" placeholder="Create a Password"  class="w-full mb-5" inputClass="w-full" inputStyle="padding:1rem"></Password>
                        
                        <Button label="Register" class="w-full p-3 text-xl" @click="onSubmit"></Button>
                        <div class="flex align-items-center justify-content-between mt-5 gap-5">
                            <span></span>
                            <Button link class="font-medium no-underline ml-2  cursor-pointer" @click="onToggle" style="color: var(--primary-color)" label="Sign In here!"/>
                            <span></span>   
                        </div>
                    </div>
                </div>
            </div>
        </div>
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
