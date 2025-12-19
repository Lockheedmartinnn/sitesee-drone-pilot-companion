import Home from './pages/Home';
import StartCapture from './pages/StartCapture';
import QuickReference from './pages/QuickReference';
import TrainingVideos from './pages/TrainingVideos';
import Scenarios from './pages/Scenarios';
import ToolsLinks from './pages/ToolsLinks';
import Profile from './pages/Profile';
import MissionHistory from './pages/MissionHistory';
import PortfolioOverview from './pages/PortfolioOverview';
import LocationQuality from './pages/LocationQuality';
import EquipmentCorrelation from './pages/EquipmentCorrelation';
import PilotGroupTrends from './pages/PilotGroupTrends';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "StartCapture": StartCapture,
    "QuickReference": QuickReference,
    "TrainingVideos": TrainingVideos,
    "Scenarios": Scenarios,
    "ToolsLinks": ToolsLinks,
    "Profile": Profile,
    "MissionHistory": MissionHistory,
    "PortfolioOverview": PortfolioOverview,
    "LocationQuality": LocationQuality,
    "EquipmentCorrelation": EquipmentCorrelation,
    "PilotGroupTrends": PilotGroupTrends,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};