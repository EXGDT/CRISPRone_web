const session = {
  name: 'this session',
  margin: 0,
  view: {
    id: 'linearGenomeView',
    minimized: false,
    type: 'LinearGenomeView',
    offsetPx: 191980240,
    bpPerPx: 0.1554251851851852,
    displayedRegions: [
      {
        refName: '10',
        start: 0,
        end: 133797422,
        reversed: false,
        assemblyName: 'GRCh38',
      },
    ],
    tracks: [
      {
        id: '4aZAiE-A3',
        type: 'ReferenceSequenceTrack',
        configuration: 'GRCh38-ReferenceSequenceTrack',
        minimized: false,
        displays: [
          {
            id: 'AD3gqvG0_6',
            type: 'LinearReferenceSequenceDisplay',
            height: 180,
            configuration:
              'GRCh38-ReferenceSequenceTrack-LinearReferenceSequenceDisplay',
            showForward: true,
            showReverse: true,
            showTranslation: true,
          },
        ],
      },
      {
        id: 'T6uhrtY40O',
        type: 'AlignmentsTrack',
        configuration: 'NA12878.alt_bwamem_GRCh38DH.20150826.CEU.exome',
        minimized: false,
        displays: [
          {
            id: 'FinKswChSr',
            type: 'LinearAlignmentsDisplay',
            configuration:
              'NA12878.alt_bwamem_GRCh38DH.20150826.CEU.exome-LinearAlignmentsDisplay',
            height: 179,
            lowerPanelType: 'LinearPileupDisplay',
          },
        ],
      },
    ],
    hideHeader: false,
    hideHeaderOverview: false,
    hideNoTracksActive: false,
    trackSelectorType: 'hierarchical',
    trackLabels: 'overlapping',
    showCenterLine: false,
    showCytobandsSetting: true,
    showGridlines: true,
  },
}

export default session
