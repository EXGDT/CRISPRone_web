import { useState, useEffect } from "react";
import "./Head.scss";
import { Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const items = [
    { key: "1", label: <Link to="/crispr/home">Home</Link> },
    { key: "2", label: <Link to="/crispr/cas9">Cas 9</Link> },
    { 
        key: "3", 
        label: 'Cas 12', 
        children: [
            { key: "3-1", label: <Link to="/crispr/cas12/cpf1">Cas12b/Cpf1</Link> },
            { key: "3-2", label: <Link to="/crispr/cas12/c2c1">Cas12a/C2c1</Link> },
        ] 
    },
    { key: "4", label: <Link to="/crispr/cas13">Cas 13</Link> },
    { key: "5", label: <Link to="/crispr/base">Base Editor</Link> },
    { key: "6", label: <Link to="/crispr/primer">Primer Editor</Link> },
    { key: "9", label: <Link to="/crispr/crispr_a">CRISPRa</Link> },
    { key: "8", label: <Link to="/crispr/knock_in">CRISPR Knock-in</Link> },
    { key: "7", label: <Link to="/crispr/crispr_epigenome">CRISPR Epigenome</Link> },
    { 
        key: "10",
        label: 'Fragment Editor',
        children:[
            { key: "10-1", label: <Link to="/crispr/fragment_editor/deletion">Deletion</Link> },
            { key: "10-2", label: <Link to="/crispr/fragment_editor/inversion">Inversion</Link> },
            { key: "10-3", label: <Link to="/crispr/fragment_editor/translocation">Translocation</Link> },
        ]
    },
    { 
        key: "11",
        label: 'Edited Analysis',
        children: [
            { key: "11-1", label: <Link to="/crispr/edited_analysis/barcode_design">Barcode Design</Link> },
            { key: "11-2", label: <Link to="/crispr/edited_analysis/editing_analysis">Editing Analysis</Link> },
            { key: "11-3", label: <Link to="/crispr/edited_analysis/off_target_analysis">Off-Target Analysis</Link> },
        ]
    },
    { key: "12", label: 'Protocol',
        children: [
            { key: "12-1", label: <Link to="/crispr/protocol/plasmids_list">Plasmids List</Link> },
            { key: "12-2", label: <Link to="/crispr/protocol/get_plasmids">Get Plasmids</Link> },
        ]
     },
    { key: "13", label: <Link to="/crispr/chat">ChatCRISPR</Link> },
    { key: "14", label: 'Help&About',
        children: [
            { key: "14-1", label: <Link to="/crispr/help">Help</Link> },
            { key: "14-3", label: <Link to="/crispr/news">News</Link> },
            { key: "14-4", label: <Link to="/crispr/contact_us">Contact US</Link> },
        ]
    },
    {
        key: "15",label: '结果示意图',
        children:[
            { key: "15-1", label: <Link to="/crispr/result/pe_submit">PE 结果图展示</Link> },
            { key: "15-2", label: <Link to="/crispr/result/cas9_12_knock_in_submit">cas9/12/knock_in 结果图展示</Link> },
            { key: "15-3", label: <Link to="/crispr/result/cas13_submit">cas13 结果图展示</Link> },
            { key: "15-4", label: <Link to="/crispr/result/be_submit">BE 结果图展示</Link> },
            { key: "15-5", label: <Link to="/crispr/result/crispra_submit">CRISPRa 结果图展示</Link> },
            { key: "15-6", label: <Link to="/crispr/result/barcode_submit">barcode 结果图展示</Link> },
            { key: "15-7", label: <Link to="/crispr/result/fe_submit">FE 结果图展示</Link> },
            { key: "15-8", label: <Link to="/crispr/result/ep_submit">EP 结果图展示</Link> },
            { key: "15-9", label: <Link to="/crispr/result/editing_submit">Editing_ala 结果图展示</Link> },
        ]
    }
];

// 自定义菜单组件样式
const CustomMenu = styled(Menu)`
  background-color: #DEECE8;
  position: sticky;
  top: 0;
  z-index: 999;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  .ant-menu-submenu-title {
    font-size: 13px;
    font-weight: 500;
    }

  .ant-menu-item {
    width: auto;
    font-size: 13px;
  }
`
function MenuComponent() {
    const [current, setCurrent] = useState('1');
    const location = useLocation();

    // 读取 localStorage 中的值
    // useEffect(() => {
    //     const savedCurrent = localStorage.getItem('selectedMenu');
    //     if (savedCurrent) {
    //         setCurrent(savedCurrent);
    //     } else {
    //         // 如果没有保存的值，基于当前路径设置初始值
    //         const currentKey = items.find(item => item.label.props.to === location.pathname)?.key || '1';
    //         setCurrent(currentKey);
    //     }
    // }, [location.pathname]);

    // 监听地址栏变化，更新当前选中的菜单项
    useEffect(() => {
        // 获取不包含hash的路径
        const pathWithoutHash = location.pathname;

        const currentKey = items.find(item => {
            // 确保 item.label 是一个有效的 React 组件，并且有 props.to
            return item.label && item.label.props && item.label.props.to === pathWithoutHash;
        })?.key || '1';

        // 检查是否为二级导航
        const parentKey = items.find(item => 
            item.children && item.children.some(child => child.label.props.to === pathWithoutHash)
        )?.key;

        // 如果是二级导航，设置一级导航为选中状态
        setCurrent(parentKey || currentKey);
        localStorage.setItem('selectedMenu', parentKey || currentKey); // 更新 localStorage
    }, [location.pathname]); // 只监听 pathname 的变化，忽略 hash 的变化

    const onClick = (e) => {
        console.log('click ', e);
        setCurrent(e.key);

        // 将选中的菜单项存入 localStorage
        localStorage.setItem('selectedMenu', e.key);
    };

    return (
        <CustomMenu
            // style={{ width: '100%' }} 
            onClick={onClick} 
            selectedKeys={[current]} 
            mode="horizontal" 
            items={items} 
        />
    );
}

export default MenuComponent;

