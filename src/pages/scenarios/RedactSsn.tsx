import RedactScenario from "@/pages/RedactScenario";
import { getScenarioById } from "@/lib/scenarios";

const scenario = getScenarioById("ssn")!;

export default function RedactSsn() {
  return <RedactScenario scenario={scenario} />;
}
