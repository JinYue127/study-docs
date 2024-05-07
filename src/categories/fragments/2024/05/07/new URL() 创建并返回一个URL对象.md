---
title: new URL() 创建并返回一个URL对象
author: JinYue
date: 2024/05/07 10:30
categories:
  - 杂碎逆袭史
tags:
  - URL
---

# new URL() 创建并返回一个URL对象

URL 接口用于解析，构造，规范化和编码 URL。它通过提供允许你轻松阅读和修改 URL 组件的属性来工作。通常，通过在调用 URL 的构造函数时将
URL 指定为字符串或提供相对 URL 和基本 URL 来创建新的 URL 对象。然后，你可以轻松读取 URL 的已解析组成部分或对 URL 进行更改。

如果浏览器尚不支持 `URL()` 构造函数，则可以使用 Window 中的 `Window.URL` 属性。确保检查你的任何目标浏览器是否要求对此添加前缀。

构造器 `new URL()` 创建并返回一个URL对象，该 URL 对象引用使用绝对 URL 字符串，相对 URL 字符串和基本 URL 字符串指定的 URL。

## 属性

| 属性           | 介绍                                                              |
|--------------|-----------------------------------------------------------------|
| hash         | 包含'#'的USVString，后跟 URL 的片段标识符。                                  |
| host         | 一个USVString，其中包含域（即主机名），后跟（如果指定了端口）“：”和 URL 的端口。                |
| hostname     | 包含 URL 域名的 USVString。                                           |
| href         | 包含完整 URL 的 USVString。                                           |
| origin       | 只读 返回一个包含协议名、域名和端口号的 USVString。                                 |
| password     | 包含在域名前面指定的密码的 USVString 。                                       |
| pathname     | 以 '/' 起头紧跟着 URL 文件路径的 DOMString。                                |
| port         | 包含 URL 端口号的 USVString。                                          |
| protocol     | 包含 URL 协议名的 USVString，末尾带 ':'。                                  |
| search       | 一个USVString ，指示 URL 的参数字符串；如果提供了任何参数，则此字符串包括所有参数，并以开头的“？”开头 字符。 |
| searchParams | 只读 URLSearchParams对象，可用于访问search中找到的各个查询参数。                     |
| username     | 包含在域名前面指定的用户名的 USVString。                                       |

## 方法

| 方法                | 介绍                                                                                     |
|-------------------|----------------------------------------------------------------------------------------|
| toString()        | 返回包含整个 URL 的USVString。它是URL.href的同义词，尽管它不能用于修改值。                                       |
| toJSON()          | 返回包含整个 URL 的USVString。它返回与href属性相同的字符串。                                                |
| createObjectURL() | 静态方法 createObjectURL() 返回一个DOMString ，包含一个唯一的 blob 链接（该链接协议为以 blob:，后跟唯一标识浏览器中的对象的掩码）。 |
| createObjectURL() | 销毁之前使用URL.createObjectURL()方法创建的 URL 实例。                                               |

## 使用说明

如果 url 参数是相对 URL，则构造函数将使用 url 参数和可选的 base 参数作为基础。

```js
const url = new URL('../cats', 'http://www.example.com/dogs');
console.log(url.hostname); // "www.example.com"
console.log(url.pathname); // "/cats"
```

可以设置 URL 属性以构造 URL：

```js
url.hash = 'tabby';
console.log(url.href); // "http://www.example.com/cats#tabby"
```

URL 根据 `RFC 3986`中的规则进行编码。例如：

```js
url.pathname = 'démonstration.html';
console.log(url.href); // "http://www.example.com/d%C3%A9monstration.html"
```

`URLSearchParams` 接口可用于构建和处理 URL 查询字符串。

要从当前窗口的 URL 获取搜索参数，可以执行以下操作：

```js
// https://some.site/?id=123
const parsedUrl = new URL(window.location.href);
console.log(parsedUrl.searchParams.get("id")); // "123"
```

URL 的 `toString()` 方法仅返回 `href` 属性的值，因此构造函数可以 用于直接对 URL 进行规范化和编码。

