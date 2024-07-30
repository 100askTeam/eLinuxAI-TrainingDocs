---
sidebar_position: 5
---
# 5. 快速入门k230 AI推理流程

> 本章教学视频：[勘智K230开发板使用教程-快速入门AI推理流程_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1tD421777Y/?spm_id_from=333.999.0.0)

本章介绍了K230 AI推理的完整流程，让大家对基于K230的AI推理过程有个大概印象，它包括视频采集，图像预处理，模型推理、后处理、显示等过程。

- 视频输入：VI（Video Input），视频采集
- 视频输出：VO（Video Output），显示

本章包含了K230 AI推理流程的两种实现：基于OpenCV(c++)的AI推理、基于ulab(MicroPython)的AI推理，分别对应两个子章节，具体实现详子章节介绍。

**详细代码实现**：[k230_AI_Demo_Code_Flow_Introduction](https://github.com/JayL323/k230_AI_Demo_Code_Flow_Introduction)

## 5.1 基于OpenCV(C++)的AI推理流程

基于OpenCV(C++)的K230 AI推理，简要介绍了使用c++语言实现的视频采集，图像预处理（OpenCV），模型推理、后处理、显示等过程。

### 5.1.1 视频采集

**视频采集**：（视频输入，VI）与摄像头相关，本小节简要介绍基于c++的摄像头设置、摄像头启动、从摄像头中获取一帧数据、摄像头停止的整体流程；详细介绍见[K230_VICAP_API参考.md](https://github.com/kendryte/k230_docs/blob/main/zh/01_software/board/mpp/K230_VICAP_API参考.md)、[K230_VICAP_SENSOR_参数分区参考.md](https://github.com/kendryte/k230_docs/blob/main/zh/01_software/board/mpp/K230_VICAP_SENSOR_参数分区参考.md)、[K230_Camera_Sensor适配指南.md](https://github.com/kendryte/k230_docs/blob/main/zh/01_software/board/mpp/K230_Camera_Sensor适配指南.md)。

**1. 设置摄像头属性**：

- 设置的sensor两路输出；
- 一路输出用于显示，输出大小设置1080p，图像格式为PIXEL_FORMAT_YVU_PLANAR_420，直接绑定到vo；
- 另一路输出用于AI计算，输出大小720p，图像格式为PIXEL_FORMAT_BGR_888_PLANAR（实际为rgb,chw,uint8）；

**创建摄像头（sensor）输出缓存（VB）**：用于存放摄像头两路输出

```
//vi_vo.h
/***************************unfixed：不同AI Demo可能需要修改***********************/
#define SENSOR_CHANNEL (3)     // 通道数
#define SENSOR_HEIGHT (720)    // sensor ch1输出高度，AI输入
#define SENSOR_WIDTH (1280)    // sensor ch1输出宽度，AI输入
#define ISP_CHN0_WIDTH  (1920) // sensor ch0输出宽度，vo
#define ISP_CHN0_HEIGHT (1080) // sensor ch0输出高度，vo
/*****************************************************************************/

/***************************fixed：无需修改***********************************/
memset(&config, 0, sizeof(config));
config.max_pool_cnt = 64;
//VB for YUV420SP output
config.comm_pool[0].blk_cnt = 5;
config.comm_pool[0].mode = VB_REMAP_MODE_NOCACHE;
config.comm_pool[0].blk_size = VICAP_ALIGN_UP((ISP_CHN0_WIDTH * ISP_CHN0_HEIGHT * 3 / 2), VICAP_ALIGN_1K);

//VB for RGB888 output
config.comm_pool[1].blk_cnt = 5;
config.comm_pool[1].mode = VB_REMAP_MODE_NOCACHE;
config.comm_pool[1].blk_size = VICAP_ALIGN_UP((SENSOR_HEIGHT * SENSOR_WIDTH * 3 ), VICAP_ALIGN_1K);

ret = kd_mpi_vb_set_config(&config);
if (ret) {
    printf("vb_set_config failed ret:%d\n", ret);
    return ret;
}
/*****************************************************************************/
```



**设置摄像头属性**：设置sensor_type；一般无需换摄像头，无需修改。

```
//vi_vo.h
/***************************fixed：无需修改***********************************/
vicap_dev = VICAP_DEV_ID_0;
ret = kd_mpi_vicap_get_sensor_info(sensor_type, &sensor_info);
if (ret) {
    printf("sample_vicap, the sensor type not supported!\n");
    return ret;
}

......

dev_attr.cpature_frame = 0;
memcpy(&dev_attr.sensor_info, &sensor_info, sizeof(k_vicap_sensor_info));

ret = kd_mpi_vicap_set_dev_attr(vicap_dev, dev_attr);
if (ret) {
    printf("sample_vicap, kd_mpi_vicap_set_dev_attr failed.\n");
    return ret;
}
/*****************************************************************************/
```



**设置摄像头通道0属性**：设置摄像头通道0分辨率为1080p，格式为PIXEL_FORMAT_YVU_PLANAR_420；并将摄像头通道0绑定到显示；一般只需要关注`chn_attr.out_win.width`、`chn_attr.out_win.height`、`chn_attr.pix_format`即可，其它不用修改。

```
//vi_vo.h
/***************************unfixed：不同AI Demo可能需要修改***********************/
#define ISP_CHN0_WIDTH  (1920) // sensor ch0输出宽度，vo
#define ISP_CHN0_HEIGHT (1080) // sensor ch0输出高度，vo
/*****************************************************************************/

/***************************unfixed：不同AI Demo可能需要修改******************/
//set chn0 output yuv420sp
......
chn_attr.out_win.width = ISP_CHN0_WIDTH;
chn_attr.out_win.height = ISP_CHN0_HEIGHT;
......
chn_attr.chn_enable = K_TRUE;
chn_attr.pix_format = PIXEL_FORMAT_YVU_PLANAR_420;
/*****************************************************************************/ 
......
/***************************fixed：无需修改***********************************/
chn_attr.buffer_num = VICAP_MAX_FRAME_COUNT;        //at least 3 buffers for isp
chn_attr.buffer_size = config.comm_pool[0].blk_size;
vicap_chn = VICAP_CHN_ID_0;

printf("sample_vicap ...kd_mpi_vicap_set_chn_attr, buffer_size[%d]\n", chn_attr.buffer_size);
ret = kd_mpi_vicap_set_chn_attr(vicap_dev, vicap_chn, chn_attr);
if (ret) {
    printf("sample_vicap, kd_mpi_vicap_set_chn_attr failed.\n");
    return ret;
}

//bind vicap chn 0 to vo
vicap_mpp_chn.mod_id = K_ID_VI;
vicap_mpp_chn.dev_id = vicap_dev;
vicap_mpp_chn.chn_id = vicap_chn;

vo_mpp_chn.mod_id = K_ID_VO;
vo_mpp_chn.dev_id = K_VO_DISPLAY_DEV_ID;
vo_mpp_chn.chn_id = K_VO_DISPLAY_CHN_ID1;

sample_vicap_bind_vo(vicap_mpp_chn, vo_mpp_chn);
printf("sample_vicap ...dwc_dsi_init\n");
/*****************************************************************************/
```



**设置摄像头通道1属性：**设置通道1分辨率为720p，格式为PIXEL_FORMAT_BGR_888_PLANAR。

```
//vi_vo.h
/***************************unfixed：不同AI Demo可能需要修改***********************/
#define SENSOR_CHANNEL (3)     // 通道数
#define SENSOR_HEIGHT (720)    // sensor ch1输出高度，AI输入
#define SENSOR_WIDTH (1280)    // sensor ch1输出宽度，AI输入
/*****************************************************************************/
......
/***************************unfixed：不同AI Demo可能需要修改******************/
//set chn1 output rgb888p
....
chn_attr.out_win.width = SENSOR_WIDTH ;
chn_attr.out_win.height = SENSOR_HEIGHT;

......
chn_attr.chn_enable = K_TRUE;
chn_attr.pix_format = PIXEL_FORMAT_BGR_888_PLANAR;
/*****************************************************************************/ 

/***************************fixed：无需修改***********************************/
chn_attr.buffer_num = VICAP_MAX_FRAME_COUNT;//at least 3 buffers for isp
chn_attr.buffer_size = config.comm_pool[1].blk_size;

printf("sample_vicap ...kd_mpi_vicap_set_chn_attr, buffer_size[%d]\n", chn_attr.buffer_size);
ret = kd_mpi_vicap_set_chn_attr(vicap_dev, VICAP_CHN_ID_1, chn_attr);
if (ret) {
    printf("sample_vicap, kd_mpi_vicap_set_chn_attr failed.\n");
    return ret;
}
/*****************************************************************************/
```



**设置初始化、并启动摄像头：**

```
//vi_vo.h
/***************************fixed：无需修改***********************************/
ret = kd_mpi_vicap_init(vicap_dev);
if (ret) {
    printf("sample_vicap, kd_mpi_vicap_init failed.\n");
    // goto err_exit;
}

printf("sample_vicap ...kd_mpi_vicap_start_stream\n");
ret = kd_mpi_vicap_start_stream(vicap_dev);
if (ret) {
    printf("sample_vicap, kd_mpi_vicap_init failed.\n");
    // goto err_exit;
}
/*****************************************************************************/
```



**使用示例**：

```
//main.cc
vivcap_start();
```



**2. 获取摄像头图像**：

**摄像头数据临时地址**：创建vaddr，临时存放摄像头最新数据，它与摄像头通道1大小相同。

```
// main.cc
/***************************fixed：无需修改***********************************/
// alloc memory for sensor
size_t paddr = 0;
void *vaddr = nullptr;
size_t size = SENSOR_CHANNEL * SENSOR_HEIGHT * SENSOR_WIDTH;
int ret = kd_mpi_sys_mmz_alloc_cached(&paddr, &vaddr, "allocate", "anonymous", size);
if (ret)
{
    std::cerr << "physical_memory_block::allocate failed: ret = " << ret << ", errno = " << strerror(errno) << std::endl;
    std::abort();
}
/*****************************************************************************/
```



**读取最新帧**：

- **dump**：从摄像头通道1读取一帧图像,即从VB中dump一帧数据到dump_info
- **映射**：将dump_info对应DDR地址（物理地址）映射到当前系统地址（虚拟地址）进行访问
- **转cv::Mat**：将摄像头数据转换为cv::Mat，sensor（rgb,chw）->cv::Mat（bgr，hwc）；将摄像头数据转换为为cv::Mat不是必须的，这里只是为了以大家比较熟悉的方式（cv::Mat）进行讲解。

```
//vi_vo.h
/***************************fixed：无需修改***********************************/
//VB for RGB888 output
config.comm_pool[1].blk_cnt = 5;
config.comm_pool[1].mode = VB_REMAP_MODE_NOCACHE;
config.comm_pool[1].blk_size = VICAP_ALIGN_UP((SENSOR_HEIGHT * SENSOR_WIDTH * 3 ), VICAP_ALIGN_1K);
/*****************************************************************************/

//main.cc
while (!isp_stop)
{
    cv::Mat ori_img;
    //sensor to cv::Mat
    {
        /***************************fixed：无需修改***********************************/
        //从摄像头通道1读取一帧图像,即从VB中dump一帧数据到dump_info
        memset(&dump_info, 0 , sizeof(k_video_frame_info));
        ret = kd_mpi_vicap_dump_frame(vicap_dev, VICAP_CHN_ID_1, VICAP_DUMP_YUV, &dump_info, 1000);
        if (ret) {
            printf("sample_vicap...kd_mpi_vicap_dump_frame failed.\n");
            continue;
        }

        //将dump_info对应DDR地址（物理地址）映射到当前系统（虚拟地址）进行访问
        //vbvaddr是实时改变的，因此我们最好把最新数据拷贝到【固定地址】vaddr，以便其它部分进行访问
        auto vbvaddr = kd_mpi_sys_mmap_cached(dump_info.v_frame.phys_addr[0], size);
        memcpy(vaddr, (void *)vbvaddr, SENSOR_HEIGHT * SENSOR_WIDTH * 3); 
        kd_mpi_sys_munmap(vbvaddr, size);
        /*****************************************************************************/
        
        //将摄像头数据转换为为cv::Mat,sensor（rgb,chw）->cv::Mat（bgr，hwc）
        cv::Mat image_r = cv::Mat(SENSOR_HEIGHT,SENSOR_WIDTH, CV_8UC1, vaddr);
        cv::Mat image_g = cv::Mat(SENSOR_HEIGHT,SENSOR_WIDTH, CV_8UC1, vaddr+SENSOR_HEIGHT*SENSOR_WIDTH);
        cv::Mat image_b = cv::Mat(SENSOR_HEIGHT,SENSOR_WIDTH, CV_8UC1, vaddr+2*SENSOR_HEIGHT*SENSOR_WIDTH);
        std::vector<cv::Mat> color_vec(3);
        color_vec.clear();
        color_vec.push_back(image_b);
        color_vec.push_back(image_g);
        color_vec.push_back(image_r);
        cv::merge(color_vec, ori_img);
    }
    //使用当前帧数据
    ......
    ......
    {
        /***************************fixed：无需修改***********************************/
        // 释放sensor当前帧
        ret = kd_mpi_vicap_dump_release(vicap_dev, VICAP_CHN_ID_1, &dump_info);
        if (ret) {
            printf("sample_vicap...kd_mpi_vicap_dump_release failed.\n");
        }
        /*****************************************************************************/
    }
}
```



**3. 停止摄像头**：

```
//vi_vo.h
/***************************fixed：无需修改***********************************/
int vivcap_stop()
{
    // 摄像头停止
    printf("sample_vicap ...kd_mpi_vicap_stop_stream\n");
    int ret = kd_mpi_vicap_stop_stream(vicap_dev);
    if (ret) {
        printf("sample_vicap, kd_mpi_vicap_init failed.\n");
        return ret;
    }

    // 摄像头资源释放
    ret = kd_mpi_vicap_deinit(vicap_dev);
    if (ret) {
        printf("sample_vicap, kd_mpi_vicap_deinit failed.\n");
        return ret;
    }

    kd_mpi_vo_disable_video_layer(K_VO_LAYER1);

    vicap_mpp_chn.mod_id = K_ID_VI;
    vicap_mpp_chn.dev_id = vicap_dev;
    vicap_mpp_chn.chn_id = vicap_chn;

    vo_mpp_chn.mod_id = K_ID_VO;
    vo_mpp_chn.dev_id = K_VO_DISPLAY_DEV_ID;
    vo_mpp_chn.chn_id = K_VO_DISPLAY_CHN_ID1;

    // vi vo解绑
    sample_vicap_unbind_vo(vicap_mpp_chn, vo_mpp_chn);

    /*Allow one frame time for the VO to release the VB block*/
    k_u32 display_ms = 1000 / 33;
    usleep(1000 * display_ms);

    // 退出vb
    ret = kd_mpi_vb_exit();
    if (ret) {
        printf("sample_vicap, kd_mpi_vb_exit failed.\n");
        return ret;
    }

    return 0;
}
/*****************************************************************************/
```



只需在main.cc中调用：

```
//main.cc
vivcap_start();
......
vivcap_stop();
```



### 5.1.2 预处理

对当前帧数据进行resize处理。

```
//main.cc
while (!isp_stop)
{
    cv::Mat ori_img;        //ori：uint8,chw,rgb
    //sensor to cv::Mat
    {
        ......
    }
    /***************************unfixed：不同AI Demo可能需要修改******************/
    // pre_process，cv::Mat((1280,720),bgr,hwc)->kmodel((224,224),rgb,hwc)
    cv::Mat pre_process_img;
    {
        cv::Mat rgb_img;
        cv::cvtColor(ori_img, rgb_img, cv::COLOR_BGR2RGB);
        cv::resize(rgb_img, pre_process_img, cv::Size(kmodel_input_width, kmodel_input_height), cv::INTER_LINEAR);
    }
    /*****************************************************************************/

    //已在ai_base.cc中给出通用实现，并且将在第6章给出开源代码
    /***************************fixed：无需修改***********************************/
    // set kmodel input
    {
        runtime_tensor tensor0 = kmodel_interp.input_tensor(0).expect("cannot get input tensor");
        auto in_buf = tensor0.impl()->to_host().unwrap()->buffer().as_host().unwrap().map(map_access_::map_write).unwrap().buffer();
        memcpy(reinterpret_cast<unsigned char *>(in_buf.data()), pre_process_img.data,sizeof(uint8_t)* kmodel_input_height * kmodel_input_width * 3);
        hrt::sync(tensor0, sync_op_t::sync_write_back, true).expect("sync write_back failed");
    }
    /*****************************************************************************/ 
    ......
}
```



### 5.1.3 模型推理

设置好模型输入后，进行模型推理，得到模型推理结果。

```
//main.cc
string kmodel_path = argv[1];
cout<<kmodel_path<<endl;
float cls_thresh=0.5;

//已在ai_base.cc中给出通用实现，并且将在第6章给出开源代码
/***************************fixed：无需修改***********************************/
// kmodel解释器，从kmodel文件构建，负责模型的加载、输入输出设置和推理
interpreter kmodel_interp;        
// load model
std::ifstream ifs(kmodel_path, std::ios::binary);
kmodel_interp.load_model(ifs).expect("Invalid kmodel");

// inputs init
for (size_t i = 0; i < kmodel_interp.inputs_size(); i++)
{
    auto desc = kmodel_interp.input_desc(i);
    auto shape = kmodel_interp.input_shape(i);
    auto tensor = host_runtime_tensor::create(desc.datatype, shape, hrt::pool_shared).expect("cannot create input tensor");
    kmodel_interp.input_tensor(i, tensor).expect("cannot set input tensor");
} 
auto shape0 = kmodel_interp.input_shape(0);      //nhwc
int kmodel_input_height = shape0[1];
int kmodel_input_width = shape0[2];

// outputs init
for (size_t i = 0; i < kmodel_interp.outputs_size(); i++)
{
    auto desc = kmodel_interp.output_desc(i);
    auto shape = kmodel_interp.output_shape(i);
    auto tensor = host_runtime_tensor::create(desc.datatype, shape, hrt::pool_shared).expect("cannot create output tensor");
    kmodel_interp.output_tensor(i, tensor).expect("cannot set output tensor");
}
/*****************************************************************************/ 
    
while (!isp_stop)
{
    cv::Mat ori_img;
    //sensor to cv::Mat
    {
        ......
    }

    // pre_process
    cv::Mat pre_process_img;
    {
        ......
    }

    // set kmodel input
    {
        ......
    }

    //已在ai_base.cc中给出通用实现，并且将在第6章给出开源代码
    /***************************fixed：无需修改***********************************/
    // kmodel run
    kmodel_interp.run().expect("error occurred in running model");

    // get kmodel output
    vector<float *> k_outputs;
    {
        for (int i = 0; i < kmodel_interp.outputs_size(); i++)
        {
            auto out = kmodel_interp.output_tensor(i).expect("cannot get output tensor");
            auto buf = out.impl()->to_host().unwrap()->buffer().as_host().unwrap().map(map_access_::map_read).unwrap().buffer();
            float *p_out = reinterpret_cast<float *>(buf.data());
            k_outputs.push_back(p_out);
        }
    }
    /*****************************************************************************/
}
```



### 5.1.4 后处理

对模型结果进行后处理，并结果放到results中。

```
//main.cc
vector<cls_res> results;
while (!isp_stop)
{
    cv::Mat ori_img;
    //sensor to cv::Mat
    {
        ......
    }

    // pre_process
    cv::Mat pre_process_img;
    {
        ......
    }

    // set kmodel input
    {
        ......
    }

    // kmodel run
    ......

    // get kmodel output
    vector<float *> k_outputs;
    {
        ......
    }

    //post process
    results.clear();
    {
        /***************************unfixed：不同AI Demo可能需要修改******************/
        float* output0 = k_outputs[0];
        //softmax
        float sum = 0.0;
        for (int i = 0; i < labels.size(); i++){
            sum += exp(output0[i]);
        }

        int max_index;
        for (int i = 0; i < labels.size(); i++)
        {
            output0[i] = exp(output0[i]) / sum;
        }
        max_index = std::max_element(output0,output0+labels.size()) - output0; 
        cls_res b;
        if (output0[max_index] >= cls_thresh)
        {
            b.label = labels[max_index];
            b.score = output0[max_index];
            results.push_back(b);
        }
        /*****************************************************************************/   
    }
}
```



### 5.1.5 显示

显示（视频输出，VO）与display相关，本小节简要介绍基于c++的显示设置、显示叠加的整体流程；详细介绍参见[K230_视频输出_API参考.md](https://github.com/kendryte/k230_docs/blob/main/zh/01_software/board/mpp/K230_视频输出_API参考.md)

- 显示设置：设置显示大小，格式
- 显示叠加：显示由2个图层构成，其中下边的图层（原图图层）直接显示摄像头输出，上边的图层（osd图层）用于画框、画点，写文字等。

**1. 显示设置**：设置显示大小，格式。

```
//vi_vo.h
/***************************fixed：无需修改***********************************/
static k_s32 sample_connector_init(void)
{
    ......
    k_connector_type connector_type = LT9611_MIPI_4LAN_1920X1080_30FPS;
    ......
}

static k_s32 vo_layer_vdss_bind_vo_config(void)
{
    ......
    sample_connector_init();

    // config lyaer
    info.act_size.width = ISP_CHN0_WIDTH;//ISP_CHN0_HEIGHT;//1080;//640;//1080;
    info.act_size.height = ISP_CHN0_HEIGHT;//ISP_CHN0_WIDTH;//1920;//480;//1920;
    info.format = PIXEL_FORMAT_YVU_PLANAR_420;
    ......
}
/*****************************************************************************/ 
```



**2. 显示叠加**：由于摄像头和显示的通道进行了绑定，我们无法对vo进行直接操作，因此采用叠加的方式进行显示。

**原图图层**：由于摄像头（vi）通道0绑定了显示（vo）的通道1；随着摄像头的启动，摄像头通道0的数据会自动流到vo的通道1。

```
//vi_vo.h
......
/***************************fixed：无需修改***********************************/
//bind vicap chn 0 to vo
vicap_mpp_chn.mod_id = K_ID_VI;
vicap_mpp_chn.dev_id = vicap_dev;
vicap_mpp_chn.chn_id = vicap_chn;

vo_mpp_chn.mod_id = K_ID_VO;
vo_mpp_chn.dev_id = K_VO_DISPLAY_DEV_ID;
vo_mpp_chn.chn_id = K_VO_DISPLAY_CHN_ID1;

sample_vicap_bind_vo(vicap_mpp_chn, vo_mpp_chn);
printf("sample_vicap ...dwc_dsi_init\n");
/*****************************************************************************/ 
......
```



**osd图层**：cv::Mat上画框、画点、写文字之后，将数据插入vo对应通道。

```
// vi_vo.h
#define osd_id                              K_VO_OSD3
/***************************unfixed：不同AI Demo可能需要修改******************/
#define ISP_CHN0_WIDTH                      (1920) // sensor ch0输出宽度，vo
#define ISP_CHN0_HEIGHT                     (1080) // sensor ch0输出高度，vo
#define osd_width                           (1920)
#define osd_height                          (1080)
/*****************************************************************************/
.....
/***************************fixed：无需修改***********************************/
k_vb_blk_handle vo_insert_frame(k_video_frame_info *vf_info, void **pic_vaddr)
{
    k_u64 phys_addr = 0;
    k_u32 *virt_addr;
    k_vb_blk_handle handle;
    k_s32 size;

    if (vf_info == NULL)
        return K_FALSE;

    if (vf_info->v_frame.pixel_format == PIXEL_FORMAT_ABGR_8888 || vf_info->v_frame.pixel_format == PIXEL_FORMAT_ARGB_8888)
        size = vf_info->v_frame.height * vf_info->v_frame.width * 4;
    else if (vf_info->v_frame.pixel_format == PIXEL_FORMAT_RGB_565 || vf_info->v_frame.pixel_format == PIXEL_FORMAT_BGR_565)
        size = vf_info->v_frame.height * vf_info->v_frame.width * 2;
    else if (vf_info->v_frame.pixel_format == PIXEL_FORMAT_ABGR_4444 || vf_info->v_frame.pixel_format == PIXEL_FORMAT_ARGB_4444)
        size = vf_info->v_frame.height * vf_info->v_frame.width * 2;
    else if (vf_info->v_frame.pixel_format == PIXEL_FORMAT_RGB_888 || vf_info->v_frame.pixel_format == PIXEL_FORMAT_BGR_888)
        size = vf_info->v_frame.height * vf_info->v_frame.width * 3;
    else if (vf_info->v_frame.pixel_format == PIXEL_FORMAT_ARGB_1555 || vf_info->v_frame.pixel_format == PIXEL_FORMAT_ABGR_1555)
        size = vf_info->v_frame.height * vf_info->v_frame.width * 2;
    else if (vf_info->v_frame.pixel_format == PIXEL_FORMAT_YVU_PLANAR_420)
        size = vf_info->v_frame.height * vf_info->v_frame.width * 3 / 2;

    size = size + 4096;         // 强制4K ，后边得删了

    printf("vb block size is %x \n", size);

    handle = kd_mpi_vb_get_block(g_pool_id, size, NULL);
    if (handle == VB_INVALID_HANDLE)
    {
        printf("%s get vb block error\n", __func__);
        return K_FAILED;
    }

    phys_addr = kd_mpi_vb_handle_to_phyaddr(handle);
    if (phys_addr == 0)
    {
        printf("%s get phys addr error\n", __func__);
        return K_FAILED;
    }

    virt_addr = (k_u32 *)kd_mpi_sys_mmap(phys_addr, size);
    // virt_addr = (k_u32 *)kd_mpi_sys_mmap_cached(phys_addr, size);

    if (virt_addr == NULL)
    {
        printf("%s mmap error\n", __func__);
        return K_FAILED;
    }

    vf_info->mod_id = K_ID_VO;
    vf_info->pool_id = g_pool_id;
    vf_info->v_frame.phys_addr[0] = phys_addr;
    if (vf_info->v_frame.pixel_format == PIXEL_FORMAT_YVU_PLANAR_420)
        vf_info->v_frame.phys_addr[1] = phys_addr + (vf_info->v_frame.height * vf_info->v_frame.stride[0]);
    *pic_vaddr = virt_addr;

    printf("phys_addr is %lx g_pool_id is %d \n", phys_addr, g_pool_id);

    return handle;
}
/*****************************************************************************/
```



**使用示例**：

```
// main.cc
/***************************fixed：无需修改***********************************/
// osd create
k_video_frame_info vf_info;
void *pic_vaddr = NULL;       
memset(&vf_info, 0, sizeof(vf_info));
vf_info.v_frame.width = osd_width;
vf_info.v_frame.height = osd_height;
vf_info.v_frame.stride[0] = osd_width;
vf_info.v_frame.pixel_format = PIXEL_FORMAT_ARGB_8888;
block = vo_insert_frame(&vf_info, &pic_vaddr);
/*****************************************************************************/ 

while (!isp_stop)
{
    cv::Mat ori_img;
    // sensor to cv::Mat
    // pre_process
    // set kmodel input
    // kmodel run
    // get kmodel output
    // post process
    results.clear();
    {
        ......
    }

    // draw result to vo
    {
        // draw osd
        {
            cv::Mat osd_frame(osd_height, osd_width, CV_8UC4, cv::Scalar(0, 0, 0, 0));
            /***************************unfixed：不同AI Demo可能需要修改******************/
            {
                //draw cls
                double fontsize = (osd_frame.cols * osd_frame.rows * 1.0) / (1100 * 1200);
                for(int i = 0; i < results.size(); i++)
                {   
                    std::string text = "class: " + results[i].label + ", score: " + std::to_string(round(results[i].score * 100) / 100.0).substr(0, 4);

                    cv::putText(osd_frame, text, cv::Point(1, 40), cv::FONT_HERSHEY_SIMPLEX, 0.8, cv::Scalar(255, 255, 255, 0), 2);

                    std::cout << text << std::endl;
                }
            }
            
            /*************************************************************************/
            
            /***************************fixed：无需修改***********************************/
            memcpy(pic_vaddr, osd_frame.data, osd_width * osd_height * 4);
        }

        // insert osd to vo
        {
            kd_mpi_vo_chn_insert_frame(osd_id+3, &vf_info);
            printf("kd_mpi_vo_chn_insert_frame success \n");
        }
        /*****************************************************************************/ 
    }
    ......
}
```



### 5.1.6 完整代码

具体怎么操作运行，请参考第6章，这里着重介绍代码流程。

vi_vo.h

```
/* Copyright (c) 2023, Canaan Bright Sight Co., Ltd
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 * 1. Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following disclaimer in the
 * documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND
 * CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES,
 * INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
 * BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
 * WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

#include <chrono>
#include <fstream>
#include <iostream>
#include <thread>
#include <atomic>

#include "mpi_sys_api.h"

/* vicap */
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <string.h>
#include <sys/mman.h>

#include "k_module.h"
#include "k_type.h"
#include "k_vb_comm.h"
#include "k_video_comm.h"
#include "k_sys_comm.h"
#include "mpi_vb_api.h"
#include "mpi_vicap_api.h"
#include "mpi_isp_api.h"
#include "mpi_sys_api.h"
#include "k_vo_comm.h"
#include "mpi_vo_api.h"

#include "vo_test_case.h"

#include "k_connector_comm.h"
#include "mpi_connector_api.h"
#include "k_autoconf_comm.h"

/***************************unfixed：不同AI Demo可能需要修改*******************/
#if defined(CONFIG_BOARD_K230_CANMV)
#define SENSOR_CHANNEL (3)                // 通道数
#define SENSOR_HEIGHT (720)               // sensor ch1输出高度，AI输入
#define SENSOR_WIDTH (1280)               // sensor ch1输出宽度，AI输入
#define ISP_CHN0_WIDTH  (1920)            // sensor ch0输出宽度，vo
#define ISP_CHN0_HEIGHT (1080)            // sensor ch0输出高度，vo
#define vicap_install_osd                   (1)
#define osd_id                              K_VO_OSD3
#define osd_width                           (1920)
#define osd_height                          (1080)
#else
#define SENSOR_CHANNEL (3)                
#define SENSOR_HEIGHT (1280)  
#define SENSOR_WIDTH (720)   
#define ISP_CHN0_WIDTH  (1088)
#define ISP_CHN0_HEIGHT (1920)
#define vicap_install_osd                   (1)
#define osd_id                              K_VO_OSD3
#define osd_width                           (1080)
#define osd_height                          (1920)
#endif
/*****************************************************************************/    

/***************************fixed：无需修改***********************************/
k_vb_config config;
k_vicap_dev vicap_dev;
k_vicap_chn vicap_chn;
k_vicap_dev_attr dev_attr;
k_vicap_chn_attr chn_attr;
k_vicap_sensor_info sensor_info;
k_vicap_sensor_type sensor_type;
k_mpp_chn vicap_mpp_chn;
k_mpp_chn vo_mpp_chn;

k_video_frame_info dump_info;

k_vo_draw_frame vo_frame = (k_vo_draw_frame) {
    1,
    16,
    16,
    128,
    128,
    1
};

static k_vb_blk_handle block;
k_u32 g_pool_id;

int vo_creat_layer_test(k_vo_layer chn_id, layer_info *info)
{
    k_vo_video_layer_attr attr;

    // check layer
    if ((chn_id >= K_MAX_VO_LAYER_NUM) || ((info->func & K_VO_SCALER_ENABLE) && (chn_id != K_VO_LAYER0))
            || ((info->func != 0) && (chn_id == K_VO_LAYER2)))
    {
        printf("input layer num failed \n");
        return -1 ;
    }

    // check scaler

    // set offset
    attr.display_rect = info->offset;
    // set act
    attr.img_size = info->act_size;
    // sget size
    info->size = info->act_size.height * info->act_size.width * 3 / 2;
    //set pixel format
    attr.pixel_format = info->format;
    if (info->format != PIXEL_FORMAT_YVU_PLANAR_420)
    {
        printf("input pix format failed \n");
        return -1;
    }
    // set stride
    attr.stride = (info->act_size.width / 8 - 1) + ((info->act_size.height - 1) << 16);
    // set function
    attr.func = info->func;
    // set scaler attr
    attr.scaler_attr = info->attr;

    // set video layer atrr
    kd_mpi_vo_set_video_layer_attr(chn_id, &attr);

    // enable layer
    kd_mpi_vo_enable_video_layer(chn_id);

    return 0;
}

k_vb_blk_handle vo_insert_frame(k_video_frame_info *vf_info, void **pic_vaddr)
{
    k_u64 phys_addr = 0;
    k_u32 *virt_addr;
    k_vb_blk_handle handle;
    k_s32 size;

    if (vf_info == NULL)
        return K_FALSE;

    if (vf_info->v_frame.pixel_format == PIXEL_FORMAT_ABGR_8888 || vf_info->v_frame.pixel_format == PIXEL_FORMAT_ARGB_8888)
        size = vf_info->v_frame.height * vf_info->v_frame.width * 4;
    else if (vf_info->v_frame.pixel_format == PIXEL_FORMAT_RGB_565 || vf_info->v_frame.pixel_format == PIXEL_FORMAT_BGR_565)
        size = vf_info->v_frame.height * vf_info->v_frame.width * 2;
    else if (vf_info->v_frame.pixel_format == PIXEL_FORMAT_ABGR_4444 || vf_info->v_frame.pixel_format == PIXEL_FORMAT_ARGB_4444)
        size = vf_info->v_frame.height * vf_info->v_frame.width * 2;
    else if (vf_info->v_frame.pixel_format == PIXEL_FORMAT_RGB_888 || vf_info->v_frame.pixel_format == PIXEL_FORMAT_BGR_888)
        size = vf_info->v_frame.height * vf_info->v_frame.width * 3;
    else if (vf_info->v_frame.pixel_format == PIXEL_FORMAT_ARGB_1555 || vf_info->v_frame.pixel_format == PIXEL_FORMAT_ABGR_1555)
        size = vf_info->v_frame.height * vf_info->v_frame.width * 2;
    else if (vf_info->v_frame.pixel_format == PIXEL_FORMAT_YVU_PLANAR_420)
        size = vf_info->v_frame.height * vf_info->v_frame.width * 3 / 2;

    size = size + 4096;         // 强制4K ，后边得删了

    printf("vb block size is %x \n", size);

    handle = kd_mpi_vb_get_block(g_pool_id, size, NULL);
    if (handle == VB_INVALID_HANDLE)
    {
        printf("%s get vb block error\n", __func__);
        return K_FAILED;
    }

    phys_addr = kd_mpi_vb_handle_to_phyaddr(handle);
    if (phys_addr == 0)
    {
        printf("%s get phys addr error\n", __func__);
        return K_FAILED;
    }

    virt_addr = (k_u32 *)kd_mpi_sys_mmap(phys_addr, size);
    // virt_addr = (k_u32 *)kd_mpi_sys_mmap_cached(phys_addr, size);

    if (virt_addr == NULL)
    {
        printf("%s mmap error\n", __func__);
        return K_FAILED;
    }

    vf_info->mod_id = K_ID_VO;
    vf_info->pool_id = g_pool_id;
    vf_info->v_frame.phys_addr[0] = phys_addr;
    if (vf_info->v_frame.pixel_format == PIXEL_FORMAT_YVU_PLANAR_420)
        vf_info->v_frame.phys_addr[1] = phys_addr + (vf_info->v_frame.height * vf_info->v_frame.stride[0]);
    *pic_vaddr = virt_addr;

    printf("phys_addr is %lx g_pool_id is %d \n", phys_addr, g_pool_id);

    return handle;
}

k_u32 vo_creat_osd_test(k_vo_osd osd, osd_info *info)
{
    k_vo_video_osd_attr attr;

    // set attr
    attr.global_alptha = info->global_alptha;

    if (info->format == PIXEL_FORMAT_ABGR_8888 || info->format == PIXEL_FORMAT_ARGB_8888)
    {
        info->size = info->act_size.width  * info->act_size.height * 4;
        info->stride  = info->act_size.width * 4 / 8;
    }
    else if (info->format == PIXEL_FORMAT_RGB_565 || info->format == PIXEL_FORMAT_BGR_565)
    {
        info->size = info->act_size.width  * info->act_size.height * 2;
        info->stride  = info->act_size.width * 2 / 8;
    }
    else if (info->format == PIXEL_FORMAT_RGB_888 || info->format == PIXEL_FORMAT_BGR_888)
    {
        info->size = info->act_size.width  * info->act_size.height * 3;
        info->stride  = info->act_size.width * 3 / 8;
    }
    else if(info->format == PIXEL_FORMAT_ARGB_4444 || info->format == PIXEL_FORMAT_ABGR_4444)
    {
        info->size = info->act_size.width  * info->act_size.height * 2;
        info->stride  = info->act_size.width * 2 / 8;
    }
    else if(info->format == PIXEL_FORMAT_ARGB_1555 || info->format == PIXEL_FORMAT_ABGR_1555)
    {
        info->size = info->act_size.width  * info->act_size.height * 2;
        info->stride  = info->act_size.width * 2 / 8;
    }
    else
    {
        printf("set osd pixel format failed  \n");
    }

    attr.stride = info->stride;
    attr.pixel_format = info->format;
    attr.display_rect = info->offset;
    attr.img_size = info->act_size;
    kd_mpi_vo_set_video_osd_attr(osd, &attr);

    kd_mpi_vo_osd_enable(osd);

    return 0;
}

void sample_vicap_install_osd(void)
{
    osd_info osd;

    osd.act_size.width = osd_width ;
    osd.act_size.height = osd_height;
    osd.offset.x = 0;
    osd.offset.y = 0;
    osd.global_alptha = 0xff;
    // osd.global_alptha = 0x32;
    osd.format = PIXEL_FORMAT_ARGB_8888;//PIXEL_FORMAT_ARGB_4444; //PIXEL_FORMAT_ARGB_1555;//PIXEL_FORMAT_ARGB_8888;

    vo_creat_osd_test(osd_id, &osd);
}

void vo_osd_release_block(void)
{
    if(vicap_install_osd == 1)
    {
        kd_mpi_vo_osd_disable(osd_id);
        kd_mpi_vb_release_block(block);
    }
    
}

static k_s32 sample_connector_init(void)
{
    k_u32 ret = 0;
    k_s32 connector_fd;
#if defined(CONFIG_BOARD_K230_CANMV)
    k_connector_type connector_type = LT9611_MIPI_4LAN_1920X1080_30FPS;// HX8377_V2_MIPI_4LAN_1080X1920_30FPS;
#else
    k_connector_type connector_type = HX8377_V2_MIPI_4LAN_1080X1920_30FPS;
#endif
    k_connector_info connector_info;

    memset(&connector_info, 0, sizeof(k_connector_info));

    //connector get sensor info
    ret = kd_mpi_get_connector_info(connector_type, &connector_info);
    if (ret) {
        printf("sample_vicap, the sensor type not supported!\n");
        return ret;
    }

    connector_fd = kd_mpi_connector_open(connector_info.connector_name);
    if (connector_fd < 0) {
        printf("%s, connector open failed.\n", __func__);
        return K_ERR_VO_NOTREADY;
    }

    // set connect power
    kd_mpi_connector_power_set(connector_fd, K_TRUE);
    // connector init
    kd_mpi_connector_init(connector_fd, connector_info);

    return 0;
}

static k_s32 vo_layer_vdss_bind_vo_config(void)
{
    layer_info info;

    k_vo_layer chn_id = K_VO_LAYER1;

    memset(&info, 0, sizeof(info));

    sample_connector_init();

    // config lyaer
    info.act_size.width = ISP_CHN0_WIDTH;//ISP_CHN0_HEIGHT;//1080;//640;//1080;
    info.act_size.height = ISP_CHN0_HEIGHT;//ISP_CHN0_WIDTH;//1920;//480;//1920;
    info.format = PIXEL_FORMAT_YVU_PLANAR_420;
    info.func = 0;//K_ROTATION_180;////K_ROTATION_90;
    info.global_alptha = 0xff;
    info.offset.x = 0;//(1080-w)/2,
    info.offset.y = 0;//(1920-h)/2;
    vo_creat_layer_test(chn_id, &info);

    if(vicap_install_osd == 1)
        sample_vicap_install_osd();

    //exit ;
    return 0;
}

static void sample_vicap_bind_vo(k_mpp_chn vicap_mpp_chn, k_mpp_chn vo_mpp_chn)
{
    k_s32 ret;

    ret = kd_mpi_sys_bind(&vicap_mpp_chn, &vo_mpp_chn);
    if (ret) {
        printf("kd_mpi_sys_unbind failed:0x%x\n", ret);
    }

    return;
}

static void sample_vicap_unbind_vo(k_mpp_chn vicap_mpp_chn, k_mpp_chn vo_mpp_chn)
{
    k_s32 ret;

    ret = kd_mpi_sys_unbind(&vicap_mpp_chn, &vo_mpp_chn);
    if (ret) {
        printf("kd_mpi_sys_unbind failed:0x%x\n", ret);
    }

    return;
}

int vivcap_start()
{
    k_s32 ret = 0;

    k_u32 pool_id;
    k_vb_pool_config pool_config;

    printf("sample_vicap ...\n");

#if defined(CONFIG_BOARD_K230_CANMV)
    sensor_type = OV_OV5647_MIPI_CSI0_1920X1080_30FPS_10BIT_LINEAR;
    kd_mpi_vicap_set_mclk(VICAP_MCLK0, VICAP_PLL0_CLK_DIV4, 16, 1);
#else
    sensor_type = IMX335_MIPI_2LANE_RAW12_2592X1944_30FPS_LINEAR;
#endif
    vicap_dev = VICAP_DEV_ID_0;

    memset(&config, 0, sizeof(config));
    config.max_pool_cnt = 64;
    //VB for YUV420SP output
    config.comm_pool[0].blk_cnt = 5;
    config.comm_pool[0].mode = VB_REMAP_MODE_NOCACHE;
    config.comm_pool[0].blk_size = VICAP_ALIGN_UP((ISP_CHN0_WIDTH * ISP_CHN0_HEIGHT * 3 / 2), VICAP_ALIGN_1K);
   
    //VB for RGB888 output
    config.comm_pool[1].blk_cnt = 5;
    config.comm_pool[1].mode = VB_REMAP_MODE_NOCACHE;
    config.comm_pool[1].blk_size = VICAP_ALIGN_UP((SENSOR_HEIGHT * SENSOR_WIDTH * 3 ), VICAP_ALIGN_1K);

    ret = kd_mpi_vb_set_config(&config);
    if (ret) {
        printf("vb_set_config failed ret:%d\n", ret);
        return ret;
    }

    k_vb_supplement_config supplement_config;
    memset(&supplement_config, 0, sizeof(supplement_config));
    supplement_config.supplement_config |= VB_SUPPLEMENT_JPEG_MASK;

    ret = kd_mpi_vb_set_supplement_config(&supplement_config);
    if (ret) {
        printf("vb_set_supplement_config failed ret:%d\n", ret);
        return ret;
    }

    ret = kd_mpi_vb_init();
    if (ret) {
        printf("vb_init failed ret:%d\n", ret);
        return ret;
    }
    printf("sample_vicap ...kd_mpi_vicap_get_sensor_info\n");

    // dwc_dsi_init();
    vo_layer_vdss_bind_vo_config();

    if(vicap_install_osd == 1)
    {
        memset(&pool_config, 0, sizeof(pool_config));
        pool_config.blk_size = VICAP_ALIGN_UP((osd_width * osd_height * 4 * 2), VICAP_ALIGN_1K);
        pool_config.blk_cnt = 4;
        pool_config.mode = VB_REMAP_MODE_NOCACHE;
        pool_id = kd_mpi_vb_create_pool(&pool_config);      // osd0 - 3 argb 320 x 240
        g_pool_id = pool_id;

        printf("--------aa--------------g_pool_id is %d pool_id is %d \n",g_pool_id, pool_id);
    }

    memset(&sensor_info, 0, sizeof(k_vicap_sensor_info));
    ret = kd_mpi_vicap_get_sensor_info(sensor_type, &sensor_info);
    if (ret) {
        printf("sample_vicap, the sensor type not supported!\n");
        return ret;
    }

    memset(&dev_attr, 0, sizeof(k_vicap_dev_attr));
    dev_attr.acq_win.h_start = 0;
    dev_attr.acq_win.v_start = 0;
#if defined (CONFIG_BOARD_K230_CANMV)
    dev_attr.acq_win.width = ISP_CHN0_WIDTH;
    dev_attr.acq_win.height = ISP_CHN0_HEIGHT;
#else
    dev_attr.acq_win.width = 2592;//SENSOR_HEIGHT;
    dev_attr.acq_win.height = 1944;//SENSOR_WIDTH;
#endif
    dev_attr.mode = VICAP_WORK_ONLINE_MODE;

    dev_attr.pipe_ctrl.data = 0xFFFFFFFF;
    dev_attr.pipe_ctrl.bits.af_enable = 0;
    dev_attr.pipe_ctrl.bits.ahdr_enable = 0;


    dev_attr.cpature_frame = 0;
    memcpy(&dev_attr.sensor_info, &sensor_info, sizeof(k_vicap_sensor_info));

    ret = kd_mpi_vicap_set_dev_attr(vicap_dev, dev_attr);
    if (ret) {
        printf("sample_vicap, kd_mpi_vicap_set_dev_attr failed.\n");
        return ret;
    }

    memset(&chn_attr, 0, sizeof(k_vicap_chn_attr));

    //set chn0 output yuv420sp
    chn_attr.out_win.h_start = 0;
    chn_attr.out_win.v_start = 0;
    chn_attr.out_win.width = ISP_CHN0_WIDTH;
    chn_attr.out_win.height = ISP_CHN0_HEIGHT;


#if defined(CONFIG_BOARD_K230_CANMV)
    chn_attr.crop_win = dev_attr.acq_win;
#else
    // chn_attr.crop_win = dev_attr.acq_win;
    chn_attr.crop_win.h_start = 768;
    chn_attr.crop_win.v_start = 16;
    chn_attr.crop_win.width = ISP_CHN0_WIDTH;
    chn_attr.crop_win.height = ISP_CHN0_HEIGHT;
#endif

    chn_attr.scale_win = chn_attr.out_win;
    chn_attr.crop_enable = K_FALSE;
    chn_attr.scale_enable = K_FALSE;
    // chn_attr.dw_enable = K_FALSE;
    chn_attr.chn_enable = K_TRUE;
    chn_attr.pix_format = PIXEL_FORMAT_YVU_PLANAR_420;
    chn_attr.buffer_num = VICAP_MAX_FRAME_COUNT;//at least 3 buffers for isp
    chn_attr.buffer_size = config.comm_pool[0].blk_size;
    vicap_chn = VICAP_CHN_ID_0;

    printf("sample_vicap ...kd_mpi_vicap_set_chn_attr, buffer_size[%d]\n", chn_attr.buffer_size);
    ret = kd_mpi_vicap_set_chn_attr(vicap_dev, vicap_chn, chn_attr);
    if (ret) {
        printf("sample_vicap, kd_mpi_vicap_set_chn_attr failed.\n");
        return ret;
    }

    //bind vicap chn 0 to vo
    vicap_mpp_chn.mod_id = K_ID_VI;
    vicap_mpp_chn.dev_id = vicap_dev;
    vicap_mpp_chn.chn_id = vicap_chn;

    vo_mpp_chn.mod_id = K_ID_VO;
    vo_mpp_chn.dev_id = K_VO_DISPLAY_DEV_ID;
    vo_mpp_chn.chn_id = K_VO_DISPLAY_CHN_ID1;

    sample_vicap_bind_vo(vicap_mpp_chn, vo_mpp_chn);
    printf("sample_vicap ...dwc_dsi_init\n");

    //set chn1 output rgb888p
    chn_attr.out_win.h_start = 0;
    chn_attr.out_win.v_start = 0;
    chn_attr.out_win.width = SENSOR_WIDTH ;
    chn_attr.out_win.height = SENSOR_HEIGHT;
    // chn_attr.crop_win = dev_attr.acq_win;

#if defined(CONFIG_BOARD_K230_CANMV)
    chn_attr.crop_win = dev_attr.acq_win;
#else   
    chn_attr.crop_win.h_start = 768;
    chn_attr.crop_win.v_start = 16;
    chn_attr.crop_win.width = ISP_CHN0_WIDTH;
    chn_attr.crop_win.height = ISP_CHN0_HEIGHT;
#endif

    chn_attr.scale_win = chn_attr.out_win;
    chn_attr.crop_enable = K_FALSE;
    chn_attr.scale_enable = K_FALSE;
    // chn_attr.dw_enable = K_FALSE;
    chn_attr.chn_enable = K_TRUE;
    chn_attr.pix_format = PIXEL_FORMAT_BGR_888_PLANAR;
    chn_attr.buffer_num = VICAP_MAX_FRAME_COUNT;//at least 3 buffers for isp
    chn_attr.buffer_size = config.comm_pool[1].blk_size;

    printf("sample_vicap ...kd_mpi_vicap_set_chn_attr, buffer_size[%d]\n", chn_attr.buffer_size);
    ret = kd_mpi_vicap_set_chn_attr(vicap_dev, VICAP_CHN_ID_1, chn_attr);
    if (ret) {
        printf("sample_vicap, kd_mpi_vicap_set_chn_attr failed.\n");
        return ret;
    }

    printf("sample_vicap ...kd_mpi_vicap_init\n");
    ret = kd_mpi_vicap_init(vicap_dev);
    if (ret) {
        printf("sample_vicap, kd_mpi_vicap_init failed.\n");
        // goto err_exit;
    }

    printf("sample_vicap ...kd_mpi_vicap_start_stream\n");
    ret = kd_mpi_vicap_start_stream(vicap_dev);
    if (ret) {
        printf("sample_vicap, kd_mpi_vicap_init failed.\n");
        // goto err_exit;
    }

    return ret;
}

int vivcap_stop()
{
    printf("sample_vicap ...kd_mpi_vicap_stop_stream\n");
    int ret = kd_mpi_vicap_stop_stream(vicap_dev);
    if (ret) {
        printf("sample_vicap, kd_mpi_vicap_init failed.\n");
        return ret;
    }

    ret = kd_mpi_vicap_deinit(vicap_dev);
    if (ret) {
        printf("sample_vicap, kd_mpi_vicap_deinit failed.\n");
        return ret;
    }

    kd_mpi_vo_disable_video_layer(K_VO_LAYER1);

    vicap_mpp_chn.mod_id = K_ID_VI;
    vicap_mpp_chn.dev_id = vicap_dev;
    vicap_mpp_chn.chn_id = vicap_chn;

    vo_mpp_chn.mod_id = K_ID_VO;
    vo_mpp_chn.dev_id = K_VO_DISPLAY_DEV_ID;
    vo_mpp_chn.chn_id = K_VO_DISPLAY_CHN_ID1;

    sample_vicap_unbind_vo(vicap_mpp_chn, vo_mpp_chn);

    /*Allow one frame time for the VO to release the VB block*/
    k_u32 display_ms = 1000 / 33;
    usleep(1000 * display_ms);

    ret = kd_mpi_vb_exit();
    if (ret) {
        printf("sample_vicap, kd_mpi_vb_exit failed.\n");
        return ret;
    }

    return 0;
}

void yuv_rotate_90(char *des, char *src,int width,int height)
{
    int n = 0;
    int hw = width>>1;
    int hh = height>>1;
    int size = width * height;
    int hsize = size>>2;

    int pos = 0;

    for(int i = width-1;i >= 0;i--)
    {
        pos = 0;
        for(int j= 0;j < height;j++)
        {
            des[n++]= src[pos+i];
            pos += width;
        }
    }

}
/****************************************************************************/
```



main.cc

```
/* Copyright (c) 2023, Canaan Bright Sight Co., Ltd
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 * 1. Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following disclaimer in the
 * documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND
 * CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES,
 * INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
 * BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
 * WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

#include <iostream>
#include <thread>
#include <map>
#include <nncase/runtime/runtime_tensor.h>
#include <nncase/runtime/interpreter.h>
#include <nncase/runtime/runtime_op_utility.h>
#include <opencv2/highgui.hpp>
#include <opencv2/imgcodecs.hpp>
#include <opencv2/imgproc.hpp>

#include "vi_vo.h"

using namespace nncase;
using namespace nncase::runtime;

using cv::Mat;
using std::cerr;
using std::cout;
using std::endl;
using namespace std;

auto cache = cv::Mat::zeros(1, 1, CV_32FC1);
/**
 * @brief 分类结果结构
 */
typedef struct cls_res
{
    float score;//分类分数
    string label;//分类标签结果
}cls_res;

std::atomic<bool> isp_stop(false);

void video_proc_cls(char *argv[])
{
    
    /***************************fixed：无需修改***********************************/
    vivcap_start();

    // osd set
    k_video_frame_info vf_info;
    void *pic_vaddr = NULL;       

    memset(&vf_info, 0, sizeof(vf_info));

    vf_info.v_frame.width = osd_width;
    vf_info.v_frame.height = osd_height;
    vf_info.v_frame.stride[0] = osd_width;
    vf_info.v_frame.pixel_format = PIXEL_FORMAT_ARGB_8888;
    block = vo_insert_frame(&vf_info, &pic_vaddr);

    // alloc memory for sensor
    size_t paddr = 0;
    void *vaddr = nullptr;
    size_t size = SENSOR_CHANNEL * SENSOR_HEIGHT * SENSOR_WIDTH;
    int ret = kd_mpi_sys_mmz_alloc_cached(&paddr, &vaddr, "allocate", "anonymous", size);
    if (ret)
    {
        std::cerr << "physical_memory_block::allocate failed: ret = " << ret << ", errno = " << strerror(errno) << std::endl;
        std::abort();
    }
    /*****************************************************************************/ 

    string kmodel_path = argv[1];
    cout<<"kmodel_path : "<<kmodel_path<<endl;
    float cls_thresh=0.5;

    /***************************fixed：无需修改***********************************/
    // 我们已经把相关实现封装到ai_base.cc，这里只是为了介绍起来比较简单
    interpreter kmodel_interp;        
    // load model
    std::ifstream ifs(kmodel_path, std::ios::binary);
    kmodel_interp.load_model(ifs).expect("Invalid kmodel");

    // inputs init
    for (size_t i = 0; i < kmodel_interp.inputs_size(); i++)
    {
        auto desc = kmodel_interp.input_desc(i);
        auto shape = kmodel_interp.input_shape(i);
        auto tensor = host_runtime_tensor::create(desc.datatype, shape, hrt::pool_shared).expect("cannot create input tensor");
        kmodel_interp.input_tensor(i, tensor).expect("cannot set input tensor");
    } 
    auto shape0 = kmodel_interp.input_shape(0);      //nhwc
    int kmodel_input_height = shape0[1];
    int kmodel_input_width = shape0[2];

    // outputs init
    for (size_t i = 0; i < kmodel_interp.outputs_size(); i++)
    {
        auto desc = kmodel_interp.output_desc(i);
        auto shape = kmodel_interp.output_shape(i);
        auto tensor = host_runtime_tensor::create(desc.datatype, shape, hrt::pool_shared).expect("cannot create output tensor");
        kmodel_interp.output_tensor(i, tensor).expect("cannot set output tensor");
    }
    /*****************************************************************************/ 

    vector<cls_res> results;
    std::vector<std::string> labels = {"bocai","changqiezi","huluobo","xihongshi","xilanhua"};
    
    while (!isp_stop)
    {
        cv::Mat ori_img;
        //sensor to cv::Mat
        {
            /***************************fixed：无需修改***********************************/
            //从摄像头读取一帧图像
            memset(&dump_info, 0 , sizeof(k_video_frame_info));
            ret = kd_mpi_vicap_dump_frame(vicap_dev, VICAP_CHN_ID_1, VICAP_DUMP_YUV, &dump_info, 1000);
            if (ret) {
                printf("sample_vicap...kd_mpi_vicap_dump_frame failed.\n");
                continue;
            }

            //将摄像头当前帧对应DDR地址映射到当前系统进行访问
            auto vbvaddr = kd_mpi_sys_mmap_cached(dump_info.v_frame.phys_addr[0], size);
            memcpy(vaddr, (void *)vbvaddr, SENSOR_HEIGHT * SENSOR_WIDTH * 3); 
            kd_mpi_sys_munmap(vbvaddr, size);
                /*****************************************************************************/ 
            
            //将摄像头数据转换为为cv::Mat,sensor（rgb,chw）->cv::Mat（bgr，hwc）
            cv::Mat image_r = cv::Mat(SENSOR_HEIGHT,SENSOR_WIDTH, CV_8UC1, vaddr);
            cv::Mat image_g = cv::Mat(SENSOR_HEIGHT,SENSOR_WIDTH, CV_8UC1, vaddr+SENSOR_HEIGHT*SENSOR_WIDTH);
            cv::Mat image_b = cv::Mat(SENSOR_HEIGHT,SENSOR_WIDTH, CV_8UC1, vaddr+2*SENSOR_HEIGHT*SENSOR_WIDTH);
            std::vector<cv::Mat> color_vec(3);
            color_vec.clear();
            color_vec.push_back(image_b);
            color_vec.push_back(image_g);
            color_vec.push_back(image_r);
            cv::merge(color_vec, ori_img);
        }

        /***************************unfixed：不同AI Demo可能需要修改******************/
        // pre_process
        cv::Mat pre_process_img;
        {
            cv::Mat rgb_img;
            cv::cvtColor(ori_img, rgb_img, cv::COLOR_BGR2RGB);
            cv::resize(rgb_img, pre_process_img, cv::Size(kmodel_input_width, kmodel_input_height), cv::INTER_LINEAR);
        }
        /*****************************************************************************/  

        /***************************fixed：无需修改***********************************/
        // set kmodel input
        {
            runtime_tensor tensor0 = kmodel_interp.input_tensor(0).expect("cannot get input tensor");
            auto in_buf = tensor0.impl()->to_host().unwrap()->buffer().as_host().unwrap().map(map_access_::map_write).unwrap().buffer();
            memcpy(reinterpret_cast<unsigned char *>(in_buf.data()), pre_process_img.data,sizeof(uint8_t)* kmodel_input_height * kmodel_input_width * 3);
            hrt::sync(tensor0, sync_op_t::sync_write_back, true).expect("sync write_back failed");
        }
        

        // kmodel run
        kmodel_interp.run().expect("error occurred in running model");

        // get kmodel output
        vector<float *> k_outputs;
        {
            for (int i = 0; i < kmodel_interp.outputs_size(); i++)
            {
                auto out = kmodel_interp.output_tensor(i).expect("cannot get output tensor");
                auto buf = out.impl()->to_host().unwrap()->buffer().as_host().unwrap().map(map_access_::map_read).unwrap().buffer();
                float *p_out = reinterpret_cast<float *>(buf.data());
                k_outputs.push_back(p_out);
            }
        }
        /***************************fixed：无需修改***********************************/

        /***************************unfixed：不同AI Demo可能需要修改******************/
        //post process
        results.clear();
        {
            
            float* output0 = k_outputs[0];
            float sum = 0.0;
            for (int i = 0; i < labels.size(); i++){
                sum += exp(output0[i]);
            }
            
            int max_index;
            for (int i = 0; i < labels.size(); i++)
            {
                output0[i] = exp(output0[i]) / sum;
            }
            max_index = std::max_element(output0,output0+labels.size()) - output0; 
            cls_res b;
            if (output0[max_index] >= cls_thresh)
            {
                b.label = labels[max_index];
                b.score = output0[max_index];
                results.push_back(b);
            }
        }
        /*****************************************************************************/    

        // draw result to vo
        {
            {
                cv::Mat osd_frame(osd_height, osd_width, CV_8UC4, cv::Scalar(0, 0, 0, 0));
                {
         /***************************unfixed：不同AI Demo可能需要修改******************/
                    //draw cls
                    double fontsize = (osd_frame.cols * osd_frame.rows * 1.0) / (1100 * 1200);
                    for(int i = 0; i < results.size(); i++)
                    {   
                        std::string text = "class: " + results[i].label + ", score: " + std::to_string(round(results[i].score * 100) / 100.0).substr(0, 4);

                        cv::putText(osd_frame, text, cv::Point(1, 40), cv::FONT_HERSHEY_SIMPLEX, 0.8, cv::Scalar(255, 255, 255, 0), 2);

                        std::cout << text << std::endl;
                    }
                    /*****************************************************************************/
                }

           /***************************fixed：无需修改***********************************/
                memcpy(pic_vaddr, osd_frame.data, osd_width * osd_height * 4);
            }

            // insert osd to vo
            {
                kd_mpi_vo_chn_insert_frame(osd_id+3, &vf_info);  //K_VO_OSD0
                printf("kd_mpi_vo_chn_insert_frame success \n");
            }
            
        }
        
        {
            // 释放sensor当前帧
            ret = kd_mpi_vicap_dump_release(vicap_dev, VICAP_CHN_ID_1, &dump_info);
            if (ret) {
                printf("sample_vicap...kd_mpi_vicap_dump_release failed.\n");
            }
        }
        /*****************************************************************************/ 
    }
    
    /***************************fixed：无需修改***********************************/
    vo_osd_release_block();
    vivcap_stop();

    // free memory
    ret = kd_mpi_sys_mmz_free(paddr, vaddr);
    if (ret)
    {
        std::cerr << "free failed: ret = " << ret << ", errno = " << strerror(errno) << std::endl;
        std::abort();
    }
    /*****************************************************************************/ 
}

int main(int argc, char *argv[])
{
     std::cout << "case " << argv[0] << " built at " << __DATE__ << " " << __TIME__ << std::endl;
    if (argc != 2)
    {
        cout << "模型推理时传参说明："
         << "<kmodel_path>" << endl
         << "Options:" << endl
         << "  kmodel_path     Kmodel的路径\n"
         << "\n"
         << endl;
        return -1;
    }

    /***************************fixed：无需修改***********************************/
    std::thread thread_isp(video_proc_cls, argv);
    while (getchar() != 'q')
    {
        usleep(10000);
    }

    isp_stop = true;
    thread_isp.join();
    /*****************************************************************************/ 
    return 0;
}
```



## 5.2 基于ulab(MicroPython)的AI推理流程

基于ulab（MicroPython）的K230 AI推理，简要介绍了使用MicroPython语言实现的视频采集，图像预处理（ulab），模型推理、后处理（ulab）、显示等过程。

### 5.2.1 视频采集

**视频采集**：（视频输入，VI）与摄像头相关，本小节简要介绍基于Micropython的摄像头设置、摄像头启动、从摄像头中获取一帧数据、摄像头停止的整体流程。

**创建摄像头sensor对象，并设置多路输出格式和大小**：

- 设置的sensor两路输出；
- 一路输出用于显示，输出大小设置1080p，图像格式为PIXEL_FORMAT_YVU_PLANAR_420，直接绑定到vo；
- 另一路输出用于AI计算，输出大小（1280,720）,图像格式为PIXEL_FORMAT_RGB_888_PLANAR；

```
import os
from media.sensor import * #导入sensor模块，使用sensor相关接口
from media.display import * #导入display模块，使用display相关接口
from media.media import * #导入media模块，使用meida相关接口
from time import *
import gc

# 显示输出大小
DISPLAY_WIDTH = ALIGN_UP(1920, 16)
DISPLAY_HEIGHT = 1080
# AI获取的RGB888P的图像大小
OUT_RGB888P_WIDTH = ALIGN_UP(1280, 16)
OUT_RGB888P_HEIGH = 720

def sensor_init():
    # 初始化并配置sensor
    sensor = Sensor()
    sensor.reset()
    # 设置镜像
    sensor.set_hmirror(False)
    # 设置翻转
    sensor.set_vflip(False)
    # 通道0直接给到显示VO，格式为YUV420
    sensor.set_framesize(width = DISPLAY_WIDTH, height = DISPLAY_HEIGHT)
    sensor.set_pixformat(PIXEL_FORMAT_YUV_SEMIPLANAR_420)
    # 通道2给到AI做算法处理，格式为RGB888
    sensor.set_framesize(width = OUT_RGB888P_WIDTH , height = OUT_RGB888P_HEIGH, chn=CAM_CHN_ID_2)
    sensor.set_pixformat(PIXEL_FORMAT_RGB_888_PLANAR, chn=CAM_CHN_ID_2)
	# 绑定通道0的输出到vo
    sensor_bind_info = sensor.bind_info(x = 0, y = 0, chn = CAM_CHN_ID_0)
    Display.bind_layer(**sensor_bind_info, layer = Display.LAYER_VIDEO1)
    # 设置为LT9611显示，默认1920x1080
    Display.init(Display.LT9611, to_ide = True)
    try:
        # media初始化
        MediaManager.init()
        # 启动sensor
        sensor.run()
        rgb888p_img = None
        while  True:
            #捕获摄像头数据
            rgb888p_img = sensor.snapshot(chn=CAM_CHN_ID_2)
            #************拿到一帧图像后可以进行后续AI过程************
            #                      ......
            #***************************************************
    except Exception as e:
        print(f"An error occurred during running: {e}")
    finally:
        os.exitpoint(os.EXITPOINT_ENABLE_SLEEP)
        #停止摄像头输出
        sensor.stop()
        #去初始化显示设备
        Display.deinit()
        #释放媒体缓冲区
        MediaManager.deinit()
        gc.collect()
        nn.shrink_memory_pool()
    return 0

sensor_init()
```



### 5.2.2 预处理

```
import os
from media.sensor import * #导入camera模块，使用camera相关接口
from media.display import * #导入display模块，使用display相关接口
from media.media import * #导入media模块，使用meida相关接口
from time import *
import time
import nncase_runtime as nn #导入nn模块，使用nn相关接口
import ulab.numpy as np #导入np模块，使用np相关接口
import gc

# 显示输出大小
DISPLAY_WIDTH = ALIGN_UP(1920, 16)
DISPLAY_HEIGHT = 1080
# AI获取的RGB888P的图像大小
OUT_RGB888P_WIDTH = ALIGN_UP(1280, 16)
OUT_RGB888P_HEIGH = 720

def cls_test():
    print("cls_test start")
    #初始化AI2D
    ai2d = nn.ai2d()
    # 设置ai2d的输入输出数据格式和数据类型
    ai2d.set_dtype(nn.ai2d_format.NCHW_FMT,nn.ai2d_format.NCHW_FMT,np.uint8, np.uint8)
    # 设置resize预处理
    ai2d.set_resize_param(True, nn.interp_method.tf_bilinear, nn.interp_mode.half_pixel )
    # 构建预处理,参数为输入输出tensor的shape
    ai2d_builder = ai2d.build([1,3,OUT_RGB888P_HEIGH,OUT_RGB888P_WIDTH], [1,3,224,224])

    # 初始化并配置sensor
    sensor = Sensor()
    sensor.reset()
    # 设置镜像
    sensor.set_hmirror(False)
    # 设置翻转
    sensor.set_vflip(False)
    # 通道0直接给到显示VO，格式为YUV420
    sensor.set_framesize(width = DISPLAY_WIDTH, height = DISPLAY_HEIGHT)
    sensor.set_pixformat(PIXEL_FORMAT_YUV_SEMIPLANAR_420)
    # 通道2给到AI做算法处理，格式为RGB888
    sensor.set_framesize(width = OUT_RGB888P_WIDTH , height = OUT_RGB888P_HEIGH, chn=CAM_CHN_ID_2)
    sensor.set_pixformat(PIXEL_FORMAT_RGB_888_PLANAR, chn=CAM_CHN_ID_2)
	# 绑定通道0的输出到vo
    sensor_bind_info = sensor.bind_info(x = 0, y = 0, chn = CAM_CHN_ID_0)
    Display.bind_layer(**sensor_bind_info, layer = Display.LAYER_VIDEO1)
    # 设置为LT9611显示，默认1920x1080
    Display.init(Display.LT9611, to_ide = True)

    try:
        # media初始化
        MediaManager.init()
        # 启动sensor
        sensor.run()
        rgb888p_img = None
        while  True:
            #捕获摄像头数据
            rgb888p_img = sensor.snapshot(chn=CAM_CHN_ID_2)
            # for rgb888planar
            if rgb888p_img.format() == image.RGBP888:
                # image转numpy.ndarray
                ai2d_input = rgb888p_img.to_numpy_ref()
                # 从numpy.ndarray创建tensor
                ai2d_input_tensor = nn.from_numpy(ai2d_input)
                # 初始化预处理输出
                data = np.ones((1,3,224,224),dtype=np.uint8)
                # numpy.ndarray转tensor
                ai2d_out = nn.from_numpy(data)
                # 执行预处理
                ai2d_builder.run(ai2d_input_tensor, ai2d_out)
                # tensor转numpy.ndarray
                ai2d_out_np=ai2d_out.to_numpy()
                # 打印预处理形状
                print(ai2d_out_np.shape)
    except Exception as e:
        print(f"An error occurred during running: {e}")
    finally:
        os.exitpoint(os.EXITPOINT_ENABLE_SLEEP)
        #停止摄像头输出
        sensor.stop()
        #去初始化显示设备
        Display.deinit()
        #释放媒体缓冲区
        MediaManager.deinit()
        gc.collect()
        time.sleep(1)
        nn.shrink_memory_pool()
    print("cls_test end")
    return 0

cls_test()
```



**注**：对于该分类模型来说，需要先拿到原图，再将原图resize到（224,224）大小，之后再喂给模型；对于micropython开发，resize可以使用ai2d模块实现。

我们也可以将喂给AI的摄像头数据分辨率直接设置为（224,224），代码如下：

```
import os
from media.sensor import * #导入camera模块，使用camera相关接口
from media.display import * #导入display模块，使用display相关接口
from media.media import * #导入media模块，使用meida相关接口
from time import *
import time
import nncase_runtime as nn #导入nn模块，使用nn相关接口
import ulab.numpy as np #导入np模块，使用np相关接口
import gc

DISPLAY_WIDTH = ALIGN_UP(1920, 16)
DISPLAY_HEIGHT = 1080

OUT_RGB888P_WIDTH = ALIGN_UP(224, 16)
OUT_RGB888P_HEIGH = 224

def cls_test():
    print("cls_test start")
    # 初始化并配置sensor
    sensor = Sensor()
    sensor.reset()
    # 设置镜像
    sensor.set_hmirror(False)
    # 设置翻转
    sensor.set_vflip(False)
    # 通道0直接给到显示VO，格式为YUV420
    sensor.set_framesize(width = DISPLAY_WIDTH, height = DISPLAY_HEIGHT)
    sensor.set_pixformat(PIXEL_FORMAT_YUV_SEMIPLANAR_420)
    # 通道2给到AI做算法处理，格式为RGB888
    sensor.set_framesize(width = OUT_RGB888P_WIDTH , height = OUT_RGB888P_HEIGH, chn=CAM_CHN_ID_2)
    sensor.set_pixformat(PIXEL_FORMAT_RGB_888_PLANAR, chn=CAM_CHN_ID_2)
	# 绑定通道0的输出到vo
    sensor_bind_info = sensor.bind_info(x = 0, y = 0, chn = CAM_CHN_ID_0)
    Display.bind_layer(**sensor_bind_info, layer = Display.LAYER_VIDEO1)
    # 设置为LT9611显示，默认1920x1080
    Display.init(Display.LT9611, to_ide = True)

    try:
        # media初始化
        MediaManager.init()
        # 启动sensor
        sensor.run()
        rgb888p_img = None
        while  True:
            #捕获摄像头数据
            rgb888p_img = sensor.snapshot(chn=CAM_CHN_ID_2)
            # for rgb888planar
            if rgb888p_img.format() == image.RGBP888:
                input_img=rgb888p_img.to_numpy_ref()
                # 打印形状
                print(input_img.shape)
    except Exception as e:
        print(f"An error occurred during running: {e}")
    finally:
        os.exitpoint(os.EXITPOINT_ENABLE_SLEEP)
        #停止摄像头输出
        sensor.stop()
        #去初始化显示设备
        Display.deinit()
        #释放媒体缓冲区
        MediaManager.deinit()
        gc.collect()
        time.sleep(1)
        nn.shrink_memory_pool()
    print("cls_test end")
    return 0

cls_test()
```



### 5.2.3 模型推理

```
import os
from media.sensor import * #导入camera模块，使用camera相关接口
from media.display import * #导入display模块，使用display相关接口
from media.media import * #导入media模块，使用meida相关接口
from time import *
import time
import nncase_runtime as nn #导入nn模块，使用nn相关接口
import ulab.numpy as np #导入np模块，使用np相关接口
import gc

# 显示输出大小
DISPLAY_WIDTH = ALIGN_UP(1920, 16)
DISPLAY_HEIGHT = 1080
# AI获取的RGB888P的图像大小
OUT_RGB888P_WIDTH = ALIGN_UP(1280, 16)
OUT_RGB888P_HEIGH = 720

kmodel_path="/sdcard/app/tests/ai_test_kmodel/veg_cls.kmodel"

def cls_test():
    print("cls_test start")
    #初始化AI2D
    ai2d = nn.ai2d()
    # 设置ai2d的输入输出数据格式和数据类型
    ai2d.set_dtype(nn.ai2d_format.NCHW_FMT,nn.ai2d_format.NCHW_FMT,np.uint8, np.uint8)
    # 设置resize预处理
    ai2d.set_resize_param(True, nn.interp_method.tf_bilinear, nn.interp_mode.half_pixel )
    # 构建预处理,参数为输入输出tensor的shape
    ai2d_builder = ai2d.build([1,3,OUT_RGB888P_HEIGH,OUT_RGB888P_WIDTH], [1,3,224,224])
    # 初始化kpu
    kpu=nn.kpu()
    # 加载模型
    kpu.load_kmodel(kmodel_path)
    
    # 初始化并配置sensor
    sensor = Sensor()
    sensor.reset()
    # 设置镜像
    sensor.set_hmirror(False)
    # 设置翻转
    sensor.set_vflip(False)
    # 通道0直接给到显示VO，格式为YUV420
    sensor.set_framesize(width = DISPLAY_WIDTH, height = DISPLAY_HEIGHT)
    sensor.set_pixformat(PIXEL_FORMAT_YUV_SEMIPLANAR_420)
    # 通道2给到AI做算法处理，格式为RGB888
    sensor.set_framesize(width = OUT_RGB888P_WIDTH , height = OUT_RGB888P_HEIGH, chn=CAM_CHN_ID_2)
    sensor.set_pixformat(PIXEL_FORMAT_RGB_888_PLANAR, chn=CAM_CHN_ID_2)
	# 绑定通道0的输出到vo
    sensor_bind_info = sensor.bind_info(x = 0, y = 0, chn = CAM_CHN_ID_0)
    Display.bind_layer(**sensor_bind_info, layer = Display.LAYER_VIDEO1)
    # 设置为LT9611显示，默认1920x1080
    Display.init(Display.LT9611, to_ide = True)

    try:
        # media初始化
        MediaManager.init()
        # 启动sensor
        sensor.run()
        rgb888p_img = None
        
        # 初始化预处理输出
        data = np.ones((1,3,224,224),dtype=np.uint8)
        # numpy.ndarray转tensor
        ai2d_out = nn.from_numpy(data)
        # 将ai2d预处理的输出绑定到kmodel的输入上，即ai2d预处理输出和kpu的输出共用一个tensor
        kpu.set_input_tensor(0,ai2d_out)
        while  True:
            #捕获摄像头数据
            rgb888p_img = sensor.snapshot(chn=CAM_CHN_ID_2)
            # for rgb888planar
            if rgb888p_img.format() == image.RGBP888:
                # image转numpy.ndarray
                ai2d_input = rgb888p_img.to_numpy_ref()
                # 从numpy.ndarray创建tensor
                ai2d_input_tensor = nn.from_numpy(ai2d_input)
                # 执行预处理
                ai2d_builder.run(ai2d_input_tensor, ai2d_out)
                # kpu推理
                kpu.run()
                
                # 获取kmodel的推理输出tensor,输出可能为多个，因此返回的是一个列表
                results=[]
                for i in range(kpu.outputs_size()):
                    # 获取kmodel的第i个输出
                    output_data = kpu.get_output_tensor(i)
                    # tensor转numpy.ndarray
                    result = output_data.to_numpy()
                    # 打印形状
                    print(result.shape)
                    # 加入列表
                    results.append(result)
                    del output_data
                
    except Exception as e:
        print(f"An error occurred during running: {e}")
    finally:
        os.exitpoint(os.EXITPOINT_ENABLE_SLEEP)
        del ai2d_input_tensor
        del ai2d_out
        #停止摄像头输出
        sensor.stop()
        #去初始化显示设备
        Display.deinit()
        #释放媒体缓冲区
        MediaManager.deinit()
        gc.collect()
        time.sleep(1)
        nn.shrink_memory_pool()
    print("cls_test end")
    return 0

cls_test()
```



注意：对于tensor类型的数据，申请后请手动释放。

### 5.2.4 后处理

对模型结果进行后处理，这里以分类为例，即对输出先做softmax再做argmax得到类别索引。

```
import os
from media.sensor import * #导入camera模块，使用camera相关接口
from media.display import * #导入display模块，使用display相关接口
from media.media import * #导入media模块，使用meida相关接口
from time import *
import time
import nncase_runtime as nn #导入nn模块，使用nn相关接口
import ulab.numpy as np #导入np模块，使用np相关接口
import gc

# 显示输出大小
DISPLAY_WIDTH = ALIGN_UP(1920, 16)
DISPLAY_HEIGHT = 1080
# AI获取的RGB888P的图像大小
OUT_RGB888P_WIDTH = ALIGN_UP(1280, 16)
OUT_RGB888P_HEIGH = 720

kmodel_path="/sdcard/app/tests/ai_test_kmodel/veg_cls.kmodel"

# softmax函数
def softmax(x):
    exp_x = np.exp(x - np.max(x))
    return exp_x / np.sum(exp_x)

def cls_test():
    print("cls_test start")
    #初始化AI2D
    ai2d = nn.ai2d()
    # 设置ai2d的输入输出数据格式和数据类型
    ai2d.set_dtype(nn.ai2d_format.NCHW_FMT,nn.ai2d_format.NCHW_FMT,np.uint8, np.uint8)
    # 设置resize预处理
    ai2d.set_resize_param(True, nn.interp_method.tf_bilinear, nn.interp_mode.half_pixel )
    # 构建预处理,参数为输入输出tensor的shape
    ai2d_builder = ai2d.build([1,3,OUT_RGB888P_HEIGH,OUT_RGB888P_WIDTH], [1,3,224,224])
    # 初始化kpu
    kpu=nn.kpu()
    # 加载模型
    kpu.load_kmodel(kmodel_path)
    
    # 初始化并配置sensor
    sensor = Sensor()
    sensor.reset()
    # 设置镜像
    sensor.set_hmirror(False)
    # 设置翻转
    sensor.set_vflip(False)
    # 通道0直接给到显示VO，格式为YUV420
    sensor.set_framesize(width = DISPLAY_WIDTH, height = DISPLAY_HEIGHT)
    sensor.set_pixformat(PIXEL_FORMAT_YUV_SEMIPLANAR_420)
    # 通道2给到AI做算法处理，格式为RGB888
    sensor.set_framesize(width = OUT_RGB888P_WIDTH , height = OUT_RGB888P_HEIGH, chn=CAM_CHN_ID_2)
    sensor.set_pixformat(PIXEL_FORMAT_RGB_888_PLANAR, chn=CAM_CHN_ID_2)
	# 绑定通道0的输出到vo
    sensor_bind_info = sensor.bind_info(x = 0, y = 0, chn = CAM_CHN_ID_0)
    Display.bind_layer(**sensor_bind_info, layer = Display.LAYER_VIDEO1)
    # 设置为LT9611显示，默认1920x1080
    Display.init(Display.LT9611, to_ide = True)

    try:
        # media初始化
        MediaManager.init()
        # 启动sensor
        sensor.run()
        rgb888p_img = None
        
        # 初始化预处理输出
        data = np.ones((1,3,224,224),dtype=np.uint8)
        # numpy.ndarray转tensor
        ai2d_out = nn.from_numpy(data)
        # 将ai2d预处理的输出绑定到kmodel的输入上，即ai2d预处理输出和kpu的输出共用一个tensor
        kpu.set_input_tensor(0,ai2d_out)
        while  True:
            #捕获摄像头数据
            rgb888p_img = sensor.snapshot(chn=CAM_CHN_ID_2)
            # for rgb888planar
            if rgb888p_img.format() == image.RGBP888:
                # image转numpy.ndarray
                ai2d_input = rgb888p_img.to_numpy_ref()
                # 从numpy.ndarray创建tensor
                ai2d_input_tensor = nn.from_numpy(ai2d_input)
                # 执行预处理
                ai2d_builder.run(ai2d_input_tensor, ai2d_out)
                # kpu推理
                kpu.run()
                
                # 获取kmodel的推理输出tensor,输出可能为多个，因此返回的是一个列表
                results=[]
                for i in range(kpu.outputs_size()):
                    # 获取kmodel的第i个输出
                    output_data = kpu.get_output_tensor(i)
                    # tensor转numpy.ndarray
                    result = output_data.to_numpy()
                    # 加入列表
                    results.append(result)
                    del output_data
                #******************后处理********************
                # softmax+argmax
                softmax_res=softmax(results[0][0])
                res_idx=np.argmax(softmax_res)
                # 打印类别索引
                print(res_idx)
    except Exception as e:
        print(f"An error occurred during running: {e}")
    finally:
        os.exitpoint(os.EXITPOINT_ENABLE_SLEEP)
        del ai2d_input_tensor
        del ai2d_out
        #停止摄像头输出
        sensor.stop()
        #去初始化显示设备
        Display.deinit()
        #释放媒体缓冲区
        MediaManager.deinit()
        gc.collect()
        time.sleep(1)
        nn.shrink_memory_pool()
    print("cls_test end")
    return 0

cls_test()
```



### 5.2.5 显示

显示（视频输出，VO）与display相关，本小节简要介绍基于Micropython的显示设置、资源释放、显示叠加的整体流程。

- 显示设置：设置显示大小，格式
- 显示叠加：显示由2个图层构成，其中下边的图层（原图图层）直接显示摄像头输出，上边的图层（osd图层）用于画框、画点，写文字等。
- 资源释放：释放显示相关资源

**显示示例**：

```
import os
from media.sensor import * #导入camera模块，使用camera相关接口
from media.display import * #导入display模块，使用display相关接口
from media.media import * #导入media模块，使用meida相关接口
from time import *
import time
import nncase_runtime as nn #导入nn模块，使用nn相关接口
import ulab.numpy as np #导入np模块，使用np相关接口
import gc

# 显示输出大小
DISPLAY_WIDTH = ALIGN_UP(1920, 16)
DISPLAY_HEIGHT = 1080
# AI获取的RGB888P的图像大小
OUT_RGB888P_WIDTH = ALIGN_UP(1280, 16)
OUT_RGB888P_HEIGH = 720

kmodel_path="/sdcard/app/tests/ai_test_kmodel/veg_cls.kmodel"
labels=["菠菜","长茄子","红苋菜","胡萝卜","西红柿","西蓝花"]

# softmax函数
def softmax(x):
    exp_x = np.exp(x - np.max(x))
    return exp_x / np.sum(exp_x)


def cls_test():
    print("cls_test start")
    #初始化AI2D
    ai2d = nn.ai2d()
    # 设置ai2d的输入输出数据格式和数据类型
    ai2d.set_dtype(nn.ai2d_format.NCHW_FMT,nn.ai2d_format.NCHW_FMT,np.uint8, np.uint8)
    # 设置resize预处理
    ai2d.set_resize_param(True, nn.interp_method.tf_bilinear, nn.interp_mode.half_pixel )
    # 构建预处理,参数为输入输出tensor的shape
    ai2d_builder = ai2d.build([1,3,OUT_RGB888P_HEIGH,OUT_RGB888P_WIDTH], [1,3,224,224])
    # 初始化kpu
    kpu=nn.kpu()
    # 加载模型
    kpu.load_kmodel(kmodel_path)
    
    # 初始化并配置sensor
    sensor = Sensor()
    sensor.reset()
    # 设置镜像
    sensor.set_hmirror(False)
    # 设置翻转
    sensor.set_vflip(False)
    # 通道0直接给到显示VO，格式为YUV420
    sensor.set_framesize(width = DISPLAY_WIDTH, height = DISPLAY_HEIGHT)
    sensor.set_pixformat(PIXEL_FORMAT_YUV_SEMIPLANAR_420)
    # 通道2给到AI做算法处理，格式为RGB888
    sensor.set_framesize(width = OUT_RGB888P_WIDTH , height = OUT_RGB888P_HEIGH, chn=CAM_CHN_ID_2)
    sensor.set_pixformat(PIXEL_FORMAT_RGB_888_PLANAR, chn=CAM_CHN_ID_2)
	# 绑定通道0的输出到vo
    sensor_bind_info = sensor.bind_info(x = 0, y = 0, chn = CAM_CHN_ID_0)
    Display.bind_layer(**sensor_bind_info, layer = Display.LAYER_VIDEO1)
    # 设置为LT9611显示，默认1920x1080
    Display.init(Display.LT9611, to_ide = True)
    
    #创建OSD图像
    osd_img = image.Image(DISPLAY_WIDTH, DISPLAY_HEIGHT, image.ARGB8888)

    try:
        # media初始化
        MediaManager.init()
        # 启动sensor
        sensor.run()
        rgb888p_img = None
        
        # 初始化预处理输出
        data = np.ones((1,3,224,224),dtype=np.uint8)
        # numpy.ndarray转tensor
        ai2d_out = nn.from_numpy(data)
        # 将ai2d预处理的输出绑定到kmodel的输入上，即ai2d预处理输出和kpu的输出共用一个tensor
        kpu.set_input_tensor(0,ai2d_out)
        while  True:
            #捕获摄像头数据
            rgb888p_img = sensor.snapshot(chn=CAM_CHN_ID_2)
            # for rgb888planar
            if rgb888p_img.format() == image.RGBP888:
                #*************************预处理***********************
                # image转numpy.ndarray
                ai2d_input = rgb888p_img.to_numpy_ref()
                # 从numpy.ndarray创建tensor
                ai2d_input_tensor = nn.from_numpy(ai2d_input)
                # 执行预处理
                ai2d_builder.run(ai2d_input_tensor, ai2d_out)
                #************************模型推理**********************
                # kpu推理
                kpu.run()
                
                # 获取kmodel的推理输出tensor,输出可能为多个，因此返回的是一个列表
                results=[]
                for i in range(kpu.outputs_size()):
                    # 获取kmodel的第i个输出
                    output_data = kpu.get_output_tensor(i)
                    # tensor转numpy.ndarray
                    result = output_data.to_numpy()
                    # 加入列表
                    results.append(result)
                    del output_data
                #******************后处理********************
                # softmax+argmax
                softmax_res=softmax(results[0][0])
                res_idx=np.argmax(softmax_res)
                #******************显示*********************
                # 类别名称
                label=labels[res_idx]
                # 类别分数
                score=softmax_res[res_idx]
                # 绘制文字
                text=label+" "+str(score)
                # 清理osd_img
                osd_img.clear()
                # 调用draw_string_advanced()在(5,5)位置，绘制text，文字大小为32，颜色为(0,255,0)
                osd_img.draw_string_advanced(5,5,32,text,color=(0,255,0))
                Display.show_image(osd_img, 0, 0, Display.LAYER_OSD3)
    except Exception as e:
        print(f"An error occurred during running: {e}")
    finally:
        os.exitpoint(os.EXITPOINT_ENABLE_SLEEP)
        del ai2d_input_tensor
        del ai2d_out
        del kpu
        #停止摄像头输出
        sensor.stop()
        #去初始化显示设备
        Display.deinit()
        #释放媒体缓冲区
        MediaManager.deinit()
        gc.collect()
        time.sleep(1)
        nn.shrink_memory_pool()
    print("cls_test end")
    return 0

cls_test()
```



### 5.2.6 资源释放

大核内存包括两个部分，一个是系统内存，一个是 GC 内存，前者主要用来给模型还有系统内的一些功能使用，包括摄像头和屏幕的缓冲区、kmodel及其输入输出都来自这里（mmz，用del释放）；后者是解析器层面申请的内存，可以给代码的变量使用（用gc.collect()释放）。

**1. gc资源释放**：

```
#classification.py
import gc
import os
 
def func_a():
    a = []
    for i in range(10000):
        a.append(i)
 
func_a()
print(gc.mem_free() / 1024 / 1024) #stack mem
print(gc.mem_alloc() / 1024 / 1024)
gc.collect()
print(gc.mem_alloc() / 1024 / 1024)
```



**2.系统内存释放**：

kmodel模块部分，kmodel的input_tensor、output_tensor，及其本身都是mmz申请的内存，需要手动释放

```
del ai2d_input_tensor
del ai2d_out
del kpu
nn.shrink_memory_pool()       #以免漏掉某个del,遍历所有kmodel相关内存，并释放
```



摄像头、显示及其media缓冲区释放：

```
#停止摄像头输出
sensor.stop()
#去初始化显示设备
Display.deinit()
#释放媒体缓冲区
MediaManager.deinit()
```



### 5.2.7 完整代码

这里给出完整代码，请参考上述每一步代码之间的变化。对于AI开发的步骤我们进行了封装，相关类在/sdcard/app/libs下面，开发步骤请参考：[AI Demo说明文档 — K230 CanMV 文档 (canaan-creative.com)](https://developer.canaan-creative.com/k230_canmv/main/zh/example/AI_Demo说明文档.html)

```
import os
from media.sensor import * #导入camera模块，使用camera相关接口
from media.display import * #导入display模块，使用display相关接口
from media.media import * #导入media模块，使用meida相关接口
from time import *
import time
import nncase_runtime as nn #导入nn模块，使用nn相关接口
import ulab.numpy as np #导入np模块，使用np相关接口
import gc

# 显示输出大小
DISPLAY_WIDTH = ALIGN_UP(1920, 16)
DISPLAY_HEIGHT = 1080
# AI获取的RGB888P的图像大小
OUT_RGB888P_WIDTH = ALIGN_UP(1280, 16)
OUT_RGB888P_HEIGH = 720

kmodel_path="/sdcard/app/tests/ai_test_kmodel/veg_cls.kmodel"
labels=["菠菜","长茄子","红苋菜","胡萝卜","西红柿","西蓝花"]

# softmax函数
def softmax(x):
    exp_x = np.exp(x - np.max(x))
    return exp_x / np.sum(exp_x)


def cls_test():
    print("cls_test start")
    #初始化AI2D
    ai2d = nn.ai2d()
    # 设置ai2d的输入输出数据格式和数据类型
    ai2d.set_dtype(nn.ai2d_format.NCHW_FMT,nn.ai2d_format.NCHW_FMT,np.uint8, np.uint8)
    # 设置resize预处理
    ai2d.set_resize_param(True, nn.interp_method.tf_bilinear, nn.interp_mode.half_pixel )
    # 构建预处理,参数为输入输出tensor的shape
    ai2d_builder = ai2d.build([1,3,OUT_RGB888P_HEIGH,OUT_RGB888P_WIDTH], [1,3,224,224])
    # 初始化kpu
    kpu=nn.kpu()
    # 加载模型
    kpu.load_kmodel(kmodel_path)
    
    # 初始化并配置sensor
    sensor = Sensor()
    sensor.reset()
    # 设置镜像
    sensor.set_hmirror(False)
    # 设置翻转
    sensor.set_vflip(False)
    # 通道0直接给到显示VO，格式为YUV420
    sensor.set_framesize(width = DISPLAY_WIDTH, height = DISPLAY_HEIGHT)
    sensor.set_pixformat(PIXEL_FORMAT_YUV_SEMIPLANAR_420)
    # 通道2给到AI做算法处理，格式为RGB888
    sensor.set_framesize(width = OUT_RGB888P_WIDTH , height = OUT_RGB888P_HEIGH, chn=CAM_CHN_ID_2)
    sensor.set_pixformat(PIXEL_FORMAT_RGB_888_PLANAR, chn=CAM_CHN_ID_2)
	# 绑定通道0的输出到vo
    sensor_bind_info = sensor.bind_info(x = 0, y = 0, chn = CAM_CHN_ID_0)
    Display.bind_layer(**sensor_bind_info, layer = Display.LAYER_VIDEO1)
    # 设置为LT9611显示，默认1920x1080
    Display.init(Display.LT9611, to_ide = True)
    
    #创建OSD图像
    osd_img = image.Image(DISPLAY_WIDTH, DISPLAY_HEIGHT, image.ARGB8888)

    try:
        # media初始化
        MediaManager.init()
        # 启动sensor
        sensor.run()
        rgb888p_img = None
        
        # 初始化预处理输出
        data = np.ones((1,3,224,224),dtype=np.uint8)
        # numpy.ndarray转tensor
        ai2d_out = nn.from_numpy(data)
        # 将ai2d预处理的输出绑定到kmodel的输入上，即ai2d预处理输出和kpu的输出共用一个tensor
        kpu.set_input_tensor(0,ai2d_out)
        while  True:
            #捕获摄像头数据
            rgb888p_img = sensor.snapshot(chn=CAM_CHN_ID_2)
            # for rgb888planar
            if rgb888p_img.format() == image.RGBP888:
                #*************************预处理***********************
                # image转numpy.ndarray
                ai2d_input = rgb888p_img.to_numpy_ref()
                # 从numpy.ndarray创建tensor
                ai2d_input_tensor = nn.from_numpy(ai2d_input)
                # 执行预处理
                ai2d_builder.run(ai2d_input_tensor, ai2d_out)
                #************************模型推理**********************
                # kpu推理
                kpu.run()
                
                # 获取kmodel的推理输出tensor,输出可能为多个，因此返回的是一个列表
                results=[]
                for i in range(kpu.outputs_size()):
                    # 获取kmodel的第i个输出
                    output_data = kpu.get_output_tensor(i)
                    # tensor转numpy.ndarray
                    result = output_data.to_numpy()
                    # 加入列表
                    results.append(result)
                    del output_data
                #******************后处理********************
                # softmax+argmax
                softmax_res=softmax(results[0][0])
                res_idx=np.argmax(softmax_res)
                #******************显示*********************
                # 类别名称
                label=labels[res_idx]
                # 类别分数
                score=softmax_res[res_idx]
                # 绘制文字
                text=label+" "+str(score)
                # 清理osd_img
                osd_img.clear()
                # 调用draw_string_advanced()在(5,5)位置，绘制text，文字大小为32，颜色为(0,255,0)
                osd_img.draw_string_advanced(5,5,32,text,color=(0,255,0))
                Display.show_image(osd_img, 0, 0, Display.LAYER_OSD3)
    except Exception as e:
        print(f"An error occurred during running: {e}")
    finally:
        os.exitpoint(os.EXITPOINT_ENABLE_SLEEP)
        del ai2d_input_tensor
        del ai2d_out
        #停止摄像头输出
        sensor.stop()
        #去初始化显示设备
        Display.deinit()
        #释放媒体缓冲区
        MediaManager.deinit()
        gc.collect()
        time.sleep(1)
    print("cls_test end")
    return 0

cls_test()
```