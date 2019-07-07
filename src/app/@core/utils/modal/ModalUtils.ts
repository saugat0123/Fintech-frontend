import {ModalResponse} from './ModalResponse';

export class ModalUtils {
    public static resolve(result: Promise<any>, callback: (obj: any) => void, obj: any): void {

        result.then(
            close => {
                if (close === ModalResponse.SUCCESS) {
                    callback(obj);
                }
            },
            dismiss => {
                console.log(dismiss);
            }
        );
    }
}

