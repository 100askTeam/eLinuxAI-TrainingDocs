---
sidebar_position: 1
---
# K230 SDK环境搭建

## 前提条件

- Ubuntu20.04：[虚拟机下载地址，默认用户名为ubuntu,密码为ubuntu](https://www.linuxvmimages.com/images/ubuntu-2004/)

> 如果没有Ubuntu环境可以使用虚拟机，vmware下载链接：https://www.vmware.com/products/desktop-hypervisor.html



## 1.配置SDK环境

### 2.1 更新清华源

编辑 `sources.list` 文件，添加或修改软件包源

```
sudo vim /etc/apt/sources.list
```

 修改内容为：

```
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal main restricted universe multiverse
# deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal main restricted universe multiverse
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal-updates main restricted universe multiverse
# deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal-updates main restricted universe multiverse
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal-backports main restricted universe multiverse
# deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal-backports main restricted universe multiverse
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal-security main restricted universe multiverse
# deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal-security main restricted universe multiverse multiverse
```

 

修改完成后需要更新软件源

```
sudo apt-get update
sudo apt-get upgrade
```

当然您也可以使用`Software & Updates`软件去修改！！！

 

### 2.2 使用apt安装软件包

```
sudo apt-get install -y --fix-broken --fix-missing --no-install-recommends \
  sudo vim wget curl git git-lfs openssh-client net-tools sed tzdata expect mtd-utils inetutils-ping locales \
  sed make binutils build-essential diffutils gcc g++ bash patch gzip bzip2 perl tar cpio unzip rsync file bc findutils \
  dosfstools mtools bison flex autoconf automake \
  libc6-dev-i386 libncurses5:i386 libssl-dev \
  python3 python3-pip python-is-python3 \
  lib32z1 scons libncurses5-dev \
  kmod fakeroot pigz tree doxygen gawk pkg-config libyaml-dev libconfuse2 libconfuse-dev
```

 

### 2.3 修改pip为清华源

编辑 `pip` 的配置文件，设置全局的 `pip` 配置选项

```
sudo vi /etc/pip.conf
```

 修改内容为：

```
[global]

timeout = 60

index-url = https://pypi.tuna.tsinghua.edu.cn/simple

extra-index-url = https://mirrors.aliyun.com/pypi/simple/ https://mirrors.cloud.tencent.com/pypi/simple
```

 

### 2.4 使用pip安装软件

```
python3 -m pip install -U pyyaml pycryptodome gmssl \
  numpy==1.19.5 protobuf==3.17.3 Pillow onnx==1.9.0 onnx-simplifier==0.3.6 onnxoptimizer==0.2.6 onnxruntime==1.8.0 cmake
```

 

### 2.5 安装微软软件包

1.使用wget下载一个名为 `packages-microsoft-prod.deb` 的文件，并将其保存到当前目录。

```
wget https://packages.microsoft.com/config/ubuntu/20.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
```

2.使用 `dpkg` 工具安装软件包。

```
sudo dpkg -i packages-microsoft-prod.deb && rm packages-microsoft-prod.deb
```

3. 更新软件源

```
sudo apt-get update
```

 4.安装两个软件包.NET和 ICU（国际组件）的开发库

```
sudo apt-get install -y dotnet-runtime-7.0 libicu-dev
```



### 2.6 安装磁盘镜像工具

1.创建临时文件夹

```
mkdir tmp
```

2.获取磁盘镜像工具安装包

```
wget https://github.com/pengutronix/genimage/releases/download/v16/genimage-16.tar.xz -O ./tmp/genimage-16.tar.xz
```

3.进入临时文件夹

```
cd tmp/
```

4.解压安装压缩包

```
tar -xf genimage-16.tar.xz
```

5.进入工具源码目录

```
cd genimage-16
```

5.编译源码

```
./configure \
    && make -j \
```

6.安装程序

```
sudo make install
```



### 2.7 清理缓存

```
sudo rm -rf /var/lib/apt/lists/*
```



### 2.8 设置系统默认语言和字符编码

```
sudo localedef -i en_US -c -f UTF-8 -A /usr/share/locale/locale.alias en_US.UTF-8
```



### 2.9 创建工具链路径

```
sudo mkdir -p /opt/toolchain/
```



## 2.下载SDK

Github:

```
git clone https://github.com/kendryte/k230_sdk
```

Gitee:

```
git clone https://gitee.com/kendryte/k230_sdk.git
```



## 3.编译SDK

### 3.1 进入SDK根目录

```
cd k230_sdk
```



### 3.2 下载toolchain

```
source tools/get_download_url.sh && make prepare_sourcecode
```



### 3.3 挂载工具链目录

```
sudo mount --bind $(pwd)/toolchain /opt/toolchain
```



### 3.4 编译SDK

```
make CONF=k230_canmv_dongshanpi_defconfig
```

