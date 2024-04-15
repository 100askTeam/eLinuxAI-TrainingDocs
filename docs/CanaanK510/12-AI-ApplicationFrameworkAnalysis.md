---
sidebar_position: 5
---
# AI应用程序框架解析

### 12.1 AI应用程序数据流框图

![image-20231012155117172](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012155117172.png)

### 12.2 阅读端侧推理模型示例

打开nncase开发文档网址：https://canaan-docs.100ask.net/Application/AIApplicationDevelopment-Canaan/05-nncase_Developer_Guides.html

![image-20231012155157720](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012155157720.png)

### 12.3 YOLOV5目标检测程序框架解析

![image-20231012155222724](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012155222724.png)

**注意：**

​    1.AI工作只作画框和绘制预测类别作用。

​    2.显示工作只作显示屏上显示工作。

### 12.4 YOLOV5目标检测程序解析-AI工作

**1.创建类**

```c++
// 创建一个目标检测类 
objectDetect od(obj_thresh, nms_thresh, net_len, {valid_width, valid_height});
```

目标检测类属于Simulator类, 用于在PC上推理kmodel

> 目的：创建这个类，用于准备内存、加载模型，设置模型的输入输出、模型的推理、后处理等功能。在这个类的public中定义功能函数。

下面为目标检测部分定义截图：

```c++
// 目标检测类定义（部分）
class objectDetect
{
public:
    objectDetect(float obj_thresh, float nms_thresh, int net_len, Framesize frame_size);
    void prepare_memory();
    void set_input(uint32_t index);
    void set_output();
    void load_model(char *path);
    void run();
    void get_output();
    void post_process(std::vector<BoxInfo> &result);
    ~objectDetect();
```

**2.加载模型**

```c++
od.load_model(kmodel_path);  // load kmodel（加载模型）
```

函数定义：

```c++
void objectDetect::load_model(char *path)
{
    od_model = read_binary_file<unsigned char>(path); // 读取传入的地址中的模型文件
    interp_od.load_model({ (const gsl::byte *)od_model.data(), od_model.size() }).expect("cannot load model.");
    std::cout << "============> interp_od.load_model finished!" << std::endl;
}
```

**3.准备内存**

```c++
Od.prepare_memory(); // memory allocation（准备内存）
```

截取代码prepare_memory定义中的重要片段。

```c++
virtual_addr_output = (char *)mmap(NULL, allocAlignMemOdOutput.size, PROT_READ | PROT_WRITE, MAP_SHARED, mem_map, allocAlignMemOdOutput.phyAddr);

virtual_addr_input[i] = (char *)mmap(NULL, allocAlignMemOdInput[i].size, PROT_READ | PROT_WRITE, MAP_SHARED, mem_map, allocAlignMemOdInput[i].phyAddr);
```

代码理解：内核申请一块共享内存供应用程序使用，这块内存的地址称为虚拟地址。外部应用想使用这块内存仅需要去调用这块虚拟内存即可。虚拟地址virtual_addr_input中包含了指向共享内存的指针。

![image-20231012155506083](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012155506083.png)

**4.VideoCapture获得摄像头数据**

```c++
mtx.lock(); //获得锁（获得独占式资源的能力）
cv::VideoCapture capture; //使用OpenCV创建一个capture类，用于调用摄像头
capture.open(5);//打开/dev/video5节点
// video setting
capture.set(cv::CAP_PROP_CONVERT_RGB, 0); //不将捕获的图像转换为RGB
capture.set(cv::CAP_PROP_FRAME_WIDTH, net_len); //设置捕获视频宽为模型宽
capture.set(cv::CAP_PROP_FRAME_HEIGHT, net_len); //设置捕获视频高为模型高
// RRRRRR....GGGGGGG....BBBBBB, CHW
capture.set(cv::CAP_PROP_FOURCC, V4L2_PIX_FMT_RGB24); //获取原来的格式，将原来的格式转换为RGB24图像
mtx.unlock(); //释放锁

cv::Mat rgb24_img_for_ai(net_len, net_len, CV_8UC3, od.virtual_addr_input[0] + (net_len - valid_width) / 2 + (net_len - valid_height) / 2 * net_len);//创建Mat数据类型，用于存储图像数据，存放位置位于虚拟地址（共享内存）中
ret = capture.read(rgb24_img_for_ai); //读取视频图像，并将图像数据存放在共享内存中
```

