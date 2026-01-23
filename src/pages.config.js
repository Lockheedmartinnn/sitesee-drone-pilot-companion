import AuditLog from './pages/AuditLog';
import Billing from './pages/Billing';
import ChecklistActivityLog from './pages/ChecklistActivityLog';
import ChecklistAnalytics from './pages/ChecklistAnalytics';
import EquipmentCorrelation from './pages/EquipmentCorrelation';
import FieldOperationsHub from './pages/FieldOperationsHub';
import GPSVerifier from './pages/GPSVerifier';
import Home from './pages/Home';
import LocationQuality from './pages/LocationQuality';
import MissionDataManagement from './pages/MissionDataManagement';
import MissionDetail from './pages/MissionDetail';
import MissionHistory from './pages/MissionHistory';
import PanoramaGuide from './pages/PanoramaGuide';
import PilotGroupTrends from './pages/PilotGroupTrends';
import PortfolioOverview from './pages/PortfolioOverview';
import Profile from './pages/Profile';
import QuickReference from './pages/QuickReference';
import Scenarios from './pages/Scenarios';
import StandardCaptureChecklist from './pages/StandardCaptureChecklist';
import StartCapture from './pages/StartCapture';
import ToolsLinks from './pages/ToolsLinks';
import TrainingHub from './pages/TrainingHub';
import TrainingVideos from './pages/TrainingVideos';
import WeatherAnalysis from './pages/WeatherAnalysis';
import RooftopTrainingModules from './pages/RooftopTrainingModules';
import __Layout from './Layout.jsx';


export const PAGES = {
    "AuditLog": AuditLog,
    "Billing": Billing,
    "ChecklistActivityLog": ChecklistActivityLog,
    "ChecklistAnalytics": ChecklistAnalytics,
    "EquipmentCorrelation": EquipmentCorrelation,
    "FieldOperationsHub": FieldOperationsHub,
    "GPSVerifier": GPSVerifier,
    "Home": Home,
    "LocationQuality": LocationQuality,
    "MissionDataManagement": MissionDataManagement,
    "MissionDetail": MissionDetail,
    "MissionHistory": MissionHistory,
    "PanoramaGuide": PanoramaGuide,
    "PilotGroupTrends": PilotGroupTrends,
    "PortfolioOverview": PortfolioOverview,
    "Profile": Profile,
    "QuickReference": QuickReference,
    "Scenarios": Scenarios,
    "StandardCaptureChecklist": StandardCaptureChecklist,
    "StartCapture": StartCapture,
    "ToolsLinks": ToolsLinks,
    "TrainingHub": TrainingHub,
    "TrainingVideos": TrainingVideos,
    "WeatherAnalysis": WeatherAnalysis,
    "RooftopTrainingModules": RooftopTrainingModules,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};