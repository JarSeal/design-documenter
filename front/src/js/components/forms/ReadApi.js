import axios from 'axios';
import { Logger } from '../../LIGHTER';
import { _CONFIG } from '../../_CONFIG';

// Attributes
// - url: String
// - onError: Function
// - afterGet: Function
class ReadApi {
    constructor(params) {
        if(!params || !params.url) {
            Logger.error('ReadApi is missing params. At least url is needed.');
            return;
        }
        this.url = _CONFIG.apiBaseUrl + params.url;
        this.onError = params.onError;
        this.afterGet = params.afterGet;
    }

    getData = async () => {
        try {
            const result = await axios.get(this.url, { withCredentials: true });
            if(result.data) {
                console.log('ReadApi', result.data);
                this.afterGet(result.data);
                return result.data;
            }
        }
        catch(e) {
            if(this.onError) this.onError(e);
            return {
                error: true,
                exception: e,
            };
        }
    }
}

export default ReadApi;