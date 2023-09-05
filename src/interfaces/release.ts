export interface Release {
    name: string;
    release_uuid?: string;
    product_uuid?: string;
    tag_name?: string;
    description?: string;
    release_id?: string;
    modules_uuid?: string;
    features?: string[];
    dev_team_uuid?: string[];
    environment?: string;
    prerelease?: boolean;
    start_date?: string;
    features_count?: string;
    release_date: string;
}