![image-20231012155528834](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012155528834.png)

**5.寻找3通道地址**

```c++
//padding
uint8_t *r_addr, *g_addr, *b_addr;
g_addr = (uint8_t *)od.virtual_addr_input[0] + offset_channel;
r_addr = is_rgb ? g_addr - offset_channel : g_addr + offset_channel;
b_addr = is_rgb ? g_addr + offset_channel : g_addr - offset_channel;
```

od.virtual_addr_input[0]为图像数据的首地址，那么RGB图像或BGR图像，就可知道3通道中的中间通道G的地址

![image-20231012155551482](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012155551482.png)

知道3通道BGR中的中间通道G的地址后，求剩下两通道的地址，下面为求解rgb三通道的各个地址。

![image-20231012155603431](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012155603431.png)

**6.填充图像**

```c++
//gnne_input_width：模型宽度 320 gnne_valid_width：视频输入宽度 240
if (gnne_valid_width < gnne_input_width) {	
    uint32_t padding_r = (gnne_input_width - gnne_valid_width); //计算总共需要填充的大小
    uint32_t padding_l = padding_r / 2; //计算左边需要填充的大小
    uint32_t row_offset = (gnne_input_height - gnne_valid_height) / 2; //计算下一个需要填充的偏移值
    padding_r -= padding_l; //计算右边需要填充的大小
    for (int row = row_offset; row < row_offset + gnne_valid_height/*30+240*/; row++) {
      uint32_t offset_l = row * gnne_input_width; //计算下一个左边需要填充的偏移值
      uint32_t offset_r = offset_l + gnne_valid_width + padding_l; //计算下一个右边需要填充的偏移值
      memset(r_addr + offset_l, PADDING_R, padding_l); //填充左边R通道，填充值为114（灰度值），填充范围
      memset(g_addr + offset_l, PADDING_G, padding_l); //填充左边G通道，填充值为114（灰度值），填充范围
      memset(b_addr + offset_l, PADDING_B, padding_l); //填充左边B通道，填充值为114（灰度值），填充范围
      memset(r_addr + offset_r, PADDING_R, padding_r); //填充右边R通道，填充值为114（灰度值），填充范围
      memset(g_addr + offset_r, PADDING_G, padding_r); //填充右边G通道，填充值为114（灰度值），填充范围
      memset(b_addr + offset_r, PADDING_B, padding_r); //填充右边B通道，填充值为114（灰度值），填充范围
       }
}

```

![image-20231012155715278](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012155715278.png)

实际图像如下所所示：

![image-20231012155732820](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012155732820.png)

**7.设置输入矩阵**

```c++
od.set_input(0); //设置输入矩阵
```

Object_detect程序中set_input定义：

```c++
void objectDetect::set_input(uint32_t index)
{
   auto in_shape = interp_od.input_shape(0); //设置输入矩阵的shape   auto input_tensor = host_runtime_tensor::create(dt_uint8, //设置数据类型
       in_shape, //设置tensor的形状
	//设置用户态数据（存放输入数据）
       { (gsl::byte *)virtual_addr_input[index], net_len * net_len * INPUT_CHANNELS},        
	false, //是否拷贝 
       hrt::pool_shared, //内存池类型，使用的是共享内存池
       allocAlignMemOdInput[index].phyAddr).expect(“cannot create input tensor”); //共享内存的物理地址
    interp_od.input_tensor(0, input_tensor).expect(“cannot set input tensor”); //设置输入的矩阵
}

```

![image-20231012155815092](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012155815092.png)

**8.设置输出矩阵**

```c++
od.set_output();//设置输出矩阵
```

Object_detect程序中set_output定义：

