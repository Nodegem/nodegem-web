import axios, { AxiosResponse, AxiosInstance, AxiosRequestConfig } from 'axios';
import { userStore } from '../stores/user-store';

const baseUrl = process.env.REACT_APP_API_BASE_URL;
const apiTimeout = parseInt(process.env.REACT_APP_API_TIMEOUT!);

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
        const { accessToken } = userStore;
        if(userStore.isAuthenticated) {
            return {...headers, Authorization: `Bearer ${accessToken}`};
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

    protected async deleteWithCredentials<T>(url: string, params = {}) : Promise<AxiosResponse<T>> {
        return await this.fetchWithCredentials(() => this.delete(url, params));
    }


    private async fetchWithCredentials(call: () => Promise<AxiosResponse<any>>) : Promise<AxiosResponse<any>> {

        try {
            return await call();
        } catch(err) {
            const response = err.response as AxiosResponse;

            if(response && response.status === 401) {
                await this.updateTokens(true);
                return await call();
            }

            userStore.logout();
            return err;
        }
    }

    protected async updateTokens(forceRefresh: boolean = false) {
        if(forceRefresh || userStore.canRefresh) {

            userStore.updateRefreshBuffer();
            const refreshTokenResponse = await this.refreshToken(userStore.accessToken!, userStore.refreshToken!);
            if(refreshTokenResponse.status !== 200) {
                userStore.logout();
            }
            
            const { accessToken, token } = refreshTokenResponse.data;
            userStore.setTokens(accessToken, token);
            return Promise.resolve();
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