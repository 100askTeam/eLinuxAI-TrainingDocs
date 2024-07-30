---
sidebar_position: 4
---
# 使用TFTP进行文件传输

软件要求：

- Ubuntu20.04

硬件要求：

- DshanPI-CanMV开发板
- 天线 x1
- Type-C数据线 x2

在开始前请确保您的CanMV开发板已经成功连接至互联网。



## 1.设置Ubuntu虚拟机为桥接模式

![image-20240724155215714](${images}/image-20240724155215714.png)



## 2.在Ubuntu端安装TFTP

在Ubuntu中执行以下命令安装TFTP服务：

```
sudo apt-get install tftp-hpa tftpd-hpa
```

然后，创建TFTP服务工作目录，并打开TFTP服务配置文件，如下:

```
mkdir -p /home/ubuntu/tftpboot
chmod 777 /home/ubuntu/tftpboot
sudo gedit /etc/default/tftpd-hpa
```

在配置文件/etc/default/tftpd-hpa中，将原来的内容删除，修改为：

```
TFTP_USERNAME="tftp"
TFTP_ADDRESS=":69"
TFTP_DIRECTORY="/home/ubuntu/tftpboot"
TFTP_OPTIONS="-l -c -s"
```

最后，重启TFTP服务

```
sudo service tftpd-hpa restart
```

查看tftp服务是否在运行,运行如下命令，即可查看是否在后台运行。

```
ubuntu@ubuntu2004:~/Desktop$ ps -aux | grep “tftp”
ubuntu 4555 0.0 0.0 9040 652 pts/0 S+ 02:33 0:00 grep --color=auto “tftp”
```



## 3.开发板通过tftp传输文件

首先确保Ubuntu或Windows的tftp服务目录内，有需要下载到板子上的文件，比如：

```
ubuntu@ubuntu2004:~$ ls /home/ubuntu/tftpboot/
1.txt
```

确认Ubuntu的网络IP，例如

![image-20240724160401031](${images}/image-20240724160401031.png)

比如下载Ubuntu服务器下的1.txt 文件，则在开发板上执行如下命令(Ubuntu的桥接网卡IP是 192.168.0.162)：

```
[root@canaan ~ ]$ tftp -g -r 1.txt 192.168.0.162
```



如何从开发板上传文件到Ubuntu？比如我们现在开发板家目录下创建一个2.txt 的文本文件，然后写入

```
tftp -p -l 2.txt 192.168.0.162
```

