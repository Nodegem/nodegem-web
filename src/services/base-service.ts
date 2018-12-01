import axios, { AxiosResponse, AxiosInstance, AxiosRequestConfig } from 'axios';
import { userStore } from '../stores/user-store';

const baseUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
const apiTimeout = parseInt(process.env.REACT_APP_API_TIMEOUT || "3000");

const axiosInstance = axios.create({
    baseURL: `${baseUrl}/api/`,
    timeout: apiTimeout
});

abstract class BaseService {

    private instance: AxiosInstance;

    constructor() {
        this.instance = axiosInstance;
    }

    private getTokenHeaders = () => {
        const headers = {...this.instance.defaults.headers};
        if(userStore.isAuthenticated) {
            return {...headers, Authorization: `Bearer ${userStore.token}`, RefreshToken: userStore.refreshToken};
        }

        return headers;
    }
    
    private createRequestConfig = (params = {}, headers = {}) : AxiosRequestConfig => {
        return {
            params: params,
            headers: this.getTokenHeaders()
        };
    }

    protected async get<T>(url: string, params = {}) : Promise<AxiosResponse<T>> {
        return await this.instance.get(url, this.createRequestConfig(params));
    }

    protected async getWithCredentials<T>(url: string, params = {}) : Promise<AxiosResponse<T>> {
        return await this.fetchWithCredentials(() => this.get(url, params));
    }

    protected async post<T>(url: string, data: any, params = {}) : Promise<AxiosResponse<T>> {
        return await this.instance.post(url, data, this.createRequestConfig(params));
    }

    protected async postWithCredentials<T>(url: string, data: any, params = {}) : Promise<AxiosResponse<T>> {
        return await this.fetchWithCredentials(() => this.post(url, data, params));
    }

    protected async put<T>(url: string, data: any, params = {}) : Promise<AxiosResponse<T>> {
        return await this.instance.put(url, data, this.createRequestConfig(params));
    }

    protected async delete<T>(url: string, params = {}) : Promise<AxiosResponse<T>> {
        return await this.instance.delete(url, this.createRequestConfig(params))
    }

    private async fetchWithCredentials(call: () => Promise<AxiosResponse<any>>) : Promise<AxiosResponse<any>> {

        try {
            return await call();
        } catch(err) {
            const response = err.response as AxiosResponse;

            if(response.status === 401) {

                const refreshTokenResponse = await this.refreshToken(userStore.token!, userStore.refreshToken!);
                if(refreshTokenResponse.status !== 200) {
                    userStore.logout();
                    throw new Error(`Unable to refresh token. Error Status: ${refreshTokenResponse.status}, Message: ${refreshTokenResponse.data}`)
                }
                
                const { accessToken, token } = refreshTokenResponse.data;
                userStore.setTokens(accessToken, token);
                return await call();
            }

            userStore.logout();
            throw new Error(`Unable to refresh token. Error Status: ${response.status}, Message: ${response.data}`)
        }
    }

    private async refreshToken(token: string, refreshToken: string) : Promise<AxiosResponse<{ accessToken: string, token: string }>> {
        return await this.instance.get("account/token/refresh", {
            validateStatus: status => status >= 200,
            headers: {
                Token: token,
                RefreshToken: refreshToken
            }
        });
    }

}

export { BaseService };