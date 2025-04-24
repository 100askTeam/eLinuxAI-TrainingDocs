---
sidebar_position: 10
---

# K230 AI Demo介绍

## K230 AI Demo

### 1.概述

K230 AI Demo集成了人脸、人体、手部、车牌、单词续写、语音、dms等模块，包含了分类、检测、分割、识别、跟踪、单目测距等多种功能，给客户提供如何使用K230开发AI相关应用的参考。

### 2.硬件环境

- `CanMV-K230-V1.x / CanMV-K230-V2.x / K230-UNSIP-LPx-EVB-V1.x / DshanPi-CanMV`

### 3.源码位置

源码路径位于`k230_sdk/src/reference/ai_poc`，目录结构如下：

```
# AI Demo子目录（eg：bytetrack、face_detection等）中有详细的Demo说明文档
.
├── anomaly_det
├── build_app.sh
├── bytetrack
├── cmake
├── CMakeLists.txt
├── crosswalk_detect
├── dec_ai_enc
├── demo_mix
├── distraction_reminder
├── dms_system
├── dynamic_gesture
├── eye_gaze
├── face_alignment
├── face_detection
├── face_emotion
├── face_gender
├── face_glasses
├── face_landmark
├── face_mask
├── face_mesh
├── face_parse
├── face_pose
├── face_verification
├── falldown_detect
├── finger_guessing
├── fitness
├── head_detection
├── helmet_detect
├── kws
├── licence_det
├── licence_det_rec
├── llamac
├── nanotracker
├── object_detect_yolov8n
├── ocr
├── person_attr
├── person_detect
├── person_distance
├── pose_detect
├── pose_det_rtsp_plug
├── pphumanseg
├── puzzle_game
├── segment_yolov8n
├── self_learning
├── shell
├── smoke_detect
├── space_resize
├── sq_hand_det
├── sq_handkp_class
├── sq_handkp_det
├── sq_handkp_flower
├── sq_handkp_ocr
├── sq_handreco
├── traffic_light_detect
├── translate_en_ch
├── tts_zh
├── vehicle_attr
├── virtual_keyboard
└── yolop_lane_seg
```

kmodel、image及相关依赖路径位于`k230_sdk/src/big/kmodel/ai_poc`，目录结构如下：

```
.
├── images
│   ├── 000.png
│   ├── 1000.jpg
│   ├── 1024x1111.jpg
│   ├── 1024x1331.jpg
│   ├── 1024x624.jpg
│   ├── 1024x768.jpg
│   ├── 333.jpg
│   ├── 640x340.jpg
│   ├── bus.jpg
│   ├── bytetrack_data
│   ├── car.jpg
│   ├── cw.jpg
│   ├── falldown_elder.jpg
│   ├── helmet.jpg
│   ├── hrnet_demo.jpg
│   ├── identification_card.png
│   ├── input_flower.jpg
│   ├── input_hd.jpg
│   ├── input_ocr.jpg
│   ├── input_pd.jpg
│   ├── licence.jpg
│   ├── person.png
│   ├── road.jpg
│   ├── smoke1.jpg
│   └── traffic.jpg
├── kmodel
│   ├── anomaly_det.kmodel
│   ├── bytetrack_yolov5n.kmodel
│   ├── cropped_test127.kmodel
│   ├── crosswalk.kmodel
│   ├── eye_gaze.kmodel
│   ├── face_alignment.kmodel
│   ├── face_alignment_post.kmodel
│   ├── face_detection_320.kmodel
│   ├── face_detection_640.kmodel
│   ├── face_detection_hwc.kmodel
│   ├── face_emotion.kmodel
│   ├── face_gender.kmodel
│   ├── face_glasses.kmodel
│   ├── face_landmark.kmodel
│   ├── face_mask.kmodel
│   ├── face_parse.kmodel
│   ├── face_pose.kmodel
│   ├── face_recognition.kmodel
│   ├── flower_rec.kmodel
│   ├── gesture.kmodel
│   ├── hand_det.kmodel
│   ├── handkp_det.kmodel
│   ├── hand_reco.kmodel
│   ├── head_detection.kmodel
│   ├── helmet.kmodel
│   ├── hifigan.kmodel
│   ├── human_seg_2023mar.kmodel
│   ├── kws.kmodel
│   ├── licence_reco.kmodel
│   ├── LPD_640.kmodel
│   ├── nanotrack_backbone_sim.kmodel
│   ├── nanotracker_head_calib_k230.kmodel
│   ├── ocr_det_int16.kmodel
│   ├── ocr_det.kmodel
│   ├── ocr_rec_int16.kmodel
│   ├── ocr_rec.kmodel
│   ├── person_attr_yolov5n.kmodel
│   ├── person_detect_yolov5n.kmodel
│   ├── person_pulc.kmodel
│   ├── recognition.kmodel
│   ├── traffic.kmodel
│   ├── translate_decoder.kmodel
│   ├── translate_encoder.kmodel
│   ├── vehicle_attr_yolov5n.kmodel
│   ├── vehicle.kmodel
│   ├── yolop.kmodel
│   ├── yolov5n-falldown.kmodel
│   ├── yolov5s_smoke_best.kmodel
│   ├── yolov8n_320.kmodel
│   ├── yolov8n_640.kmodel
│   ├── yolov8n-pose.kmodel
│   ├── yolov8n_seg_320.kmodel
│   ├── yolov8n_seg_640.kmodel
│   ├── zh_fastspeech_1_f32.kmodel
│   ├── zh_fastspeech_1.kmodel
│   └── zh_fastspeech_2.kmodel
└── utils
    ├── Asci0816.zf
    ├── bfm_tri.bin
    ├── bu.bin
    ├── dict_6625.txt
    ├── dict_ocr_16.txt
    ├── dict_ocr.txt
    ├── file
    ├── HZKf2424.hz
    ├── jiandao.bin
    ├── libsentencepiece.a
    ├── llama.bin
    ├── memory.bin
    ├── ncc_code.bin
    ├── pintu.bin
    ├── reply_wav
    ├── shang.bin
    ├── shitou.bin
    ├── tokenizer.bin
    ├── trans_src.model
    ├── trans_tag.model
    ├── wav_play.elf
    ├── xia.bin
    ├── you.bin
    └── zuo.bin
```

