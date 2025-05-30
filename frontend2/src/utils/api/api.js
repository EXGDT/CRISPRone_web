import http from "@/utils/request";
import axios from "axios";

export const PostTokenCas9 = async (tempFormData) => {
  console.log("tempFormData", tempFormData);
  try {
    const payload = {
      inputSequence: String(tempFormData.input_sequences || "").trim(),
      pam: String(tempFormData.pam_type || "").trim(),
      spacerLength: Number(tempFormData.spacer_length) || 20,
      sgRNAModule: tempFormData.sgRNA_module || "spacerpam",
      name_db: String(tempFormData.target_genome || "").trim(),
    };
    if (!payload.inputSequence || !payload.name_db || !payload.pam) {
      throw new Error("缺少必填参数");
    }
    const response = await axios.post(
      "http://211.69.141.134:8866/cas9_API/",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return {
      token: response.data,
    };
  } catch (error) {
    console.error("API请求失败:", error);
    return {
      token: "default_fallback_token",
    };
  }
};

// export const PostTokenCas9 = async (tempFormData) => {
//     // 获取 token
//     const response = await new Promise((resolve) => {
//         setTimeout(() => {
//             let token;
//             switch (tempFormData.target_genome) {
//                 case 'Beta_vulgaris':
//                     token = '001';
//                     break;
//                 case 'Camelina_sativa':
//                     token = '002';
//                     break;
//                 case 'Phaseolus_vulgaris':
//                     token = '003';
//                     break;
//                 case 'Gossypium_hirsutum_Jin668_HZAU':
//                     token = '004';
//                     break;
//                 case 'Brassica_napus':
//                     token = '005';
//                     break;
//                 default:
//                     token = '006';
//             }
//             resolve({ token });
//         }, 1000);
//     });

//     let data = {
//         token: response.token
//     }
//     return data;
// }

// 新增的获取配置的 API 方法
// export const getConfigCas9 = (token) => {
//       // 获取结果数据并初始化 JBrowse
//       let resultFile;
//       switch (token) {
//           case '001':
//               resultFile = 'Beta_vulgaris_TCAGTGTTTGCCATGAGGCAAAGGTTTGCTGTTTCTTCAGTTGGTTGTTCCT_Guide.json';
//               break;
//           case '002':
//               resultFile = 'Camelina_sativa_gene.json';
//               break;
//           case '003':
//               resultFile = 'Phaseolus_vulgaris_gene.json';
//               break;
//           case '004':
//               resultFile = 'cas9_result_cas9_list.json';
//               break;
//           case '005':
//               resultFile = 'Bruassica_napus_LK033659_27681_27736_Guide.json';
//               break;
//           default:
//               resultFile = 'cas9.json';
//       }

//     // 假设请求头中携带 token
//     return http.get(`/demo/${resultFile}`);
// }


export const getConfigCas9 = (token) => {
  return new Promise((resolve, reject) => {
    const checkStatus = async () => {
      try {
        const response = await axios.get(
          "http://211.69.141.134:8866/cas9_module_API/",
          {
            params: { task_id: token },
          }
        );

        if (response.data.task_status === "finished") {
          resolve({ data: response.data.sgRNAJson });
        } 
        else if (response.data.task_status === "failed") {
          console.log("taskid", response.data.task_id);
          console.log("任务失败:", response.data.log);
          reject(new Error("TASK_FAILED:" + (response.data?.log || "未知原因")));
        }
        else {
          setTimeout(checkStatus, 2000);
        }
      } catch (error) {
        console.error("配置获取失败:", error);
        setTimeout(checkStatus, 2000);
      }
    };
    checkStatus();
  });
};

export const PostTokenCas13 = async (tempFormData) => {
  // 获取 token
  const response = await new Promise((resolve) => {
    setTimeout(() => {
      let token;
      if (tempFormData) {
        token = "001";
      }
      resolve({ token });
    }, 1000);
  });

  let data = {
    token: response.token,
  };
  return data; // 假设后端接口为 /api2/getCas9Token
};

export const getConfigCas13 = (token) => {
  console.log("token", token);

  if (token == "001") {
    console.log("2");
    return http.get(`/demo/cas13.json`);
  }
};

export const PostTokenBE = async (tempFormData) => {
  // 获取 token
  const response = await new Promise((resolve) => {
    setTimeout(() => {
      let token;
      if (tempFormData) {
        token = "001";
      }
      resolve({ token });
    }, 1000);
  });

  let data = {
    token: response.token,
  };
  return data;
};

export const getConfigBE = (token) => {
  if (token == "001") {
    return http.get(`/demo/BE.json`);
  }
};
export const PostTokenPE = async (tempFormData) => {
  // 获取 token
  const response = await new Promise((resolve) => {
    setTimeout(() => {
      let token;
      if (tempFormData) {
        token = "001";
      }
      resolve({ token });
    }, 1000);
  });

  let data = {
    token: response.token,
  };
  return data;
};
export const getConfigPE = (token) => {
  if (token == "001") {
    return http.get(`/demo/PE.json`);
  }
};
