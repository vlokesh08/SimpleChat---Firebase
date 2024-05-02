import {useSelector} from "react-redux"
import {Navigate} from "react-router-dom"

const Protect = ({children} : any) => {
    const user = useSelector((state: any) => state.user);
    
    if(!user.id) {
        return <Navigate to="/" />
    }
 return children

};

export default Protect;