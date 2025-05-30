import { useEffect, useState } from 'react';
import {helpItems} from '@/utils/datas/static-data';
import './help.scss';

function Help() {

    const [activeId, setActiveId] = useState('');

    useEffect(() => {
        const handleScroll = () => {
            let currentId = '';
            helpItems.forEach(item => {
                const element = document.getElementById(item.id);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    if (rect.top <= 140 && rect.bottom >= 140) {
                        currentId = item.id;
                    }
                }
            });
            setActiveId(currentId);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="help">
            <h1>Help</h1>
            <hr />
            <div className="help-content">
                <div className="nav_swiper">
                    <ul className='nav_swiper_item'>
                        {helpItems.map((item, index) => (
                            <li 
                                key={index} 
                                className={activeId === item.id ? 'active' : ''} 
                                onClick={() => {
                                    const target = document.getElementById(item.id);
                                    target.scrollIntoView({ behavior: 'smooth' });
                                }}
                            >
                                {item.question}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="help-content-right">
                    <ul className='help_content_item'>
                        {helpItems.map((item, index) => (
                            <li key={index} id={item.id}>
                                <p>{item.question}</p>
                                <hr />
                                <div className="answer">
                                    {item.answer}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Help;