import { bitable } from '@lark-base-open/js-sdk';
import { Outlet } from '@modern-js/runtime/router';

export default function Layout() {
  const updateTheme = async (theme: string) => {
    if (theme === 'DARK') {
      // 设置为暗黑主题
      document.body.setAttribute('arco-theme', 'dark');
      document.body.setAttribute('theme-mode', 'dark');
    } else {
      // 恢复亮色主题
      document.body.removeAttribute('arco-theme');
      document.body.removeAttribute('theme-mode');
    }
  };
  bitable.bridge.getTheme().then(theme => updateTheme(theme));
  bitable.bridge.onThemeChange(event => {
    updateTheme(event.data.theme);
  });
  return <Outlet />;
}
