import axios, { AxiosResponse, AxiosInstance } from 'axios';

const axiosInstance = axios.create({
    baseURL: "http://localhost:5000/api/",
    timeout: 1000
});

abstract class BaseService {

    private instance: AxiosInstance;

    constructor() {
        this.instance = axiosInstance;
    }

    protected get = <T>(url: string, params = {}, headers = {}) : Promise<AxiosResponse<T>> => {
        return axiosInstance.get(url);
    }

    protected post = <T>(url: string, data: any, headers = {}) : Promise<AxiosResponse<T>> => {
        return axiosInstance.post(url, data);
    }

    protected put = <T>(url: string, data: any, header = {}) : Promise<AxiosResponse<T>> => {
        return axiosInstance.put(url, data);
    }

    protected delete = <T>(url: string, headers = {}) : Promise<AxiosResponse<T>> => {
        return axiosInstance.delete(url)
    }

}

export { BaseService };