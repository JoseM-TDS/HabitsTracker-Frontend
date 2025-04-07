export const fetchRegisterUser = async (username: string, password: string) => {
    const response = await fetch("https://habits-app-backend.vercel.app/users/register", {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "username": username,
            "password": password
        })
    });
    if(!response.ok){
        throw new Error("Error al registrar usuario")
    }
    return response;
};

export const fetchLoginUser = async (username: string, password: string) => {
    const response = await fetch("https://habits-app-backend.vercel.app/users/login", {
        method: 'POST',
        credentials: 'include',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "username": username,
            "password": password
        })
    });
    if(!response.ok){
        throw new Error("Error al ingresar usuario")
    }
    return response;
};