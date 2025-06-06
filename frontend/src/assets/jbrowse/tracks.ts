const tracks = [
  {
    type: 'FeatureTrack',
    trackId: 'Zea_mays.processed',
    name: 'Zea_mays.processed',
    adapter: {
      type: 'Gff3Adapter',
      gffLocation: {
        uri: '/jbrowse/Zea_mays.processed.gff3',
        locationType: 'UriLocation'
      }
    },
    assemblyNames: ['Zea_mays']
  }
]

export default tracks  
