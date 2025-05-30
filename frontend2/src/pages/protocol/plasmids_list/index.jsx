import './index.scss';
import plasmids_list_img from '@/assets/Image/example.png';

const plasmids_list_data = [
    {
        name: 'CRISPR/Cas9',
        description: "Some quick example text to build on the card title and make up the bulk of the card's content.",
        img: plasmids_list_img,
        id: 1,
    },
    {
        name: 'CRISPR-Cas12a (Cpf1)',
        description: "A cytidine deaminase sequence (APOBEC) fused with nCas9 and uracil glycosylase inhibitor (UGI) was inserted into our CRISPR/Cas9 plasmid (pRGEB32-GhU6.7). The editing efficiency ranged from 26.67 to 57.78% at the three target sites.",
        img: plasmids_list_img,
        id: 2,
    },
    {
        name: 'CRISPR-Cas12b (C2c1)',
        description: "We established various ABE vectors based on different engineered adenosine deaminase (TadA) proteins fused to Cas9 variants (dCas9, nCas9), enabling efficient A to G editing up to 64% efficiency on-target sites of the allotetraploid cotton genome.",
        img: plasmids_list_img,
        id: 3,
    },
    {
        name: 'CRISPR Cas13',
        description: "Some quick example text to build on the card title and make up the bulk of the card's content.",
        img: plasmids_list_img,
        id: 4,
    },
    {
        name: 'CRISPR Knock-ins',
        description: "Some quick example text to build on the card title and make up the bulk of the card's content.",
        img: plasmids_list_img,
        id: 5,
    },
    {
        name: 'GhCBE',
        description: "A cytidine deaminase sequence (APOBEC) fused with nCas9 and uracil glycosylase inhibitor (UGI) was inserted into our CRISPR/Cas9 plasmid (pRGEB32-GhU6.7). The editing efficiency ranged from 26.67 to 57.78% at the three target sites.",
        img: plasmids_list_img,
        id: 6,
    },
    {
        name: 'GhABE',
        description: "We established various ABE vectors based on different engineered adenosine deaminase (TadA) proteins fused to Cas9 variants (dCas9, nCas9), enabling efficient A to G editing up to 64% efficiency on-target sites of the allotetraploid cotton genome.",
        img: plasmids_list_img,
        id: 7,
    },
    {
        name: 'GhCBE + GhABE',
        description: "Some quick example text to build on the card title and make up the bulk of the card's content.",
        img: plasmids_list_img,
        id: 8,
    },
    {
        name: 'Prime Editing',
        description: "Prime EditingA cytidine deaminase sequence (APOBEC) fused with nCas9 and uracil glycosylase inhibitor (UGI) was inserted into our CRISPR/Cas9 plasmid (pRGEB32-GhU6.7). The editing efficiency ranged from 26.67 to 57.78% at the three target sites.",
        img: plasmids_list_img,
        id: 9,
    },
    {
        name: 'CRISPR activation',
        description: "We established various ABE vectors based on different engineered adenosine deaminase (TadA) proteins fused to Cas9 variants (dCas9, nCas9), enabling efficient A to G editing up to 64% efficiency on-target sites of the allotetraploid cotton genome.",
        img: plasmids_list_img,
        id: 10,
    },
    {
        name: 'CRISPR Epigenetics',
        description: "A cytidine deaminase sequence (APOBEC) fused with nCas9 and uracil glycosylase inhibitor (UGI) was inserted into our CRISPR/Cas9 plasmid (pRGEB32-GhU6.7). The editing efficiency ranged from 26.67 to 57.78% at the three target sites.",
        img: plasmids_list_img,
        id: 11,
    },
]
 
function PlasmidsList() {

    const btn = (id) => {
        alert(`${id}的详细信息`);
    }


    return (
        <div className="plasmids_list">
            <h1>Plasmids used in our labs</h1>
            <hr />
            <div className="plasmids_list_content">
                <div className="plasmids_list_content_item_menu">
                    {plasmids_list_data.map((item, index) => (
                        <div className="section" key={index} onClick={() => {
                            // 点击后，跳转到相应id的items
                            const target = document.getElementById(item.id);
                            target.scrollIntoView({ behavior: 'smooth' });
                        }}>
                           <h3>{item.name}</h3>
                        </div>
                    ))}
                </div>
                <div className="plasmids_list_content_item">
                    {plasmids_list_data.map((item, index) => (
                        <div className="items" key={index} id={item.id}>
                            <img src={item.img} alt="" />
                            <h3>{item.name}</h3>
                            <p>{item.description}</p>
                            <button className="read_more_btn" onClick={() => btn(item.id)}>Read More</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default PlasmidsList;