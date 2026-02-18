import {useSelector} from "react-redux";
import {lightTheme, darkTheme} from "../theme/color"

 const   useTheme = ()=>{
    const isDark = useSelector((state)=>state.theme.theme)
    return isDark ? darkTheme:lightTheme;
}

export default useTheme;