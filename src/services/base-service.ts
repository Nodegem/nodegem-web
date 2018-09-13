import axios, { AxiosResponse } from 'axios';

const axiosInstance = axios.create({
    baseURL: "http://localhost:5000/api/",
    timeout: 1000
});

abstract class BaseService {

    protected path : string;

    constructor(path: string) {
        this.path = path;
    }

    public get = <T>(url: string) : Promise<AxiosResponse<T>> => {
        return axiosInstance.get(this.joinPath(url));
    }

    public post = <T>(url: string, data: any) : Promise<AxiosResponse<T>> => {
        return axiosInstance.post(this.joinPath(url), data);
    }

    public put = <T>(url: string, data: any) : Promise<AxiosResponse<T>> => {
        return axiosInstance.put(this.joinPath(url), data);
    }

    public delete = <T>(url: string) : Promise<AxiosResponse<T>> => {
        return axiosInstance.delete(this.joinPath(url))
    }

    private joinPath = (url: string) => {
        return `${this.path}${url}`;
    }

}

export { BaseService };