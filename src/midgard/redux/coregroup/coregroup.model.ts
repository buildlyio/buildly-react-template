export interface CoreGroup {
    name: string;
    is_global?: boolean;
    permissions?: {
        create?: string;
        update?: string;
        delete?: string;
        read?: string;
    };
}
