import axios, { AxiosResponse } from 'axios';

const axiosInstance = axios.create({
    baseURL: "http://localhost:5000/api/",
    timeout: 1000
});

abstract class BaseService {

    protected get = <T>(url: string) : Promise<AxiosResponse<T>> => {
        return axiosInstance.get(url);
    }

    public post = <T>(url: string, data: any) : Promise<AxiosResponse<T>> => {
        return axiosInstance.post(url, data);
    }

    public put = <T>(url: string, data: any) : Promise<AxiosResponse<T>> => {
        return axiosInstance.put(url, data);
    }

    public delete = <T>(url: string) : Promise<AxiosResponse<T>> => {
        return axiosInstance.delete(url)
    }

}

export { BaseService };