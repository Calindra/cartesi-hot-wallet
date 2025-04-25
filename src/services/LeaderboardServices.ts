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
    return `${month}/${day}/${finalYear}`;
  
    // return `${month}/${day}/${finalYear}, ${time}`;

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

  export async function generateLeaderboardHTML(): Promise<string> {
    const tapesOut = await getRuleLeaderboard(RULE_ID)
  
    if (!tapesOut || tapesOut.total < 1) {
      return `
        <html><body><h2>No leaderboard data</h2></body></html>
      `
    }
  
    const rows = tapesOut.data.map((tape, i) => {
      const rank = tape.rank ?? i + 1
      const score = tape.score ?? '-'
      const date = timeToDateUTCString(tape.timestamp)
      const verified = tape.verified ? '✅' : ''
      const shortAddress = `${tape.user_address.slice(0, 6)}...${tape.user_address.slice(-4)}`
  
      const rankClass = rank === 1 ? 'gold' : rank === 2 ? 'silver' : rank === 3 ? 'bronze' : ''
  
      return `<tr class="${rankClass}">
        <td>${rank}</td>
        <td>${shortAddress}</td>
        <td>${date}</td>
        <td>${score}</td>
        <td>${verified}</td>
      </tr>`
    }).join('\n')
  
    return `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <style>
            body {
              font-family: system-ui, sans-serif;
              padding: 16px;
              margin: 0;
              background: #fff;
              color: #333;
            }
            h2 {
              font-size: 20px;
              text-align: center;
            }
            .table-wrapper {
              overflow-x: auto;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 12px;
            }
            th, td {
              padding: 10px 12px;
              font-size: 14px;
              border: 1px solid #ddd;
              text-align: left;
              white-space: nowrap;
            }
            th {
              background: #f8f8f8;
            }
            .gold { background-color: #fff8dc; font-weight: bold; }
            .silver { background-color: #f0f0f0; font-weight: bold; }
            .bronze { background-color: #f8e0c0; font-weight: bold; }
          </style>
        </head>
        <body>
          <h2>Leaderboard</h2>
          <div class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>User</th>
                  <th>Date (UTC)</th>
                  <th>Score</th>
                  <th>✓</th>
                </tr>
              </thead>
              <tbody>
                ${rows}
              </tbody>
            </table>
          </div>
        </body>
      </html>
    `
  }
  