```C++
void objectDetect::set_output()
{
    for (size_t i = 0; i < interp_od.outputs_size(); i++)
    {
       auto out_shape = interp_od.output_shape(i); //设置输出矩阵的shape
       auto output_tensor = host_runtime_tensor::create(dt_float32, //设置数据类型
           out_shape, //设置tensor的形状
           {(gsl::byte *)virtualAddrOdOutput[i], output_size[i]}, //设置用户态数据（存放输出数据）
           false, //是否拷贝 
           hrt::pool_shared, output_pa_addr[i]).expect(“cannot create output tensor”); //共享内存的物理地址
           interp_od.output_tensor(i, output_tensor).expect(“cannot set output tensor”); //设置输出的矩阵
    }
}
```

![image-20231012155858016](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012155858016.png)

**9.运行模型推理**

```
od.run(); //运行kmodel推理
```

Object_detect程序中run定义：

```
void objectDetect::run()
{
    interp_od.run().expect("error occurred in running model"); //运行kmodel推理
}
```

![image-20231012155938420](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012155938420.png)

**注意：**

在运行kmodel推理前，我们已经设置了输入矩阵和输出矩阵的存放地址，所以我们只需要访问存放地址，拷贝出来使用即可。

**10.获取推理结果**

```c++
od.get_output(); //获取推理后的输出结果
```

Object_detect程序中get_output定义：

```c++
void objectDetect::get_output()
{
    output_0 = reinterpret_cast<float *>(virtualAddrOdOutput[0]);
    output_1 = reinterpret_cast<float *>(virtualAddrOdOutput[1]);
    output_2 = reinterpret_cast<float *>(virtualAddrOdOutput[2]);
}
```

**提示：** reinterpret_cast用于进行各种不同类型的指针之间、不同类型的引用之间以及指针和能容纳指针的整数类型之间的转换。转换时，执行的是逐个比特复制的操作。

![image-20231012160048382](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012160048382.png)

**注意：**将输出矩阵拷贝到objectDetect类中的私有成员变量中

**11.后处理**

```c++
od.post_process(result); //后处理
```

Object_detect程序中get_output定义：

```c++
void objectDetect::post_process(std::vector<BoxInfo> &result)
{
    auto boxes0 = decode_infer(output_0, net_len, 8, classes_num, frame_size, anchors_0, obj_thresh);
    result.insert(result.begin(), boxes0.begin(), boxes0.end());
    auto boxes1 = decode_infer(output_1, net_len, 16, classes_num, frame_size, anchors_1, obj_thresh);
    result.insert(result.begin(), boxes1.begin(), boxes1.end());
    auto boxes2 = decode_infer(output_2, net_len, 32, classes_num, frame_size, anchors_2, obj_thresh);
    result.insert(result.begin(), boxes2.begin(), boxes2.end());
    nms(result, nms_thresh);
}
```

decode_infer函数：

进行后处理操作，将输出的tensor结果转换为坐标的格式存储在vector容器中。

![image-20231012160200499](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012160200499.png)

```c++
std::vector<BoxInfo> decode_infer(float *data, int net_size, int stride, int num_classes, Framesize frame_size, float anchors[][2], float threshold)
{
    // 计算比例和增益，用于缩放坐标
    float ratiow = (float)net_size / frame_size.width;
    float ratioh = (float)net_size / frame_size.height;
    float gain = ratiow < ratioh ? ratiow : ratioh;

    // 存储解码后的边界框
    std::vector<BoxInfo> result;

    // 计算网格大小
    int grid_size = net_size / stride;
    int one_rsize = num_classes + 5;  // 每个锚框有num_classes + 5个值

    // 遍历网格
    for (int shift_y = 0; shift_y < grid_size; shift_y++)
    {
        for (int shift_x = 0; shift_x < grid_size; shift_x++)
        {
            int loc = shift_x + shift_y * grid_size;

            // 遍历锚框
            for (int i = 0; i < 3; i++)
            {
                float *record = data + (loc * 3 + i) * one_rsize;
                float *cls_ptr = record + 5;

                // 遍历类别
                for (int cls = 0; cls < num_classes; cls++)
                {
                    float score = (cls_ptr[cls]) * (record[4]);

                    // 检查分数是否超过阈值
                    if (score > threshold)
                    {
                        // 解码边界框坐标
                        cx = ((record[0]) * 2.f - 0.5f + (float)shift_x) * (float)stride;
                        cy = ((record[1]) * 2.f - 0.5f + (float)shift_y) * (float)stride;
                        w = pow((record[2]) * 2.f, 2) * anchors[i][0];
                        h = pow((record[3]) * 2.f, 2) * anchors[i][1];
                        cx -= ((net_size - frame_size.width * gain) / 2);
                        cy -= ((net_size - frame_size.height * gain) / 2);
                        cx /= gain;
                        cy /= gain;
                        w /= gain;
                        h /= gain;

                        // 创建BoxInfo结构并将其添加到结果向量
                        BoxInfo box;
                        box.x1 = std::max(0, std::min(frame_size.width, int(cx - w / 2.f)));
                        box.y1 = std::max(0, std::min(frame_size.height, int(cy - h / 2.f)));
                        box.x2 = std::max(0, std::min(frame_size.width, int(cx + w / 2.f)));
                        box.y2 = std::max(0, std::min(frame_size.height, int(cy + h / 2.f)));
                        box.score = score;
                        box.label = cls;
                        result.push_back(box);
                    }
                }
            }
        }
    }

    // 返回解码后的边界框向量
    return result;
}
```

