import { Empty, Menu, Typography } from 'antd';
import { CompanyBusinessLayout } from '@company/ui/business-layout';
import { CompanyPageHeader } from '@company/ui/page-header';
import { CompanySurface } from '@company/ui/surface';
import { adminRoutes } from '../routes';

const { Text } = Typography;

export function App() {
  const activeRoute = adminRoutes[0];
  const navigation = (
    <div className="admin-navigation">
      <div className="admin-navigation__brand"><Text strong>后台管理系统</Text></div>
      <Menu
        mode="inline"
        selectedKeys={[activeRoute.key]}
        items={adminRoutes.map((route) => ({ key: route.key, label: route.title }))}
      />
    </div>
  );

  return (
    <div className="admin-app">
      <CompanyBusinessLayout
        className="admin-business-layout"
        navigation={navigation}
        header={<CompanyPageHeader className="admin-page-header" breadcrumbItems={[{ title: activeRoute.title }]} />}
      >
        <CompanySurface className="admin-business-surface" tone="business">
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无业务模块" />
        </CompanySurface>
      </CompanyBusinessLayout>
    </div>
  );
}
