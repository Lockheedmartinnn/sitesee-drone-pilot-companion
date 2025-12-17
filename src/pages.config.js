import Home from './pages/Home';
import StartCapture from './pages/StartCapture';
import QuickReference from './pages/QuickReference';
import TrainingVideos from './pages/TrainingVideos';
import Scenarios from './pages/Scenarios';
import ToolsLinks from './pages/ToolsLinks';
import Profile from './pages/Profile';
import MissionHistory from './pages/MissionHistory';
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
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};