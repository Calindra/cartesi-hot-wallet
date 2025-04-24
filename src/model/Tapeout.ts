
export interface TapesOutput {
    data: TapeInfo[];
    total: number;
    page: number;
  }


export interface TapeInfo {
    id: string;
    cartridge_id: string;
    rule_id: string;
    user_address: string;
    timestamp: number;
    input_index?: number;
    score?: number;
    rank?: number;
    verified?: boolean;
    in_card?: string;
    data?: string;
    out_card?: string;
    tapes?: string[];
  }