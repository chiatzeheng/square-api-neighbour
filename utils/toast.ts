import * as T from 'react-native-toast-message';

class Toast {
    static success(message: string) {
        T.SuccessToast({
            text1: message
        });
    }

    static error(message: string) {
        T.ErrorToast({
            text1: message
        });
    }

    static warn(message:string) {
        T.ErrorToast({
            text1: message
        });
    }

    static info(message:string) {
        T.InfoToast({
            text1: message
        });
    }
    
}

export default Toast;