### 4.编译及运行程序

（1）确保已根据《K230 SDK环境搭建指南》搭建好Ubuntu20.04环境

（2）获取最新的SDK:`git clone https://e.coding.net/weidongshan/dshanpi-canmv/k230_sdk.git`

（3）环境准备

```
cd k230_sdk
make prepare_sourcecode #（若之前已执行，请忽略）
sudo mount --bind $(pwd)/toolchain /opt/toolchain
make mpp
make cdk-user
#根据使用的开发板型号，分别执行不同的命令
#若是型号是DshanPI-CanMV，执行以下命令
make CONF=k230_canmv_dongshanpi_defconfig prepare_memory
cd src/reference/ai_poc
```

（4）编译单个AI Demo（以人脸检测为例）

```
./build_app.sh face_detection
```

**注**：执行build_app.sh前，确保已经准备好依赖，即`k230_sdk/src/big/kmodel/ai_poc`下已经有相应kmodel、images、utils

```
#若是没有上述依赖，执行一下命令下载
cd k230_sdk
make prepare_sourcecode
```

生成以下文件：

```
k230_bin/
├── face_detection
│   ├── 1024x624.jpg
│   ├── face_detect_image.sh
│   ├── face_detection_320.kmodel
│   ├── face_detection_640.kmodel
│   ├── face_detection.elf
│   └── face_detect_isp.sh
```

将k230_bin整个文件夹拷贝到板子，在大核上执行sh脚本即可运行相应AI demo

```
#进入开发板小核sharefs目录
scp -r username@ip:/xxx/k230_sdk/src/big/kmodel/ai_poc/k230_bin .

#进入开发板大核sharefs目录
cd /sharefs/k230_bin/face_detection
#执行相应脚本即可运行人脸检测
#详细人脸检测说明可以参考k230_sdk/src/reference/ai_poc/face_detection/README.md
./face_detect_isp.sh
```

> 更多传输方法请参考《开发板文件传输》

（5）编译所有AI Demo（若只需编译某个demo，无需执行该步骤）

```
./build_app.sh
```

生成以下文件：

```
k230_bin/
......
├── face_detection
│   ├── 1024x624.jpg
│   ├── face_detect_image.sh
│   ├── face_detection_320.kmodel
│   ├── face_detection_640.kmodel
│   ├── face_detection.elf
│   └── face_detect_isp.sh
......
└── llamac
    ├── llama.bin
    ├── llama_build.sh
    ├── llama_run
    └── tokenizer.bin
......
```

将k230_bin整个文件夹拷贝到板子，在大核上执行sh脚本即可运行相应AI demo

```
#进入小核sharefs目录
scp -r username@ip:/xxx/k230_sdk/src/big/kmodel/ai_poc/k230_bin .

#进入大核sharefs目录
cd /sharefs/k230_bin/face_detection
#执行相应脚本即可运行人脸检测
#详细人脸检测说明可以参考k230_sdk/src/reference/ai_poc/face_detection/README.md
./face_detect_isp.sh
```
