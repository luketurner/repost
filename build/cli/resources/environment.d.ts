export declare const environment: {
    name: string;
    aliases: string[];
    commands: {
        name: string;
        example: string[];
        description: string;
        options: ({
            name: string;
            alias: string;
            defaultOption: boolean;
            type: StringConstructor;
            multiple?: undefined;
        } | {
            name: string;
            alias: string;
            multiple: boolean;
            type: StringConstructor;
            defaultOption?: undefined;
        })[];
        handler: (ctx: any) => Promise<any>;
    }[];
};
//# sourceMappingURL=environment.d.ts.map