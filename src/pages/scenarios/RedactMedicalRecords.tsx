import RedactScenario from "@/pages/RedactScenario";
import { getScenarioById } from "@/lib/scenarios";

const scenario = getScenarioById("medical-records")!;

export default function RedactMedicalRecords() {
  return <RedactScenario scenario={scenario} />;
}
