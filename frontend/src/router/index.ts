import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import Cas9View from '@/views/Cas9View.vue'
import Cas9ResultView from '@/views/Cas9ResultView.vue'
import Cas12aView from '@/views/Cas12aView.vue'
import Cas12bView from '@/views/Cas12bView.vue'
import Cas13View from '@/views/Cas13View.vue'
import baseEditorView from '@/views/BaseEditorView.vue'
import PrimeEditorView from '@/views/PrimeEditorView.vue'
import CRISPRaView from '@/views/CRISPRaView.vue'
import CRISPRKnockInView from '@/views/CRISPRKnockInView.vue'
import CRISPREpigenomeView from '@/views/CRISPREpigenomeView.vue'
import FragmentEditorDeletionView from '@/views/FragmentEditorDeletionView.vue'
import FragmentEditorInversionView from '@/views/FragmentEditorInversionView.vue'
import FragmentEditorTranslocationView from '@/views/FragmentEditorTranslocationView.vue'
import BarcodeDesignView from '@/views/BarcodeDesignView.vue'
import EditingAnalysisView from '@/views/EditingAnalysisView.vue'
import OffTargetAnalysisView from '@/views/OffTargetAnalysisView.vue'
import ProtocolPlasmidListView from '@/views/ProtocolPlasmidListView.vue'
import ProtocolGetPlasmidsView from '@/views/ProtocolGetPlasmidsView.vue'
import ChatCRISPRView from '@/views/ChatCRISPRView.vue'
import HelpView from '@/views/HelpView.vue'
import DownloadView from '@/views/DownloadView.vue'
import NewsView from '@/views/NewsView.vue'
import ContactView from '@/views/ContactView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/cas9',
      name: 'cas9',
      component: Cas9View
    },
    {
      path: '/cas9_result',
      name: 'cas9_result',
      component: Cas9ResultView
    },
    {
      path: '/cas12a',
      name: 'cas12a',
      component: Cas12aView
    },
    {
      path: '/cas12b',
      name: 'cas12b',
      component: Cas12bView
    },
    {
      path: '/cas13',
      name: 'cas13',
      component: Cas13View
    },
    {
      path: '/baseEditor',
      name: 'baseEditor',
      component: baseEditorView
    },
    {
      path: '/PrimeEditor',
      name: 'PrimeEditor',
      component: PrimeEditorView
    },
    {
      path: '/CRISPRa',
      name: 'CRISPRa',
      component: CRISPRaView
    },
    {
      path: '/CRISPRKnockIn',
      name: 'CRISPRKnockIn',
      component: CRISPRKnockInView
    },
    {
      path: '/CRISPREpigenome',
      name: 'CRISPREpigenome',
      component: CRISPREpigenomeView
    },
    {
      path: '/FragmentEditorDeletion',
      name: 'FragmentEditorDeletion',
      component: FragmentEditorDeletionView
    },
    {
      path: '/FragmentEditorInversion',
      name: 'FragmentEditorInversion',
      component: FragmentEditorInversionView
    },
    {
      path: '/FragmentEditorTranslocation',
      name: 'FragmentEditorTranslocation',
      component: FragmentEditorTranslocationView
    },
    {
      path: '/BarcodeDesign',
      name: 'BarcodeDesign',
      component: BarcodeDesignView
    },
    {
      path: '/EditingAnalysis',
      name: 'EditingAnalysis',
      component: EditingAnalysisView
    },
    {
      path: '/OffTargetAnalysis',
      name: 'OffTargetAnalysis',
      component: OffTargetAnalysisView
    },
    {
      path: '/ProtocolPlasmidList',
      name: 'ProtocolPlasmidList',
      component: ProtocolPlasmidListView
    },
    {
      path: '/ProtocolGetPlasmids',
      name: 'ProtocolGetPlasmids',
      component: ProtocolGetPlasmidsView
    },
    {
      path: '/ChatCRISPR',
      name: 'ChatCRISPR',
      component: ChatCRISPRView
    },
    {
      path: '/Help',
      name: 'Help',
      component: HelpView
    },
    {
      path: '/Download',
      name: 'Download',
      component: DownloadView
    },
    {
      path: '/News',
      name: 'News',
      component: NewsView
    },
    {
      path: '/Contact',
      name: 'Contact',
      component: ContactView
    },
  ]
})

export default router
