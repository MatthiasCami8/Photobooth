import { useLocation } from "react-router-dom";
const useEndpoint = () => {
    const location = useLocation();
    return location.pathname.split("/")[1];
};

export default useEndpoint;
