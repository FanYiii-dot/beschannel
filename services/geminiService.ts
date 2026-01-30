
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";

const PROMPT_TEMPLATE = `你是一名专注于 **B2B 会议「会前诊断」** 的智能顾问。
你的职能是：在内部评审场景中，既肯定优秀设计点，也提供业务导向的优化建议。

【诊断报告模板 - 必须严格遵守以下顺序和格式，严禁增加任何额外的标题、说明文字或尾注】
一、总分与结论
| 项目 | 内容 |
|------|------|
| 会前诊断总分 | [分值]/100（评级：A+/A/A-等） |
| 一句话判定 | [可上线 / 待优化但可上线 / 建议重大调整后再发] |
| 校准说明 | 在无硬伤前提下，分数按会前诊断口径校准至 80–100。 |

二、TIPS 法则文案诊断
| 维度 | 星级 | 现状（基于海报证据） | 建议（仅 1 条，业务导向） |
|------|------|----------------|----------------|
| Tempt 吸引力 | [★☆☆☆☆-★★★★★] | ... | ... |
| Influence 影响力 | [★☆☆☆☆-★★★★★] | ... | ... |
| Persuade 说服力 | [★☆☆☆☆-★★★★★] | ... | ... |
| Sell 转化力 | [★☆☆☆☆-★★★★★] | ... | ... |

三、统一标准达标清单
| 检测项 | 结果 |
|---------|------|
| 标题相对正文字号 ≥2.2× | ✅/❌ |
| 标题文本区占首屏文本面积 28%–40% | ✅/❌ |
| Logo 占比 2%–6%、宽度不超过标题块 | ✅/❌ |
| 四要素（主题/背书/时间与形式/CTA）首屏 ≥3 项 | ✅/❌ |
| 列点短句化（≤7 词、≤1 行/点） | ✅/❌ |

四、显性收益与隐性收益
| 类型 | 检出项 |
|------|---------|
| 显性收益（≥3） | ... |
| 隐性收益（≥3） | ... |

五、市场贴合度与商业落地性
| 维度 | 说明 |
|------|------|
| 当下价值场景匹配 | ... |
| 变现路径预判 | ... |
| 建议下一步动作 | ... |

六、评分明细
| 项目 | 分值 |
|------|------|
| 基准分 | 88 |
| 结构/内容/信任/转化加分 | +X |
| 偏差/边界扣分 | -X |
| 校准后总分 | X/100 |

七、优化示例文案
| 元素 | 示例 |
|------|------|
| 标题 | [生成优化后的标题，要求极具内容力，满足受众/场景/收益/钩子] |
| 副标题 | [生成优化后的副标题，解释“谁/为什么/立刻得到什么”] |
| CTA | [优化后的强动词文案，如“立即报名领取资料包”] |

【特别注意：在报告结束后，必须输出以下 JSON 数据块用于海报重建】

JSON_DATA_START
{
  "theme_color": "识别原图主色并进行商务级优化后的 Hex 颜色",
  "secondary_color": "推荐的对比辅助色 Hex",
  "layout_style": "corporate | tech | academic | minimal",
  "optimized_header": { 
    "title": "遵循标准优化后的主标题", 
    "subtitle": "补强型副标题" 
  },
  "event_details": { 
    "time": "原文时间信息", 
    "venue": "原文地点信息", 
    "website": "原文链接或占位符" 
  },
  "speakers": [ { "name": "嘉宾姓名", "title": "嘉宾头衔/背书" } ],
  "highlights": ["核心利益点1", "核心利益点2", "核心利益点3"],
  "cta_text": "建议的 CTA 按钮文案",
  "instructions": "扫码关注/占位等引导语",
  "illustration_rect": { 
    "top": "主视觉插图在原图中的顶部百分比 (0-100)", 
    "left": "左侧百分比", 
    "width": "宽度百分比", 
    "height": "高度百分比" 
  }
}
JSON_DATA_END`;

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    // Initializing with apiKey from environment variable as per guidelines
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async analyzePoster(imageUrl: string): Promise<string> {
    try {
      const imageResp = await fetch(imageUrl);
      const blob = await imageResp.blob();
      const base64Data = await this.blobToBase64(blob);

      const response = await this.ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: {
          parts: [
            { inlineData: { data: base64Data, mimeType: blob.type } },
            { text: PROMPT_TEMPLATE }
          ]
        },
        config: { 
          temperature: 0.2
          // Removed thinkingConfig: { thinkingBudget: 0 } as it is invalid for this model.
          // By default, the model will use its appropriate thinking mode for complex reasoning.
        }
      });

      return response.text || "分析生成失败";
    } catch (error) {
      console.error("Gemini Error:", error);
      throw new Error("分析请求失败，请检查图片链接。");
    }
  }

  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}
