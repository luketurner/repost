export declare const request: {
    name: string;
    aliases: string[];
    commands: {
        name: string;
        example: string[];
        description: string;
        options: ({
            name: string;
            description: string;
            defaultOption: boolean;
            type: StringConstructor;
        } | {
            name: string;
            description: string;
            type: StringConstructor;
            defaultOption?: undefined;
        })[];
        handler: (ctx: any) => Promise<any>;
    }[];
};
//# sourceMappingURL=request.d.ts.map