nms函数：

删除模型预测后冗余的预测框，保留最佳的结果。

![image-20231012160207101](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012160207101.png)

**12.类别名清理**

```C++
/****fixed operation for display clear****/
/****显示屏清理的固定操作****/
cv::Mat img_argb;
uint64_t index;
{
    buf_mgt_writer_get(&buf_mgt, (void **)&index); //获取DRM的写入数据的能力
    ScopedTiming st("display clear", enable_profile);
    struct drm_buffer *fbuf_argb = &drm_dev.drm_bufs_argb[index];
    img_argb = cv::Mat(screen_height, screen_width, CV_8UC4, (uint8_t *)fbuf_argb->map); //将图像输出至map

    for (uint32_t cc = 0; cc < points_to_clear[index].size(); cc++)
    {          
        cv::putText(img_argb, strs_to_clear[index][cc], points_to_clear[index][cc], cv::FONT_HERSHEY_COMPLEX, 1.5, cv::Scalar(0, 0, 0, 0), 1, 8, 0); //预测的类别名 清理为黑色
    }
}
```

如下图所示：将显示屏上的类别名称清理为黑色

![image-20231012160248794](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012160248794.png)

**13.绘制矩形框**

```c++
  for (auto r : result){
    if (obj_cnt < 32){
	struct vo_draw_frame frame; //创建画框和标注的图像
	frame.crtc_id = drm_dev.crtc_id; 
	frame.draw_en = 1; //是否绘制
	frame.frame_num = obj_cnt; //绘制个数
	int x1 = r.x2 * screen_width / valid_width;
	int x0 = r.x1 * screen_width / valid_width;
	int y0 = r.y1 * screen_height / valid_height;
	int y1 = r.y2 * screen_height / valid_height;
	x1 = std::max(0, std::min(x1, (int)screen_width)); //如果x1值超出屏幕宽度，则取屏幕宽度
	x0 = std::max(0, std::min(x0, (int)screen_width)); //如果x0值超出屏幕宽度，则取屏幕宽度
	y0 = std::max(0, std::min(y0, (int)screen_height)); //如果y0值超出屏幕宽度，则取屏幕高度
	y1 = std::max(0, std::min(y1, (int)screen_height)); //如果y1值超出屏幕宽度，则取屏幕高度
	frame.line_x_start = x0; //设置x轴的起点
	frame.line_x_end = x1; //设置x轴的终点
	frame.line_y_start = y0; //设置y轴的起点
	frame.line_y_end = y1; //设置y轴的终点	draw_frame(&frame); //绘制矩形框
	cv::Point origin;
	origin.x = (int)(r.x1 * screen_width / valid_width); //绘制展示标签值的x坐标
	origin.y = (int)(r.y1 * screen_height / valid_height + 10); //绘制展示标签值的y坐标
	//从result容器中获取标签值
	std::string text = od.labels[r.label] + “:” + std::to_string(round(r.score * 100) / 100.0).substr(0,4);
 	//在指定的坐标处绘制标签值
	cv::putText(img_argb, text, origin, cv::FONT_HERSHEY_COMPLEX, 1.5, cv::Scalar(0, 0, 255, 255), 1, 8, 0);
	points_to_clear[index].push_back(origin); //将坐标值加入清空容器中
	strs_to_clear[index].push_back(text); //将标签值加入清空容器中
```

