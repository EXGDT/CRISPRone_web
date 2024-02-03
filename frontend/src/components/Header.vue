<script setup lang="ts">
import { ref } from 'vue'
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const activeIndex = ref('1')
const router = useRouter()
const route = useRoute()

const updateActiveIndex = (path: string) => {
    switch (path) {
        case '/':
            activeIndex.value = '1';
            break;
        case '/cas9':
            activeIndex.value = '2';
            break;
    }
}

const toPage = (path: string) => {
    router.push(path)
}

onMounted(() => {
    updateActiveIndex(route.path);
});
</script>

<template>
    <el-header style="height: 5vh;">
        <el-menu :default-active="activeIndex" mode="horizontal" unique-opened style="height: 100%;">
            <el-menu-item index="1" @click="toPage('/')">Home</el-menu-item>
            <el-menu-item index="2" @click="toPage('/cas9')">Cas9</el-menu-item>
            <el-sub-menu index="3">
                <template #title>Cas12</template>
                <el-menu-item index="3-1">Cas12a/Cpf1</el-menu-item>
                <el-menu-item index="3-2">Cas12b/C2c1</el-menu-item>
            </el-sub-menu>
            <el-menu-item index="4">Cas13</el-menu-item>
            <el-menu-item index="5">Base Editor</el-menu-item>
            <el-menu-item index="6">Prime Editor</el-menu-item>
            <el-menu-item index="7">CRISPRa</el-menu-item>
            <el-menu-item index="8">CRISPR Knock-in</el-menu-item>
            <el-menu-item index="9">CRISPR Epigenome</el-menu-item>
            <el-sub-menu index="2">
                <template #title>Fragment Editor</template>
                <el-menu-item index="9-1">Deletion</el-menu-item>
                <el-menu-item index="9-2">Inversion</el-menu-item>
                <el-menu-item index="9-3">Translocation</el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="10">
                <template #title>Edited Analysis</template>
                <el-menu-item index="10-1">Barcode Design</el-menu-item>
                <el-menu-item index="10-2">Editing Analysis</el-menu-item>
                <el-menu-item index="10-3">Off-Target Analysis</el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="11">
                <template #title>Literature</template>
                <el-menu-item index="11-1">Cas9</el-menu-item>
                <el-menu-item index="11-2">Base Editor</el-menu-item>
                <el-menu-item index="11-3">Prime Edtitors</el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="12">
                <template #title>Protocol</template>
                <el-menu-item index="12-1">Plasmids List</el-menu-item>
                <el-menu-item index="12-2">Get Plasmids</el-menu-item>
            </el-sub-menu>
            <el-menu-item index="13">Literature</el-menu-item>
            <el-menu-item index="14">ChatCRISPR</el-menu-item>
            <el-sub-menu index="15">
                <template #title>Help&About</template>
                <el-menu-item index="15-1">Help</el-menu-item>
                <el-menu-item index="15-2">Download</el-menu-item>
                <el-menu-item index="15-3">News</el-menu-item>
                <el-menu-item index="15-4">Contact US</el-menu-item>
            </el-sub-menu>

        </el-menu>
    </el-header>
</template>

<style>
el-menu-item el-sub-menu {
    padding-left: 10px;
    padding-right: 10px;
}
</style>