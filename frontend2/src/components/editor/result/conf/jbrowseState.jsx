import { createViewState as createJBrowseViewState } from "@jbrowse/react-linear-genome-view";

let jbrowseState = null;

// 创建基础配置
const createBaseState = (jbrowseConfig) => ({
    assembly: {
        name: jbrowseConfig.assembly.name,
        sequence: {
            type: "ReferenceSequenceTrack",
            trackId: "Gossypium_hirsutum_T2T-Jin668_HZAU_genome-ReferenceSequenceTrack",
            adapter: {
                type: "IndexedFastaAdapter",
                fastaLocation: {
                    uri: jbrowseConfig.assembly.fasta,
                    locationType: "UriLocation",
                },
                faiLocation: {
                    uri: jbrowseConfig.assembly.fai,
                    locationType: "UriLocation",
                },
            },
        },
    },
    tracks: [{
        type: "FeatureTrack",
        trackId: "file.gff3",
        name: jbrowseConfig.tracks.name,
        assemblyNames: [jbrowseConfig.assembly.name],
        adapter: {
            type: "Gff3TabixAdapter",
            gffGzLocation: {
                uri: jbrowseConfig.tracks.gff3_gz,
                locationType: "UriLocation"
            },
            index: {
                location: {
                    uri: jbrowseConfig.tracks.gff3_tbi,
                    locationType: "UriLocation"
                },
                indexType: "CSI"
            }
        }
    }],
    location: jbrowseConfig.position,
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
                    "assemblyName": jbrowseConfig.assembly.name
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

export const initJBrowseState = (jbrowseConfig) => {
    const baseState = createBaseState(jbrowseConfig);
    jbrowseState = createJBrowseViewState(baseState);
    return jbrowseState;
};

export const getJBrowseState = () => jbrowseState;

// 新增：从结果数据创建状态
export const createJBrowseStateFromResult = (resultData) => {
    if (resultData?.JbrowseInfo) {
        return initJBrowseState(resultData.JbrowseInfo);
    }
    return null;
}; 