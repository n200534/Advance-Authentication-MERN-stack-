import axios from 'axios'
import React, { useEffect, useState } from 'react'
axios.defaults.withCredentials = true
let firstRender = true;
function Welcome() {
    const [user, setUser] = useState();
    const refreshToken = async () => {
        const res = await axios.get('http://localhost:1000/api/refresh', {
            withCredentials: true
        }).catch(err => console.log(err));

        const data = await res.data;
        return data;
    }
    const sendrequest = async () => {
        const res = await axios.get("http://localhost:1000/api/user", {
            withCredentials: true
        }).catch(err => console.log(err));
        const data = await res.data;
        return data
    }
    useEffect(() => {
        if (firstRender) {
            sendrequest().then((data) => setUser(data.user));
            firstRender = false;
        }
        let interval=setInterval(()=>{
            refreshToken().then(data=>setUser(data.user))
        },1000*28)

        return ()=>clearInterval(interval)

    }, [])
    return (
        <div>
            {user && <h1>{user.name}</h1>}
        </div>
    )
}

export default Welcome