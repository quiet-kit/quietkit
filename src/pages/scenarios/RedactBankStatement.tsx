import RedactScenario from "@/pages/RedactScenario";
import { getScenarioById } from "@/lib/scenarios";

const scenario = getScenarioById("bank-statement")!;

export default function RedactBankStatement() {
  return <RedactScenario scenario={scenario} />;
}
