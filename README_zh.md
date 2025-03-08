# Heygem - Heygen的开源平替产品 [【英文】](./README.md)

![image-20250304114114272](README_zh.assets/image-20250304114114272.png)

## 介绍

Heygem是一款专为Windows系统设计的全离线视频合成工具，它能够精确克隆您的外貌和声音，让您的形象数字化。您可以通过文字和语音驱动虚拟形象，进行视频制作。无需联网，保护隐私的同时，也能享受到便捷和高效的数字体验。

- 核心功能
  - 精确外貌与声音克隆：运用先进的 AI 算法，高精度捕捉真人外貌特征，包括五官形状、面部轮廓等，构建逼真虚拟模型。同时，能精准克隆声音，捕捉并还原人声的细微特征，支持多种声音参数设置，可创造与原声高度相似的克隆效果。
  - 文字和语音驱动虚拟形象：通过自然语言处理技术理解文本内容，将文字转换为自然流畅的语音，实现文字驱动虚拟形象。也可直接使用语音输入，让虚拟形象根据语音的节奏、语调等进行相应的动作和表情变化，使虚拟形象的表现更加自然、生动。
  - 高效视频合成：将数字人的视频画面与声音高度同步，实现自然流畅的口型匹配，智能优化音视频同步效果。
  - 多语言：脚本支持八种语言，英语、日语、韩语、中文、法语、德语、阿拉伯语和西班牙语。
- 显著优势
  - 全离线操作：无需联网即可使用，有效保护用户隐私，让用户在安全、独立的环境中进行创作，避免数据在网络传输过程中可能存在的泄露风险。
  - 简单易用：操作界面简洁直观，即使是没有任何技术背景的小白也能轻松上手，快速掌握软件的使用方法，轻松开启数字人创作之旅。
  - 多模型支持：支持导入多个模型，并通过一键启动包进行管理，方便用户根据不同的创作需求和应用场景选择合适的模型。
- 技术支持
  - 声音克隆技术：利用人工智能等先进技术，根据给定的声音样本生成与之相似或相同声音的技术，涵盖语音中的语境、语调、语速等。
  - 自动语音识别：一种能将人类语音中的词汇内容转换为计算机可读输入，也就是转换为文本格式的技术，让计算机能够 “听懂” 人们说的话。
  - 计算机视觉技术：用于视频合成中的视觉处理，包括面部识别、口型分析等，确保虚拟形象的口型与声音和文字内容相匹配。

## 依赖

1. Nodejs 18
2. Docker Image
   - docker pull guiji2025/fun-asr:1.0.2
   - docker pull guiji2025/fish-speech-ziming:1.0.39
   - docker pull guiji2025/heygem.ai:0.0.7_sdk_slim

## 如何安装

### 前置条件

1.  必须有 D 盘：主要用于后续数字人、作品等数据存储
    - 空闲空间要求：大于30G
2.  C 盘：用于存储服务镜像文件

    - 空闲空间要求：大于 100G
    - 如果不足 100G，可以在安装完成docker后，在下图的位置重新选一个剩余空间大于 100G 的磁盘文件夹。

      ![output](README_zh.assets/output.png)

3.  系统要求：
    - 目前支持 Windows 10 19042.1526 或更高版本
4.  推荐配置：
    - CPU：第13代英特尔酷睿 i5-13400F
    - 内存：32G
    - 显卡：rtx-4070
5.  确保有英伟达显卡，并正确安装显卡驱动

    英伟达驱动下载地址 https://www.nvidia.cn/drivers/lookup/

    ![nvidia](README_zh.assets/nvidia.png)

### 安装 Windows Docker

1. 用wsl --list --verbose命令可以查看本机有没有安装过wsl，如下图就是已经安装过，无需再安装

   ![wsl-list](README_zh.assets/wsl-list.png)

> - 安装wsl的命令：`wsl --install`
> - 由于网络原因，可能失败，多试几次
> - 安装过程中需要设置新的用户名和密码，设置并记住

2. 用wsl --update更新wsl。

   ![updatewsl](README_zh.assets/updatewsl.png)

