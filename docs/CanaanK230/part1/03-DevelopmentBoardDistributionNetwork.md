---
sidebar_position: 3
---
# 开发板配网

硬件要求：

- DshanPI-CanMV开发板
- 天线 x1
- Type-C数据线 x2

## 1.联网

### 1.1 使能WIFI

在Linux终端输入

```
ifconfig wlan0 up
```

![image-20240723182044366](${images}/image-20240723182044366.png)



### 1.2 填写WIFI信息

需要根据自己实际的WiFi设备信息在Linux终端输入：

```
wpa_passphrase <wifi名称> <密码> > /etc/wpa_supplicant.cof
```

假设我的WIFI名为Programmers，密码为12345678，则实际执行的命令为：

```
wpa_passphrase Programmers 12345678 > /etc/wpa_supplicant.conf
```

### 1.3 连接WIFI

连接到 SSID，在Linux终端输入：

```
wpa_supplicant -D nl80211 -i wlan0 -c /etc/wpa_supplicant.conf -B
```

执行完成后如下所示：

![image-20240723182724941](${images}/image-20240723182724941.png)

### 1.4 获取IP地址

在Linux终端输入：

```
udhcpc -i wlan0
```

获取完成IP地址后如下所示：

![image-20240723182823254](${images}/image-20240723182823254.png)



## 2.测试网络

测试WiFi是否可以访问互联网，输入`ping www.baidu.com`，输入后如下所示：

```
[root@canaan ~ ]#ping www.baidu.com
PING www.baidu.com (183.2.172.42): 56 data bytes
64 bytes from 183.2.172.42: seq=0 ttl=52 time=14.734 ms
64 bytes from 183.2.172.42: seq=1 ttl=52 time=42.191 ms
^C
--- www.baidu.com ping statistics ---
2 packets transmitted, 2 packets received, 0% packet loss
round-trip min/avg/max = 14.734/28.462/42.191 ms
```

