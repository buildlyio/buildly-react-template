export interface Product {
    id?: number;
    product_uuid?: string; 
    name: string;
    organization_uuid: string;
    description?: string;
    start_date?: string;
    end_date?: string;
    project_manager_uuid?: string;
    third_party_tool?: any;
    product_team?: string;
    issue_tool_detail?: any;
    feature_tool_detail?: any;
    product_info?: any;
    pdf_report_hash?: string;
    last_download_date?: string;

}