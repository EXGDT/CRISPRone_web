import { useEffect, useState } from 'react';
import logo from '@/assets/Image/logo.png';
import { WechatOutlined, BilibiliOutlined, FacebookOutlined, TwitterOutlined, GithubOutlined } from '@ant-design/icons';

const Head = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // 向下滚动时隐藏
      if (currentScrollY > lastScrollY) {
        setIsVisible(false);
      }
      // 向上滚动到顶部时显示
      else if (currentScrollY < 50) {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return (
    <div className={`head ${isVisible ? '' : 'hide'}`}>
      <div className="head-logo">
        <img src={logo} alt="logo" className="head-logo-img" />
        <span className="head-logo-text">CRISPRone：An improved CRISPR/Cas protein tool for genome editing in plants</span>
      </div>
      <div className="head-social-media">
        <div className="head-social-media-item"><span>Follow CRISPRone on social media</span></div>
        <ul className="head-social-media-list">
          <li>
            <a href="" target='blank'>
              <WechatOutlined aria-label="WeChat" />
            </a>
          </li>
          <li>
            <a href="https://space.bilibili.com/62795729" target='blank'>
              <BilibiliOutlined aria-label="Bilibili" />
            </a>
          </li>
          <li>
            <a href="https://www.facebook.com/mdbootstrap" target='blank'>
              <FacebookOutlined aria-label="Facebook" />
            </a>
          </li>
          <li>
            <a href="https://github.com/tiramisutes" target='blank'>
              <GithubOutlined aria-label="Github" />
            </a>
          </li>
          <li>
            <a href="https://twitter.com/hopetogy" target='blank'>
              <TwitterOutlined aria-label="Twitter" />
            </a>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Head;

