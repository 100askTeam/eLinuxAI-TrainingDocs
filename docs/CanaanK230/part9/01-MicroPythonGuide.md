---
sidebar_position: 1
---
# MicroPython基础

**MicroPython** 是一个**精简版的 Python 3 解释器**，专为微控制器和嵌入式系统设计。它让我们可以用 Python 语言控制单片机或者SOC中。

> 你可以把它理解成“跑在芯片上的 Python”。



## 1.基础数据类型与运算符

| 类型    | 示例值                     | 描述                     |
| ------- | -------------------------- | ------------------------ |
| `int`   | `10`, `-5`, `0xFF`         | 整数（十进制、十六进制） |
| `float` | `3.14`, `-2.5`             | 浮点数                   |
| `bool`  | `True`, `False`            | 布尔值                   |
| `str`   | `'hello'`, `"world"`       | 字符串                   |
| `bytes` | `b'abc'`, `bytes([65,66])` | 字节数据                 |
| `list`  | `[1, 2, 3]`                | 列表（数组）             |
| `tuple` | `(1, 2)`                   | 元组                     |
| `dict`  | `{'a': 1, 'b': 2}`         | 字典（键值对）           |

**算术运算符**

```
a = 10
b = 3
print(a + b)   # 13
print(a - b)   # 7
print(a * b)   # 30
print(a / b)   # 3.333...
print(a // b)  # 3（整除）
print(a % b)   # 1（取余）
print(a ** b)  # 1000（乘方）
```

**关系运算符（比较）**

```
print(a == b)  # False
print(a != b)  # True
print(a > b)   # True
print(a < b)   # False
print(a >= b)  # True
print(a <= b)  # False
```

**逻辑运算符**

```
x = True
y = False

print(x and y)  # False
print(x or y)   # True
print(not x)    # False
```

**赋值运算符**

```
a = 5
a += 2  # a = a + 2
print(a)  # 7

a *= 3
print(a)  # 21

a //= 4
print(a)  # 5
```

**位运算符（适用于底层硬件控制）**

```
x = 0b1010  # 10
y = 0b1100  # 12

print(bin(x & y))  # 0b1000（按位与）
print(bin(x | y))  # 0b1110（按位或）
print(bin(x ^ y))  # 0b0110（按位异或）
print(bin(~x))     # -0b1011（按位取反）
print(bin(x << 1)) # 0b10100（左移）
print(bin(y >> 2)) # 0b11（右移）
```

**成员运算符（常用于字符串、列表、字典等）**

```
letters = ['a', 'b', 'c']
print('a' in letters)     # True
print('d' not in letters) # True

text = "hello"
print('e' in text)        # True
```

**类型判断**

```
a = 123
print(type(a))         # <class 'int'>

s = "MicroPython"
print(isinstance(s, str))  # True
```

## 2.字符串

**字符串的定义和基本使用：**

```
s1 = "hello"
s2 = 'world'
s3 = "MicroPython"

print(s1)            # 输出: hello
print(s1 + " " + s2) # 拼接: hello world
print(len(s3))       # 长度: 11
```

**字符串索引与切片：**

```
msg = "MicroPython"

print(msg[0])     # M（第一个字符）
print(msg[-1])    # n（最后一个字符）
print(msg[0:5])   # Micro（切片，从索引0到4）
print(msg[5:])    # Python（从索引5到结尾）
print(msg[::-1])  # 反转字符串：nohtyPorcim
```

**字符串格式化：**

1.使用 `%`：

```
name = "Alice"
age = 25
print("Name: %s, Age: %d" % (name, age))
```

2.使用 `str.format()`

```
temp = 36.6
print("体温是 {:.1f}℃".format(temp))  # 保留1位小数
```



**常用字符串方法：**

```
text = "  hello MicroPython!  "

print(text.strip())        # 去除首尾空格
print(text.lower())        # 全小写
print(text.upper())        # 全大写
print(text.replace("Micro", "Mini"))  # 替换单词
print(text.find("Python")) # 查找子串位置
print(text.startswith("  h"))  # 是否以 "  h" 开头
print(text.endswith("!  "))    # 是否以 "!  " 结尾
```

**字符串拆分和拼接：**

```
data = "temp,humidity,pressure"

parts = data.split(",")    # 拆分成列表
print(parts)               # ['temp', 'humidity', 'pressure']

joined = "-".join(parts)   # 用 - 连接
print(joined)              # temp-humidity-pressure
```

