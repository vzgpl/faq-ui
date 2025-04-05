import axios from "axios";
import {ILogin} from "../../models";
import env from "react-dotenv";

export const api = axios.create({
    baseURL: env.API_URL,
    headers: {
        'api-token': localStorage.getItem('api_token') ?? ''
    },
})

export const requestAutCheck = async function requestAutCheck(callback = (date = null) => {
}, date: any = null) {
    await api.get('/api/check-auth', {}).then(res => {
        callback(date);
    }).catch(err => {
        setTimeout(() => callback(date), 300);
    })
}

export async function logout() {
    await api.get('/api/logout', {}).then(res => {
        localStorage.setItem('api_token', '');
        window.location.reload();
    }).catch(err => {})
}

async function refreshToken() {
    await api.post<ILogin>('/api/refresh', {
        refresh_token: localStorage.getItem('refresh_token') || '',
    }).then(res => {
        localStorage.setItem('uuid', res.data.uuid ?? '');
        localStorage.setItem('api_token', res.data.api_token);
        localStorage.setItem('refresh_token', res.data.refresh_token ?? '');
        localStorage.setItem('name', res.data.name ?? '');
        api.defaults.headers['api-token'] = res.data.api_token;
    }).catch(err => {
        localStorage.setItem('api_token', '');
        window.location.reload()
    })
}

api.interceptors.response.use((response) => response, (error) => {
    if (error.response.status === 401) {
        refreshToken();
    }
    if (error.response.status === 429) {
        localStorage.setItem('api_token', '');
        window.location.reload()
    }

    throw error;
});

