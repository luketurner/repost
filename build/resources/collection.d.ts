export declare const collection: {
    name: string;
    aliases: string[];
    commands: {
        name: string;
        example: string[];
        description: string;
        options: {
            name: string;
            defaultOption: boolean;
            type: StringConstructor;
        }[];
        handler: (ctx: any) => Promise<any>;
    }[];
};
//# sourceMappingURL=collection.d.ts.map