import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Menu, Layout } from 'antd';
import Homepage from './pages/Homepage/Homepage';
import NoPage from './pages/Nopage/Nopage';
import LineOfCode from './pages/LineOfCode/LineOfCode';
import FileDiffViewer from './pages/FilieDiffViewer/FileDiffViewer';
import RepositoryDiffViewer from './pages/RepositoryDiffViewer/RepositoryDiffViewer';

import './App.css'; // Import a custom CSS file for global styles
import TempPage from './pages/TempPage/TempPage';

const { Header, Content } = Layout;

function App() {
  return (
    <Router>
      <Layout>
        <Header className="navbar">
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} breakpoint="md">
            <Menu.Item key="1">
              <Link to="/">Home</Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to="/line-of-code">Line of Code</Link>
            </Menu.Item>
            <Menu.Item key="3">
              <Link to="/file-diff">File Diff</Link>
            </Menu.Item>
            <Menu.Item key="4">
              <Link to="/repository-diff">Repository Diff</Link>
            </Menu.Item>
          </Menu>
        </Header>
        <hr />
        <Content className="content">
          <Routes>
            <Route exact path="/" element={<Homepage />} />
            <Route path="/line-of-code" element={<LineOfCode />} />
            <Route path="/file-diff" element={<FileDiffViewer />} />
            <Route path="/repository-diff" element={<RepositoryDiffViewer />} />
            <Route path="/temp-page" element={<TempPage />} />
            <Route path="*" element={<NoPage />} />
          </Routes>
        </Content>
      </Layout>
    </Router>
  );
}

export default App;
