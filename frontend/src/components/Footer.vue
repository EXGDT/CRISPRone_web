<template>
  <el-footer
    style="
      height: 5vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #c7c7c7;
    "
  >
    <div>
      <el-row style="height: 2.5vh">
        <el-col :span="5" style="font-size: 1vw">
          <i class="fas fa-angle-double-right"></i> CITE US: , DOI:
          <a class="text-dark" href="http://croplab.hzau.edu.cn/" target="_blank">10.11</a>
        </el-col>
        <el-col :span="7" :offset="9" style="font-size: 1vw"
          >
          Follow CRISPRone on social media</el-col
        >
        <el-col :span="1" style="height: 2.5vh">
          <a
            href="http://jinlab.hzau.edu.cn/PsctH/images/PBJ.jpg"
            role="button"
            rel="nofollow"
            target="_blank"
            style="font-size: 2.5vh"
          >
            <i class="fab fa-weixin"></i>
          </a>
        </el-col>
        <el-col :span="1" style="height: 2.5vh">
          <a
            href="https://twitter.com/hopetogy"
            role="button"
            rel="nofollow"
            target="_blank"
            style="font-size: 2.5vh"
          >
            <i class="fab fa-twitter"></i>
          </a>
        </el-col>
        <el-col :span="1" style="height: 2.5vh">
          <a
            href="https://github.com/tiramisutes"
            role="button"
            rel="nofollow"
            target="_blank"
            style="font-size: 2.5vh"
          >
            <i class="fab fa-github"></i>
          </a>
        </el-col>
      </el-row>
      <el-row height="2.5vh">
        <el-col style="font-size: 1vw">
          &copy; 2022 Copyright: Huazhong Agricultural University &amp; National Key Laboratory of
          Crop Genetic Improvement &amp; Group of Cotton Genetic Improvement
        </el-col>
      </el-row>
    </div>
  </el-footer>
</template>

<style></style>
