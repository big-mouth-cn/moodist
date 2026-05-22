<div align="center">
  <img src="/public/og.png" alt="Moodist X" />
  <h2>Moodist X</h2>
  <p>支持 AI 创作的环境音效混音工具，适合专注、休息和平静下来。</p>
  <p>
    <a href="https://moodistx.aigateway.cn">访问 <strong>Moodist X</strong></a>
    ·
    <a href="README.en.md">English</a>
  </p>
</div>

---

## 亮点

### AI 创作音效组合

Moodist X 支持用户用自然语言描述任意场景、状态或环境，例如：

- “雨夜咖啡馆，适合专注写作”
- “帮助入睡的森林小屋”
- “模拟清晨办公室的轻微人声与键盘声”

系统会调用兼容 OpenAI Chat Completions 协议的 LLM 接口，从内置音效库中生成可直接播放的音效组合，并自动给出音量配置。生成记录会保存在浏览器本地，之后可以在 AI 弹窗的历史记录里重新应用。

### 多语言

当前支持：

- English
- 简体中文

用户可以在设置中切换语言，选择会保存到浏览器本地。页面标题、主要功能文案、菜单、弹窗和音效名称都会随语言切换。

## 功能

- 84 个精选环境音效，可自由叠加组合。
- AI 音效组合创作：输入场景描述，自动生成可播放组合。
- AI 生成历史记录：保存在浏览器本地，可再次应用。
- 支持英文和简体中文，语言选择本地保存。
- 每个音效可单独调节音量。
- 支持收藏常用音效。
- 支持随机音效组合。
- 支持通过链接分享当前组合，并一键导入。
- 支持预设保存、重命名、删除和快速应用。
- 内置双耳节拍、等时音生成器。
- 内置呼吸练习、番茄钟、倒计时、待办清单和记事本。
- 支持 PWA 安装和离线缓存。
- 支持 Docker 自托管。

## AI 配置

AI 生成功能通过前端环境变量直连 OpenAI Chat Completions 兼容接口：

```bash
PUBLIC_LLM_BASE_URL=https://api.openai.com/v1
PUBLIC_LLM_API_KEY=your_api_key
PUBLIC_LLM_MODEL=gpt-4o-mini
```

请求地址为：

```text
${PUBLIC_LLM_BASE_URL}/chat/completions
```

注意：当前方案是在浏览器端直连接口，`PUBLIC_LLM_API_KEY` 会暴露给前端用户。生产环境如需隐藏密钥，建议增加后端代理。

## 本地开发

```bash
pnpm install
pnpm run dev
```

构建：

```bash
pnpm run build
```

代码检查：

```bash
pnpm run check
```

## 自托管

### Docker

```bash
docker run -d \
  --name moodist \
  -p 8080:8080 \
  ghcr.io/remvze/moodist:latest
```

然后打开：

```text
http://localhost:8080
```

### Docker Compose

项目根目录包含 `docker-compose.yml`：

```bash
docker compose up -d
```

然后打开：

```text
http://localhost:8080
```

## 开源说明

当前项目地址：

- [big-mouth-cn/moodist](https://github.com/big-mouth-cn/moodist)

Moodist X 基于开源项目 [remvze/moodist](https://github.com/remvze/moodist) 进行二次开发，遵循 MIT 协议。

## 许可证

本项目基于 **MIT License** 开源，详情见 [LICENSE](LICENSE)。

### 第三方音频资源

项目中的部分音频资源来自第三方平台，可能受不同许可证约束：

- Pixabay Content License: [Pixabay Content License](https://pixabay.com/service/license-summary/)
- CC0: [Creative Commons Zero License](https://creativecommons.org/publicdomain/zero/1.0/)
