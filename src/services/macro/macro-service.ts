import { BaseService } from 'src/services/base-service';

class MacroService extends BaseService {

    public async getAllMacros() : Promise<any> {
        // return await this.get() 
    }

}

export const macroService = new MacroService();