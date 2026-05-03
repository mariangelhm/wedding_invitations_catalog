import RomanticMotionTemplate from './romantic-motion/RomanticMotionTemplate.vue';

export const templateRegistry = {
  'romantic-motion': RomanticMotionTemplate,
};

export function getTemplateComponent(templateComponent) {
  return templateRegistry[templateComponent] || null;
}
