# 解决 kex_exchange_identification 报错

## 踩坑

在使用 `git` 时，发现 `git pull` 时经常会出现下面的报错 **kex_exchange_identification: Connection closed by remote host**，导致无法正常拉取代码

```txt
$ git pull // [!code ++]
kex_exchange_identification: Connection closed by remote host // [!code error]
Connection closed by 192.30.255.113 port 22 // [!code error]
fatal: Could not read from remote repository. // [!code error]

Please make sure you have the correct access rights  // [!code error]
and the repository exists. // [!code error]

```

## 解决办法

在 `~/.ssh/config` 文件中添加下面的配置( `.ssh` 没有 `config` 就创建一个)

```text
Host github.com
Hostname ssh.github.com
Port 443
User git

```
