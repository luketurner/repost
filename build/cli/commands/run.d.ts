export declare const run: {
    name: string;
    examples: string[];
    description: string;
    options: ({
        name: string;
        defaultOption: boolean;
        multiple: boolean;
        type: StringConstructor;
        alias?: undefined;
        description?: undefined;
        defaultValue?: undefined;
    } | {
        name: string;
        alias: string;
        type: StringConstructor;
        description: string;
        defaultValue: string;
        defaultOption?: undefined;
        multiple?: undefined;
    })[];
    handler: (ctx: any) => Promise<void>;
};
//# sourceMappingURL=run.d.ts.map