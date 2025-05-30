import { useEffect, useRef } from 'react';
import home_img from '@/assets/Image/home01.png';
import crisper_cas9 from '@/assets/Image/home02.png';
import GCD from '@/assets/Image/home03.png';
import GVI from '@/assets/Image/home04.png';
import GSS from '@/assets/Image/home05.png';
import './index.scss';

function Home() {
    // 编辑卡片和home_item的ref，用于实现效果
    const editCardsRef = useRef([]);
    const featuresRef = useRef(null); // 添加 features 的 ref

    // 编辑卡片数据
    const editCards = [
        {
            imgSrc: GCD,
            title: 'Gene conserved domain',
            paragraph: 'The optimal editing regions are marked according to the conservative domain information from Pfam, NCBI and InterPro.',
        },
        {
            imgSrc: GVI,
            title: 'Genome Variation Information',
            paragraph: 'Display genomic variation information of a given gene, including SNP, InDel and SV, to help select the best sgRNA.',
        },
        {
            imgSrc: GSS,
            title: 'Genome Spatial Structure',
            paragraph: 'Display the chromosome 3D genome information (Compartment, TAD, Loop et.al) of a given gene to help select the best CRISPR knock in site.',
        },
    ];

    // 监听元素是否进入视口
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in-view');
                        entry.target.classList.remove('out-of-view');
                    } else {
                        entry.target.classList.remove('in-view');
                        entry.target.classList.add('out-of-view');
                    }
                });
            },
            { threshold: 0.1 }
        );

        // 观察 features 部分
        if (featuresRef.current) {
            observer.observe(featuresRef.current);
        }

        // 观察卡片部分
        editCardsRef.current.forEach((card) => {
            if (card) observer.observe(card);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <div className="home">
            <section className="banner">
                <div className="banner-content">
                    <img src={home_img} alt="home banner" />
                    <div className="banner-text">
                        <h1 className="main-title">CRISPRone</h1>
                        <h2 className="sub-title">
                            Comprehensive gene editing tools provide convenience for gene editing work, and 
                            <b 
                            onClick={
                                () => {
                                    window.location.href = '/crispr/chat';
                                }
                            }
                            style={{
                                cursor: 'pointer',
                                margin: '0 10px',
                            }}
                            >ChatCRISPR intelligently</b>
                            answers questions
                        </h2>
                    </div>
                </div>
            </section>

            <section className="features">
                <div className="features-content" ref={featuresRef}>
                    <div className="features-image">
                        <img src={crisper_cas9} alt="CRISPR-Cas9 Edit" />
                    </div>
                    <div className="features-text">
                        <h2>Why Use CRISPRone?</h2>
                        <p>
                            CRISPRone is a comprehensive tool set that can meet any demand related to CRISPR. It includes sgRNA design of different CRISPR
                            variants and the edited analysis of transgenic plants.
                        </p>
                        <h2>Doloremque vero ex debitis veritatis?</h2>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quod itaque voluptate nesciunt laborum incidunt. Officia, quam
                            consectetur. Earum eligendi aliquam illum alias, unde optio accusantium soluta, iusto molestiae adipisci et?
                        </p>
                    </div>
                </div>
            </section>

            <section className="cards">
                {editCards.map(({ imgSrc, title, paragraph }, index) => (
                    <div key={index} className="card" ref={(el) => (editCardsRef.current[index] = el)}>
                        <div className="card-image">
                            <img src={imgSrc} alt={title} />
                        </div>
                        <div className="card-content">
                            <h2>{title}</h2>
                            <p>{paragraph}</p>
                            <button onClick={() => {
                                window.location.href = '/crispr/help#characteristics';
                            }}>More</button>
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
}

export default Home;

