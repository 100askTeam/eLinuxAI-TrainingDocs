---
sidebar_position: 1
---

# K230 实战基础篇 - hello world

## 1.概述

本文将讲解如果在pc端使用交叉编译工具编译一个hello world的基础程序，并在大核rt-smart或小核linux上运行。

## 2.环境准备

### 2.1 硬件环境

- DshanPI-CanMV K230开发板
- Ubuntu PC 20.04
- Typec USB线 * 2 至少
- SD卡(如果使用SD卡启动，或软件需要访问SD卡)

### 2.2 软件环境

k230_sdk中提供了工具链，分别在如下路径。

- 大核rt-samrt工具链

```
k230_sdk/toolchain/riscv64-linux-musleabi_for_x86_64-pc-linux-gnu
```



- 小核linux工具链

```
k230_sdk/toolchain/Xuantie-900-gcc-linux-5.10.4-glibc-x86_64-V2.6.0
```



也可通过以下链接下载工具链

```
wget https://download.rt-thread.org/rt-smart/riscv64/riscv64-unknown-linux-musl-rv64imafdcv-lp64d-20230222.tar.bz2
wget https://occ-oss-prod.oss-cn-hangzhou.aliyuncs.com/resource//1659325511536/Xuantie-900-gcc-linux-5.10.4-glibc-x86_64-V2.6.0-20220715.tar.gz
```



### 2.3 代码编写

在ubuntu上创建一个C文件hello.c并加入如下代码

```
#include <stdio.h>
int main (void)
{
    printf("hello world\n");
    return 0;
}
```



将hello.c放到与k230_sdk同一级目录下

```
canaan@develop:~/work$ ls
hello.c   k230_sdk
```



### 2.4 编译适用于小核linux的可执行程序

```
k230_sdk/toolchain/Xuantie-900-gcc-linux-5.10.4-glibc-x86_64-V2.6.0/bin/riscv64-unknown-linux-gnu-gcc hello.c -o hello
```



### 2.5 编译适用于大核rt-smart的可执行程序

```
k230_sdk/toolchain/riscv64-linux-musleabi_for_x86_64-pc-linux-gnu/bin/riscv64-unknown-linux-musl-gcc -o hello.o -c -mcmodel=medany -march=rv64imafdcv -mabi=lp64d hello.c

k230_sdk/toolchain/riscv64-linux-musleabi_for_x86_64-pc-linux-gnu/bin/riscv64-unknown-linux-musl-gcc -o hello.elf -mcmodel=medany -march=rv64imafdcv -mabi=lp64d -T k230_sdk/src/big/mpp/userapps/sample/linker_scripts/riscv64/link.lds  -Lk230_sdk/src/big/rt-smart/userapps/sdk/rt-thread/lib -Wl,--whole-archive -lrtthread -Wl,--no-whole-archive -n --static hello.o -Lk230_sdk/src/big/rt-smart/userapps/sdk/lib/risc-v/rv64 -Lk230_sdk/src/big/rt-smart/userapps/sdk/rt-thread/lib/risc-v/rv64 -Wl,--start-group -lrtthread -Wl,--end-group
```

其中第一行命令参数解析为：

- `-o hello.o`：指定输出文件名为 `hello.o`。
- `-c`：只进行编译，不进行链接。
- `-mcmodel=medany`：指定中等代码模型。
- `-march=rv64imafdcv`：指定目标架构为 RISC-V 64 位，支持整数、乘除法、原子操作、浮点数、压缩指令和向量扩展。
- `-mabi=lp64d`：指定应用二进制接口为 LP64D（64 位长整型和双精度浮点数）。
- `hello.c`：输入的 C 源文件。

其中第二行命令参数解析为：

