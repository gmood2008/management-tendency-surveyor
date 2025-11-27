
import { Question } from './types';

// Styles for classification
export const STYLES = {
  RESULT: '结果与决策型',
  TEAM: '团队与协作型',
  PROCESS: '流程与稳健型',
  INNOVATION: '创新与变革型'
};

export const QUESTIONS: Question[] = [
  {
    id: 'q1',
    text: '1. 在管理活动中，您最看重的是什么？',
    type: 'single',
    options: [
      { id: 'q1_a', text: 'A. 目标设定', styleCategory: STYLES.RESULT },
      { id: 'q1_b', text: 'B. 团队激励', styleCategory: STYLES.TEAM },
      { id: 'q1_c', text: 'C. 过程监控', styleCategory: STYLES.PROCESS },
      { id: 'q1_d', text: 'D. 结果评估', styleCategory: STYLES.RESULT }
    ]
  },
  {
    id: 'q2',
    text: '2. 当团队成员出现分歧时，您通常会如何处理？',
    type: 'single',
    options: [
      { id: 'q2_a', text: 'A. 组织讨论，寻求共识', styleCategory: STYLES.TEAM },
      { id: 'q2_b', text: 'B. 做出决策，明确方向', styleCategory: STYLES.RESULT },
      { id: 'q2_c', text: 'C. 倾听各方意见，安抚情绪', styleCategory: STYLES.TEAM },
      { id: 'q2_d', text: 'D. 引入第三方，协助调解', styleCategory: STYLES.PROCESS }
    ]
  },
  {
    id: 'q3',
    text: '3. 在评估团队绩效时，您更倾向于关注？',
    type: 'single',
    options: [
      { id: 'q3_a', text: 'A. 个人贡献', styleCategory: STYLES.RESULT },
      { id: 'q3_b', text: 'B. 团队整体表现', styleCategory: STYLES.TEAM },
      { id: 'q3_c', text: 'C. 创新性和过程改进', styleCategory: STYLES.INNOVATION },
      { id: 'q3_d', text: 'D. 客户满意度', styleCategory: STYLES.RESULT }
    ]
  },
  {
    id: 'q4',
    text: '4. 您认为有效的管理者应该具备哪些核心素质？（多选）',
    type: 'multi',
    options: [
      { id: 'q4_a', text: 'A. 决策力' },
      { id: 'q4_b', text: 'B. 沟通能力' },
      { id: 'q4_c', text: 'C. 责任心' },
      { id: 'q4_d', text: 'D. 学习能力' },
      { id: 'q4_e', text: 'E. 同理心' }
    ]
  },
  {
    id: 'q5',
    text: '5. 在面对不确定性时，您更倾向于采取哪种管理风格？',
    type: 'single',
    options: [
      { id: 'q5_a', text: 'A. 计划周密，规避风险', styleCategory: STYLES.PROCESS },
      { id: 'q5_b', text: 'B. 灵活应变，抓住机遇', styleCategory: STYLES.INNOVATION },
      { id: 'q5_c', text: 'C. 依靠经验，稳步推进', styleCategory: STYLES.PROCESS },
      { id: 'q5_d', text: 'D. 鼓励试错，快速迭代', styleCategory: STYLES.INNOVATION }
    ]
  }
];

export const STYLE_DESCRIPTIONS: Record<string, string> = {
  [STYLES.RESULT]: '您倾向于目标导向，行事果断，注重效率和最终结果。在团队中常扮演“指挥官”角色。',
  [STYLES.TEAM]: '您非常重视人际关系和团队氛围，擅长激励和沟通。在团队中常扮演“粘合剂”角色。',
  [STYLES.PROCESS]: '您行事严谨，注重规则、细节和风险控制。在团队中常扮演“守护者”角色。',
  [STYLES.INNOVATION]: '您拥抱变化，喜欢尝试新方法，适应能力极强。在团队中常扮演“变革者”角色。'
};
