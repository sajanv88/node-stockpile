import { promises as fs } from 'fs';
import ms from 'ms';

export type NodeStockpileConfig = {
    basePath?: string;
    folderName?: string;
    expiresIn: number;
}

type StorageValue = Record<string, string | string[] | number | number[] | boolean | null>;
export default class NodeStockpile {
    #size = 0;
    #config: NodeStockpileConfig; 

    constructor(config: NodeStockpileConfig) {
        const { basePath = './', folderName = '.stockpile' } = config;
        this.#config = {...config, basePath, folderName};
    }

    public readonly init = async () => {
        const path = this.getPath();
        try {
            await fs.access(path);
        }catch(e: unknown){
            const error = e as Error;
            console.warn(error.stack, 'Hence, creating one.');
            await fs.mkdir(path);
        }
    }

    private readonly getPath = (): string => {
        const { basePath, folderName } = this.#config;
        return `${basePath}/${folderName}`;
    }

    public readonly save = async (key: string, value: StorageValue): Promise<void> => {
        const path = this.getPath();
        const file = `${path}/${key}.json`;
        try {
            await fs.writeFile(file, JSON.stringify(value), {encoding: 'utf8'});
            this.#size = this.#size + 1;
        }catch(e: unknown) {
            const error = e as Error;
            console.error(error.stack)
        }
    }

    public readonly getStoredJsonObject = async (key: string): Promise<ReturnType<typeof JSON.parse> | null>  => {
        const path = this.getPath();
        const file = `${path}/${key}.json`;
        try {
           const data =  await fs.readFile(file, {encoding: 'utf8'});
           return JSON.parse(data);
        }catch(e: unknown) {
            const error = e as Error;
            console.error(error.stack)
            return null;
        }
    }

    public readonly hasExpired = (): boolean => {
        const { expiresIn } = this.#config;
        const expires = ms(expiresIn);
        const now = ms(new Date().getMilliseconds());
        if(parseInt(now) > parseInt(expires)) {
            return true;
        }
        return false;
    }

    public readonly clearAll = async (): Promise<void> => {
        const path = this.getPath();
        try {
            await fs.rmdir(path, {recursive: true});
        }catch(e: unknown) {
            const error = e as Error;
            console.error(error.stack)
        }
    }
    
    public readonly clear = async (key: string): Promise<void> => {
        const path = this.getPath();
        const file = `${path}/${key}.json`;
        try {
            await fs.rm(file);
        }catch(e: unknown) {
            const error = e as Error;
            console.error(error.stack)
        }
    }

    public readonly size = (): number => this.#size; 
}
