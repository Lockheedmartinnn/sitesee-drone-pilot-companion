import AuditLog from './pages/AuditLog';
import Billing from './pages/Billing';
import ChecklistActivityLog from './pages/ChecklistActivityLog';
import EquipmentCorrelation from './pages/EquipmentCorrelation';
import GPSVerifier from './pages/GPSVerifier';
import Home from './pages/Home';
import LocationQuality from './pages/LocationQuality';
import MissionDataManagement from './pages/MissionDataManagement';
import MissionDetail from './pages/MissionDetail';
import MissionHistory from './pages/MissionHistory';
import MissionMarkupQuiz from './pages/MissionMarkupQuiz';
import PilotGroupTrends from './pages/PilotGroupTrends';
import PortfolioOverview from './pages/PortfolioOverview';
import Profile from './pages/Profile';
import QuickReference from './pages/QuickReference';
import Scenarios from './pages/Scenarios';
import StartCapture from './pages/StartCapture';
import ToolsLinks from './pages/ToolsLinks';
import TrainingVideos from './pages/TrainingVideos';
import WeatherAnalysis from './pages/WeatherAnalysis';
import ChecklistAnalytics from './pages/ChecklistAnalytics';
import __Layout from './Layout.jsx';


export const PAGES = {
    "AuditLog": AuditLog,
    "Billing": Billing,
    "ChecklistActivityLog": ChecklistActivityLog,
    "EquipmentCorrelation": EquipmentCorrelation,
    "GPSVerifier": GPSVerifier,
    "Home": Home,
    "LocationQuality": LocationQuality,
    "MissionDataManagement": MissionDataManagement,
    "MissionDetail": MissionDetail,
    "MissionHistory": MissionHistory,
    "MissionMarkupQuiz": MissionMarkupQuiz,
    "PilotGroupTrends": PilotGroupTrends,
    "PortfolioOverview": PortfolioOverview,
    "Profile": Profile,
    "QuickReference": QuickReference,
    "Scenarios": Scenarios,
    "StartCapture": StartCapture,
    "ToolsLinks": ToolsLinks,
    "TrainingVideos": TrainingVideos,
    "WeatherAnalysis": WeatherAnalysis,
    "ChecklistAnalytics": ChecklistAnalytics,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};