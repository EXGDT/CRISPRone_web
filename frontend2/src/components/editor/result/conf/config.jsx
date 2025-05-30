// 从 localStorage 获取保存的 URLs，如果没有则返回 null
const getSavedUrls = () => {
    const savedUrls = localStorage.getItem('crispr_urls');
    return savedUrls ? JSON.parse(savedUrls) : null;
};

// 动态URLs配置
export let URLS = getSavedUrls() || {
    fasta: '',
    fai: '',
    gff3_gz: '',
    gff3_tbi: '',
    json: '',
    position: '',
    assembly_name: 'Gossypium_hirsutum_T2T-Jin668_HZAU_genome',
    tracks_name: 'file.gff3'
};

// 更新URLs的函数
export const updateConfigUrls = (newUrls) => {
    URLS = { ...URLS, ...newUrls };
    // 保存到 localStorage
    localStorage.setItem('crispr_urls', JSON.stringify(URLS));
    // 重新创建state
    state = createViewState();
};

import { createViewState as createJBrowseViewState } from "@jbrowse/react-linear-genome-view";

// 创建基础配置
const createBaseState = () => ({
    assembly: {
        name: URLS.assembly_name,
        sequence: {
            type: "ReferenceSequenceTrack",
            trackId: "Gossypium_hirsutum_T2T-Jin668_HZAU_genome-ReferenceSequenceTrack",
            adapter: {
                type: "IndexedFastaAdapter",
                fastaLocation: {
                    uri: URLS.fasta,
                    locationType: "UriLocation",
                },
                faiLocation: {
                    uri: URLS.fai,
                    locationType: "UriLocation",
                },
            },
        },
    },
    tracks: [{
        type: "FeatureTrack",
        trackId: "file.gff3",
        name: URLS.tracks_name,
        assemblyNames: [URLS.assembly_name],
        adapter: {
            type: "Gff3TabixAdapter",
            gffGzLocation: {
                uri: URLS.gff3_gz,
                locationType: "UriLocation"
            },
            index: {
                location: {
                    uri: URLS.gff3_tbi,
                    locationType: "UriLocation"
                },
                indexType: "CSI"
            }
        }
    }],
    location: URLS.position,
    defaultSession: {
        "id": "oAijenQUiz0L9U1vnRvh9",
        "name": "default-session",
        "margin": 0,
        "drawerPosition": "right",
        "drawerWidth": 384,
        "widgets": {},
        "activeWidgets": {},
        "minimized": false,
        "connectionInstances": [],
        "sessionTracks": [],
        "view": {
            "id": "linearGenomeView",
            "minimized": false,
            "type": "LinearGenomeView",
            "offsetPx": 574926,
            "bpPerPx": 2.613251087393094,
            "displayedRegions": [
                {
                    "reversed": false,
                    "refName": "2",
                    "start": 0,
                    "end": 108101717,
                    "assemblyName": URLS.assembly_name
                }
            ],
            "tracks": [
                {
                    "id": "36D2JvtMu9BCCwmgFcXM7",
                    "type": "ReferenceSequenceTrack",
                    "configuration": "Gossypium_hirsutum_T2T-Jin668_HZAU_genome-ReferenceSequenceTrack",
                    "minimized": false,
                    "displays": [
                        {
                            "id": "Dc_w8QBWD8PsojaMwlVSN",
                            "type": "LinearReferenceSequenceDisplay",
                            "heightPreConfig": 120,
                            "configuration": "Gossypium_hirsutum_T2T-Jin668_HZAU_genome-ReferenceSequenceTrack-LinearReferenceSequenceDisplay",
                            "showForward": true,
                            "showReverse": true,
                            "showTranslation": true
                        }
                    ]
                },
                {
                    "id": "kUFojABIpFjT-xmwCT6-s",
                    "type": "FeatureTrack",
                    "configuration": "file.gff3",
                    "minimized": false,
                    "displays": [
                        {
                            "id": "NOV0H2L1rVva6IdV2-c8n",
                            "type": "LinearBasicDisplay",
                            "heightPreConfig": 200,
                            "configuration": "file.gff3-LinearBasicDisplay"
                        }
                    ]
                }
            ],
            "hideHeader": false,
            "hideHeaderOverview": false,
            "hideNoTracksActive": false,
            "trackSelectorType": "hierarchical",
            "showCenterLine": false,
            "showCytobandsSetting": true,
            "trackLabels": "",
            "showGridlines": true,
            "highlight": [],
            "colorByCDS": false,
            "showTrackOutlines": true
        }
    }
});

// 创建视图状态
const createViewState = () => {
    const baseState = createBaseState();
    return createJBrowseViewState(baseState);
};

// 导出当前state（让它可变）
export let state = createViewState();