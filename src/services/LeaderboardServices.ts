import { TapesOutput } from "../model/Tapeout";
import { fromHex } from "viem";

export const RIVES_NODE_URL = "https://app.rives.io";
export const RULE_ID = '721f735bbca3721f735bbca3cfee7c08a98f4b56';

export interface LeaderboardEntry {
  rank: number;
  user: string;
  score: number;
  verified: boolean;
}

export async function getRuleLeaderboard(
  ruleId: string,
): Promise<TapesOutput | null> {
  try {
    const res = await fetch(`${RIVES_NODE_URL}/inspect/core/tapes?rule_id=${ruleId}&order_by=score&order_dir=desc&full=true`);
    const outJson = await res.json();

    if (outJson["status"] !== "Accepted" || outJson["reports"].length === 0) {
      console.log(`Request error: ${outJson["message"]}`);
      return null;
    }

    const out: TapesOutput = JSON.parse(
      fromHex(outJson["reports"][0].payload, "string"),
    );
    return out;
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    return null;
  }
}

export async function generateLeaderboardData(): Promise<LeaderboardEntry[]> {
  try {
    const tapesOut = await getRuleLeaderboard(RULE_ID);
    
    if (!tapesOut || tapesOut.total < 1) {
      return [];
    }
    return tapesOut.data.map((tape, i) => {
      return {
        rank: tape.rank ?? i + 1,
        user: `${tape.user_address.slice(0, 6)}...${tape.user_address.slice(-4)}`,
        score: tape.score ?? 0,
        verified: Boolean(tape.verified)
      };
    });
  } catch (error) {
    console.error("Error generating leaderboard data:", error);
    return [];
  }
}

export async function generateLeaderboardHTML(): Promise<string> {
  const tapesOut = await getRuleLeaderboard(RULE_ID);

  if (!tapesOut || tapesOut.total < 1) {
    return `No leaderboard data`;
  }
  
  const rows = tapesOut.data.map((tape, i) => {
    const rank = tape.rank ?? i + 1;
    const score = tape.score ?? '-';
    const verified = tape.verified ? '✅' : '';
    const shortAddress = `${tape.user_address.slice(0, 6)}...${tape.user_address.slice(-4)}`;
    
    
    return `
      ${rank}
      ${shortAddress}
      ${score}
      ${verified}
    `;
  }).join('\n');
  
  return rows;
}