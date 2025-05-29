import GenAIWebpageEligibilityService from './GenAIWebpageEligibilityService';

const eligibilityService = new GenAIWebpageEligibilityService();

// 安全调用函数
async function safeShouldShowTouchpoints() {
  try {
    return await eligibilityService.shouldShowTouchpoints();
  } catch (error) {
    console.error('Error checking touchpoint eligibility:', error);
    return false;
  }
}

// 使用示例
async function initContentScript() {
  try {
    const shouldShow = await safeShouldShowTouchpoints();
    if (shouldShow) {
      // 显示相关内容
    }
  } catch (error) {
    console.error('Content script initialization failed:', error);
  }
}

// 确保在浏览器环境中执行
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', initContentScript);
}

export { initContentScript, safeShouldShowTouchpoints };