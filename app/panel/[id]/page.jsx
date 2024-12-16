'use client';
import {useEffect, useState} from 'react';
import {useParams} from 'next/navigation';
import fetchPanelById from '@/utils/v2/fetchPanelById';
const PanelPage = () => {
    const {id} = useParams();
    const [panel, setPanel] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchPanel = async () => {
            if (!id) {
                return;
            }
            try {
                const panel = await fetchPanelById(id);
                setPanel(panel);
                // console.log("panel", panel);
            } catch (error) {
                console.error("Panel operation failed", error);
            }finally {
                setLoading(false);
            }
            
        };
        if(panel === null) {
            fetchPanel();
        }
    }, [id, panel]);

    return ( 
        <div>PanelPage</div>

     );
}
 
export default PanelPage;