export const CATEGORIES = [
  'AI训练师', 'AI评测', 'GEO', '前沿技术',
  '工具测评', '大佬访谈', '使用技巧', '人生感悟'
] as const

export type Category = typeof CATEGORIES[number]
