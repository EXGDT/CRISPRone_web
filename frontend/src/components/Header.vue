<script setup lang="ts">
import { ref } from 'vue'
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import ElementPlus from 'element-plus'
import 'element-plus/theme-chalk/index.css'

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
        case '/cas12a':
            activeIndex.value = '3';
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
                <el-menu-item index="3-1" @click="toPage('/cas12a')">Cas12a/Cpf1</el-menu-item>
                <el-menu-item index="3-2" @click="toPage('/cas12b')">Cas12b/C2c1</el-menu-item>
            </el-sub-menu>
            <el-menu-item index="4" @click="toPage('/cas13')">Cas13</el-menu-item>
            <el-menu-item index="5" @click="toPage('/baseEditor')">Base Editor</el-menu-item>
            <el-menu-item index="6" @click="toPage('/PrimeEditor')">Prime Editor</el-menu-item>
            <el-menu-item index="7" @click="toPage('/CRISPRa')">CRISPRa</el-menu-item>
            <el-menu-item index="8" @click="toPage('/CRISPRKnockIn')">CRISPR Knock-in</el-menu-item>
            <el-menu-item index="9" @click="toPage('/CRISPREpigenome')">CRISPR Epigenome</el-menu-item>
            <el-sub-menu index="2">
                <template #title>Fragment Editor</template>
                <el-menu-item index="9-1" @click="toPage('/FragmentEditorDeletion')">Deletion</el-menu-item>
                <el-menu-item index="9-2" @click="toPage('/FragmentEditorInversion')">Inversion</el-menu-item>
                <el-menu-item index="9-3" @click="toPage('/FragmentEditorTranslocation')">Translocation</el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="10">
                <template #title>Edited Analysis</template>
                <el-menu-item index="10-1" @click="toPage('/BarcodeDesign')">Barcode Design</el-menu-item>
                <el-menu-item index="10-2" @click="toPage('/EditingAnalysis')">Editing Analysis</el-menu-item>
                <el-menu-item index="10-3" @click="toPage('/OffTargetAnalysis')">Off-Target Analysis</el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="11">
                <template #title>Protocol</template>
                <el-menu-item index="11-1" @click="toPage('/ProtocolPlasmidList')">Plasmids List</el-menu-item>
                <el-menu-item index="11-2" @click="toPage('/ProtocolGetPlasmids')">Get Plasmids</el-menu-item>
            </el-sub-menu>
            <el-menu-item index="12" @click="toPage('/ChatCRISPR')">ChatCRISPR</el-menu-item>
            <el-sub-menu index="13">
                <template #title>Help&About</template>
                <el-menu-item index="13-1" @click="toPage('/Help')">Help</el-menu-item>
                <el-menu-item index="13-2" @click="toPage('/Download')">Download</el-menu-item>
                <el-menu-item index="13-3" @click="toPage('/News')">News</el-menu-item>
                <el-menu-item index="13-4" @click="toPage('/Contact')">Contact US</el-menu-item>
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