绘制预测框和预测类别和预测概率，并将其输出至显示屏上。

![image-20231012160326697](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012160326697.png)

**14.屏幕清理和摄像头释放**

```c++
	/****显示屏清理的操作****/
for (uint32_t i = obj_cnt; i < 32; i++) {
                struct vo_draw_frame frame;
                frame.crtc_id = drm_dev.crtc_id;
                frame.draw_en = 0;
                frame.frame_num = i;
                draw_frame(&frame);
            }
        }
        frame_cnt += 1;
        buf_mgt_writer_put(&buf_mgt, (void *)index);
    }

    /****fixed operation for capture release and display clear****/
    /****固定摄像头捕获释放和显示清除的操作****/
    printf("%s ==========release \n", __func__);
    mtx.lock(); //获得锁
    capture.release(); // 释放摄像头资源
    mtx.unlock(); //释放锁
    for(uint32_t i = 0; i < 32; i++)
    {
        struct vo_draw_frame frame;
        frame.crtc_id = drm_dev.crtc_id;
        frame.draw_en = 0;
        frame.frame_num = i;
        draw_frame(&frame);
    }
}
```

![image-20231012160455292](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012160455292.png)

AI工作的流程图如下所示：

![image-20231012160526570](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012160526570.png)

### 12.5 YOLOV5目标检测程序解析- display_work

使用V4L2打开指定摄像头设备节点，并将调用DRM输出显示函数，将视频流buffer显示在显示屏上

```c++
    mtx.lock(); //获得锁
    vdev = v4l2_open(dev_info[0].video_name[1]); //使用v4l2打开指定摄像头设备节点
    if (vdev == NULL) {
        printf("error: unable to open video capture device %s\n",
            dev_info[0].video_name[1]);
        mtx.unlock();
        goto display_cleanup;
    }
    memset(&format, 0, sizeof format);
    format.pixelformat = dev_info[0].video_out_format[1] ? V4L2_PIX_FMT_NV12 : V4L2_PIX_FMT_NV16; //设置视频输出格式
    format.width = dev_info[0].video_width[1]; //设置视频宽度
    format.height = dev_info[0].video_height[1]; //设置视频高度
    ret = v4l2_set_format(vdev, &format); //设置帧格式
    if (ret < 0)
    {
        printf("%s:v4l2_set_format error\n",__func__);
        mtx.unlock();
        goto display_cleanup;
    }
    ret = v4l2_alloc_buffers(vdev, V4L2_MEMORY_USERPTR, DRM_BUFFERS_COUNT); //申请帧缓冲
    if (ret < 0)
    {
        printf("%s:v4l2_alloc_buffers error\n",__func__);
        mtx.unlock();
        goto display_cleanup;
    }
    FD_ZERO(&fds); //对内存中保存的文件句柄进行清理操作
    FD_SET(vdev->fd, &fds); //用来将一个给定的文件描述符加入集合之中
    for (i = 0; i < vdev->nbufs; ++i) {
        buffer.index = i;
        fbuf_yuv = &drm_dev.drm_bufs[buffer.index];
        buffer.mem = fbuf_yuv->map;
        buffer.size = fbuf_yuv->size;
        ret = v4l2_queue_buffer(vdev, &buffer); //buffer入队
        if (ret < 0) {
            printf("error: unable to queue buffer %u\n", i);
            mtx.unlock();
            goto display_cleanup;
        }   
    }
    ret = v4l2_stream_on(vdev); //开启视频流
    if (ret < 0) {
        printf("%s error: failed to start video stream: %s (%d)\n", __func__,
            strerror(-ret), ret);
        mtx.unlock();
        goto display_cleanup;
    }
    mtx.unlock();
    while(quit.load()) {
        struct timeval timeout;
        fd_set rfds;
        timeout.tv_sec = SELECT_TIMEOUT / 1000;
        timeout.tv_usec = (SELECT_TIMEOUT % 1000) * 1000;
        rfds = fds;
        ret = select(vdev->fd + 1, &rfds, NULL, NULL, &timeout); //定时器作用，判断是否获取视频超时
        if (ret < 0) {
            if (errno == EINTR)
                continue;
            printf("error: select failed with %d\n", errno);
            goto display_cleanup;
        }
        if (ret == 0) {
            printf("error: select timeout\n");
            goto display_cleanup;
        }
        process_ds0_image(vdev, format.width, format.height); //使用DRM框架将视频设备数据显示在显示屏上
    }
display_cleanup:
    mtx.lock(); //获得锁
    video_stop(vdev); //关闭视频流
    video_cleanup(vdev); //关闭内存映射相关的内存块和关闭视频设备
    mtx.unlock(); //释放锁
}
```

