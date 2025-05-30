import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./pages/MainLayout";

const Home = lazy(() => import("./pages/home"));
const Cas9 = lazy(() => import("./pages/cas9"));
const Cas9_12_knock_submit = lazy(() => import('./pages/result/cas9_submit'));


const C2p1 = lazy(() => import("./pages/cas12/cpf1"));
const C2c1 = lazy(() => import("./pages/cas12/c2c1"));
const Cas13 = lazy(() => import('./pages/cas13'));
const Base = lazy(() => import('./pages/base_editer'));
const Primer = lazy(() => import('./pages/Primer_editor/Primer_editor'));
const Crispr_ra = lazy(() => import('./pages/crispr_a'));
const KnockIn = lazy(() => import('./pages/knock_in'));
const Crispr_epigenome = lazy(() => import('./pages/crispr_epigenome'));
const Deletion = lazy(() => import('./pages/fragment_editor/deletion'));
const Inversion = lazy(() => import('./pages/fragment_editor/inversion'));
const Translocation = lazy(() => import('./pages/fragment_editor/translocation'));
const GetPlasmids = lazy(() => import('./pages/protocol/get_plasmids'));
const PlasmidsList = lazy(() => import('./pages/protocol/plasmids_list'));
const BarcodeDesign = lazy(() => import('./pages/edited_analysis/barcode_design'));
const EditingAnaly = lazy(() => import('./pages/edited_analysis/editing_analy'));
const OffTarget = lazy(() => import('./pages/edited_analysis/offtarget_analy'));
const ChatCrispr = lazy(() => import('./pages/chatcrispr'));
const News = lazy(() => import('./pages/help_about/news/news'));
const Help = lazy(() => import('./pages/help_about/help/help'));
const ContactUs = lazy(() => import('./pages/help_about/contact_us/contact_us'));
const NonExist = lazy(() => import("./pages/缺省页/404"));
const NoWrite = lazy(() => import('./pages/缺省页/no_write'));

const Cas13_submit = lazy(() => import('./pages/result/cas13_submit'));
const Crispra_submit = lazy(() => import('./pages/result/crispra_submit'));
const Pe_submit = lazy(() => import('./pages/result/pe_submit'));
const Be_submit = lazy(() => import('./pages/result/be_submit'));
const Barcode_submit = lazy(() => import('./pages/result/barcode_submit'));
const Fe_submit = lazy(() => import('./pages/result/fe_submit'));
const Ep_submit = lazy(() => import('./pages/result/epigenome_submit'));
const Edit_submit = lazy(() => import('./pages/result/editing_analysis'));

function App() {


  return (
    <Suspense fallback={<div>加载中...</div>}>
      <Routes>
        <Route path="/crispr" element={<MainLayout />}>
          <Route path="*" element={<NoWrite />} />
          <Route path="" element={<Home />} />
          <Route path="home/*" element={<Home />} />
          <Route path="cas9/*" element={<Cas9 />} />
          <Route path="cas12/c2c1/*" element={<C2c1 />} />
          <Route path="cas12/cpf1/*" element={<C2p1 />} />
          <Route path="cas13/*" element={<Cas13 />} />
          <Route path="contact_us/*" element={<ContactUs />} />
          <Route path="knock_in/*" element={<KnockIn />} />
          <Route path="primer/*" element={<Primer />} />
          <Route path="base/*" element={<Base />} />
          <Route path="crispr_a/*" element={<Crispr_ra />} />
          <Route path="crispr_epigenome/*" element={<Crispr_epigenome />} />
          <Route path="news/*" element={<News />} />
          <Route path="help/*" element={<Help />} />
          <Route path="fragment_editor/deletion/*" element={<Deletion />} />
          <Route path="fragment_editor/inversion/*" element={<Inversion />} />
          <Route path="fragment_editor/translocation/*" element={<Translocation />} />
          <Route path="protocol/get_plasmids/*" element={<GetPlasmids />} />
          <Route path="protocol/plasmids_list/*" element={<PlasmidsList />} />
          <Route path="edited_analysis/off_target_analysis/*" element={<OffTarget />} />
          <Route path="edited_analysis/editing_analysis/*" element={<EditingAnaly />} />
          <Route path="edited_analysis/barcode_design/*" element={<BarcodeDesign />} />
          <Route path="chat/*" element={<ChatCrispr />} />

          <Route path="result/cas9_12_knock_in_submit/*" element={<Cas9_12_knock_submit />} />
          <Route path="result/cas13_submit/*" element={<Cas13_submit />} />
          <Route path="result/crispra_submit/*" element={<Crispra_submit />} /> 
          <Route path="result/pe_submit/*" element={<Pe_submit />} />
          <Route path="result/be_submit/*" element={<Be_submit />} />
          <Route path="result/barcode_submit/*" element={<Barcode_submit />} />
          <Route path="result/fe_submit/*" element={<Fe_submit />} />
          <Route path="result/ep_submit/*" element={<Ep_submit />} />
          <Route path="result/editing_submit/*" element={<Edit_submit />} />
        </Route>
        <Route path="/404" element={<NonExist />}></Route>
        <Route path="*" element={<Navigate to="/404" />} />
        <Route path="/" element={<Navigate to="/crispr/home/" />} />
      </Routes>
    </Suspense>
  );
}

export default App;

