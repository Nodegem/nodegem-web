import axios, { AxiosResponse, AxiosInstance, AxiosRequestConfig } from 'axios';
import { userStore } from '../stores/user-store';

const axiosInstance = axios.create({
    baseURL: "http://localhost:5000/api/",
    timeout: 3000
});

abstract class BaseService {

    private instance: AxiosInstance;

    constructor() {
        this.instance = axiosInstance;
    }

    private getToken = (originalHeaders: any = {}) => {
        const headers = {...this.instance.defaults.headers, ...originalHeaders};
        const userToken = userStore.token;
        if(userToken) {
            return {...headers, "Authorization": `Bearer ${userToken}`};
        }

        return headers;
    }

    private createRequestConfig = (params = {}, headers = {}) : AxiosRequestConfig => {
        return {
            params: params,
            headers: this.getToken(headers)
        };
    }

    protected get = <T>(url: string, params = {}, headers = {}) : Promise<AxiosResponse<T>> => {
        return axiosInstance.get(url, this.createRequestConfig(params, headers));
    }

    protected post = <T>(url: string, data: any, params = {}, headers = {}) : Promise<AxiosResponse<T>> => {
        return axiosInstance.post(url, data, this.createRequestConfig(params ,headers));
    }

    protected put = <T>(url: string, data: any, params = {}, headers = {}) : Promise<AxiosResponse<T>> => {
        return axiosInstance.put(url, data, this.createRequestConfig(params ,headers));
    }

    protected delete = <T>(url: string, params = {}, headers = {}) : Promise<AxiosResponse<T>> => {
        return axiosInstance.delete(url, this.createRequestConfig(params ,headers))
    }

}

export { BaseService };