### 12.6 YOLOV5目标检测程序解析- DRM显示函数process_ds0_image

```c++
static int process_ds0_image(struct v4l2_device *vdev, unsigned int width, unsigned int height)
{
	// 声明一个结构体用于存储视频缓冲区信息
	struct v4l2_video_buffer buffer;
    int ret;
    // 声明静态结构体，用于存储上一帧的视频缓冲区信息
    static struct v4l2_video_buffer old_buffer;
    // 屏幕初始化标志，用于标识屏幕是否已初始化
    static int screen_init_flag = 0;
    mtx.lock(); //获得锁
    ret = v4l2_dequeue_buffer(vdev, &buffer); //把数据放回缓存队列（出队）,并获取到视频buf
    if (ret < 0) {
        printf("error: unable to dequeue buffer: %s (%d)\n",
            strerror(-ret), ret);
        mtx.unlock(); //释放锁
        return ret;
    }
    mtx.unlock(); //释放锁
    
    // 如果视频缓冲区存在错误，打印警告信息并跳过当前帧的处理
    if (buffer.error) {
        printf("warning: error in dequeued buffer, skipping\n");
        return 0;
    }
    fbuf_yuv = &drm_dev.drm_bufs[buffer.index]; // 获取当前帧的视频缓冲区信息
    
    // 如果屏幕已经初始化
    if (screen_init_flag) {
        if (drm_dev.req)
            drm_wait_vsync(); //等待显示屏空闲时间，等待完成后才可传入新数据
        uint64_t index;
        if (buf_mgt_display_get(&buf_mgt, (void **)&index) != 0) //获取DRM显示能力
            index = 0;
        
        //获取用于显示的另一个缓冲区的信息
        struct drm_buffer *fbuf_argb = &drm_dev.drm_bufs_argb[index];
        
        //设置平面显示
        if (drm_dmabuf_set_plane(fbuf_yuv, fbuf_argb)) //将视频buf传入DRM显示buf中
	{
            std::cerr << "Flush fail \n";
            return 1;
        }
    }
    // 如果屏幕已经初始化
    if(screen_init_flag) {
        fbuf_yuv = &drm_dev.drm_bufs[old_buffer.index]; // 获取上一帧的视频缓冲区信息
        old_buffer.mem = fbuf_yuv->map; // 更新上一帧的视频缓冲区信息到 old_buffer 结构体
        old_buffer.size = fbuf_yuv->size; //获取drm显示buf的大小
        //使用互斥锁确保线程安全性
        mtx.lock();
        ret = v4l2_queue_buffer(vdev, &old_buffer); //把数据从缓存中读取出来（入队）
        if (ret < 0) {
            printf("error: unable to requeue buffer: %s (%d)\n",
                strerror(-ret), ret);
            mtx.unlock();
            return ret;
        }
        mtx.unlock();
    }
    else {
        screen_init_flag = 1;
    }

old_buffer = buffer; //将buffer的数据赋值给旧buffer

return 0;
}
```

![image-20231012160852281](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012160852281.png)

注意：old_buffer是静态变量保存着上一个buffer



DRM显示流程为：

1.Buffer获取新的V4l2数据，交给DRM去做显示操作。

2.等待上一个buffer传输完成后，再将新buffer传入DRM去做显示。

3.old_buffer保存着上一个buffer的数据和地址，由于需要等待DRM读取并显示，所以等待下一回合才去入队归还buffer给驱动