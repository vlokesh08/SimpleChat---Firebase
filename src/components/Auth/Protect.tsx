import {useSelector} from "react-redux"

const Protect = ({children} : any) => {
    const user = useSelector((state: any) => state.user.user);
    
    if(!user.id) {
        console.log("user not found")
        window.location.href = "/login"
    }
 return children

};

export default Protect;