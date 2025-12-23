import EquipmentCorrelation from './pages/EquipmentCorrelation';
import Home from './pages/Home';
import LocationQuality from './pages/LocationQuality';
import MissionDetail from './pages/MissionDetail';
import MissionHistory from './pages/MissionHistory';
import PilotGroupTrends from './pages/PilotGroupTrends';
import PortfolioOverview from './pages/PortfolioOverview';
import Profile from './pages/Profile';
import QuickReference from './pages/QuickReference';
import Scenarios from './pages/Scenarios';
import StartCapture from './pages/StartCapture';
import ToolsLinks from './pages/ToolsLinks';
import TrainingVideos from './pages/TrainingVideos';
import Billing from './pages/Billing';
import __Layout from './Layout.jsx';


export const PAGES = {
    "EquipmentCorrelation": EquipmentCorrelation,
    "Home": Home,
    "LocationQuality": LocationQuality,
    "MissionDetail": MissionDetail,
    "MissionHistory": MissionHistory,
    "PilotGroupTrends": PilotGroupTrends,
    "PortfolioOverview": PortfolioOverview,
    "Profile": Profile,
    "QuickReference": QuickReference,
    "Scenarios": Scenarios,
    "StartCapture": StartCapture,
    "ToolsLinks": ToolsLinks,
    "TrainingVideos": TrainingVideos,
    "Billing": Billing,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};