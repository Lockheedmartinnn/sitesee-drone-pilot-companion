import EquipmentCorrelation from './pages/EquipmentCorrelation';
import Home from './pages/Home';
import LocationQuality from './pages/LocationQuality';
import PilotGroupTrends from './pages/PilotGroupTrends';
import Profile from './pages/Profile';
import QuickReference from './pages/QuickReference';
import Scenarios from './pages/Scenarios';
import StartCapture from './pages/StartCapture';
import ToolsLinks from './pages/ToolsLinks';
import TrainingVideos from './pages/TrainingVideos';
import MissionDetail from './pages/MissionDetail';
import MissionHistory from './pages/MissionHistory';
import PortfolioOverview from './pages/PortfolioOverview';
import __Layout from './Layout.jsx';


export const PAGES = {
    "EquipmentCorrelation": EquipmentCorrelation,
    "Home": Home,
    "LocationQuality": LocationQuality,
    "PilotGroupTrends": PilotGroupTrends,
    "Profile": Profile,
    "QuickReference": QuickReference,
    "Scenarios": Scenarios,
    "StartCapture": StartCapture,
    "ToolsLinks": ToolsLinks,
    "TrainingVideos": TrainingVideos,
    "MissionDetail": MissionDetail,
    "MissionHistory": MissionHistory,
    "PortfolioOverview": PortfolioOverview,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};