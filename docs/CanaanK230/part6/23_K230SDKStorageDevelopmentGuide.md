---
sidebar_position: 23
---

# K230 SDK 存储 使用指南

## 1. 概述

### 1.1 编写目的

介绍K230 EMMC 分区，⽂件系统等存储相关信息。



### 1.2 适用范围

K230 SDK V1.6及后续版本。



## 2.分区管理

### 2.1 分区文件

在嘉楠平台中，通过`genimage-sdcard.cfg`文件配置分区大小，其路径如下所示：

```
k230_sdk/board/common/gen_image_cfg/genimage-sdcard.cfg
```



### 2.2 常见分区和用途

| 分区名 | 用途              | 大小             |
| ------ | ----------------- | ---------------- |
| vfat   | 共享文件分区      | 根据需求设置     |
| rtt    | RT-Smart分区      | 使用默认大小即可 |
| linux  | linux分区         | 使用默认大小即可 |
| rootfs | linux根文件系统镜 | 使用默认大小即可 |



### 2.3 调整共享文件分区

共享文件中的大小由app.vfat中的size指定具体大小。

```
image app.vfat {
        vfat {
                files = {
                        "big-core/app",
                }
        }
        # empty =true
        size = 256M
}
```

假设您想设置共享文件分区的大小为1024M，可将size设置成1024M,如下所示：

```
image app.vfat {
        vfat {
                files = {
                        "big-core/app",
                }
        }
        # empty =true
        size = 1024M
}
```

同理，如果您想将共享文件分区的大小为7GB，可将size设置成7168M。

> 注意：由于K230的镜像为FAT格式，会随着size设置的大小变大，如果您设置的size为7GB,对应的生成的镜像也为7GB，所以请根据实际的需求设置对应的镜像大小！！