**遍历字符串：**

```
msg = "OKK123"

for ch in msg:
    print(ch)  # 每次输出一个字符
```

**字符串转数字与判断:**

```
s = "123"
if s.isdigit():
    num = int(s)
    print(num + 10)  # 133

f = "3.14"
if f.replace('.', '', 1).isdigit():
    print(float(f) * 2)  # 6.28
```



## 3.判断语句

基础结构：

```
x = 10

if x > 5:
    print("x 大于 5")
```

`if-else` 示例

```
light = "green"

if light == "red":
    print("停下")
else:
    print("可以通行")
```

`if-elif-else` 多分支判断

```
temp = 38.5

if temp < 35:
    print("体温过低")
elif temp >= 35 and temp <= 37.5:
    print("体温正常")
else:
    print("体温偏高")

```

嵌套判断语句

```
x = 12
y = 5

if x > 10:
    if y > 3:
        print("x 和 y 都大于阈值")
    else:
        print("x > 10，但 y 不满足")
```

布尔运算结合

```
is_day = True
has_motion = False

if is_day and has_motion:
    print("开启录像")
else:
    print("不需要录像")
```



## 4.循环语句

**`for` 循环基本用法**

```
for i in range(5):
    print("当前 i =", i)
```

`range(5)` 会生成：0, 1, 2, 3, 4（不包括5）



**自定义起始值与步长**

```
for i in range(2, 10, 2):
    print(i)
```

 输出：2, 4, 6, 8



 **遍历列表或字符串**

```
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print("喜欢", fruit)

word = "Hi!"
for c in word:
    print(c)
```



`while` 循环基本用法

```
count = 0
while count < 3:
    print("count =", count)
    count += 1
```



**`break` 与 `continue` 控制**

```
for i in range(10):
    if i == 5:
        break
    print(i)
```

`break`：提前结束循环

输出 0~4，遇到5跳出



```
for i in range(5):
    if i == 2:
        continue
    print(i)
```

`continue`：跳过本次循环

 输出 0, 1, 3, 4，跳过了2



**嵌套循环（两个循环）**

```
for i in range(3):
    for j in range(2):
        print("i =", i, ", j =", j)
```



## 5.函数

**基本函数定义与调用**

```
def say_hello():
    print("你好，MicroPython！")

# 调用函数
say_hello()
```



**带参数的函数**

```
def greet(name):
    print("你好，" + name + "!")

greet("小明")
greet("小红")
```



**带返回值的函数**

```
def add(a, b):
    return a + b

result = add(3, 5)
print("加法结果是：", result)
```



**带默认参数的函数**

```
def blink(times=3):
    for i in range(times):
        print("LED 闪烁一次")

blink()         # 默认3次
blink(5)        # 闪烁5次
```



**函数返回多个值**

```
def min_max(a, b):
    return min(a, b), max(a, b)

low, high = min_max(3, 8)
print("最小值:", low)
print("最大值:", high)
```



## 6.类与继承

**定义类与创建对象**

```
class Person:
    def __init__(self, name):
        self.name = name

    def say_hello(self):
        print("你好，我是", self.name)

# 创建对象
p1 = Person("100ASK")
p1.say_hello()
```

`__init__()` 是构造函数，创建对象时自动调用。



**添加多个属性和方法**

```
class Dog:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def bark(self):
        print(self.name, "汪汪叫！")

    def get_info(self):
        return f"名字: {self.name}, 年龄: {self.age} 岁"

dog1 = Dog("小黑", 3)
dog1.bark()
print(dog1.get_info())
```



**类的继承**

```
class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        print(self.name, "发出声音")

# Dog继承Animal
class Dog(Animal):
    def speak(self):
        print(self.name, "说：汪汪！")

# Cat继承Animal
class Cat(Animal):
    def speak(self):
        print(self.name, "说：喵喵~")

dog = Dog("旺财")
cat = Cat("咪咪")

dog.speak()
cat.speak()
```

子类可以重写父类的方法（也可以通过 `super()` 调用父类方法）



**使用 `super()` 继承父类构造器**

```
class Animal:
    def __init__(self, name):
        self.name = name

class Dog(Animal):
    def __init__(self, name, breed):
        super().__init__(name)  # 调用父类构造函数
        self.breed = breed

    def show_info(self):
        print("名字:", self.name, ", 品种:", self.breed)

dog = Dog("来福", "哈士奇")
dog.show_info()
```

