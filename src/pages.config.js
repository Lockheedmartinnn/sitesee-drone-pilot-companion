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
import RooftopModule1 from './pages/RooftopModule1';
import RooftopModule2 from './pages/RooftopModule2';
import RooftopModule3 from './pages/RooftopModule3';
import RooftopModule4 from './pages/RooftopModule4';
import RooftopModule5 from './pages/RooftopModule5';
import RooftopTrainingModules from './pages/RooftopTrainingModules';
import Scenarios from './pages/Scenarios';
import StandardCaptureChecklist from './pages/StandardCaptureChecklist';
import StartCapture from './pages/StartCapture';
import ToolsLinks from './pages/ToolsLinks';
import TrainingHub from './pages/TrainingHub';
import TrainingVideos from './pages/TrainingVideos';
import WeatherAnalysis from './pages/WeatherAnalysis';
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
    "RooftopModule1": RooftopModule1,
    "RooftopModule2": RooftopModule2,
    "RooftopModule3": RooftopModule3,
    "RooftopModule4": RooftopModule4,
    "RooftopModule5": RooftopModule5,
    "RooftopTrainingModules": RooftopTrainingModules,
    "Scenarios": Scenarios,
    "StandardCaptureChecklist": StandardCaptureChecklist,
    "StartCapture": StartCapture,
    "ToolsLinks": ToolsLinks,
    "TrainingHub": TrainingHub,
    "TrainingVideos": TrainingVideos,
    "WeatherAnalysis": WeatherAnalysis,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};