3. [下载 Docker Windows 版](https://www.docker.com/)，根据机器 CPU 架构选择不同的安装包。

4. 出现这个界面表示安装成功。

   ![61eb4c19-3e7a-4791-a266-de4209690cbd](README_zh.assets/61eb4c19-3e7a-4791-a266-de4209690cbd.png)

5. 运行 Docker

   ![shortcut](README_zh.assets/shortcut.png)

6. 首次运行接受协议和跳过登录

   ![accept](README_zh.assets/accept.png)

   ![576746d5-5215-4973-b1ca-c8d7409a6403](README_zh.assets/576746d5-5215-4973-b1ca-c8d7409a6403.png)

   ![9a10b7b2-1eea-48c1-b7af-34129fe04446](README_zh.assets/9a10b7b2-1eea-48c1-b7af-34129fe04446.png)

### 安装服务端

采用Docker方式安装，docker-compose如下：

1. `docker-compose.yml`文件在`/deploy`目录下。

2. 在`/deploy`目录执行`docker-compose up -d`

3. 耐心等待一段时间（半小时左右，速度取决于网速），下载会消耗70G左右流量，注意连WIFI
4. 看到Dokcer 中出现三个服务，表示成功了

   ![e29d1922-7c58-46b4-b1e9-961f853f26d4](README_zh.assets/e29d1922-7c58-46b4-b1e9-961f853f26d4.png)

### 客户端

1. 构建脚本`npm run build:win`，执行后会在`dist`目录下产生`HeyGem-1.0.0-setup.exe`
2. 双击`HeyGem-1.0.0-setup.exe`即可安装

## 开放 API

我们开放了模特训练和视频合成的API，Docker 启动后会在本地暴露几个端口，通过`http://127.0.0.1`可以调用。

具体代码可以参考

- src/main/service/model.js
- src/main/service/video.js
- src/main/service/voice.js

### 模特训练

1. 将视频分离为静音视频 + 音频
2. 音频放到`D:\heygem_data\voice\data`下
   > `D:\heygem_data\voice\data`是与`guiji2025/fish-speech-ziming`服务约定的，可以在docker-compose中修改
3. 调用`http://127.0.0.1:18180/v1/preprocess_and_tran`接口
   > 参数示例：
   >
   > ```json
   > {
   >   "format": ".wav",
   >   "reference_audio": "xxxxxx/xxxxx.wav",
   >   "lang": "zh"
   > }
   > ```
   >
   > 返回示例：
   >
   > ```json
   > {
   >   "asr_format_audio_url": "xxxx/x/xxx/xxx.wav",
   >   "reference_audio_text": "xxxxxxxxxxxx"
   > }
   > ```
   >
   > **记录下返回结果后续音频合成需要用到**

### 音频合成

接口：`http://127.0.0.1:18180/v1/invoke`

```json
// 请求参数
{
  "speaker": "{uuid}", // 一个UUID保持唯一即可
  "text": "xxxxxxxxxx", // 需要合成的文本内容
  "format": "wav", // 固定传参
  "topP": 0.7, // 固定传参
  "max_new_tokens": 1024, // 固定传参
  "chunk_length": 100, // 固定传参
  "repetition_penalty": 1.2, // 固定传
  "temperature": 0.7, // 固定传参
  "need_asr": false, // 固定传参
  "streaming": false, // 固定传参
  "is_fixed_seed": 0, // 固定传参
  "is_norm": 0, // 固定传参
  "reference_audio": "{voice.asr_format_audio_url}", // 上一步“模特训练”的返回值
  "reference_text": "{voice.reference_audio_text}" // 上一步“模特训练”的返回值
}
```

### 视频合成

- 合成接口：`http://127.0.0.1:8383/easy/submit`

  ```json
  // 请求参数
  {
    "audio_url": "{audioPath}", // 音频路径
    "video_url": "{videoPath}", // 音频路径
    "code": "{uuid}", // 唯一key
    "chaofen": 0, // 固定值
    "watermark_switch": 0, // 固定值
    "pn": 1 // 固定值
  }
  ```

- 进度查询：`http://127.0.0.1:8383/easy/query?code=${taskCode}`
  > get 请求，参数`taskCode`是上面合成接口的返回值

## 提问前自查步骤

1. 三个服务是否都是Running状态

   ![e29d1922-7c58-46b4-b1e9-961f853f26d4](./doc/常见问题.assets/e29d1922-7c58-46b4-b1e9-961f853f26d4.png)

2. 确认机器上是有英伟达显卡且正确安装了驱动程序。

   本项目所有算力都在本地，没有英伟达显卡或没有驱动程序，以上三个服务是启动不了的。

3. 确保服务端和客户端都更新到了最新版本，项目刚开源，社区很活跃，更新也比较频繁，说不定你的问题已经在新版中解决了。

   - 服务端：到`/deploy`目录下重新执行`docker-compose up -d`
   - 客户端：`pull`代码后重新`build`

4. [GitHub Issuse](https://github.com/GuijiAI/HeyGem.ai/issues)持续更新，每天都在解决和关闭问题单，经常看看，也许你的问题已经解决了。

## 提问模板

1. 问题描述

   详细描述一下复现步骤，如有截图最好。

2. 提供报错日志

   - 客户端日志获取方式

     ![image-20250308205954494](./doc/常见问题.assets/image-20250308205954494.png)

   - 服务端日志

     找到关键位置，或点开我们的三个Docker服务，如下图操作“复制”。

     ![image-20250308215812201](./doc/常见问题.assets/image-20250308215812201.png)

## 联系我们

```
  end_sub@hotmail.com
```

## 协议

[LICENSE](./LICENSE)

## 致谢

- ASR 基于 [fun-asr](https://github.com/modelscope/FunASR)
- TTS 基于 [fish-speech-ziming](https://github.com/fishaudio/fish-speech)
