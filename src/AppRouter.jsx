import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import MyNFTs from "./pages/MyNfts";

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/my-nfts" element={<MyNFTs />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;
