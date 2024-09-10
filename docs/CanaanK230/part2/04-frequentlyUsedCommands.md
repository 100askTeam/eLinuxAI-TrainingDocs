---
sidebar_position: 4
---

# 常用命令

## 1.基础编译命令

| 命令                                                        | 解释                    |
| ----------------------------------------------------------- | ----------------------- |
| source tools/get_download_url.sh && make prepare_sourcecode | 下载toolchain和准备源码 |
| sudo mount --bind $(pwd)/toolchain /opt/toolchain           | 挂载工具链目录          |
| make CONF=k230_canmv_dongshanpi_defconfig prepare_memory    | 配置板级型号            |
| make CONF=k230_canmv_dongshanpi_defconfig                   | 编译SDK                 |



## 2.所有命令解析

| 命令                                      | 解释                                                         |
| ----------------------------------------- | ------------------------------------------------------------ |
| make CONF=k230_canmv_dongshanpi_defconfig | 编译dshanpi-canmv开发板配置，会编译生成相应配置的固件        |
| make                                      | 构建k230 SDK所有配置项                                       |
| make prepare_sourcecode                   | 下载并准备源码                                               |
| make little-core-opensbi                  | 构建k230小核心opensbi                                        |
| make big-core-opensbi                     | 构建k230大核心opensbi                                        |
| make mpp-apps                             | 构建mpp内核驱动程序用户api lib和k230的示例代码               |
| make rt-smart                             | 构建mpp rtsmart内核、userapps和opensbi                       |
| make rt-smart-kernel                      | 构建rtsmart内核                                              |
| make rt-smart-apps                        | 构建rtsmart用户应用程序                                      |
| make cdk-kernel                           | 构建CDK内核代码                                              |
| make cdk-kernel-install                   | 将CDK内核的编译产品安装到rt-smart和rootfs                    |
| make cdk-user                             | 构建CDK用户代码                                              |
| make cdk-user-install                     | 将CDK用户的编译产品安装到rt-smart和rootfs                    |
| make uboot                                | 用defconfig构建k230 uboot代码                                |
| make uboot-menuconfig                     | uboot的Menufonig，选择保存将保存到 output/xxx_defconfig/little/uboot/.config |
| make uboot-savedefconfig                  | 将uboot配置保存到output/xxx_defconfig/little/uboot/defconfig |
| make uboot-rebuild                        | 重建k230 uboot                                               |
| make uboot-clean                          | 在k230 uboot构建目录中执行clean，运行make uboo-reputation将构建所有源代码 |
| make linux                                | 用defconfig构建k230 Linux代码                                |
| make linux-rebuild                        | 重建k230 Linux内核                                           |
| make linux-menuconfig                     | Linux内核的Menufonig，选择保存将保存到output/xxx_defconfig/little/linux/.config |
| make linux-savedefconfig                  | 将Linux内核配置保存到output/xxx_defconfig/little/linux/defconfig |
| make linux-clean                          | 在Linux内核构建目录中进行clean，运行make linux-restart将构建所有源代码 |
| make buildroot                            | 用defconfig构建k230 buildroot                                |
| make buildroot-rebuild                    | 重建k230 buildroot                                           |
| make buildroot-menuconfig                 | k230 buildroot的Menufonig，选择保存将保存到output/xxx_defconfig/little/buildroot-ext/.config |
| make buildroot-savedefconfig              | 将buildroot配置保存到src/little/buildroot-ext/configs/xxx_defconfig |
| make buildroot-clean                      | 清理k230 buildroot构建目录，清理后，运行make buildroot-reputation将失败，因为构建目录不存在。运行使buildroot来构建; |
| make build-image                          | 构建k230 rootfs镜像                                          |





