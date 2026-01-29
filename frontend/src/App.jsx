import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Switch page manually for now */}
        <PrivacyPolicy />
        {/* <TermsOfService /> */}
      </main>
      <Footer />
    </div>
  );
}
