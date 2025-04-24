---
sidebar_position: 2
---

# K230 nncase 常见问题解答

## 1. 安装 `whl`包出错

### 1.1 `xxx.whl is not a supported wheel on this platform.`

- A：升级 pip `pip install --upgrade pip`

------

## 2.编译模型时报错

### 2.1 `System.NotSupportedException: Not Supported *** op: XXX`

- A：该异常表明 `XXX`算子尚未支持，可以在[nncase Github Issue](https://github.com/kendryte/nncase/issues)中提需求。当前目录下 `***_ops.md`文档，可以查看各个推理框架中已经支持的算子。如果 `XXX`属于 `FAKE_QUANT`、`DEQUANTIZE`、`QUANTIZE`等量化相关的算子，表明当前模型属于量化模型，`nncase`目前不支持这类模型，请使用浮点模型来编译 `kmodel`。

### 2.2 `System.IO.IOException: The configured user limit (128) on the number of inotify instances has been reached, or the per-process limit on the number of open file descriptors has been reached`

- A：使用 `sudo gedit /proc/sys/fs/inotify/max_user_instances`修改128为更大的值即可。

### 2.3 `RuntimeError: Failed to initialize hostfxr.` or `RuntimeError: Failed to get hostfxr path.`

- A：需要安装dotnet-sdk-7.0，不要在`anaconda`的虚拟环境中安装。

  - Linux:

    ```
    sudo apt-get update
    sudo apt-get install dotnet-sdk-7.0
    ```

    

    如果安装完毕后仍然报错，配置`dotnet`环境变量。

    ```
    export DOTNET_ROOT=/usr/share/dotnet
    ```

    

  - Windows: 请自行查阅微软官方文档。

### 2.4 `The given key 'K230' was not present in the dictionary`

- A：需要安装nncase-kpu

  - Linux：`pip install nncase-kpu`

  - Windows：在[nncase github tags界面](https://github.com/kendryte/nncase/tags)下载对应版本的whl包，然后使用pip安装。

    > 安装nncase-kpu之前，请先检查nncase版本，然后安装与nncase版本一致的nncase-kpu。

    ```
    > pip show nncase | grep "Version:"
     Version: 2.8.0
    (Linux)  > pip install nncase-kpu==2.8.0
    (Windows)> pip install nncase_kpu-2.8.0-py2.py3-none-win_amd64.whl
    ```

    

------

## 3. 推理时报错

### 3.1 `nncase.simulator.k230.sc: not found`

或者以下情况：

> - `"nncase.simulator.k230.sc: Permision denied."`
> - `"Input/output error."`

- A：将nncase的安装路径加入到 `PATH`环境变量中，并检查一下nncase和nncase-kpu版本是否一致，如果不一致，请安装相同版本的Python包 `pip install nncase==x.x.x.x nncase-kpu==x.x.x.x`。

  ```
  root@a52f1cacf581:/mnt# pip list | grep nncase
  nncase                       2.1.1.20230721
  nncase-kpu                   2.1.1.20230721
  ```

  

------

## 4. k230开发板推理时报错

### 4.1 `data.size_bytes() == size = false (bool)`

- A：推理时输入数据有错误，与模型输入节点shape、type不匹配。当编译模型时配置了前处理相关参数，模型输入节点shape和type信息会有相应的更新。请以模型编译时配置的 `input_shape`、`input_type`为准来生成输入数据。

### 4.2 `std::bad_alloc`

- A：通常是因为内存分配失败导致的，可做如下排查。
  - 检查生成的kmodel是否超过当前系统可用内存
  - 检查App是否存在内存泄露

### 4.3 `terminate:Invalid kmodel`

加载`kmodel`代码如下时，抛出该自定义异常内容。

```
interp.load_model(ifs).expect("Invalid kmodel");
```



- A：在不存在其他问题的情况下，是由于编译`kmodel`时的nncase版本与当前SDK版本不匹配导致，请按照[SDK、nncase版本对应关系](https://developer.canaan-creative.com/k230/zh/dev/03_other/K230_SDK_nncase版本对应关系.html)查询，并按照[更新nncase运行时库教程](https://developer.canaan-creative.com/k230/zh/dev/03_other/K230_SDK更新nncase运行时库指南.html)解决。