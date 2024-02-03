<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
const route = useRoute();
const router = useRouter();

import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';

import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Mousewheel } from 'swiper/modules';
const modules = [Pagination, Mousewheel];

import bg2 from '@/assets/header-bg2.svg';
import crispr_img from '@/assets/CRISPR.jpg';
import interpro_img from '@/assets/InterPro.png';
import d3genome_img from '@/assets/3dGenome.jpg';
import genomesv_img from '@/assets/genomeSV.png';


</script>
<template>
  <div class="common-layout">
    <el-container direction="vertical">
      <Header />
      <el-main style="height: 90vh;">
        <swiper :direction="'vertical'" :pagination="{ clickable: true }" :scrollbar="{ hide: true }" :mousewheel="true"
          :modules="modules" class="mySwiper">
          <swiper-slide><el-image :src="bg2" alt="bg2" style="height: 100%" /></swiper-slide>
          <swiper-slide><el-row justify="center">
              <el-col :span="8">
                <el-image :src="crispr_img" alt="crispr_img" />
              </el-col>
              <el-col :span="2"></el-col>
              <el-col :span="8">
                <el-card>
                  <template #header>
                    <div class="card-header">
                      <h4> <strong>Why Use CRISPRall?</strong> </h4>
                    </div>
                  </template>
                  <p>
                    CRISPRone is a comprehensive tool set that can meet any demand related to CRISPR. It includes sgRNA
                    design of different CRISPR variants and the edited analysis of transgenic plants.
                  </p>
                  <p><strong>Doloremque vero ex debitis veritatis?</strong></p>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quod itaque voluptate
                    nesciunt laborum incidunt. Officia, quam consectetur. Earum eligendi aliquam illum
                    alias, unde optio accusantium soluta, iusto molestiae adipisci et?
                  </p>
                </el-card>
              </el-col>
            </el-row>
          </swiper-slide>
          <swiper-slide>
            <el-row justify="center" :gutter="30">
              <el-col :span="6"><el-card><el-image :src="interpro_img" alt="interpro_img" style="height: 30vh;" fit="contain" /><template #header>
                    <div>
                      <h4><strong>Gene conserved domain</strong></h4>
                    </div>
                  </template>
                  <p>
                    The optimal editing regions are marked according to the conservative domain information from Pfam,
                    NCBI and InterPro.
                  </p>
                  <template #footer>
                    <div class="card-footer"><el-button type="primary">More</el-button></div>
                  </template>

                </el-card></el-col>
              <el-col :span="6"><el-card><el-image :src="genomesv_img" alt="genomesv_img" style="height: 30vh;" fit="contain"/><template #header>
                    <div>
                      <h4><strong>Genome Variation Information</strong></h4>
                    </div>
                  </template>
                  <p>
                    Display genomic variation information of a given gene, including SNP, InDel and SV, to help select the
                    best sgRNA.
                  </p>
                  <template #footer>
                    <div class="card-footer"><el-button type="primary">More</el-button></div>
                  </template>
                </el-card></el-col>
              <el-col :span="6"><el-card><el-image :src="d3genome_img" alt="d3genome_img" style="height: 30vh;" fit="contain" /><template #header>
                    <div>
                      <h4><strong>Genome Spatial Structure</strong></h4>
                    </div>
                  </template>
                  <p>
                    Display the chromosome 3D genome information (Compartment, TAD, Loop et.al) of a given gene to help
                    select the best CRISPR knock in site.
                  </p>
                  <template #footer>
                    <div class="card-footer"><el-button type="primary">More</el-button></div>
                  </template>
                </el-card></el-col>
            </el-row>

          </swiper-slide>
        </swiper>
      </el-main>
      <Footer />
    </el-container>
  </div>
</template>

<style scoped>
.mySwiper,
.swiper-slide {
  height: 100%;
}

.swiper-slide {
  display: flex;
  justify-content: center;
  align-items: center;
}

.card-footer {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
