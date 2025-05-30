import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import Foot from "../components/Foot/Foot";
import Head from "../components/Head/Head";
import MenuComponent from "@/components/Head/NavSwiper";
import './index.scss'

const MainLayOut = () => {
  return (
    <Layout style={{  minHeight: "100vh", backgroundColor: "#fff" }}>
      <Head />
      <MenuComponent />
      <div style={{ flex: 1 }}>
        <Outlet />
      </div>
      <Foot />
    </Layout>
  );
};

export default MainLayOut;
