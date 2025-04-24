import { TapesOutput } from "../model/Tapeout";
import { fromHex } from "viem";
export const RIVES_NODE_URL = "https://app.rives.io";

export const RULE_ID = '721f735bbca3721f735bbca3cfee7c08a98f4b56'

export function formatDate(date: Date) {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
      timeZone: "UTC",
      timeZoneName: "short",
    };
  
    const dateString = date.toLocaleDateString("en-US", options);
    const [month_day, year, time] = dateString.split(",");
    const [month, day] = month_day.split(" ");
    const finalYear = year.substring(1);
  
    return `${month}/${day}/${finalYear}, ${time}`;
  }
  

export function timeToDateUTCString(time: number) {
    const date = new Date(Number(time) * 1000);
    return formatDate(date);
  }
  

export async function getRuleLeaderboard(
    ruleId: string,
  ): Promise<TapesOutput | null> {
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
  }
  export async function renderLeaderboard() {
    const table: HTMLTableElement = document.getElementById("leaderboard") as HTMLTableElement;
    const tapesOut = await getRuleLeaderboard(RULE_ID);
    if (!tapesOut || tapesOut.total < 1) {
      const row = table.insertRow();
      row.innerHTML = "No tapes";
      return;
    }
    let rank = 1;
    for (const tape of tapesOut.data) {
      const row = table.insertRow();
      row.insertCell().innerHTML = `${rank++}`;
      row.insertCell().innerHTML = tape.user_address;
      row.insertCell().innerHTML = timeToDateUTCString(tape.timestamp);
      row.insertCell().innerHTML = `${tape.score ? tape.score : ''}`;
    }
  }