- `-o hello.elf`：指定输出文件名为 `hello.elf`。
- `-mcmodel=medany`：指定中等代码模型。
- `-march=rv64imafdcv`：指定目标架构为 RISC-V 64 位，支持整数、乘除法、原子操作、浮点数、压缩指令和向量扩展。
- `-mabi=lp64d`：指定应用二进制接口为 LP64D（64 位长整型和双精度浮点数）。
- `-T k230_sdk/src/big/mpp/userapps/sample/linker_scripts/riscv64/link.lds`：指定链接脚本文件。
- `-Lk230_sdk/src/big/rt-smart/userapps/sdk/rt-thread/lib`：指定库文件搜索路径。
- `-Wl,--whole-archive -lrtthread -Wl,--no-whole-archive`：将 `rtthread` 库中的所有对象文件包含在链接中。
- `-n`：生成静态可执行文件。
- `--static`：静态链接所有库。
- `hello.o`：输入的目标文件。
- `-Lk230_sdk/src/big/rt-smart/userapps/sdk/lib/risc-v/rv64` 和 `-Lk230_sdk/src/big/rt-smart/userapps/sdk/rt-thread/lib/risc-v/rv64`：指定额外的库文件搜索路径。
- `-Wl,--start-group -lrtthread -Wl,--end-group`：将 `rtthread` 库包含在链接中，并确保链接器正确处理库的依赖关系。

首先将 `hello.c` 编译成目标文件 `hello.o`，然后将其链接成可执行文件 `hello.elf`。

### 2.6 运行程序

将编译好的hello以及hello.elf拷贝到sd卡的vfat分区内(sd卡烧写完镜像后可以在pc端看到一个可用的盘符)，或通过其他方式(参考sdk使用说明文档)将可执行程序拷贝到小核的/sharefs目录下。

- 开发板启动后，在小核端运行测试程序,小核启动后输入`root`进入控制台

```
Welcome to Buildroot
canaan login: root
[root@canaan ~ ]#cd /sharefs
[root@canaan /sharefs ]#./hello
hello world
```



- 在大核端运行测试程序

```
msh /sharefs>hello.elf
hello world
```



### 2.7 大核程序编译进阶

大核如果用musl-gcc直接编译的话，编译参数是比较多的，对于初学者来说很不方便，也不太好理解，当前sdk中提供了两种用于编译大核程序的方式，分别是scons和Makefile,这里我们介绍scons的编译方式，Makefile的编译构建较为复杂，不是rt-smart官方提供的编译方式，感兴趣的读者可参考`src/big/mpp/userapps/sample`中的Makefile结构来编译。

到`k230_sdk/src/big/rt-smart/userapps`目录下创建一个文件夹，命名为hello

```
cd k230_sdk/src/big/rt-smart/userapps
mkdir hello
cd hello
```



创建以下三个文件

- hello.c
- SConscript

```
# RT-Thread building script for component

from building import *

cwd = GetCurrentDir()
src = Glob('*.c')
CPPPATH = [cwd]

CPPDEFINES = [
    'HAVE_CCONFIG_H',
]
group = DefineGroup('hello', src, depend=[''], CPPPATH=CPPPATH, CPPDEFINES=CPPDEFINES)

Return('group')
```



- SConstruct

```
import os
import sys

# add building.py path
sys.path = sys.path + [os.path.join('..','..','tools')]
from building import *

BuildApplication('hello', 'SConscript', usr_root = '../')
```



之后回到`k230_sdk/src/big/rt-smart/`目录，配置环境变量

```
canaan@develop:~/k230_sdk/src/big/rt-smart$ source smart-env.sh riscv64
Arch         => riscv64
CC           => gcc
PREFIX       => riscv64-unknown-linux-musl-
EXEC_PATH    => /home/canaan/k230_sdk/src/big/rt-smart/../../../toolchain/riscv64-linux-musleabi_for_x86_64-pc-linux-gnu/bin
```



进入`k230_sdk/src/big/rt-smart/userapps`目录，编译程序