```js
const response = await fetch(new URL('http://www.example.com/démonstration.html'));
```

## URLSearchParams 处理 URL 的查询字符串

> URLSearchParams 接口定义了一些实用的方法来处理 URL 的查询字符串。

|                            |                                                 |
|----------------------------|-------------------------------------------------|
| URLSearchParams()          | 构造函数 URLSearchParams()，返回一个 URLSearchParams 对象。 |
| size                       | 实例属性 size 只读，返回 URLSearchParams 对象中查询参数的总个数。    |
| URLSearchParams.append()   | 插入一个指定的键/值对作为新的查询参数。                            |
| URLSearchParams.delete()   | 从查询参数列表里删除指定的查询参数及其对应的值。                        |
| URLSearchParams.entries()  | 返回一个iterator可以遍历所有键/值对的对象。                      |
| URLSearchParams.forEach()  | 通过回调函数迭代此对象中包含的所有值。                             |
| URLSearchParams.get()      | 获取指定查询参数的第一个值。                                  |
| URLSearchParams.getAll()   | 获取指定查询参数的所有值，返回是一个数组。                           |
| URLSearchParams.has()      | 返回 Boolean 判断是否存在此查询参数。                         |
| URLSearchParams.keys()     | 返回iterator 此对象包含了键/值对的所有键名。                     |
| URLSearchParams.set()      | 置一个查询参数的新值，假如原来有多个值将删除其他所有的值。                   |
| URLSearchParams.sort()     | 按键名排序。                                          |
| URLSearchParams.toString() | 返回查询参数组成的字符串，可直接使用在 URL 上。                      |
| URLSearchParams.values()   | 返回iterator 此对象包含了键/值对的所有值。                      |

### 示例

```js
const paramsString = "q=URLUtils.searchParams&topic=api";
const searchParams = new URLSearchParams(paramsString);

// 迭代查询参数
for (let p of searchParams) {
  console.log(p);
}

console.log(searchParams.has("topic")); // true
console.log(searchParams.has("topic", "fish")); // false
console.log(searchParams.get("topic") === "api"); // true
console.log(searchParams.getAll("topic")); // ["api"]
console.log(searchParams.get("foo") === null); // true
console.log(searchParams.append("topic", "webdev"));
console.log(searchParams.toString()); // "q=URLUtils.searchParams&topic=api&topic=webdev"
console.log(searchParams.set("topic", "More webdev"));
console.log(searchParams.toString()); // "q=URLUtils.searchParams&topic=More+webdev"
console.log(searchParams.delete("topic"));
console.log(searchParams.toString()); // "q=URLUtils.searchParams"

```

对象也可作为查询参数

```js

// 对象也可作为查询参数
const paramsObj = {foo: "bar", baz: "bar"};
const searchParams = new URLSearchParams(paramsObj);

console.log(searchParams.toString()); // "foo=bar&baz=bar"
console.log(searchParams.has("foo")); // true
console.log(searchParams.get("foo")); // "bar"

```

`URLSearchParams` 构造函数不会解析完整 URL，但是如果字符串起始位置有 `?` 的话会被去除。

```js

const paramsString1 = "http://example.com/search?query=%40";
const searchParams1 = new URLSearchParams(paramsString1);
console.log(searchParams1.has("query")); // false

const paramsString2 = "?query=value";
const searchParams2 = new URLSearchParams(paramsString2);
console.log(searchParams2.has("query")); // true

const url = new URL("http://example.com/search?query=%40");
const searchParams3 = new URLSearchParams(url.search);
console.log(searchParams3.has("query")); // true
```

`URLSearchParams` 不区分 `=` 后面没有任何内容的参数和完全没有 `=` 的参数。

```js

const emptyVal = new URLSearchParams("foo=&bar=baz");
console.log(emptyVal.get("foo")); // 返回 ''
const noEquals = new URLSearchParams("foo&bar=baz");
console.log(noEquals.get("foo")); // 也返回 ''
console.log(noEquals.toString()); // 'foo=&bar=baz'
```
