import { Button, Result } from 'antd';
const App = () => (
  <Result
    status="403"
    title="暂未开发"
    subTitle="Sorry, this page is not developed yet."
    extra={<Button type="primary" onClick={() => window.location.href = '/'}>Back Home</Button>}
  />
);
export default App;