```
canaan@develop:~/k230_sdk/src/big/rt-smart/userapps$ scons --directory=hello
scons: Entering directory `/home/canaan/k230_sdk/src/big/rt-smart/userapps/hello'
scons: Reading SConscript files ...
scons: done reading SConscript files.
scons: Building targets ...
scons: building associated VariantDir targets: build/hello
CC build/hello/hello.o
LINK hello.elf
/home/canaan/k230_sdk/toolchain/riscv64-linux-musleabi_for_x86_64-pc-linux-gnu/bin/../lib/gcc/riscv64-unknown-linux-musl/12.0.1/../../../../riscv64-unknown-linux-musl/bin/ld: warning: hello.elf has a LOAD segment with RWX permissions
scons: done building targets.
```



编译好的程序在hello文件夹下

```
canaan@develop:~/k230_sdk/src/big/rt-smart/userapps$ ls hello/
build  cconfig.h  hello.c  hello.elf  SConscript  SConstruct
```



之后即可将hello.elf拷贝到小核linux上，然后大核rt-smart通过/sharefs即可运行该程序



### 2.8 编译文件解析

#### 2.8.1 SConscript

用于构建 RT-Thread 组件的脚本。它使用了一个名为 `building` 的模块来定义构建过程。

1. **导入模块**：

   ```python
   from building import *
   ```

   这行代码导入了 `building` 模块中的所有内容。

2. **获取当前目录**：

   ```python
   cwd = GetCurrentDir()
   ```

   这行代码获取当前工作目录的路径，并将其存储在变量 `cwd` 中。

3. **获取所有 `.c` 文件**：

   ```python
   src = Glob('*.c')
   ```

   这行代码使用 `Glob` 函数获取当前目录中所有扩展名为 `.c` 的源文件，并将它们存储在变量 `src` 中。

4. **定义包含路径**：

   ```python
   CPPPATH = [cwd]
   ```

   这行代码将当前工作目录添加到包含路径列表 `CPPPATH` 中。

5. **定义预处理器宏**：

   ```python
   CPPDEFINES = [
       'HAVE_CCONFIG_H',
   ]
   ```

   这行代码定义了一个预处理器宏 `HAVE_CCONFIG_H`，并将其存储在列表 `CPPDEFINES` 中。

6. **定义构建组**：

   ```python
   group = DefineGroup('hello', src, depend=[''], CPPPATH=CPPPATH, CPPDEFINES=CPPDEFINES)
   ```

   这行代码使用 `DefineGroup` 函数定义了一个名为 `hello` 的构建组。该组包含以下内容：

   - `src`：源文件列表。
   - `depend`：依赖项列表，这里为空。
   - `CPPPATH`：包含路径列表。
   - `CPPDEFINES`：预处理器宏列表。

7. **返回构建组**：

   ```python
   Return('group')
   ```

   这行代码返回定义的构建组 `group`。

这段脚本的作用是定义一个名为 `hello` 的构建组，包含当前目录中的所有 `.c` 文件，并指定了一些包含路径和预处理器宏。

 

#### 2.8.2 SConstruct

构建应用程序的脚本

1. **导入模块**：

   ```python
   import os
   import sys
   ```

   这两行代码导入了 `os` 和 `sys` 模块，分别用于与操作系统交互和操作 Python 解释器的环境。

2. **添加 `building.py` 的路径**：

   ```python
   # add building.py path
   sys.path = sys.path + [os.path.join('..','..','tools')]
   ```

   这行代码将 `building.py` 所在的目录路径添加到 `sys.path` 中。`os.path.join('..','..','tools')` 生成相对路径 `../../tools`，表示从当前目录向上两级，然后进入 `tools` 目录。

3. **从 `building` 模块导入所有内容**：

   ```python
   from building import *
   ```

   这行代码从 `building` 模块中导入所有内容。

4. **构建应用程序**：

   ```python
   BuildApplication('hello', 'SConscript', usr_root = '../')
   ```

   这行代码调用 `BuildApplication` 函数来构建名为 `hello` 的应用程序。参数解释如下：

   - `'hello'`：应用程序的名称。
   - `'SConscript'`：构建脚本文件的名称。
   - `usr_root = '../'`：用户根目录的路径，这里是相对路径 `../`，表示当前目录的上一级目录。

这段脚本的作用是设置构建环境并调用 `BuildApplication` 函数来构建一个名为 `hello` 的应用程序。

​              